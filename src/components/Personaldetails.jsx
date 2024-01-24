import React from 'react';
import { Button, TextField } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import FormDataContext from '../GlobalContext'
import axios from 'axios';
import prev from "../assets/prev_icon.png"

import Autocomplete from '@mui/material/Autocomplete';
import Config from "../config/config"

import toast from 'react-hot-toast';

import "../css/Personaldetails.css"
const Personaldetails = () => {

    const [cities, setCities] = useState([]);
    const [isNextButtonDisabled, setNextButtonDisabled] = useState(true);
    const { formData, setFormData, fetchedUserData } = useContext(FormDataContext)
    const { setStep } = useContext(FormDataContext)

    // set companies here
    const [company, setCompany] = useState([]);

    const optionsforCompany = company.map((item) => (
        item.name
    ))
    // const optionsforCompany = company.length > 0 ? company.map((item) => item.name) : [];
    // const optionsforCompany = company ? company.filter(item => item !== null).map(item => item.name) : [];


    // console.log("company", company)
    // console.log("optionsforCompany", optionsforCompany)
    // handle changes 
    const handleChange = (event) => {
        const { name, value } = event.target;

        if (name === "email") {
            const emailError = validateInput(value, emailRegex);
            setFormData({
                ...formData,
                email: value,
                emailError: emailError,
            });
        } else if (name === 'city') {
            const selectedCity = cities.find((city) => city.name === value);
            const cityId = selectedCity ? selectedCity.id : null;

            setFormData({
                ...formData,
                city: value,
                cityId: cityId,
            });
        } else if (name === 'phoneNumber') {
            if (value.length <= 10) {
                const phoneNumberError = validateInput(value, /^\d{10}$/);
                setFormData({
                    ...formData,
                    phoneNumber: value,
                    phoneError: phoneNumberError,
                });
            }
        } else if (name === "aadhaarNumber") {
            if (value.length <= 12) {
                setFormData({
                    ...formData,
                    aadhaarNumber: value,
                });
            }
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
        setNextButtonDisabled(!value.trim());

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
    const phoneNumberError = validateInput(formData.phoneNumber, /^\d{10}$/)
    useEffect(() => {
        setNextButtonDisabled(!formData.name.trim());
    }, [formData.name]);

    const cityUrl = Config.baseUrl + Config.apiEndPoints.cityEndpoint + "?cityName=" + formData.city
    useEffect(() => {
        const fetchCity = async () => {
            try {
                const response = await axios.get(
                    // `http://192.168.12.54:8080/api/cityByName?cityName=${formData.city}`
                    cityUrl
                );
                if (response.status === 200) {
                    setCities(response.data.data);

                }
            } catch (error) {
                console.error(error);
            }
        };

        if (formData.city) {
            fetchCity();
        }
    }, [formData.city]);

    const companyUrl = Config.baseUrl + Config.apiEndPoints.searchCompany + "?companyName="

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const response = await axios.get(companyUrl)
                if (response.status === 200) {
                    // console.log("response.data.data", response.data.data)
                    setCompany(response.data.data)
                }
            } catch (err) {
                console.error(err)
            }
        }
        fetchCompany()
    }, [])

    const handleNewSubmit = (e) => {
        e.preventDefault();
    
        // Check if any of the required fields are empty or invalid
        if (
            !formData.name ||
            !formData.email ||
            !formData.city ||
            !formData.user.id ||
            !formData.visitorCompany.name ||
            !formData.meetingContext ||
            formData.visitorCompany.name === null
        ) {
            toast.error('Please fill up all the details!', {
                icon: '👏',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            });
            return;
        } else if (formData.emailError) {
            toast.error('Please enter a valid email!', {
                icon: '👏',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            });
            return;
        } else if (/^\s|\s$/.test(formData.visitorCompany.name)) {
            toast.error('Company name cannot contain spaces at the beginning or end!', {
                icon: '👏',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            });
            return;
        }
    
        setStep(3);
    };
    
    


    return (
        <div className='viewport_personal'>
            <div className="header" >
                <img src={prev} alt="previous" style={{ height: "3em", width: "3em" }} onClick={() => setStep(1)} />
                <div className="meeting_details" >
                    Enter Personal Details
                </div>
            </div>

            <div className="personal_form">

                <TextField
                    variant='outlined'
                    label="Full Name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    inputProps={{ maxLength: 25 }}
                    // disabled={fetchedUserData && !editMode && !editButtonClicked}
                    style={{ outline: 'none', boxShadow: 'none' }}
                    disabled={fetchedUserData !== null}
                    sx={{ width: "95%" }}

                />

                <TextField
                    variant='outlined'
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!formData.emailError}
                    helperText={formData.emailError}
                    inputProps={{ maxLength: 60 }}
                    disabled={fetchedUserData !== null}
                    sx={{ width: "95%" }}
                // disabled={fetchedUserData && !editMode && !editButtonClicked}

                />

                <Autocomplete
                    disablePortal
                    sx={{ width: "95%" }}
                    id="combo-box-demo"
                    name="city"
                    options={cities}
                    freeSolo={false}
                    // value={formData.city}
                    value={
                        { id: formData.cityId, name: formData.city } && cities.some((city) => city.id === formData.cityId)
                            ? { id: formData.cityId, name: formData.city }
                            : null
                    }
                    // autoComplete
                    // autoHighlight
                    // options={cities.map((city) => city.name)}
                    // options={cities.map((city, index) => ({ label: city.name, value: city.name, id: index }))}

                    onInputChange={(event, newValue) => {

                        const formCityId = formData.city ? formData.cityId : null;
                        const formStateId = formData.stateId;
                        const selectedCity = cities.find((city) => city.name === newValue);
                        const cityId = selectedCity ? selectedCity.id : formCityId || null;
                        const stateId = selectedCity ? selectedCity.state.id : formStateId || null;

                        // console.log("newData", newValue)

                        setFormData({
                            ...formData,
                            city: newValue,
                            cityId: cityId,
                            stateId: stateId,
                        });
                    }}
                    getOptionLabel={(option) => option.name || ""}
                    renderOption={(props, option) => (
                        <li {...props} key={option.id}>
                            {option.name}
                        </li>
                    )}
                    // onChange={handleChange}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="outlined"
                            label="City "
                            id={formData.cityId ? String(formData.cityId) : ""}
                            value={formData.cityId ? formData.city : ""}
                        />
                    )}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    // disabled={fetchedUserData && !editMode && !editButtonClicked}
                    disabled={fetchedUserData !== null}
                />

                {/* <TextField
                    variant='outlined'
                    label="Company Name"
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    inputProps={{ maxLength: 60 }}
                    disabled={fetchedUserData}
                    sx={{ width: "95%" }}

                /> */}

                <Autocomplete
                    sx={{ width: "95%" }}
                    options={optionsforCompany || ""}
                    fullWidth
                    freeSolo
                    id="free-solo-2-demo"
                    disableClearable
                    value={formData.visitorCompany.name || ""}
                    onInputChange={(event, newValue) => {
                        const selectedCompany = company.find((item) => item.name === newValue);
                        const companyId = selectedCompany ? selectedCompany.id : null;

                        setFormData({
                            ...formData,
                            visitorCompany: {
                                id: companyId,
                                name: newValue,
                            },
                        });
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Search Company"
                            InputProps={{
                                ...params.InputProps,
                                type: 'search',
                            }}
                        />
                    )}
                    disabled={fetchedUserData !== null}

                />
                
            </div>

            <div className="footer_personal">
                <Button variant="contained" sx={{ width: "40%" }} onClick={() => setStep(1)}>Previous</Button>
                <Button variant="contained" sx={{ width: "40%" }} onClick={handleNewSubmit} disabled={isNextButtonDisabled}>Next</Button>
            </div>
        </div>
    )
}

export default Personaldetails



