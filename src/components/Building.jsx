import React, { useContext } from 'react';
import "../css/Building.css";
import nyggs from "../assets/nyggs.svg"
import forwardicon from "../assets/forward.png"
import FormDataContext from '../GlobalContext';

const Building = () => {
  const { searchBuilding, newFormData, handleNewChange } = useContext(FormDataContext)

  return (
    <div className='building_parent'>
      <div className='parent1'>
        <div className="logo_text">
          <img src={nyggs} alt="nyggs" style={{ height: "10em", width: "10em" }} />
          <p style={{ color: "white", fontSize: "1.7em" }}>Welcome to NYGGS</p>
        </div>

        <input 
          type='text'
          name="buildingId"
          className='building_textfield'
          placeholder='Enter Building Id'
          value={newFormData.buildingId}
          onInput={handleNewChange}
          maxLength={7} 

        />

        <img src={forwardicon} 
          alt="forward"
          className='forward_icon'
          onClick={searchBuilding}
          cursor="pointer"
        />

      </div>
    </div>
  )
}

export default Building
