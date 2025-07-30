import { useRef } from "react";
import { useDispatch } from "react-redux";
import Image from "next/image";
import styles from "../styles/Styles.module.scss";
import ModalNav from "./ModalNav";
import { createClient } from "@sanity/client";

// Sanity client setup
const client = createClient({
  projectId: "yqk7lu4g",
  dataset: "production",
  apiVersion: "2023-03-11",
  useCdn: true,
});

export default function Lightbox({ content, onClose, urlFor, modalName, handleModalResize, modalRef, resize, toggle }) {
  if (!content) {
    return null;
  }

  const dispatch = useDispatch();
  const maximizeRef = useRef(null);

  const isVideo = (content.asset && content.asset._type === "sanity.fileAsset") || content._type === "file";
  const isImage = (content.asset && content.asset._type === "sanity.imageAsset") || content._type === "image";

  const renderContent = () => {
    
    if (isVideo) {
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
            controls
            autoPlay
            loop
			muted
			preload="metadata"
			objectFit="contain"
			//make the width and height responsive
			//give it a max width and height of half the screen size
			maxWidth={"50%"}
			maxHeight={"50%"}


            className={styles.lightbox_video}
          >
            Your browser does not support the video tag.
          </video>
      ) : null;
    } else if (isImage) {
      return (
          <Image
            src={urlFor(content)
              .width(1920)
              .format("webp")
              .quality(85)
              .fit("max")
              .url()}
            alt="Lightbox content"
			layout="responsive"
			width={1920}
			height={1080}
            style={{ objectFit: 'contain' }}
            priority
            className={styles.lightbox_image}
          />
      );
    } else {
      return null;
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