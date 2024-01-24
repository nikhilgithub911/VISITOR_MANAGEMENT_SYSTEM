import { Box, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import "react-toastify/dist/ReactToastify.css";
import "../css/Logoutuser.css"
import Config from "../config/config"
import {useNavigate} from 'react-router-dom'
import Pop from "../components/Pop"


const Logoutuser = () => {
    const [fetchedUserData, setFetchedUserData] = useState(null);
    const [phoneInput, setPhoneInput] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const navigate = useNavigate();

    const searchMeeting = async (event) => {
        const visitorPhoneNumber = event.target.value;
    
        if (visitorPhoneNumber.length === 10) {
          const companyId = localStorage.getItem("selectedCompanyId")
          // const getMeetUrl = Config.baseUrl + Config.apiEndPoints.getMeetingEndPoint + "?phoneNumber=" + visitorPhoneNumber
          const getMeetUrl = Config.baseUrl + Config.apiEndPoints.getMeetingEndPoint + "?phoneNumber=" + visitorPhoneNumber + "&companyId=" + companyId
          try {
            // const response = await axios.get(`http://192.168.12.54:8080/api/meeting/getMeetingsToCheckout?phoneNumber=${visitorPhoneNumber}`);
            // const response = await axios.get(`http://192.168.12.54:8080/api/meeting/getMeetingsToCheckout?phoneNumber=${visitorPhoneNumber}?companyId={companyId}`);
            // http://192.168.12.54:8080/api/meeting/check-meetings?phoneNumber=1111111111&companyId=1
            const response = await axios.get(getMeetUrl);
    
            if (response.status === 200 && response.data.data) {
              setFetchedUserData(response.data.data);
            } else if (response.data.data === null) {
              toast('No meeting details found!', {
                icon: '👏',
                style: {
                  borderRadius: '10px',
                  background: '#333',
                  color: '#fff',
                },
              });
            }
          } catch (error) {
            toast('No meeting found!', {
              icon: '👏',
              style: {
                borderRadius: '10px',
                background: '#FF000080',
                color: '#fff',
              },
            });
            console.error(error);
          }
        }
      };
    

      const checkoutUser = async () => {

        const checkoutUrl = Config.baseUrl + Config.apiEndPoints.checkoutEndPoint + "?phone=" + fetchedUserData.visitor.phoneNumber
        try {
          // const response = await axios.get(`http://192.168.12.54:8080/api/meeting/checkout?phone=${fetchedUserData.visitor.phoneNumber}`);
          const response = await axios.get(checkoutUrl);
    
          if (response.status === 200 && response.data.data === null) {
            // Open the modal
            setIsModalOpen(true);
      
            // Wait for a few seconds before closing the modal
            setTimeout(function () {
              // Close the modal
              setIsModalOpen(false);
                navigate("/company");
            }, 5000);
          }
        } catch (error) {
          console.error(error);
          toast("Already checked out", {
            position: "top-center",
            autoClose: 800,
          });
        }
      };

  return (
    <div>
    {!fetchedUserData && (
      <TextField
        fullWidth
        label="Phone Number"
        variant="outlined"
        name="phoneNumber"
        autoComplete="off"
        autoFocus
        onInput={searchMeeting}
        value={phoneInput}
        type='tel'
        sx={{mb:1}}
        inputProps={{
          pattern: '^[0-9]*',
          onInput: (event) => {
            let value = event.target.value;
            value = value.replace(/\D/g, '');
            if (value.length > 10) {
              value = value.slice(0, 10);
            }
            setPhoneInput(value);
          },
        }}
      />
    )}

    {fetchedUserData && (
      <div className='card'>
        <Typography>
          <strong> Name: </strong>
         <span style={{color:"#555"}}> {fetchedUserData.visitor.name}</span>
        </Typography>
        <Typography>
          <strong> Phone: </strong>
          <span style={{color:"#555"}}> {fetchedUserData.visitor.phoneNumber}</span>
        </Typography>
        <Typography>
          <strong> Company: </strong>
          <span style={{color:"#555"}}> {fetchedUserData.visitor.visitorCompanyDto.name}</span>
        </Typography>

        <Typography variant="h6" sx={{ color: "black",fontSize:"bold" }}>
          Meeting Details:
        </Typography>
        <Typography>
          <strong>Host Name: </strong>
          <span style={{color:"#555"}}> {fetchedUserData.user.firstName}</span>
        </Typography>
        <Typography>
          <strong>Status: </strong>
          <span style={{color:"#555"}}> {fetchedUserData.status}</span>
        </Typography>
        <Typography>
          <strong>Visit Type: </strong>
          <span style={{color:"#555"}}>  {fetchedUserData.context}</span>
        </Typography>
        <Box className="baton">
          <Button
            variant="outlined"
            sx={{ width: "8.5em" }}
            onClick={checkoutUser}
            color="primary"
          >
            Check out
          </Button>
        </Box>
      </div>
    )}
     {isModalOpen && <Pop onClose={() => setIsModalOpen(false)} />}
  </div>
  )
}

export default Logoutuser