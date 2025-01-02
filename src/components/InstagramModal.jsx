import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { useSelector, useDispatch } from "react-redux";
import styles from "../styles/ModalContent.module.scss";
import { modalValue } from "../slices/modalSlice";
import moment from "moment";
import Image from "next/image";
import vegalogo from "../assets/vega-logo.jpeg";
import like from "../assets/svg/ig-like.svg";
import comment from "../assets/svg/ig-comment.svg";
import closeBtn from "../assets/svg/close-btn.svg";

function Post({ post, randomNum }) {
	const [likes, setLikes] = useState(0);
	const [comments, setComments] = useState(0);
	const videoRef = useRef(null);

	useEffect(() => {
		setLikes(randomNum(10000, 50000));
		setComments(randomNum(10000, 50000));
	}, []);

	useEffect(() => {
		const handleFullscreenChange = () => {
			if (videoRef.current) {
				if (document.fullscreenElement) {
					videoRef.current.style.objectFit = 'contain';
				} else {
					videoRef.current.style.objectFit = 'cover';
				}
			}
		};
	
		document.addEventListener('fullscreenchange', handleFullscreenChange);
	
		return () => {
		  document.removeEventListener('fullscreenchange', handleFullscreenChange);
		};
	  }, []);

	useEffect(() => {
		const videoElement = videoRef.current;
		if (!videoElement) return;

		const handleModalClose = () => {
			videoElement.pause();
			videoElement.currentTime = 0;
		};

		const modalCloseEvent = () => {
			console.log("Modal closed");
			handleModalClose();
		};

		document.addEventListener("modalClose", modalCloseEvent);

		return () => {
			document.removeEventListener("modalClose", modalCloseEvent);
			handleCloseModal();
		};
	}, []);

	const handleCloseModal = () => {
		const closeModalEvent = new Event("modalClose");
		document.dispatchEvent(closeModalEvent);
	};

	return (
		<div
			className={styles.post}
			key={post.id}
		>
			<div className={styles.post_header}>
				<span>
					<Image
						src={vegalogo}
						height={128}
						width={128}
						alt="vega logo"
					/>
					vega.us
				</span>
				<p className={styles.timestamp}>{moment(post.timestamp).fromNow()}</p>
			</div>

			{post.media_type === "VIDEO" ? (
				<video
					src={post.media_url}
					ref={videoRef}
					autoPlay={true}
					className={styles.image}
					controls={false}
					poster={post.thumbnail_url}
					muted
					loop
					playsInline
				/>
			) : (
				<a href={post.permalink}>
					<img
						src={post.media_url}
						alt={post.caption}
						className={styles.image}
					/>
				</a>
			)}

			<div className={styles.like_comment}>
				<a href={post.permalink}>
					<Image
						className={styles.like}
						src={like}
						height={32}
						width={32}
						alt="like icon"
					/>
					<span>{likes} likes</span>
				</a>
				<a href={post.permalink}>
					<Image
						className={styles.comment}
						src={comment}
						height={32}
						width={32}
						alt="comment icon"
					/>
					<span>{comments} comments</span>
				</a>
			</div>
			<p className={styles.caption}>
				<strong>vega.us</strong>
				{post.caption}
			</p>
		</div>
	);
}

export default function InstagramModal({
	modalName,
	modalRef,
	resize,
	window,
	width,
	height,
	toggle,
	instaFeed,
}) {
	const active = useSelector(modalValue);
	const dispatch = useDispatch();
	const maximizeRef = useRef(null);

	const handleModalResize = (modalRef, resize, window, width, height) => {
		dispatch(resize());
		if (window === false) {
			gsap.to(modalRef.current, {
				duration: 1,
				ease: "expo.out",
				width: "95%",
				height: "82vh",
				top: "150",
				left: "20",
				transformOrigin: "center center",
				transform: "translate3d(0,-100px,0)",
			});
		} else {
			gsap.to(modalRef.current, {
				duration: 1,
				ease: "expo.out",
				width: width,
				height: height,
			});
		}
	};

	const handleModalExpand = () => {
		if (active.resizeActive === true) {
			maximizeRef.current.classList.add(styles.modal_expanded);
		} else {
			maximizeRef.current.classList.remove(styles.modal_expanded);
		}
	};

	const randomNum = (min, max) => {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	const handleCloseModal = () => {
		dispatch(toggle());
		const closeModalEvent = new Event("modalClose");
		document.dispatchEvent(closeModalEvent);
	};

	return (
		<div className={styles.ig_modal}>
			<div className={styles.ig_modal_nav}>
				<Image
					src={closeBtn}
					alt="close window"
					className={styles.close_window}
					width={20}
					height={20}
					onClick={() => dispatch(toggle())}
				/>
			</div>
			<div className={`${styles.ig_modal_title_wrap} dragTrigger`}>
				<svg
					className={styles.modal_title_before}
					width="100%"
					height="100%"
					viewBox="0 0 23 38"
				>
					<path d="M0,33.634L0,20.976C0,9.484 9.496,0 21,0L23,0L23,38L4.372,38C1.958,38 0,36.046 0,33.634Z" />
				</svg>
				<h2 className={styles.modal_title}>{modalName}</h2>
				<svg
					className={styles.modal_title_after}
					width="100%"
					height="100%"
					viewBox="0 0 60 38"
				>
					<path d="M0,0L60,0L60,8L58.882,8.002C49.447,8.002 40.34,12.357 33.286,18.615L19.537,30.813C14.318,35.443 7.579,38 0.598,38L0,38L0,0Z" />
				</svg>
				<div className={styles.modal_title_after_line}></div>
			</div>
			<a
				className={styles.follow}
				href="https://www.instagram.com/vega.us/"
			>
				Follow
			</a>
			<div className={styles.modal_content}>
				<div
					ref={maximizeRef}
					className={styles.modal_body_instagram}
				>
					<div className={styles.instagram_container}>
						{instaFeed &&
							instaFeed.map((post) => (
								<Post
									key={post.id}
									post={post}
									randomNum={randomNum}
								/>
							))}
					</div>
				</div>
			</div>
		</div>
	);
}
