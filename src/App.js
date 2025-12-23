import {
  faXmark,
  faThumbsUp,
  faThumbsDown,
  faTrashCan,
  faPlus,
  faMinus,
  faPaintbrush,
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState, useReducer } from "react";
import Loader from "./componenet/loader/Loader";
import img from "./assets/back.png";
import { Canvas } from "./Canvas";
import "./App.css";
import { Alert } from "./componenet/Alert/Alert";
const variants = {
  hidden: { opacity: 0.4, scale: 0.2, y: 30 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0.4, scale: 0.2, y: 30 },
};
const fadeIn = {
  hidden: { opacity: 0.5, scale: 0.7 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0.5, scale: 0.7 },
};
const translate = {
  hidden: { y: 40, opacity: 0 },
  visible: { y: 0, opacity: 1 },
  exit: { y: 40, opacity: 0 },
};
const ACTIONS = {
  ERROR: "ERROR",
  LOADING: "LOADING",
  ISCLICKED: "ISCLICKED",
};
const ActionIntialData = {
  error: false,
  loading: false,
  isClicked: false,
};
function reducer(state, action) {
  // eslint-disable-next-line default-case
  const {
    type,
    payload: { name, value },
  } = action;
  // eslint-disable-next-line default-case
  switch (type) {
    case ACTIONS.ERROR:
      return { ...state, [name]: value };
    case ACTIONS.LOADING:
      return { ...state, [name]: value };
    case ACTIONS.ISCLICKED:
      return { ...state, [name]: value };
    default:
      return state;
  }
}
function App() {
  const canvas = useRef();
  const [urlSection, setUrlSection] = useState(false);
  const [dowloadeUrl, setDowloadeUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  // const [imageSrc, setSrcImg] = useState("");
  const [imgs, setImgs] = useState([]);
  const sectionForm = useRef(null);
  const scale = useRef(1);
  const [state, dispatch] = useReducer(reducer, ActionIntialData);
  const handleZoomImg = (check) => {
    const ctx = canvas.current?.getContext("2d");
    const zomFactor = 0.1;
    if (!ctx) {
      console.error("canvas context are not availabel");
      return;
    }
    if (check) scale.current += zomFactor;
    else scale.current -= zomFactor;
    const width = canvas.current.width;
    const height = canvas.current.height;
    const x = width / 2 - (scale.current * width) / 2;
    const y = height / 2 - (scale.current * height) / 2;
    const img = new Image();
    img.src = dowloadeUrl;
    img.onload = () => {
      console.log("ata mal had x : " + x, "ata mal had x : " + y);
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.scale(scale.current, scale.current);
      ctx.translate(-width / 2 - x, -height / 2 - y);
      ctx.drawImage(img, x, y, width, height);
      ctx.restore();
    };
    img.onerror = () => {
      //Error to load had zmer
      console.error("Failed to load image:", img.src);
      dispatch({
        type: ACTIONS.ERROR,
        payload: { name: "error", value: true },
      });
    };
  };
  const handleChangeInput = ({ target }) => {
    setImageUrl(target.value);
  };
  const handleDisposeUrl = () => {
    setUrlSection(true);
    setTimeout(() => {
      sectionForm.current.classList.add("show");
    }, 500);
  };
  const handleImage = (srcImage) => {
    return new Promise((res, rej) => {
      const image = new Image();
      const sizeImage = 250;
      image.crossOrigin = "Anonymous";
      image.src = srcImage;
      // setSrcImg(srcImage);
      image.onload = () => {
        setTimeout(() => {
          try {
            const ctx = canvas.current.getContext("2d");
            const width = (canvas.current.width = sizeImage);
            const height = (canvas.current.height = sizeImage);
            ctx.drawImage(image, 0, 0, width, height);
            const imageData = ctx.getImageData(0, 0, width, height);
            const pixelsData = imageData.data;
            for (let i = 0; i < pixelsData.length; i += 4) {
              const red = pixelsData[i];
              const green = pixelsData[i + 1];
              const blue = pixelsData[i + 2];
              if (red > 200 && green > 200 && blue > 200) pixelsData[i + 3] = 0;
            }
            ctx.putImageData(imageData, 0, 0);
            const imgAfterProccess = canvas.current.toDataURL("image/png");
            setImgs((prevImgs) => [
              ...prevImgs,
              { actualImg: srcImage, imgAfterProccess },
            ]);
            setDowloadeUrl(imgAfterProccess);
          } catch (error) {
            console.error("ERROR processing image", error);
            dispatch({
              type: ACTIONS.ERROR,
              payload: { name: "error", value: true },
            });
          }
        }, 300);
        res("");
        dispatch({
          type: ACTIONS.ISCLICKED,
          payload: { name: "isClicked", value: true },
        });
      };
      image.onerror = () => {
        rej("failed to fetch image");
      };
    });
  };
  const handleChange = ({ target }) => {
    const file = target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ({ target }) => {
        handleImage(target.result);
      };
      reader.readAsDataURL(file);
    }
    dispatch({
      type: ACTIONS.ISCLICKED,
      payload: { name: "isClicked", value: true },
    });
  };
  const drawImage = (i) => {
    const ctx = canvas.current.getContext("2d");
    if (!ctx) {
      console.error("the canvas context are not availabel");
      return;
    }
    const height = canvas.current.height;
    const width = canvas.current.width;
    const img = new Image();
    img.src = imgs.find((_, index) => index === i).imgAfterProccess;
    img.onload = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      setDowloadeUrl(img.src);
    };
    img.onerror = () => {
      console.log("Failed to load Image");
    };
  };
  const delateImg = () => {
    if (!(imgs.length !== 1)) {
      console.log("Are not found any Image");
      dispatch({
        type: ACTIONS.ISCLICKED,
        payload: { name: "isClicked", value: false },
      });
      setImgs([]);
      return;
    }
    const index = imgs.findIndex((img) => img.imgAfterProccess === dowloadeUrl);
    drawImage(index > 0 ? index - 1 : index);
    setImgs(imgs.filter((img) => img.imgAfterProccess !== dowloadeUrl));
  };
  return (
    <div className="App">
      <Canvas />
      <header className="App-header">
        <ul>
          <motion.li
            initial={{ opacity: 0.3, x: "-200%" }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="rubik-glitch "
          >
            Remove <span style={{ color: "azure" }}>Bg</span>
          </motion.li>
          <motion.li
            initial={{ opacity: 0.3, x: "200%" }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            Contact
          </motion.li>
        </ul>
      </header>
      {urlSection && (
        <section className="url-form center " ref={sectionForm}>
          <h1 className="francois">PUT YOUR URL Image</h1>
          <FontAwesomeIcon
            icon={faXmark}
            className="icon-xmark"
            onClick={() => {
              sectionForm.current.classList.remove("show");
              setTimeout(() => {
                setUrlSection(false);
              }, 500);
            }}
          />
          <input
            type="text"
            placeholder="URL"
            style={{ width: "50%" }}
            onChange={handleChangeInput}
          />
          <button
            onClick={() => {
              setTimeout(() => {
                handleImage(imageUrl)
                  .then((resp) => {
                    sectionForm.current.classList.remove("show");
                    console.log(resp);
                  })
                  .catch(() => {
                    dispatch({
                      type: ACTIONS.ERROR,
                      payload: { name: "error", value: true },
                    });
                  });
              }, 500);
            }}
          >
            Click
          </button>
        </section>
      )}
      <section>
        {!state.isClicked ? (
          <div className="container">
            <motion.h1
              variants={translate}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="francois"
              style={{ color: "azure", fontSize: "35px" }}
            >
              Remove background
            </motion.h1>
            <motion.p
              className="bai"
              variants={translate}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: .6, ease:"linear" }}
            >
              Cut out image background. Remove the background of your JPG and
              PNG images
            </motion.p>
            <motion.div
              className="btn choose-btn"
              variants={translate}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: .9, ease:"linear" }}
            >
              <label htmlFor="file-upload" className="custom-file-upload">
                Choose File
              </label>
              <input
                id="file-upload"
                accept="image/*"
                type="file"
                style={{ display: "none" }}
                onChange={handleChange}
              />
              <span id="file-name"></span>
            </motion.div>
            <div className="dispose-url">
              <motion.h3
                initial="hidden"
                variants={translate}
                animate="visible"
                exit="exit"
                transition={{ duration: 1.2, ease:"linear"}}
              >
                or upload a file,
              </motion.h3>
              <motion.p
                className="bai"
                variants={translate}
              initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 1.4, ease:"linear" }}
                style={{ width: "100%" }}
              >
                paste an image
                <span onClick={handleDisposeUrl}>or URL</span>
              </motion.p>
            </div>
          </div>
        ) : (
          <>
            <div className="container-imgs-proccess">
              <div className="container-zoom-in-out">
                <motion.canvas
                  className="canvas-image-process"
                  variants={fadeIn}
                  initial={"hidden"}
                  animate={"visible"}
                  exit={"exit"}
                  transition={{ duration: 1 }}
                  width={"200"}
                  height={"200"}
                  ref={canvas}
                ></motion.canvas>
                <div className="zoom-in-out">
                  <div className="center" onClick={() => handleZoomImg(false)}>
                    <FontAwesomeIcon icon={faMinus} />
                  </div>
                  <div className="center" onClick={() => handleZoomImg(true)}>
                    <FontAwesomeIcon icon={faPlus} />
                  </div>
                </div>
              </div>
              <div className="container-options center">
                <div className="center  option">
                  <div className="btn-add-img-color center">
                    <FontAwesomeIcon icon={faPlus} />
                  </div>
                  <p className="text">Change Background</p>
                </div>
                <div className="option center">
                  <div className="effacer center">
                    <FontAwesomeIcon icon={faPaintbrush} />
                  </div>
                  <p>Effacer/Restaurer</p>
                </div>
                <div className="option center">
                  <div className="effect center">
                    <FontAwesomeIcon icon={faWandMagicSparkles} />
                  </div>
                  <p>Effect</p>
                </div>
                <motion.div
                  className="dowloade bai center"
                  variants={fadeIn}
                  initial={"hidden"}
                  animate={"visible"}
                  exit={"exit"}
                  transition={{ duration: 3 }}
                >
                  <a href={dowloadeUrl} download="edited-image.png">
                    Dowload
                  </a>
                </motion.div>
              </div>
            </div>
          </>
        )}
      </section>
      <AnimatePresence>
        {state.isClicked && (
          <div className="content section-content">
            <motion.div
              className="btn"
              variants={variants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.7 }}
            >
              <label
                style={{ width: "50px", aspectRatio: "1", padding: "0" }}
                htmlFor="file-upload"
                className="custom-file-upload center"
              >
                +
              </label>
              <input
                id="file-upload"
                type="file"
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleChange}
              />
              <span id="file-name"></span>
            </motion.div>
            {imgs &&
              imgs.map((elm, index) => (
                <motion.img
                  className="img-block"
                  key={index}
                  src={elm.actualImg}
                  variants={variants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.7 }}
                  alt="uploaded"
                  onClick={() => {
                    drawImage(index);
                  }}
                />
              ))}
            <div className="container-remove-like center">
              <span className="btn">
                <FontAwesomeIcon icon={faThumbsUp} />
              </span>
              <span className="btn">
                <FontAwesomeIcon icon={faThumbsDown} />
              </span>
              <span className="bar">|</span>
              <span onClick={delateImg} className="btn">
                <FontAwesomeIcon icon={faTrashCan} />
              </span>
            </div>
          </div>
        )}
        {state.error && (
          <Alert
            mess={"failed to fetch image"}
            onClose={() =>
              dispatch({
                type: ACTIONS.ERROR,
                payload: { name: "error", value: false },
              })
            }
          />
        )}
      </AnimatePresence>
    </div>
  );
}
export default App;