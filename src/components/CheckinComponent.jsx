import React, { useEffect, useState } from 'react';
import "../css/CheckinComponent.css";
import checkin from "../assets/checkin.png"
import checkout from "../assets/checkout.png"
import { useNavigate } from 'react-router';
import { Button } from '@mui/material';
import Loginuser from './Loginuser';
import Logoutuser from './Logoutuser';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';


const CheckinComponent = () => {

  const navigate = useNavigate();
  const [iconVisible, setIconVisible] = useState(true);
  const [loginUserComponent, setLoginUserComponent] = useState(false);
  const [checkinComponent, setCheckinComponent] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");

  useEffect(() => {
    // Retrieve logo URL from local storage
    const storedLogoUrl = localStorage.getItem('selectedCompanyLogo');
    if (storedLogoUrl) {
      setLogoUrl(storedLogoUrl);
    }
  }, []);

  const handleCheckIn = () => {
    setIconVisible(false)
    setLoginUserComponent(true)
  }

  const handleCheckout = () => {
    setIconVisible(false)
    setCheckinComponent(true);
  }

  const homeClick = () => {
    setIconVisible(true)
    setLoginUserComponent(false)
    setCheckinComponent(false);
  }

  const handleCompanyBack = () => {
    navigate("/company")
  }
  return (
    <div className='parentcheckin'>
            <ArrowBackIosNewIcon sx={{ color: "#fff", position: 'absolute', top: 0, left: 0, margin: '10px',cursor:"pointer" }} onClick={handleCompanyBack}/>

      <div className="blur_checkin_parent">
        <div className="logo_container">
          <div className='selected_company'>
            <img src={logoUrl} alt="logo" className='img_style' style={{ height: "100%", width: "100%" }} />
          </div>

          {iconVisible ?
            <div className='icons'>
              <div className='checkinicon'>
                <img src={checkin} alt="checkin" style={{ height: "6em", width: "6em" }} onClick={handleCheckIn} />
                <p style={{ fontWeight: "bold" }} >checkin</p>
              </div>
              <div className="checkouticon">
                <img src={checkout} alt="checkout" style={{ height: "6em", width: "6em" }} onClick={handleCheckout} />
                <p style={{ fontWeight: "bold" }} >checkout</p>
              </div>
            </div>

            : ((loginUserComponent ? (<div className='icons1' style={{ marginBottom: '20px' }}><Loginuser /><Button variant="contained" href="#contained-buttons" onClick={homeClick} sx={{ width: "8.5em" }}>
              Go Back
            </Button></div>) : (checkinComponent ? <div className='icons1' style={{ marginBottom: '20px' }}><Logoutuser />
              <Button variant="contained" href="#contained-buttons" onClick={homeClick} sx={{ width: "8.5em" }}>
                Go Back
              </Button>
            </div> : "")))}

        </div>
      </div>
    </div>
  )
}

export default CheckinComponent
