import React, { useContext } from "react";
//import Log from "../components/Log";
//import { UidContext } from "../components/AppContext";
import UpdateProfil from "../components/Profil/UpdateProfil";
import Navbar from "../components/Navbar";

const Profile = () => {
//  const uid = useContext(UidContext);

  return (
    <div>
      <Navbar/>
    <div className="profil-page">

        <UpdateProfil /> 
    </div>
    </div>
  );
};

export default Profile;
