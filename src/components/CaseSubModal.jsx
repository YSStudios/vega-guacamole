import React, { useEffect, useRef, useState } from "react";
import { useSwipeable } from "react-swipeable";
import styles from "../styles/Styles.module.scss";
import Image from "next/image";
import PortableText from "react-portable-text";
import ModalNav from "./ModalNav";
import { useDispatch } from "react-redux";
import { createClient } from "@sanity/client";

// Sanity client setup
const client = createClient({
  projectId: "yqk7lu4g",
  dataset: "production",
  apiVersion: "2023-03-11",
  useCdn: true,
});

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
	const [preloadedImages, setPreloadedImages] = useState(new Set());

	useEffect(() => {
		setImageVersion(Date.now());
		
		// Preload all gallery images for faster lightbox loading
		const preloadImages = () => {
			if (modalData.imageGallery1) {
				modalData.imageGallery1.forEach((content, index) => {
					if (content._type === "image") {
						const fullResUrl = urlFor(content)
							.width(1920)
							.format("webp")
							.quality(85)
							.fit("max")
							.url();
							
						const img = new window.Image();
						img.src = fullResUrl;
						img.onload = () => {
							setPreloadedImages(prev => new Set([...prev, fullResUrl]));
						};
					}
				});
			}
			
			// Preload portrait at full resolution
			if (modalData.portrait && modalData.portrait.length > 0) {
				const portraitItem = modalData.portrait[0];
				if (portraitItem._type === "image") {
					const fullResUrl = urlFor(portraitItem)
						.width(1920)
						.format("webp")
						.quality(85)
						.fit("max")
						.url();
						
					const img = new window.Image();
					img.src = fullResUrl;
					img.onload = () => {
						setPreloadedImages(prev => new Set([...prev, fullResUrl]));
					};
				}
			}
		};
		
		// Delay preloading to not interfere with initial render
		const timeoutId = setTimeout(preloadImages, 500);
		return () => clearTimeout(timeoutId);
	}, [modalData]);

	function isGif(url) {
		return typeof url === "string" && url.toLowerCase().endsWith(".gif");
	}

	function ProgressiveImage({ src, placeholderSrc, alt, priority = false }) {
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
				priority={priority}
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
				  const assetType = content?.asset?._type;
				  const isVideoAsset = assetType === "sanity.fileAsset" || content?._type === "file";
				  const isImageAsset = assetType === "sanity.imageAsset" || content?._type === "image";
				  
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
					  {isVideoAsset ? (
						(() => {
						  let videoUrl;
						  if (content.asset?.url) {
							videoUrl = content.asset.url;
						  } else if (content?.asset?._ref) {
							// Handle Sanity asset reference
							const assetRef = content.asset._ref;
							videoUrl = `https://cdn.sanity.io/files/${client.config().projectId}/${client.config().dataset}/${assetRef.replace('file-', '').replace('-mp4', '.mp4')}`;
						  }
						  
						  return videoUrl ? (
							<video
							  src={videoUrl}
							  autoPlay={true}
							  loop
							  muted
							  playsInline
							  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
							>
							  Your browser does not support the video tag.
							</video>
						  ) : null;
						})()
					  ) : isImageAsset ? (
						<ProgressiveImage
						  src={
							isGif(content?.asset?.url)
							  ? urlFor(content).url()
							  : urlFor(content)
								  .width(600)
								  .format("webp")
								  .quality(60)
								  .fit("crop")
								  .auto("format")
								  .url()
						  }
						  placeholderSrc={
							isGif(content?.asset?.url)
							  ? null
							  : urlFor(content).width(20).quality(30).blur(20).url()
						  }
						  alt={`${galleryKey} Slide ${index}`}
						  priority={index < 3}
						/>
					  ) : null}
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
		// Immediate scroll reset when component mounts
		const resetScroll = () => {
			window.scrollTo(0, 0);
			document.body.scrollTop = 0;
			document.documentElement.scrollTop = 0;
			
			if (modalContentRef.current) modalContentRef.current.scrollTop = 0;
			if (col2Ref.current) col2Ref.current.scrollTop = 0;
			if (col3Ref.current) col3Ref.current.scrollTop = 0;
		};

		resetScroll();
		// Run reset after a short delay to ensure content is loaded
		const timeoutId = setTimeout(resetScroll, 50);

		return () => clearTimeout(timeoutId);
	}, []); // Empty dependency array means this runs once on mount

	useEffect(() => {
		// Reset scroll positions first
		if (modalContentRef.current) modalContentRef.current.scrollTop = 0;
		if (col2Ref.current) col2Ref.current.scrollTop = 0;
		if (col3Ref.current) col3Ref.current.scrollTop = 0;
		window.scrollTo(0, 0);
		
		// Then handle other updates
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
		let portraitItem;
		if (modalData.portrait && modalData.portrait.length > 0) {
			portraitItem = modalData.portrait[0];
		} else if (modalData.image) {
			portraitItem = modalData.image;
		} else {
			return null;
		}
	  
		const assetType = portraitItem?.asset?._type;
	  
		if (assetType === "sanity.imageAsset" || (portraitItem && portraitItem._type === "image")) {
			return (
			  <ProgressiveImage
				src={urlFor(portraitItem)
				  .width(800)
				  .format("webp")
				  .quality(75)
				  .fit("max")
				  .auto("format")
				  .url()}
				placeholderSrc={urlFor(portraitItem)
				  .width(20)
				  .quality(30)
				  .blur(20)
				  .url()}
				alt="Portrait image"
				priority={true}
			  />
			);
		} else if (assetType === "sanity.fileAsset" || portraitItem._type === "file") {
			// Handle Sanity file assets (videos) - construct URL from reference
			const assetRef = portraitItem?.asset?._ref;
			if (!assetRef) {
			  console.warn("Asset reference is missing");
			  return null;
			}
			
			// Convert Sanity asset reference to CDN URL
			const videoUrl = `https://cdn.sanity.io/files/${client.config().projectId}/${client.config().dataset}/${assetRef.replace('file-', '').replace('-mp4', '.mp4')}`;

			return (
			  <video
				src={videoUrl}
				autoPlay={true}
				loop
				muted
				playsInline
				style={{ width: '100%', height: '100%', objectFit: 'cover' }}
			  >
				Your browser does not support the video tag.
			  </video>
			);
		}

		console.warn("Unsupported asset type or asset is null:", assetType, portraitItem);
		return null;
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
					{((modalData.portrait && modalData.portrait.length > 0) || modalData.image) && (
                    <div className={styles.col1}>
                        <div
                            className={styles.portrait}
                            onClick={() => {
                                const contentToSet = (modalData.portrait && modalData.portrait.length > 0) ? modalData.portrait[0] : modalData.image;
                                setCurrentContent(contentToSet);
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
