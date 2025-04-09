import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { useSelector, useDispatch } from "react-redux";
import styles from "../styles/ModalContent.module.scss";
import { modalValue } from "../slices/modalSlice";
import moment from "moment";
import Image from "next/image";
import { urlFor } from "../api/dataFetcher";
import closeBtn from "../assets/svg/close-btn.svg";
import vegalogo from "../assets/vega-logo.jpeg";
import like from "../assets/svg/ig-like.svg";
import comment from "../assets/svg/ig-comment.svg";
import { INSTAGRAM_MODAL_ASSETS } from "../types/instagram";

function Post({ post }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (videoRef.current) {
        if (document.fullscreenElement) {
          videoRef.current.style.objectFit = "contain";
        } else {
          videoRef.current.style.objectFit = "cover";
        }
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
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

  // Use likes/comments from Sanity if available, or fallback to default values
  const likes =
    post.likes || Math.floor(Math.random() * (50000 - 10000 + 1)) + 10000;
  const comments =
    post.comments || Math.floor(Math.random() * (50000 - 10000 + 1)) + 10000;

  return (
    <div className={styles.post} key={post.id}>
      <div className={styles.post_header}>
        <span>
          <Image src={vegalogo} height={128} width={128} alt="vega logo" />
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
  sanityInstaData,
}) {
  const active = useSelector(modalValue);
  const dispatch = useDispatch();
  const maximizeRef = useRef(null);

  // Use Sanity data if available, otherwise fall back to instaFeed from props
  const posts = sanityInstaData?.posts || instaFeed;
  const instagramProfileUrl =
    sanityInstaData?.instagramProfile ||
    INSTAGRAM_MODAL_ASSETS.links.instagramProfile;

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

  const handleCloseModal = (e) => {
    // If this was called directly from an event, prevent default
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
      e.stopPropagation();
    }

    // Dispatch the toggle action to close the modal
    dispatch(toggle());

    // Create and dispatch the custom event for cleanup
    const closeModalEvent = new Event("modalClose");
    document.dispatchEvent(closeModalEvent);

    // Return false to prevent default browser behavior
    return false;
  };

  return (
    <div className={styles.ig_modal}>
      <div className={styles.ig_modal_nav}>
        <div
          className={`${styles.close_window}`}
          onClick={(e) => handleCloseModal(e)}
        >
          <Image src={closeBtn} alt="Close Modal" />
        </div>
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
      <a className={styles.follow} href={instagramProfileUrl}>
        Follow
      </a>
      <div className={styles.modal_content}>
        <div ref={maximizeRef} className={styles.modal_body_instagram}>
          <div className={styles.instagram_container}>
            {posts && posts.map((post) => <Post key={post.id} post={post} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
