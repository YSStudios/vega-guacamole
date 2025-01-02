import React, { useEffect, useRef, useState } from "react";
import { useSwipeable } from "react-swipeable";
import styles from "../styles/Styles.module.scss";
import Image from "next/image";
import PortableText from "react-portable-text";
import ModalNav from "./ModalNav";
import { useDispatch } from "react-redux";

export default function CaseSubModal({
	modalName,
	modalRef,
	resize,
	toggle,
	modalData,
	urlFor,
	handleModalResize,
	isCaseSubFullscreen,
	setCurrentContent,
	setLightBoxActive,
	setLightBoxResize,
	caseStudies,
}) {
	const maximizeRef = useRef(null);
	const titleRef = useRef(null);
	const modalContentRef = useRef(null);
	const col2Ref = useRef(null);
	const col3Ref = useRef(null);
	const dispatch = useDispatch();
	

	const [gallerySlides, setGallerySlides] = useState({
		gallery1: 0,
	});

	const [imageVersion, setImageVersion] = useState(Date.now());
	const [titleFontSize, setTitleFontSize] = useState(null);

	useEffect(() => {
		setImageVersion(Date.now());
	}, [modalData]);

	function isGif(url) {
		return typeof url === "string" && url.toLowerCase().endsWith(".gif");
	}

	function ProgressiveImage({ src, placeholderSrc, alt }) {
		const [imgSrc, setImgSrc] = useState(
			isGif(src) ? src : placeholderSrc || src
		);

		useEffect(() => {
			if (!isGif(src) && typeof window !== "undefined" && src) {
				const img = new window.Image();
				img.src = src;
				img.onload = () => {
					setImgSrc(src);
				};
			}
		}, [src]);

		if (!src) {
			return null;
		}

		return (
			<Image
				src={imgSrc}
				alt={alt}
				fill
				sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
				style={{
					filter:
						!isGif(src) && imgSrc === placeholderSrc ? "blur(1px)" : "none",
					transition: "filter 0.3s ease-out",
				}}
			/>
		);
	}


		const renderGallery = (galleryKey, images) => {
			const imageGrid = `${styles.image_grid} ${styles[`images-${images.length}`]}`;
			if (!images || images.length === 0) {
			  return null;
			}
		
			return (
			  <div className={imageGrid}>
				{images.map((content, index) => {
				  const imageUrl = content?.asset?.url || content;
				  return (
					<div
					  key={`${index}-${imageVersion}`}
					  className={styles.grid_image}
					  onClick={() => {
						setCurrentContent(content);
						if (isCaseSubFullscreen) {
						  dispatch(setLightBoxResize(true));
						}
						dispatch(setLightBoxActive(true));
					  }}
					  style={{ position: "relative" }}
					>
					  <ProgressiveImage
						src={
						  isGif(imageUrl)
							? urlFor(content).url()
							: urlFor(content)
								.format("webp")
								.quality(80)
								.fit("fillmax")
								.url()
						}
						placeholderSrc={
						  isGif(imageUrl)
							? null
							: urlFor(content).width(10).quality(20).blur(10).url()
						}
						alt={`${galleryKey} Slide ${index}`}
					  />
					</div>
				  );
				})}
			  </div>
			);
		  };

	const adjustTitleFontSize = () => {
		if (titleRef.current && col3Ref.current) {
			const col3Width = col3Ref.current.offsetWidth;
			const titleWidth = titleRef.current.offsetWidth;
			const currentFontSize = parseFloat(
				window.getComputedStyle(titleRef.current).fontSize
			);

			if (titleWidth > col3Width) {
				const newFontSize = Math.floor(
					(col3Width / titleWidth) * currentFontSize
				);
				setTitleFontSize(newFontSize);
			} else {
				setTitleFontSize(null);
			}
		}
	};

	useEffect(() => {
		if (modalContentRef.current) {
			modalContentRef.current.scrollTop = 0;
		}
		if (col2Ref.current) {
			col2Ref.current.scrollTop = 0;
		}
		if (col3Ref.current && isCaseSubFullscreen) {
			col3Ref.current.scrollTop = 0;
		}
		adjustTitleFontSize();
	}, [modalData, isCaseSubFullscreen]);

	useEffect(() => {
		const handleResize = () => {
			adjustTitleFontSize();
		};

		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	const renderPortrait = () => {
		if (!modalData.portrait || !modalData.portrait.length) {
		  console.log("No portrait available.");
		  return null;
		}
	  
		const portraitItem = modalData.portrait[0];
	  
		const assetType = portraitItem?.asset?._type;
	  
		if (assetType === "sanity.imageAsset") {
			console.log("portraitItem", portraitItem);
		  return (
			<ProgressiveImage
			  src={urlFor(portraitItem)
				.format("webp")
				.quality(80)
				.fit("max")
				.url()}
			  placeholderSrc={urlFor(portraitItem)
				.width(10)
				.quality(20)
				.blur(10)
				.url()}
			  alt="Portrait image"
			/>
		  );
		} else if (assetType === "sanity.fileAsset") {
		  const videoUrl = portraitItem.asset.url;
		  console.log("videoUrl", videoUrl);
		  return (
			<video
			  src={videoUrl}
			  autoPlay={true}
			  loop
			  muted
			  width={"100%"}
			  height={"100%"}
			  objectfit="cover"
			>
			  Your browser does not support the video tag.
			</video>
		  );
		} else {
		  console.log("Unsupported asset type or asset is null:", assetType);
		  return null;
		}
	};
	  
	return (
		<div className={`${styles.content_wrap} ${styles.subModal}`}>
			<ModalNav
				modalName={modalName}
				handleModalResize={handleModalResize}
				modalRef={modalRef}
				resize={resize}
				toggle={toggle}
				dispatch={dispatch}
			/>
			<div
				className={styles.modal_content}
				ref={modalContentRef}
			>
				<div
					ref={maximizeRef}
					className={styles.modal_body}
				>
					{modalData.portrait && modalData.portrait.length > 0 && (
                    <div className={styles.col1}>
                        <div
                            className={styles.portrait}
                            onClick={() => {
                                setCurrentContent(modalData.portrait[0]);
                                if (isCaseSubFullscreen) {
                                    dispatch(setLightBoxResize(true));
                                }
                                dispatch(setLightBoxActive(true));
                            }}
                            resize={resize}
                        >
                            {renderPortrait()}
                        </div>
                    </div>
                )}
					{modalData.imageGallery1 && modalData.imageGallery1.length > 0 && (
                    <div
                        className={styles.col2}
                        ref={col2Ref}
                    >
                        {renderGallery("gallery1", modalData.imageGallery1)}
                    </div>
                	)}
					<div
						className={styles.col3}
						ref={col3Ref}
					>
						<h1
							className={styles.title}
							ref={titleRef}
							style={titleFontSize ? { fontSize: `${titleFontSize}px` } : {}}
						>
							{modalData.title}
						</h1>
						<h2 className={styles.subtitle}>{modalData.subtitle}</h2>
						<div className={styles.project_info}>
							{modalData.body && (
								<>
									{modalData.projectBreakdown && (
										<h3>{modalData.projectBreakdown}</h3>
									)}
									<PortableText
										content={modalData.body}
										dataset="production"
										className={styles.project_breakdown}
									/>
								</>
							)}
						</div>
						<div className={styles.services}>
							<h3>Services</h3>
							<ul className={styles.services}>
								{modalData.services &&
									modalData.services.map((service, index) => (
										<li key={index}>
											<span>{service}</span>
										</li>
									))}
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
