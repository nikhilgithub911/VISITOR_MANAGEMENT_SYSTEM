import './App.css';
import Building from './components/Building';
import "../src/css/Building.css"
import { Route, Routes } from 'react-router-dom';
import Companylist from './components/Companylist';
import CheckinComponent from './components/CheckinComponent';
import Invite from './components/Invite';
// import Meetingform from './components/Meetingform';
// import Personaldetails from './components/Personaldetails';
// import CameraComponent from './components/CameraComponent';
import { useEffect } from 'react';
import  { Toaster, useToasterStore,toast } from 'react-hot-toast';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TOAST_LIMIT = 1;

function App() {

  const { toasts } = useToasterStore();

  // Enforce Limit
  useEffect(() => {
    toasts
      .filter((t) => t.visible) 
      .filter((_, i) => i >= TOAST_LIMIT)
      .forEach((t) => toast.dismiss(t.id));
  }, [toasts]);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Building/>}/>
        <Route path="/company" element={<Companylist/>}/>
        <Route path="/checkin" element={<CheckinComponent/>}/>
        <Route path="/invite" element={<Invite/>}/>
        {/* <Route path="/meet" element={<Meetingform/>}/>
        <Route path="/personal" element={<Personaldetails/>}/>
        <Route path="/camera" element={<CameraComponent/>}/> */}

      </Routes>
      {/* <div>
      <div className='stroke1'></div>
      <div className='stroke2'></div>
      </div> */}
        <ToastContainer autoClose={3000} />
        <Toaster />
    </div>
  );
}

export default App;

// january 23