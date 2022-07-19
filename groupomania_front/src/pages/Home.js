import React from "react";
import NewPostForm from "../components/Post/NewPostForm";
import Thread from "../components/Thread";
import Navbar from "../components/Navbar";

const Home = () => {

  return (
    <div>
      <Navbar/>     
    <div className="home">
      <div className="main">
        <div className="home-header">
       <NewPostForm /> 
        </div>
        
        <Thread />
        </div>
        
       
        

      
      
    </div>
    </div>
  );
};

export default Home;
