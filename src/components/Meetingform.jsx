import React, { useContext, useEffect, useState } from 'react';
import "../css/Meetingform.css"
import prev from "../assets/prev_icon.png"
import FormDataContext from "../GlobalContext"
import { Autocomplete, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import axios from 'axios';
import Config from "../config/config"
import toast from 'react-hot-toast';

const Meetingform = () => {

  const { setStep, handleCancel } = useContext(FormDataContext)
  const { formData, setFormData, handlePhoneNumberChange, fetchedUserData, setFetchedUserData, handleOpen, handleClose, open, setOpen, stream, setStream, currentStep } = useContext(FormDataContext)
  const companyId = localStorage.getItem("selectedCompanyId")
  const [localPhone, setLocalPhone] = useState(localStorage.getItem("phoneNumber") || "");
  const [users, setUsers] = useState([]);

  // api from config folder
  const userUrl = Config.baseUrl + Config.apiEndPoints.userUrlEndPoint + "?companyId=" + companyId
  const meetingContextUrl = Config.baseUrl + Config.apiEndPoints.meetingContextEndPoint

  const handleClick = () => {

    if (!formData.user.id || !formData.meetingContext) {
      toast.error('Please fill up all the details!', {
        icon: '👏',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
      return;
    }
    // If meeting context is "OTHERS", check if Remarks is filled
    if (formData.meetingContext === "OTHERS" && !formData.remarks) {
      toast.error('Please fill up the Remarks field!', {
        icon: '👏',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
      return;
    } setStep(2)
    // console.log("next button is getting called")
  }
  // handle changes 
  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "state") {

      setFormData({
        ...formData,
        [name]: value,
      });
      // fetchCitiesByState(value);

    } else if (name === "user") {
      setFormData({
        ...formData,
        user: {
          id: value,
        }
      })
    }

    else if (name === "city") {


      setFormData({
        ...formData,
        [name]: value,
      });
    } else if (name === "email") {
      const emailError = validateInput(value, emailRegex);
      setFormData({
        ...formData,
        email: value,
        emailError: emailError,
      })
    } else if (name === "phoneNumber") {
      if (value.length <= 10) {

        setFormData({
          ...formData,
          phoneNumber: value,
        })
      }
    }

    else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  // email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[a-z]{2,3}$/i;

  // validate input function
  const validateInput = (value, validationRule) => {
    if (validationRule.test(value)) {
      return "";
    } else {
      return "Invalid Input"
    }
  }
  const emailError = validateInput(formData.email, emailRegex);


  // state to store the meeting context dropdown
  const [meetingContextOptions, setMeetingContextOptions] = useState([]);
  // const meetingContextUrl = "http://192.168.12.54:8080/vis/meetCon";

  // fetching meeting context options from api
  const fetchMeetingContextOptions = async () => {
    try {
      const response = await axios.get(meetingContextUrl);
      if (response.status === 200 && response.data.data) {
        setMeetingContextOptions(response.data.data);
      }
    } catch (error) {
      console.log("error fetching meeting context options");
    }
  };
  // calling the meeting context options inside useeffect
  useEffect(() => {
    fetchMeetingContextOptions();
  }, []);

  useEffect(() => {
    const phoneNumberFromLocalStorage = localStorage.getItem("phoneNumber");
    if (phoneNumberFromLocalStorage) {
      setLocalPhone(phoneNumberFromLocalStorage);
      setFormData({
        ...formData,
        phoneNumber: phoneNumberFromLocalStorage,
      });
    }
  }, []);


  // Effect to call handlePhoneNumberChange when the component mounts
  useEffect(() => {
    if (localPhone) {
      handlePhoneNumberChange({ target: { value: localPhone } });
    }
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
        try {
            const response = await axios.get(userUrl);
            if (response.status === 200 && response.data.data) {

                setUsers(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching users", error);
        }
    };

    fetchUsers();
}, []);
  return (
    <div className="viewport_parent">
      <div className="header" >
        <img src={prev} alt="previous" style={{ height: "3em", width: "3em" }} onClick={handleCancel}/>
        <div className="meeting_details" >
          Enter Meeting Details
        </div>
      </div>

      <div className="meeting_form">

        <TextField
          label="PhoneNumber"
          name="phoneNumber"
          variant="outlined"
          id="outlined-basic"
          // value changed from local phone to formData.phoneNumber
          // value={formData.phoneNumber}
          value={localPhone}
          onChange={handleChange}
          autoComplete="off"
          onInput={handlePhoneNumberChange}
          inputProps={{ maxLength: 10 }}
          disabled={true}
          autoFocus
          sx={{ width: "95%" }}
        // size='small'

        />

        <Autocomplete
          disablePortal
          fullWidth
          sx={{ width: "95%" ,textAlign:"left"}}

          id="combo-box-demo"
          options={users}
          getOptionLabel={(option) => (option.name || "")}
          renderOption={(props, option) => (
            <li {...props} key={option.id}>
              {option.name} &nbsp;  <span>({option.department})</span>
            </li>
          )}
          value={users.find((user) => user.id === formData.user.id) || null}
          onChange={(event, newValue) => {
            if (!newValue || newValue.isPresent) {
              setFormData({
                ...formData,
                user: {
                  id: newValue ? newValue.id : "",
                },
              });
            }
          }}
          getOptionDisabled={(option) => !option.isPresent}
          renderInput={(params) => <TextField {...params} label="Whom you want to meet"
          // id={formData.user.id ? String(formData.user.id) : ""}
          placeholder='Whom you want to meet'
          />}
        />


        {/* visit type */}

        <FormControl fullWidth
          sx={{ width: "95%",textAlign:"left" }}
        >
          <InputLabel id="demo-simple-select-label">
            Reason of visit*
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            // value={formData.meetingContext || ""}
            value={meetingContextOptions.includes(formData.meetingContext) ? formData.meetingContext : ""}

            onChange={handleChange}
            name="meetingContext"
            label="meetingContext"
          >
            {meetingContextOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Remarks */}
        {formData.meetingContext === "OTHERS" ? <TextField id="outlined-basic" label="Remarks" variant="outlined" value={formData.remarks || ""} name="remarks" required           sx={{ width: "95%" }}

          onChange={handleChange}
          inputProps={{ maxLength: 60 }}
        /> : ""}
      </div>

      <div className="footer">
        <Button variant="contained" sx={{ width: "40%" }} onClick={handleCancel}>Cancel</Button>
        {/* <Button variant="contained" sx={{ width: "40%" }} onClick={() => setStep(2)} */}
        <Button variant="contained" sx={{ width: "40%" }} onClick={handleClick}
        >Next</Button>
      </div>
    </div>
  )
}

export default Meetingform
