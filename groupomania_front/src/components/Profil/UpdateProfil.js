import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateBio,uploadPicture } from "../../actions/user.actions";
import { isEmpty, dateParser } from "../Utils";

//import UploadImg from "./UploadImg";

const UpdateProfil = () => {
  const [bio, setBio] = useState("");
  const [updateForm, setUpdateForm] = useState(false);
  const userData = useSelector((state) => state.userReducer);
  const error = useSelector((state) => state.errorReducer.userError);
  const dispatch = useDispatch();
  const [file, setFile] = useState();
  const [postPicture, setPostPicture] = useState(null);
  const errors = useSelector((state) => state.errorReducer.postError);


  const handleUpdate = () => {
    dispatch(updateBio(userData._id, bio));
    setUpdateForm(false);
  };
  const cancelUPDATE = () => {    setUpdateForm(false);
  }
  const handlePictureUpdate = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", userData.pseudo);
    data.append("userId", userData._id);
    data.append("file", file);

    dispatch(uploadPicture(data, userData._id));
  };
  const handlePicture = (e) => {
    setPostPicture(URL.createObjectURL(e.target.files[0]));
    setFile(e.target.files[0]);
  };
  return (
    <div className="profil-container">
      <h1> Profil de {userData.pseudo}</h1>
      <br />
      <div className="update-container">
        <div className="left-part">
          <h3>Photo de profil</h3>
          {!postPicture && <img src={userData.picture} alt="user-pic" />}
          {postPicture && <img src={postPicture} alt="user-pic" />}      <p>{error.maxSize}</p>

          <form action="" onSubmit={handlePictureUpdate} className="upload-pic">
      <label htmlFor="file">Changer d'image</label>
      <input
        type="file"
        id="file"
        name="file"
        accept=".jpg, .jpeg, .png"
        onChange={(e) => handlePicture(e)}
      />
      
      <br />
      <input type="submit" value="Valider" />
    </form>    
    {!isEmpty(errors.format) && <p>{errors.format}</p>}
              {!isEmpty(errors.maxSize) && <p>{errors.maxSize}</p>}        </div>
        <div className="right-part">
          <div className="bio-update">
            <h3>Bio</h3>
            {updateForm === false && (
              <>
                <p onClick={() => setUpdateForm(!updateForm)}>{userData.bio}</p>
                <button onClick={() => setUpdateForm(!updateForm)}>
                  Modifier bio
                </button>
              </>
            )}
            {updateForm && (
              <>
                <textarea
                  type="text"
                  defaultValue={(userData.bio )}
                  onChange={(e) => setBio(e.target.value)}
                ></textarea>
                <button onClick={handleUpdate}>Valider modifications</button>
                <button onClick={cancelUPDATE }>Annuler les modifications</button>

              </>
            )}
          </div>
          <h4> Membre depuis le : {dateParser(userData.createdAt)}</h4>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfil;
