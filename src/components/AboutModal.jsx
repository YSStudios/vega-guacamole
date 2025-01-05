import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { useSelector, useDispatch } from "react-redux";
import styles from "../styles/Styles.module.scss";
import { modalValue } from "../slices/modalSlice";
import PortableText from "react-portable-text";
import ModalNav from "./ModalNav";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import checkers from "../assets/svg/checkers.svg";
import square from "../assets/svg/square.svg";
import graph from "../assets/svg/graph.svg";
import rectangles from "../assets/svg/2rectangles.svg";
import lines from "../assets/svg/lines.svg";
import circles from "../assets/svg/circles.svg";
import squarecircle from "../assets/svg/squarecircle.svg";

export default function AboutModal({
  modalName,
  modalRef,
  resize,
  toggle,
  aboutState,
  urlFor,
  handleModalResize,
}) {
  const active = useSelector(modalValue);
  const dispatch = useDispatch();
  const maximizeRef = useRef(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);

  // console.log("aboutState:", aboutState);

  useEffect(() => {
    if (aboutState.length > 0 && aboutState[0].imagesGallery2) {
      setCurrentImage(aboutState[0].imagesGallery2[0]);
    }
  }, [aboutState]);

  return (
    <div className={styles.about_container}>
      <ModalNav
        modalName={modalName}
        handleModalResize={handleModalResize}
        modalRef={modalRef}
        resize={resize}
        dispatch={dispatch}
        toggle={toggle}
        modalHeaderStyle={styles.no_opacity}
      />
      <div className={styles.modal_content}>
        <div ref={maximizeRef} className={styles.modal_body}>
          {aboutState.slice(0, 1).map((about, index) => (
            <div key={index}>
              <div className={styles.about_logo}>
                {(aboutState[0]?.logoMovUrl || aboutState[0]?.logoWebMUrl) && (
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    webkit-playsinline="true"
                    x5-playsinline="true"
                    style={{
                      width: /^((?!chrome|android).)*safari/i.test(
                        navigator.userAgent
                      )
                        ? "15em"
                        : "8em",
                      height: "7em",
                      objectFit: "cover",
                    }}
                  >
                    {aboutState[0]?.logoWebMUrl && (
                      <source
                        src={aboutState[0].logoWebMUrl}
                        type="video/webm"
                      />
                    )}
                    {aboutState[0]?.logoMovUrl && (
                      <source
                        src={aboutState[0].logoMovUrl}
                        type="video/quicktime"
                      />
                    )}
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            </div>
          ))}

          {aboutState.map((about, index) => (
            <div key={index} className={styles.about_info}>
              <h1 className={styles.about_title}>vega.earth</h1>
              <span className={styles.est_date}>est. 2024</span>
              <ul className={styles.about_stats}>
                <li>
                  <div className={styles.list_item}>
                    <div className={styles.list_title}>Mission</div>
                    <div className={styles.list_content}>
                      Innovate and build.
                    </div>
                  </div>
                </li>
                <li>
                  <div className={styles.list_item}>
                    <div className={styles.list_title}>Services</div>
                    <div className={styles.list_content}>3D, AR, Web</div>
                  </div>
                </li>
                <li>
                  <div className={styles.list_item}>
                    <div className={styles.list_title}>Design</div>
                    <div className={styles.list_content}>Future Focused</div>
                  </div>
                </li>
                <li>
                  <div className={styles.list_item}>
                    <div className={styles.list_title}>vegaOS</div>
                    <div className={styles.list_content}>
                      The OS for creative flow.
                    </div>
                  </div>
                </li>
              </ul>
              <button
                className={styles.about_moreinfo}
                onClick={() => handleModalResize(modalRef, resize)}
              >
                More Info...
              </button>

              {/* begin full content */}
              <div className={styles.about_full_content}>
                <div className={styles.about_grid}>
                  <h1 className={styles.about_header}>VEGA STUDIO</h1>

                  <div className={styles.agency}>
                    <h2>
                      Agency
                      <br /> Snapshot
                    </h2>
                    <p>
                      Vega Studio is a full-service, black-owned and operated
                      agency, distinguished in conceptualizing, creating and
                      executing digital-first creative strategies established at
                      the intersection of cutting edge technology, cultural
                      analysis and virality. This approach led Vega to becoming
                      Meta’s official AR partner, and has allowed the agency to
                      work with internationally renowned companies including
                      Google, YouTube, Netflix, Xbox, Intel, Instagram, Roc
                      Nation, Universal Music Group, Coachella, and more.
                    </p>
                  </div>
                  <div className={`${styles.expertise} ${styles.services}`}>
                    <h2>Our Focus</h2>
                    <ul>
                      <li>
                        <span>Viral Campaigns</span>
                      </li>
                      <li>
                        <span>Creative Storytelling</span>
                      </li>
                      <li>
                        <span>Emerging Technology</span>
                      </li>
                      <li>
                        <span>Immersive Experiences</span>
                      </li>
                      <li>
                        <span>Custom Solutions</span>
                      </li>
                    </ul>
                  </div>

                  <div className={styles.team_slider}>
                    {about.imagesGallery2 && (
                      <Slider
                        infinite={true}
                        speed={500}
                        slidesToShow={1}
                        slidesToScroll={1}
                        beforeChange={(oldIndex, newIndex) =>
                          setActiveSlide(newIndex)
                        }
                        adaptiveHeight={true}
                        variableWidth={false}
                        className={`${styles.team_slick_slider} team_slick_slider`}
                        customPaging={(i) => (
                          <div>
                            <span>{about.imagesGallery2[i].name}</span>
                            {about.imagesGallery2[i].title}
                          </div>
                        )}
                        responsive={[
                          {
                            breakpoint: 991,
                            settings: {
                              variableWidth: false, // Disabling variableWidth at and below 1024px might help
                              adaptiveHeight: true,
                            },
                          },
                          {
                            breakpoint: 768,
                            settings: {
                              variableWidth: false, // Ensuring variableWidth is disabled for smaller devices
                              adaptiveHeight: true,
                            },
                          },
                        ]}
                      >
                        {about.imagesGallery2.map((item, itemIndex) => (
                          <div key={itemIndex} className={styles.team_member}>
                            <img
                              src={urlFor(item.image)
                                .width(800)
                                .height(800)
                                .fit("crop")
                                .crop(
                                  item.image.hotspot ? "focalpoint" : "center"
                                )
                                .focalPoint(
                                  item.image.hotspot.x,
                                  item.image.hotspot.y
                                )
                                .url()}
                              alt={item.name || ""}
                              className={`${styles.team_image} ${
                                itemIndex === activeSlide ? styles.active : ""
                              }`}
                            />
                            <div className={styles.name_title_overlay}>
                              <span>{item.name}</span>
                              <br />
                              <span>{item.title}</span>
                            </div>
                          </div>
                        ))}
                      </Slider>
                    )}
                  </div>
                </div>
                <div className={styles.solutions_container}>
                  <h1 className={styles.about_header}>Solutions</h1>
                  <div className={styles.solutions_row}>
                    <div className={styles.solutions_col}>
                      <Image src={checkers} alt="Checkers" width={100} />
                      <h2>Strategy</h2>
                      <ul>
                        <li>
                          <h3>Creative Direction</h3>
                          <span>Leading creative vision and execution.</span>
                        </li>
                        <li>
                          <h3>Creative Strategy</h3>
                          <span>
                            Strategizing to align creative projects with
                            business goals.
                          </span>
                        </li>
                        <li>
                          <h3>Art Direction</h3>
                          <span>Defining visual style and aesthetics.</span>
                        </li>
                      </ul>
                    </div>
                    <div className={styles.solutions_col}>
                      <Image src={square} alt="Checkers" width={100} />
                      <h2>Design</h2>
                      <ul>
                        <li>
                          <h3>Social AR</h3>
                          <span>
                            Developing AR experiences for social platforms like
                            Instagram and Snapchat, with TikTok services on a
                            case-by-case basis.
                          </span>
                        </li>
                        <li>
                          <h3>Visual/Brand Identity</h3>
                          <span>
                            Crafting timeless and distinct brand identities
                          </span>
                        </li>
                        <li>
                          <h3>2D/3D Motion Design</h3>
                          <span>
                            Creating visually engaging motion graphics including
                            VFX, Social content, World Buiof Meta, we execute AR
                            strategies and designs for renowned brands.
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div className={styles.solutions_col}>
                      <Image src={graph} alt="Checkers" width={100} />
                      <h2>Production</h2>
                      <ul>
                        <li>
                          <h3>Project Management</h3>
                          <span>
                            Overseeing production for quality content delivery
                            including AR/XR experiences and Film.
                          </span>
                        </li>
                        <li>
                          <h3>Social Content Creation</h3>
                          <span>
                            Developing compelling content for various social
                            media platforms, tailored to engage and captivate
                            the target audience.
                          </span>
                        </li>
                        <li>
                          <h3>Video Editing</h3>
                          <span>
                            Enhancing storytelling through professional video
                            editing.
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className={styles.framework_container}>
                  <h1 className={styles.about_header}>Framework</h1>
                  <div className={styles.blurb}>
                    <h2>
                      Process <br />
                      Overview
                    </h2>
                    <p>
                      Our approach to every project follows a strategic process
                      comprising research, ideation, conceptualization, and
                      application. Our structured methodology and values ensure
                      that each stage is executed with precision to deliver
                      exceptional results.
                    </p>
                  </div>
                  <div className={styles.framework_row}>
                    <div className={styles.framework_col}>
                      <h3>Research</h3>
                      <Image src={rectangles} alt={"rectangles"} width={100} />
                      <p>
                        Collecting relevant information that can be used to
                        inform decision-making or to develop.
                      </p>
                    </div>
                    <div className={styles.framework_col}>
                      <h3>Ideation</h3>
                      <Image src={lines} alt={"lines"} width={100} />
                      <p>
                        Process of generating new ideas, exploring solutions,
                        and innovative concepts.
                      </p>
                    </div>
                    <div className={styles.framework_col}>
                      <h3>Concept</h3>
                      <Image src={circles} alt={"circles"} width={100} />
                      <p>
                        Defining key components, characteristics, and
                        relationships of the concept.
                      </p>
                    </div>
                    <div className={styles.framework_col}>
                      <h3>Application</h3>
                      <Image
                        src={squarecircle}
                        alt={"squarecircle"}
                        width={100}
                      />
                      <p>
                        Concepts translated into tangible outcomes; driving
                        results.
                      </p>
                    </div>
                  </div>
                </div>
                <div className={styles.partners_container}>
                  <h1 className={styles.about_header}>Partners</h1>
                  <div className={styles.blurb}>
                    <h2>
                      Work <br />
                      Index
                    </h2>
                    <p>
                      Our ability to create successful collaborations with
                      diverse partners and clients is reflected in our track
                      record. With each project, we bring our expertise,
                      consistently delivering exceptional results and building
                      lasting relationships.
                    </p>
                  </div>
                  {/* make a slider that is 6 slides wide and 4 columns tall */}
                  <div className={styles.partners_slider}>
                    {about.imagesGallery && (
                      <>
                        {Array.from(
                          {
                            length: Math.ceil(
                              Math.min(about.imagesGallery.length, 24) / 6
                            ),
                          },
                          (_, i) => (
                            <Slider
                              key={i}
                              dots={false}
                              infinite={true}
                              speed={700}
                              autoplaySpeed={3000}
                              slidesToShow={4} // Default slides to show for desktop
                              slidesToScroll={1}
                              autoplay={false}
                              arrows={false}
                              swipeToSlide={true}
                              pauseOnHover={false}
                              rtl={i % 2 !== 0}
                              style={{ height: "7em" }}
                              centerMode={true}
                              responsive={[
                                {
                                  breakpoint: 1024,
                                  settings: {
                                    slidesToShow: 3, // Reduced number for tablets
                                    centerMode: false,
                                  },
                                },
                                {
                                  breakpoint: 768,
                                  settings: {
                                    slidesToShow: 3, // Reduced further for landscape phones
                                    centerMode: false,
                                  },
                                },
                                {
                                  breakpoint: 480,
                                  settings: {
                                    slidesToShow: 2, // Only one slide for small phones
                                    centerMode: false,
                                  },
                                },
                              ]}
                            >
                              {about.imagesGallery
                                .slice(i * 6, i * 6 + 6)
                                .map((image, index) => (
                                  <div
                                    key={index}
                                    className={styles.partner_image}
                                  >
                                    <Image
                                      src={urlFor(image).url()}
                                      alt={`About image ${i * 6 + index}`}
                                      width={150}
                                      height={150}
                                    />
                                  </div>
                                ))}
                            </Slider>
                          )
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
              {/* end full content */}

              <span className={styles.about_subtext}>
                ™ and © 1989 - {new Date().getFullYear()} Vega Inc. <br />
                All rights reserved.
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
