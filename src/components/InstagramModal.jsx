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
import { CloudinaryOptimizer } from "../utils/cloudinary";

function Post({ post, onDeletePost, isAdmin }) {
  const videoRef = useRef(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDeletePost = async () => {
    if (!confirm("Are you sure you want to delete this post?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch("/api/instagram/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId: post.id }),
      });

      const result = await response.json();

      if (result.success) {
        onDeletePost(post.id);
      } else {
        alert(`Failed to delete post: ${result.message}`);
      }
    } catch (error) {
      alert(`Error deleting post: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Debug video URLs in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && post.media_type === "VIDEO") {
      console.log('=== Video Debug Info ===');
      console.log('Original video URL:', post.media_url);
      const optimizedUrl = CloudinaryOptimizer.getOptimizedUrl(post.media_url, {
        quality: 'auto:good'
      });
      console.log('Optimized video URL:', optimizedUrl);
      
      if (post.thumbnail_url) {
        console.log('Original thumbnail URL:', post.thumbnail_url);
        const optimizedThumbnail = CloudinaryOptimizer.getThumbnail(post.thumbnail_url, 640);
        console.log('Optimized thumbnail URL:', optimizedThumbnail);
      }
      console.log('=======================');
    }
  }, [post]);

  return (
    <div className={styles.post} key={post.id}>
      <div className={styles.post_header}>
        <span>
          <Image src={vegalogo} height={128} width={128} alt="vega logo" />
          vega.us
        </span>
        <div className={styles.post_header_right}>
          <p className={styles.timestamp}>{moment(post.timestamp).fromNow()}</p>
          {isAdmin && (
            <button
              className={styles.delete_button}
              onClick={handleDeletePost}
              disabled={isDeleting}
              title="Delete post"
            >
              {isDeleting ? "..." : "×"}
            </button>
          )}
        </div>
      </div>

      <a href={post.permalink} target="_blank" rel="noopener noreferrer" className={styles.media_link}>
        {post.media_type === "VIDEO" ? (
          <video
            src={CloudinaryOptimizer.getOptimizedUrl(post.media_url, {
              quality: 'auto:good'
              // Removed format: 'mp4' to avoid breaking existing URLs
            }) || post.media_url}
            ref={videoRef}
            autoPlay={true}
            className={styles.image}
            controls={false}
            poster={CloudinaryOptimizer.getThumbnail(post.thumbnail_url, 640) || post.thumbnail_url}
            muted
            loop
            playsInline
            onError={() => {
              console.warn('Video failed to load with optimization, trying original URL');
              if (videoRef.current) {
                videoRef.current.src = post.media_url;
              }
            }}
          />
        ) : (
          <img
            src={CloudinaryOptimizer.getResponsiveImage(post.media_url, 800) || post.media_url}
            alt={post.caption}
            className={styles.image}
            loading="lazy"
            onError={(e) => {
              console.warn('Image failed to load with optimization, trying original URL');
              e.target.src = post.media_url;
            }}
          />
        )}
      </a>

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
  const [posts, setPosts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const instagramProfileUrl =
    sanityInstaData?.instagramProfile ||
    INSTAGRAM_MODAL_ASSETS.links.instagramProfile;

  useEffect(() => {
    // Initialize posts from props
    setPosts(sanityInstaData?.posts || instaFeed || []);
    
    // Check if user is admin (you can implement your own admin check logic)
    const checkAdminStatus = async () => {
      try {
        const response = await fetch("/api/admin/check", {
          credentials: "include",
        });
        const data = await response.json();
        setIsAdmin(data.isAdmin);
      } catch (error) {
        console.log("Not logged in as admin");
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [sanityInstaData, instaFeed]);

  const handleDeletePost = (postId) => {
    setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
  };

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
            {posts && posts.map((post) => (
              <Post 
                key={post.id} 
                post={post} 
                onDeletePost={handleDeletePost}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
