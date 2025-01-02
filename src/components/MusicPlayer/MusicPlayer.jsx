import React, { useState, useRef, useEffect } from "react";
import styles from "../../styles/Player.module.scss";
import Player from "./Player";
import { playAudio } from "./utils";
import Image from "next/image";
import closeBtn from "../../assets/svg/close-btn.svg";
import { useDispatch } from "react-redux";

function MusicPlayer({ songData, toggle, urlFor }) {
	const audioRef = useRef(null);
	const dispatch = useDispatch();
	const [songs, setSongs] = useState([]);
	const [currentSong, setCurrentSong] = useState(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [songInfo, setSongInfo] = useState({
		currentTime: 0,
		duration: 0,
		animationPercentage: 0,
		volume: 0,
	});
	const [isMobile, setIsMobile] = useState(false);
	
	useEffect(() => {
		// Define a function to update the state based on the window width
		const checkIfMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};

		// Call the function once to set the initial state
		checkIfMobile();

		// Add a resize event listener to update the state when the window is resized
		window.addEventListener("resize", checkIfMobile);

		// Cleanup the event listener when the component is unmounted
		return () => window.removeEventListener("resize", checkIfMobile);
	}, []);

	useEffect(() => {
		if (songData && songData.length > 0) {
			setSongs(songData);
			setCurrentSong(songData[0]);
		}
	}, [songData]);

	const timeUpdateHandler = (e) => {
		const current = e.target.currentTime;
		const duration = e.target.duration;
		const roundedCurrent = Math.round(current);
		const roundedDuration = Math.round(duration);
		const percentage = Math.round((roundedCurrent / roundedDuration) * 100);
		setSongInfo({
			...songInfo,
			currentTime: current,
			duration: duration,
			animationPercentage: percentage,
			volume: e.target.volume,
		});
	};

	const songEndHandler = async () => {
		let currentIndex = songs.findIndex((song) => song._id === currentSong._id);
		await setCurrentSong(songs[(currentIndex + 1) % songs.length]);
		playAudio(isPlaying, audioRef);
		return;
	};

	return (
		<div className={styles.music_player}>
			
				{!isMobile ? (
					<svg className={`${styles.player_drag} dragTrigger`} width="100%" height="100%" viewBox="0 0 318 30" preserveAspectRatio="xMidYMid meet">
					<g>
						<circle cx="6" cy="24" r="6" />
						<circle cx="24" cy="6" r="6" />
						<circle cx="42" cy="24" r="6" />
						<circle cx="60" cy="6" r="6" />
						<circle cx="78" cy="24" r="6" />
						<circle cx="96" cy="6" r="6" />
						<circle cx="114" cy="24" r="6" />
						<circle cx="132" cy="6" r="6" />
						<circle cx="150" cy="24" r="6" />
						<circle cx="168" cy="6" r="6" />
						<circle cx="186" cy="24" r="6" />
						<circle cx="204" cy="6" r="6" />
						<circle cx="222" cy="24" r="6" />
						<circle cx="240" cy="6" r="6" />
						<circle cx="258" cy="24" r="6" />
						<circle cx="276" cy="6" r="6" />
						<circle cx="294" cy="24" r="6" />
					</g>
					</svg>
				) : 
				<svg className={`${styles.player_drag} dragTrigger`} width="100%" height="100%" viewBox="0 0 318 30" preserveAspectRatio="xMidYMid meet">
					<g>
						<circle cx="6" cy="24" r="6" />
						<circle cx="24" cy="6" r="6" />
						<circle cx="42" cy="24" r="6" />
						<circle cx="60" cy="6" r="6" />
					</g>
				</svg>
				}

			<Image
				src={closeBtn}
				alt="close window"
				className={styles.close_window}
				width={20}
				height={20}
				onClick={() => dispatch(toggle())}
			/>
			{currentSong && (
				<Player
					audioRef={audioRef}
					setIsPlaying={setIsPlaying}
					currentSong={currentSong}
					isPlaying={isPlaying}
					songInfo={songInfo}
					setSongInfo={setSongInfo}
					songs={songs}
					setSongs={setSongs}
					setCurrentSong={setCurrentSong}
					songData={songData}
					urlFor={urlFor}
					isMobile={isMobile}
				/>
			)}
			{currentSong && (
				<audio
					onLoadedMetadata={timeUpdateHandler}
					onTimeUpdate={timeUpdateHandler}
					ref={audioRef}
					src={currentSong.audio}
					onEnded={songEndHandler}
				></audio>
			)}
		</div>
	);
}

export default MusicPlayer;