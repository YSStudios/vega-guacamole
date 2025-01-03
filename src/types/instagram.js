import { v4 as uuidv4 } from "uuid";
import vegalogo from "../assets/vega-logo.jpeg";
import like from "../assets/svg/ig-like.svg";
import comment from "../assets/svg/ig-comment.svg";
import closeBtn from "../assets/svg/close-btn.svg";

export const INSTAGRAM_FEED = [
  {
    id: uuidv4(),
    media_type: "IMAGE",
    media_url:
      "https://res.cloudinary.com/dtps5ugbf/image/upload/v1735864131/Snapinsta.app_469032350_972320741348027_4606653916306432690_n_1080_p0auyq.jpg",
    permalink: "https://www.instagram.com/p/DDIEOwupQxS/?img_index=1",
    caption:
      "It's an honor to announce that we are now Official Creative Partners of @runwayapp ...",
    timestamp: "2024-03-20T15:00:00+0000",
  },
  {
    id: uuidv4(),
    media_type: "VIDEO",
    media_url:
      "https://res.cloudinary.com/dtps5ugbf/video/upload/v1735864132/Snapinsta.app_video_AQOTOnUwil_rx8nSt2v4B2GzW6pD2x9hNh5vv5cJKCdMuXzxjlhtl2BbynVDlF2UG0GoJD_ESFZh5HYRPqTcItAdfvt2b0ynQXhSPS8_gfiuf6.mp4",
    thumbnail_url:
      "https://res.cloudinary.com/dtps5ugbf/image/upload/v1735865656/Screenshot_2025-01-02_at_19.54.07_byuqqc.png",
    permalink: "https://www.instagram.com/p/DDXmPVLpIKE/",
    caption: "Vega for @nike x @h_lorenzo 40th Anniversary - Air Max Muse",
    timestamp: "2024-03-19T14:30:00+0000",
  },
  {
    id: uuidv4(),
    media_type: "VIDEO",
    media_url:
      "https://res.cloudinary.com/dtps5ugbf/video/upload/v1735864132/Snapinsta.app_video_AQMFKBYDvs_pIdoCWuTeJ6udTMq4sKHag3UVK4vdgV2gKCnOEzD2F4lGC0ttjtHpmOo8qx8EB23FPSWhNqUGrPoAciytRvQTxPZv3H0_vb5axr.mp4",
    thumbnail_url:
      "https://res.cloudinary.com/dtps5ugbf/image/upload/v1735866152/Screenshot_2025-01-02_at_20.02.14_asscva.png",
    permalink: "https://www.instagram.com/p/DCFZS-tpOHt/",
    caption:
      "CGI film for @bbcicecream + @complexcon Directed by @ceej.vega 💫 Agency : @vega.us + @meadiaagency Creative director: @ceej.vega CGI Animation + Sound design: @eyelidmovie Producer : @_joshuameadia Special thanks to @lundonraine 💫",
    timestamp: "2024-03-19T14:30:00+0000",
  },
];

export const INSTAGRAM_MODAL_ASSETS = {
  images: {
    vegaLogo: vegalogo,
    likeIcon: like,
    commentIcon: comment,
    closeButton: closeBtn,
  },
  links: {
    instagramProfile: "https://www.instagram.com/vega.us/",
  },
};
