import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import styles from "../styles/Styles.module.scss";
import { useDispatch } from "react-redux";
import { Draggable } from "gsap";
import ModalNav from "./ModalNav";

// Assuming urlFor is already imported and configured in your project
export default function CaseStudiesModal({
	modalName,
	modalRef,
	resize,
	caseStudiesState,
	openModal,
	handleModalResize,
	toggle,
	urlFor,
}) {
	const dispatch = useDispatch();
	const maximizeRef = useRef(null);
	const audioRef = useRef(null);
	const [windowWidth, setWindowWidth] = useState(0);

	useEffect(() => {
		// Load the audio file
		audioRef.current = new Audio('https://res.cloudinary.com/dtps5ugbf/video/upload/v1722389162/Unrealsfx_-_Cyberpunk_-_UI_HUD_Notification_ovkwjh.wav');
	}, []);  

	useEffect(() => {
		// Set initial width
		setWindowWidth(window.innerWidth);

		// Handle resize
		const handleResize = () => {
			setWindowWidth(window.innerWidth);
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const handleZIndex = (toggle, ref) => {
		dispatch(toggle());
		gsap.set(ref, { zIndex: Draggable.zIndex++ });
	};

	const handleCaseStudyClick = (study) => {
		// Play the sound
		if (audioRef.current) {
			audioRef.current.volume = 0.5;
			audioRef.current.play().catch(error => console.error("Error playing case study sound:", error));
		}
		
		// Reset all possible scroll positions immediately
		window.scrollTo(0, 0);
		document.body.scrollTop = 0;
		document.documentElement.scrollTop = 0;
		
		// If modalRef exists, reset its scroll position
		if (modalRef.current) {
			modalRef.current.scrollTop = 0;
		}
		
		openModal(study);
	};

	// Ensure image is sized to 230x305 while using the hotspot and crop
	const getImageUrl = (study) => {
		const isMobile = windowWidth <= 768;
		const dimension = isMobile ? 230 : 230;
		
		return urlFor(study.image)
			.width(dimension)
			.height(isMobile ? dimension : 305)
			.fit('crop')
			.auto('format')
			.url();
	};

	return (
		<div className={styles.content_wrap}>
			<ModalNav
				modalName={modalName}
				handleModalResize={handleModalResize}
				modalRef={modalRef}
				resize={resize}
				dispatch={dispatch}
				toggle={toggle}
			/>
			<div className={styles.modal_content}>
				<div ref={maximizeRef} className={styles.modal_body}>
					<div className={styles.case_studies_body}>
						{caseStudiesState?.map((study, index) => (
							<div className={styles.case_study} key={index}>
								<div height={300} offset={300}>
									<div className={styles.case_image_wrap}>
										<img
											src={getImageUrl(study)}
											alt={study.header}
											onClick={() => handleCaseStudyClick(study)}
											height="100%"
											width="100%"
											loading="lazy"
										/>
										<span>{study.header}</span>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
