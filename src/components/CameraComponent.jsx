import React, { useContext } from 'react';
import prev from "../assets/prev_icon.png";
import "../css/CameraComponent.css"
import { Backdrop, Box, Button, CircularProgress, Modal } from '@mui/material';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import FormDataContext from '../GlobalContext';
import image from "../assets/fold1.svg"
import WebcamImage from './WebcamImage';
import FlipCameraIosIcon from '@mui/icons-material/FlipCameraIos';

const CameraComponent = () => {

    const { openMeetModal, open, handleClose, handleImageCapture, openBackDrop, handleSubmit, setStep, handleOpen, existingUserImage, capturedImage, recapture } = useContext(FormDataContext)
    // console.log(openMeetModal,"openMeetModal");
    
    // const style = {
    //     position: "absolute",
    //     top: "40%",
    //     left: "50%",
    //     transform: "translate(-50%, -50%)",
    //     width: "80%",
    //     maxWidth: "450px",
    //     bgcolor: "background.paper",
    //     display: "flex",
    //     justifyContent: "center",
    //     boxShadow: 24,
    //     p: 4,
    // };
    const style = {
        position: "absolute",
        top: "40%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "100%",
        height:"85%",
        marginTop:"4em",
        // display:"flex",
        // paddingTop:"2em",
        // maxWidth: "450px",
        background: "#25272B",
        // backdrop-filter: "blur(43px)",
        display: "flex",
        justifyContent: "center",
        boxShadow: 24,
        p: 4,
    };
    return (
        <div className='viewport_camera'>
            <div className="header_camera" >
                <img src={prev} alt="previous" style={{ height: "3em", width: "3em" }} onClick={() => setStep(2)}/>
                <div className="meeting_details" >
                    Capture your Image
                </div>
            </div>

            <div className="camera">
               <div className="camera_grid">
               {existingUserImage ? (
                    <img src={existingUserImage} alt="User" style={{ height: "100%", width: "100%" }} />
                ) : (
                    !capturedImage ? (
                        <div style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
                            <AddAPhotoIcon sx={{ height:"2.5em",width:"2.5em", color: "#0069F5", cursor: "pointer" }} onClick={handleOpen} />
                            <p>Click to capture image</p>
                        </div>
                    ) : (
                        <img src={capturedImage} alt="Captured" style={{ height: "100%", width: "100%" }} />
                    )
                )}
                    
               </div>

               <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                sx={{ zIndex: 1, width: "100%"}}
                className='webModal'
            >
                {/* webcam in modal */}
                <Box sx={style}>
                    <WebcamImage onCloseModal={handleClose} onImageCapture={handleImageCapture} />
                </Box>
            </Modal>

              {/* Display the Backdrop component when openBackDrop is true */}
              {openBackDrop && (
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={openBackDrop}
                    onClick={handleClose}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            )}
            </div>

            <div className="footer">
                <Button variant="contained" sx={{ width: "40%" }} onClick={() => setStep(2)}>Previous</Button>
                {existingUserImage || capturedImage ?
                    (<div className="retakeImage">
                        <FlipCameraIosIcon sx={{ fontSize: 35, color: "#00308F", cursor: "pointer" }} onClick={recapture} />
                    </div>) : ("")
                }
                <Button variant="contained" sx={{ width: "40%" }} onClick={handleSubmit} disabled={openBackDrop}
                >Submit</Button>
            </div>

            {openMeetModal &&
                <Modal
                    open={true}
                    // onClose={handleClose}
                    onClose={() => { }}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box className="modalContainer">
                        <img className="modalImage" src={image} alt="thank you" style={{height:"50%",width:"50%"}}/>
                        <p className="modalTitle">
                            Thank you for sharing your details!<br /> Our host will connect with you shortly.
                        </p>

                    </Box>
                </Modal>
            }
        </div>
    )
}

export default CameraComponent