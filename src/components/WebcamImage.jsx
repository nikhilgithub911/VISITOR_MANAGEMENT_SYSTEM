import React, { useContext, useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
// import "./WebcamImage.css"
import { Box, Button } from "@mui/material";
import FormDataContext from "../GlobalContext";
import Config from "../config/config";
import click from "../assets/click.svg"

function WebcamImage({ onCloseModal, onImageCapture }) {

  // if img is present than CancelIcon and CheckCircleIcon and if img is not there than CameraAltIcon will be present
  const { stream } = useContext(FormDataContext)
  const [img, setImg] = useState(null);
  const webcamRef = useRef(null);



  const webUrl = Config.baseUrl+ Config.apiEndPoints.webCamEndPoint
  const capture = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    // console.log("imageSrc",imageSrc)

    const binaryData = atob(imageSrc.split(",")[1]);
    const array = new Uint8Array(binaryData.length);
    for (let i = 0; i < binaryData.length; i++) {
      array[i] = binaryData.charCodeAt(i);
    }
    
    const imageBlob = new Blob([array], { type: "image/jpeg" });

    const formData = new FormData();
    formData.append("image", imageBlob, "image.jpg");
    try {
      const response = await axios.post(webUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      localStorage.setItem("capturedImageURL", response.data.data);
    } catch (error) {
      console.error("Error sending image:", error);
    }

     // Close the webcam modal
     onCloseModal();
  
     // Stop the stream if it exists
     if (stream) {
       stream.getTracks().forEach(track => track.stop());
     }
   
     // Set the captured image in the parent component
     onImageCapture(imageSrc);

  };

  const handleCheckIconClick = () => {
    // Check if an image is captured before closing the modal
    if (img) {
      onImageCapture(img);
      // Close the modal
      onCloseModal();
      // 
    }
  };

  return (
    <div className="Container" >
      <div className="webcam-container" style={{ position: "relative" }}>
        
        <Webcam
          audio={false}
          mirrored={true}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          style={{height:"100%",width:"100%"}}
          // videoConstraints
        />
        <Box sx={{ display: "flex", justifyContent: "space-evenly"}}>
        
          {img && <CancelIcon onClick={() => setImg(null)} style={{ width: "8%",height:"8%",cursor: "pointer" }} />}
          {/* {!img &&<CameraAltIcon onClick={capture} style={{ width: "8%",height:"8%",cursor: "pointer" }} />}  */}
          {!img && <img src={click} alt ="click" onClick={capture} style={{ width: "12%",height:"12%",cursor: "pointer",marginTop:"2.5em" }} />}
          {img && <CheckCircleIcon onClick={handleCheckIconClick} style={{ width: "8%",height:"8%" ,cursor: "pointer"}}/>}

        </Box>
      </div>
      {img && (
        <div className="image-container" >
          <img src={img} alt="screenshot"
            style={{ position: "absolute",
              left: window.innerWidth < 600 ? 4 : 32,
              top: window.innerWidth < 600 ? 45 : 33,
              zIndex: 2 }}
          />
        </div>
      )}

     
    </div>
  );
}

export default WebcamImage;


