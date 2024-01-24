import { createContext, useContext, useEffect, useState } from "react";
import { toast } from 'react-hot-toast';
// import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Config from "../src/config/config"
import "./App.css";

const FormDataContext = createContext();

export function FormDataProvider({ children }) {
  const [openBackDrop, setOpenBackDrop] = useState(false);
  // modal after submitting meeting request
  const [openMeetModal,setOpenMeetModal] = useState(false)
  // console.log(openMeetModal, "openmeetmodal in GlobalContext");

  const [editMode, setEditMode] = useState(false);

  // keeping track of the steps
  const [currentStep, setStep] = useState(1);
  // captured image will be stored here
  const [capturedImage, setCapturedImage] = useState(null);

  const navigate = useNavigate();
  
  const localPhone = localStorage.getItem("phoneNumber")

  const [existingUserImage, setExistingUserImage] = useState("");

  //  state to store fetched user data
  const [fetchedUserData, setFetchedUserData] = useState(null);
// console.log("fetched user data",fetchedUserData)
// ----------------------new module-------------------
const [newFormData,setNewFormData] = useState({
  buildingId:""
})
const [data, setData] = useState(() => {
  const storedData = localStorage.getItem('companyList');
  return storedData ? JSON.parse(storedData) : [];
});

const handleNewChange = (e) => {
  const { name, value } = e.target;
// console.log("this function is getting called")
  // const numericValue = value.replace(/[^0-9]/g, '');

  if (/[a-z]/.test(value)) {
    // Display a warning message or perform any other action
    // console.warn("Warning: Lowercase letters are not allowed.");
    toast('Please enter uppercase letters only!',
        {
          icon: '👏',
          style: {
            borderRadius: '10px',
            background: '#333',
            // background:'#FF0000',
            color: '#fff',
          },
        }
      );
    // toast.warn("Enter uppercase letters")
    
  }
  const alphanumericValue = value.replace(/[^A-Z0-9]/g, '');


  // setNewFormData({ target: { name, value: numericValue } });

  setNewFormData({
      [name]: alphanumericValue
  })
}

// const buildingUrl = `http://192.168.12.54:8080/com/getByBuildingId?buildingId=${newFormData.buildingId}`;

const searchBuilding = async () => {
let buildingApi = Config.baseUrl + Config.apiEndPoints.buildingEndPoint + "?buildingId="+newFormData.buildingId

  if(!newFormData.buildingId){
    toast('Please enter building id!',
        {
          icon: '👏',
          style: {
            borderRadius: '10px',
            background: '#333',
            // background:'#FF0000',
            color: '#fff',
          },
        }
      );

      return;
  }
  try {
    const response = await axios.get(buildingApi);
    if (response.data.data.length > 0) {
      const newData = response.data.data;
      // console.log("newData",newData)
      setData(newData);
      localStorage.setItem('companyList', JSON.stringify(newData));
      // console.log("Data updated:", newData);
      navigate("/company");
      setNewFormData({
        buildingId: ""
      });
    }else if(response.data.data.length === 0){
      console.log("response.data.data",response.data.data)
      // toast.error("no companies found")
    }
  } catch (err) {
    console.error(err);
    // console.log("response.data.data",)
      toast.error("no companies found")
  }
};
const handleGoBack = ()=>{
    navigate("/")
    localStorage.removeItem("companyList")
}
const handleCompanyClick = (logoUrl,companyId) => {
  localStorage.setItem('selectedCompanyLogo', logoUrl);
  localStorage.setItem('selectedCompanyId', companyId);
  navigate('/checkin')

}

// --------------------------------------------------------------

  const initialFormData = {
    id: "",
    name: "",
    phoneNumber: localPhone || "",
    email: "",
    gender: "",
    // age: "",
    state: "",
    stateId:"",
    city: "",
    cityId:"",
    address: "",
    imageUrl: null,
    aadhaarNumber: "",
    user: {
      id: "",
    },
    visitorCompany: {
      id:null,
      name:""
    },
  
    // companyName: "",

    meetingContext: "",
    remarks:""
  };


  const [formData, setFormData] = useState({ ...initialFormData });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setOpenBackDrop(true);

    const imageUrl = localStorage.getItem("capturedImageURL");
    // console.log(formData.cityId, "cityId before API call");

    const updatedFormData = {
      // ...formData,
      id: formData.id,

      name: formData.name || "",
      phoneNumber: formData.phoneNumber || "",
      email: formData.email || "",
      // age: formData.age || "",
      state: {
        id: formData.stateId,
      },
      city: {
        id: formData.cityId,
      },
      imageUrl: existingUserImage || imageUrl,
      // companyName: formData.companyName,
      visitorCompany: {
        id: formData.visitorCompany.id || "",
        name:formData.visitorCompany.name ,
    },
      remarks: formData.remarks || '',
      context: formData.meetingContext || '',
      user: {
        id: formData.user.id || ''
      }
    };
   

    const addMeetingUrl = Config.baseUrl + Config.apiEndPoints.addMeetingEndPoint
    try {
      const response = await axios.post(
        // "http://192.168.12.54:8080/api/visitor-meeting/save",
        addMeetingUrl,
        updatedFormData
      );
      if (response.status === 200) {
        // console.log("Form Data:", updatedFormData);
        localStorage.removeItem("capturedImageURL");
        // toast.success("Thanks for sharing your details! Our host will connect with you shortly. ")

        setCapturedImage(null);
        setExistingUserImage("");
        // added this line on 4.4.24
        setOpenMeetModal(true);
        setFetchedUserData(null)
      }
    } catch (err) {
      console.error(err, "There is some issue moving into the database");
      toast.error("Meeting request failed")
      setFetchedUserData(null)
    }
    setOpenBackDrop(false);
// commented this line on 4.4.24
    // setOpenMeetModal(true)

    setTimeout(function () {
      // Close the modal
      navigate("/company");
      setStep(1);
      
      setOpenMeetModal(false);
    }, 5000);
    setFormData({ ...initialFormData });
    // setFetchedUserData("")
    localStorage.removeItem("capturedImageURL");
    localStorage.removeItem("phoneNumber")
    // navigate('/company');
   
  };

  const handlePhoneNumberChange = async (event) => {
    const phoneNumber = event.target.value;

    // handle selected states
    if (phoneNumber.length === 10) {
      const url = Config.baseUrl + Config.apiEndPoints.getVisitorByPhone + "?phoneNumber=" + phoneNumber
      try {
        // const response = await axios.get(`http://192.168.12.54:8080/vis/getVisitorByPhone?phoneNumber=${phoneNumber}`)
        const response = await axios.get(url)

        if (response.status === 200 && response.data.data) {
          // set the fetched user data in the form 
          setFetchedUserData(response.data.data);
          // console.log(response.data.data,"fetcheduser data")
          
          setExistingUserImage(response.data.data.imageUrl);
          // console.log(response.data.data.id, "existing visitor id")
          const newStateId = response.data.data.state.id;
          const newCityId = response.data.data.city.id;
          const newCityName = response.data.data.city.name;
          setFormData({
            ...formData,
            id: response.data.data.id,
            imageUrl: response.data.data.imageUrl,
            name: response.data.data.name || "",
            phoneNumber: phoneNumber,
            email: response.data.data.email || "",
           

            // stateId: response.data.data.state.id,
            stateId: newStateId,
            // state: response.data.data.state.name,
            city:newCityName,
            cityId: newCityId,

            address: response.data.data.address || "",
            // companyName: response.data.data.companyName || "",
            // context: formData.meetingContext || '',
            visitorCompany:{
              id:response.data.data.visitorCompanyDto.id || "",
              name:response.data.data.visitorCompanyDto.name
            }
          });
          setStep(1);

        }
      } catch (error) {
        // console.error(error);
        console.log("visitor not found")
      }

    }
  }
// console.log(formData,"formData from handle phone number change")
  // opening the camera modal
  const [open, setOpen] = useState(false);
  const [stream, setStream] = useState(null);
  // opening the camera modal
  const handleOpen = async () => {

    try {
      const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: true })

      setStream(userMediaStream);
      setOpen(true);
    } catch (error) {
      console.error('webcam access denied', error);
    }
  }

  // closing the camera modal
  const handleClose = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setOpen(false);

  };

  // function for handling the captured image
  
  const handleImageCapture = (imageURL) => {
    // Set the captured image URL in the state
    setCapturedImage(imageURL);
  };


  // recapture the image
  const recapture = () => {
    // console.log("removing the captured image")
    setCapturedImage(null);
    setExistingUserImage("");
    localStorage.removeItem("capturedImageURL");

    setFormData({
      ...formData,
      imageUrl: null,
    });

  }


  const handleCancel = () => {
    setFormData({ ...initialFormData });

    setCapturedImage(null);
    setExistingUserImage("");
    setFetchedUserData(null);
    localStorage.removeItem("capturedImageURL");
    // localStorage.clear();
    localStorage.removeItem("phoneNumber")
    navigate("/company")

  }
  // console.log("contextrerender");
  return (
    <FormDataContext.Provider value={{ openBackDrop,
      setOpenBackDrop,setEditMode,editMode,handleGoBack,handleCompanyClick, data,setData,recapture, formData, setFormData, handleSubmit,searchBuilding, handleNewChange,newFormData,handlePhoneNumberChange, fetchedUserData, setFetchedUserData, handleOpen, handleClose, open, setOpen, stream, setStream, localPhone, currentStep, setStep, handleImageCapture, existingUserImage, capturedImage, handleCancel,openMeetModal,setOpenMeetModal }}>
      {children}
    </FormDataContext.Provider>
  );
}

export default FormDataContext;



// changes made to global context for setting step to 1 in (handlephonenumberchange and handlesubmit)

