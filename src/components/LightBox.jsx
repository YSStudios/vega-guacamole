import { useRef } from "react";
import { useDispatch } from "react-redux";
import Image from "next/image";
import styles from "../styles/Styles.module.scss";
import ModalNav from "./ModalNav";

export default function Lightbox({ content, onClose, urlFor, modalName, handleModalResize, modalRef, resize, toggle }) {
  if (!content) {
    return null;
  }

  const dispatch = useDispatch();
  const maximizeRef = useRef(null);

  const isVideo = content.asset && content.asset._type === "sanity.fileAsset";

  const renderContent = () => {
    if (isVideo) {
      const videoUrl = content.asset.url;
      return (
          <video
            src={videoUrl}
            controls
            autoPlay
            loop
			muted
			objectFit="contain"
			//make the width and height responsive
			//give it a max width and height of half the screen size
			maxWidth={"50%"}
			maxHeight={"50%"}


            className={styles.lightbox_video}
          >
            Your browser does not support the video tag.
          </video>
      );
    } else {
      return (
          <Image
            src={urlFor(content).url()}
            alt="Lightbox content"
			layout="responsive"
			width={typeof window !== 'undefined' ? window.innerWidth : undefined}
			height={typeof window !== 'undefined' ? window.innerHeight : undefined}
            style={{ objectFit: 'contain' }}
            priority
            className={styles.lightbox_image}
          />
      );
    }
  };

  return (
    <div className={styles.fullheight}>
      <ModalNav
        modalName={modalName}
        handleModalResize={handleModalResize}
        modalRef={modalRef}
        resize={resize}
        dispatch={dispatch}
        toggle={toggle}
        modalHeaderStyle={styles.no_display}
        modalNavStyle={styles.offset_nav}
        noDragTrigger={true}
      />
      <div ref={maximizeRef} className={styles.modal_body}>
        {renderContent()}
      </div>
    </div>
  );
}