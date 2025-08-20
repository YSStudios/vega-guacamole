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
		console.log('Full modalData:', modalData);
		
		// Search for video assets across all fields
		const searchForVideos = (obj, path = '') => {
			if (!obj) return;
			
			if (typeof obj === 'object' && obj.asset && obj.asset._ref) {
				if (obj.asset._ref.startsWith('file-')) {
					console.log(`Found video asset at ${path}:`, obj);
				}
			}
			
			if (Array.isArray(obj)) {
				obj.forEach((item, index) => searchForVideos(item, `${path}[${index}]`));
			} else if (typeof obj === 'object' && obj !== null) {
				Object.keys(obj).forEach(key => {
					searchForVideos(obj[key], path ? `${path}.${key}` : key);
				});
			}
		};
		
		searchForVideos(modalData, 'modalData');
		
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
				  console.log('Gallery item:', content, 'index:', index);
				  const assetType = content?.asset?._type;
				  const assetRef = content?.asset?._ref;
				  
				  // Determine if it's video or image based on the asset reference prefix
				  // Videos can have _type: "image" but start with "file-", so check reference first
				  const isVideoAsset = (assetRef && assetRef.startsWith('file-')) || 
									   (assetType === "sanity.fileAsset" || content?._type === "file");
				  const isImageAsset = (assetRef && assetRef.startsWith('image-')) && 
									   !isVideoAsset;
				  
				  console.log('Asset type:', assetType, 'Asset ref:', assetRef, 'isVideo:', isVideoAsset, 'isImage:', isImageAsset);
				  
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
							console.log('Processing asset reference:', assetRef);
							
							// More robust file extension detection
							let fileExtension = '.mp4'; // default
							const refLower = assetRef.toLowerCase();
							if (refLower.includes('-mov')) fileExtension = '.mov';
							else if (refLower.includes('-webm')) fileExtension = '.webm';
							else if (refLower.includes('-avi')) fileExtension = '.avi';
							else if (refLower.includes('-mkv')) fileExtension = '.mkv';
							else if (refLower.includes('-mp4')) fileExtension = '.mp4';
							
							// Extract the hash part and construct URL
							// Remove 'file-' prefix and any format suffix to get the hash
							const hashMatch = assetRef.match(/^file-([a-f0-9]+)/);
							if (hashMatch) {
								const hash = hashMatch[1];
								videoUrl = `https://cdn.sanity.io/files/${client.config().projectId}/${client.config().dataset}/${hash}${fileExtension}`;
							} else {
								console.warn('Could not extract hash from asset reference:', assetRef);
							}
						  }
						  
						  console.log('Video URL constructed:', videoUrl, 'from asset:', content.asset);
						  
						  return videoUrl ? (
							<video
							  src={videoUrl}
							  autoPlay={true}
							  loop
							  muted
							  playsInline
							  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
							  onError={(e) => {
								console.error('Gallery video failed to load:', videoUrl, e);
							  }}
							>
							  Your browser does not support the video tag.
							</video>
						  ) : (
							<div style={{ width: '100%', height: '100%', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
							  <span>Video not found</span>
							</div>
						  );
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
			console.log('No portrait or image found in modalData');
			return null;
		}
		
		console.log('=== PORTRAIT DEBUG ===');
		console.log('Portrait item:', portraitItem);
		console.log('Portrait item _type:', portraitItem?._type);
		console.log('Portrait asset type:', portraitItem?.asset?._type);
		console.log('Portrait asset ref:', portraitItem?.asset?._ref);
	  
		const assetType = portraitItem?.asset?._type;
		const assetRef = portraitItem?.asset?._ref;
		
		// Check if it's a video asset first (by reference prefix)
		const isVideoByRef = assetRef && assetRef.startsWith('file-');
		
		console.log('Is video by reference:', isVideoByRef);
		console.log('=====================');
	  
		if (isVideoByRef || assetType === "sanity.fileAsset" || portraitItem._type === "file") {
			// Handle video assets
			let videoUrl;
			
			// Check if we have a direct URL first (this is the case for portrait)
			if (portraitItem.asset?.url) {
				videoUrl = portraitItem.asset.url;
				console.log('Using direct portrait video URL:', videoUrl);
			} else if (assetRef) {
				// Fallback to constructing URL from reference
				console.log('Processing portrait asset reference:', assetRef);
				
				// More robust file extension detection for portrait videos
				let fileExtension = '.mp4'; // default
				const refLower = assetRef.toLowerCase();
				if (refLower.includes('-mov')) fileExtension = '.mov';
				else if (refLower.includes('-webm')) fileExtension = '.webm';
				else if (refLower.includes('-avi')) fileExtension = '.avi';
				else if (refLower.includes('-mkv')) fileExtension = '.mkv';
				else if (refLower.includes('-mp4')) fileExtension = '.mp4';
				
				// Extract the hash part and construct URL
				const hashMatch = assetRef.match(/^file-([a-f0-9]+)/);
				if (hashMatch) {
					const hash = hashMatch[1];
					videoUrl = `https://cdn.sanity.io/files/${client.config().projectId}/${client.config().dataset}/${hash}${fileExtension}`;
				} else {
					console.warn('Could not extract hash from portrait asset reference:', assetRef);
					return null;
				}
				
				console.log('Portrait video URL constructed:', videoUrl);
			} else {
				console.warn("Portrait asset has no URL or reference");
				return null;
			}

			return (
			  <video
				src={videoUrl}
				autoPlay={true}
				loop
				muted
				playsInline
				style={{ width: '100%', height: '100%', objectFit: 'cover' }}
				onError={(e) => {
					console.error('Portrait video failed to load:', videoUrl, e);
				}}
				onLoadStart={() => console.log('Portrait video started loading')}
				onCanPlay={() => console.log('Portrait video can play')}
			  >
				Your browser does not support the video tag.
			  </video>
			);
		} else if (assetType === "sanity.imageAsset" || (portraitItem && portraitItem._type === "image")) {
			// Handle image assets
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
