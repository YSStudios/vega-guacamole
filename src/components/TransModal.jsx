import { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "../styles/Styles.module.scss";
import { modalValue } from "../slices/modalSlice";
import PortableText from "react-portable-text";
import ModalNav from "./ModalNav";

export default function TransModal({
  modalName,
  modalRef,
  resize,
  toggle,
  transState,
  urlFor,
  handleModalResize,
}) {
  const active = useSelector(modalValue);
  const dispatch = useDispatch();
  const maximizeRef = useRef(null);

  return (
    <div className={styles.fullheight}>
      <ModalNav
        modalName={modalName}
        handleModalResize={handleModalResize}
        modalRef={modalRef}
        resize={resize}
        dispatch={dispatch}
        toggle={toggle}
      />
      <div className={`${styles.trans_modal_content} ${styles.modal_content} ${resize ? styles.maximized : ''}`}>
        <div ref={maximizeRef}>
          {transState.map((trans, index) => (
            <div key={index}>
              <div className={styles.trans_modal_media_video}>
                {trans.videos &&
                  trans.videos.map((video, index) => (
                    <div key={index}>
                      <a href={video.videoLink} target="_blank" rel="noopener noreferrer">
                        <img
                          src={video.thumbnail ? urlFor(video.thumbnail).url() : ""}
                          alt={`Video thumbnail ${index}`}
                          style={{ cursor: 'pointer' }}
                        />
                      </a>
                    </div>
                  ))}
              </div>
              <div className={styles.text_content}>
                <PortableText content={trans.body} dataset="production" />
                {trans.body2 ? (
                  <PortableText content={trans.body2} dataset="production" />
                ) : null}
              </div>
              <div className={styles.trans_modal_media_gallery}>
                {trans.imagesGallery &&
                  trans.imagesGallery.map((image, index) => (
                    <div key={index}>
                      <img src={urlFor(image).url()} alt={`trans image ${index}`} />
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}