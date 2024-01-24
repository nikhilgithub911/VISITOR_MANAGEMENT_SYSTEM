import React, { useContext } from "react";
import { Box } from "@mui/material";
import "../css/Invite.css";
import FormDataContext from "../GlobalContext"
import Meetingform from "./Meetingform";
import Personaldetails from "./Personaldetails";
import CameraComponent from "./CameraComponent";


export default function CompanyReg() {
  // global context
  const { currentStep } = useContext(FormDataContext);
  function showStep(step) {
    switch (step) {
      case 1:
      return <Meetingform />;
      case 2:
      return <Personaldetails />;
      case 3:
      return <CameraComponent />;
      default:
      return <Meetingform />;
    }
  }

  return (
    <>
      <div className="parent_invite">
        {showStep(currentStep)}
      </div>
    </>
  );
}
