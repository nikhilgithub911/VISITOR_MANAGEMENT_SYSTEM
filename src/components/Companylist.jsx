import React, { useContext, useState } from 'react';
import "../css/CompanyList.css";
import FormDataContext from '../GlobalContext';
import TextField from '@mui/material/TextField';
import { Typography } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const Companylist = () => {
  const { data, handleCompanyClick,handleGoBack } = useContext(FormDataContext);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter the companies based on the user input
  const filteredCompanies = data.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const arr_length = data.length;

  return (
    <div style={{ height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
      {arr_length > 3 ?
        <TextField id="standard-basic"
          label="Search Company"
          variant="standard"
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          inputProps={{
            maxLength: 12,
            style: { color: "white", marginLeft: "20px" }
          }}
        /> : ""
      }
      <ArrowBackIosNewIcon sx={{ color: "#fff", position: 'absolute', top: 0, left: 0, margin: '10px',cursor:"pointer"  }} onClick={handleGoBack}/>

      <div className="parentcompany" >
        <div className='blur_parent'>
        <div 
        className='blur_parent_child'
        // style={{
        //   overflowY: "auto",
        //   display: "flex",
        //   flexDirection: "column",
        //   gap: 10,
        //   padding: "2rem",
        //   alignItems:"center"
        // }} 
        >

          {filteredCompanies && filteredCompanies.length > 0 ? (
            filteredCompanies.map(company => (
              <div key={company.id} className="listting" onClick={() => handleCompanyClick(company.logo, company.id)}>
                <img src={company.logo} alt={company.name} className='company_logo' />
                {/* <p>{company.name}</p> */}
              </div>
            ))
          ) : <Typography variant="h5" sx={{ color: "#fff" }}>No matching companies found</Typography>}

        </div>
      </div>
      </div>
    </div>
  );
}

export default Companylist;


