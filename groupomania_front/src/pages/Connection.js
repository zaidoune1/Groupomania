import React, { useContext } from "react";
import Log from "../components/Log";

const Connection = () => {
  
    return (
         
      <div className="Connection-page">
        <div className="Connection-bloc">
          <div className="Connection_logo">
            <div className="bloc_logo">
              <img src="./img/icon-left-font-monochrome-white.svg" alt="icon" />
            </div>
          </div> 
            <div className="container_page">
            <div className="login-container">
            <Log signin={true} signup={false} />
            {/*<div className="img-container">
              <img src="./img/log.svg" alt="img-log" />
    </div>*/}
          </div>
        </div>
        </div>
      </div>
    );
  };
  
  export default Connection;