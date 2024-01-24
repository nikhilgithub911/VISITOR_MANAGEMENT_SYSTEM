const Config = Object.freeze({
  // baseUrl: "http://192.168.12.54:8080/", 
  // baseUrl: "http://192.168.12.58:8080/",
  // baseUrl: "http://192.168.12.60:8080/",
  baseUrl: "https://vms.nyggs.com/backend/", 
  // baseUrl: "http://192.168.12.58:8085/vms/", 


  apiEndPoints: {

    // building.jsx
    buildingEndPoint: "com/getByBuildingId",

    //   loginuser.jsx
    getByPhoneEndPoint: "api/meeting/getByPhone",

    //   mainform.jsx
    userUrlEndPoint: "api/user/alluser",
    meetingContextEndPoint: "vis/meetCon",

    //   mainform2.jsx
    cityEndpoint: "api/cityByName",

    //   webcam.jsx
    webCamEndPoint: "vis/upload",

    // handleSubmit globalContext
    addMeetingEndPoint: "api/visitor-meeting/save",

    // checkin.jsx
    //  getMeetingEndPoint:"api/meeting/getMeetingsToCheckout",
    getMeetingEndPoint: "api/meeting/check-meetings",
    checkoutEndPoint: "api/meeting/checkout",
// ----------------------------------------------------------
    // 11.1.24-personaldetails.js
    searchCompany:"vis/company/name",

    //  globalContext.jsx
    getVisitorByPhone: "vis/getVisitorByPhone"
  },
});

export default Config;

