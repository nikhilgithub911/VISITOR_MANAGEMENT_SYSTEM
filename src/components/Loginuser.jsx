import React, { useEffect, useState } from "react";
import { Button, TextField } from "@mui/material";
import axios from "axios";
import { toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import Config from "../config/config"
import "../css/Loginuser.css"
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';


const Loginuser = () => {




  const [phoneInput, setPhoneInput] = useState("");
  const [fillDetailsToastShown, setFillDetailsToastShown] = useState(false);
  const [pendingMeetingsToastShown, setPendingMeetingsToastShown] = useState(false);
  const [isContinueDisabled, setIsContinueDisabled] = useState(true);
  const navigate = useNavigate();

  const companyfromlocal = localStorage.getItem("selectedCompanyId")

  const searchMeeting = async () => {
    setFillDetailsToastShown(false);
    setPendingMeetingsToastShown(false);
  
    localStorage.setItem("phoneNumber", phoneInput);
    let getByPhoneUrl =
      Config.baseUrl +
      Config.apiEndPoints.getByPhoneEndPoint +
      "?phoneNumber=" +
      phoneInput +
      "&companyId=" +
      companyfromlocal;
  
    try {
      const response = await axios.get(getByPhoneUrl);
  
      if (response.data.data.length === 0) {
        toast.success("Please fill up the details");
        navigate("/invite");
      } else if (response.data.data.length !== 0) {
        toast.success('You already have pending meetings', {
          style: {
            border: '1px solid #713200',
            padding: '16px',
            color: '#713200',
          },
          iconTheme: {
            primary: '#713200',
            secondary: '#FFFAEE',
          },
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  


  const handlePhoneInputChange = (event) => {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 10) {
      value = value.slice(0, 10);
    }
    setPhoneInput(value);
    setIsContinueDisabled(value.length !== 10);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <TextField
        label="Phone Number"
        variant="outlined"
        id="outlined-basic"
        autoFocus
        type="tel"
        name="phoneNumber"
        autoComplete="off"
        sx={{ mb: 1 }}
        value={phoneInput}
        inputProps={{
          pattern: '^[0-9]*',
          onInput: handlePhoneInputChange,
        }}
      />
      <Button
        variant="contained"
        onClick={searchMeeting}
        disabled={isContinueDisabled}
        endIcon={<ArrowForwardIcon />}
      // sx={{width:"50%"}}
      >
        Continue
      </Button>


    </div>
  )
}

export default Loginuser

