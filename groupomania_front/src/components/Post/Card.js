import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePost, updatePicture,getPosts } from "../../actions/post.actions";
import { dateParser, isEmpty } from "../Utils";
import CardComments from "./CardComments";
import DeleteCard from "./DeleteCard";
import LikeButton from "./LikeButton";

const Card = ({ post }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdated, setIsUpdated] = useState(false);
  const [textUpdate, setTextUpdate] = useState(null);
  const [showComments, setShowComments] = useState(null)
  const usersData = useSelector((state) => state.usersReducer);
  const userData = useSelector((state) => state.userReducer);
  const [postPicture, setPostPicture] = useState(null);
  const [file, setFile] = useState();  
    const errors = useSelector((state) => state.errorReducer.postError);
const dispatch = useDispatch();
  
// Modifier le texte du post
  const updateItem = () => {
    if (textUpdate) {dispatch(updatePost(post._id, textUpdate))
     }
    if(postPicture) {

      const data = new FormData();
    data.append("postId", post._id);
    data.append("posterId", post.posterId);
    data.append("file", file);

    dispatch(updatePicture(data, post._id));
     };
    setIsUpdated(false);
    cancelUPDATE();
  };


  const cancelUPDATE = () => {setIsUpdated(false)};// Annuler la Modification 

  
  const handlePicture = (e) => {
    setPostPicture(URL.createObjectURL(e.target.files[0]));
    setFile(e.target.files[0]);
  };
// //Afficher le spinner
//   useEffect(() => {
//     !isEmpty(usersData[0]) && setIsLoading(false);
//   }, [usersData]);

  return (
      <li className="card-container" key={post._id}>
        {/* {isLoading ? (
          <i className="fas fa-spinner fa-spin"></i>
        ) : ( */}
          <>
          {/* Afficher les donnéesde la créateur du poste: photo */}
            <div className="card-left">
              <img
                src={
                  !isEmpty(usersData[0]) &&
                  usersData
                    .map((user) => {
                      if (user._id === post.posterId) return user.picture;
                      else return null;
                    })
                    .join("")
                }
                alt="profil de l'auteur du post"
              />
            </div>
            {/* Afficher les données de la créateur du poste:pseudo */}
            <div className="card-right">
              <div className="card-header">
                <div className="pseudo">
                  <h3>
                    {!isEmpty(usersData[0]) &&
                      usersData
                        .map((user) => {
                          if (user._id === post.posterId) return user.pseudo;
                          else return null;
                        })
                        .join("")}
                  </h3>
                </div>
                <div>
                 {/* Afficher les données de la poste:date de crèation*/}
                <span>{dateParser(post.createdAt)}</span>
                {/* verifier l'utilisateur pour autoriser la modification/suppression du post */}
                {(userData._id === post.posterId || userData.role === "admin") && (
                <div className="button-container">
                  <div onClick={() => setIsUpdated(!isUpdated)}>
                    <img src="./img/icons/edit.svg" alt="modifier le post" />
                  </div>
                  <DeleteCard id={post._id} />
                </div>
              )}
              </div>
              </div>
              <br />
              {/* afficher le contenu du post: la partie text */}
              {isUpdated === false && <p className={
              post.message ===""
                ? "post-container"
                : "post-container-text"
            }>{post.message}</p>}
              {/* afficher le bloc du modification du post */}
              {isUpdated && (
                <div className="update-post">
                  <textarea
                    defaultValue={post.message}
                    onChange={(e) => setTextUpdate(e.target.value)}
                  />
                  <div className="icon" >
                <>

                  <img src="./img/icons/picture.svg" alt="icone d'upload de fichier" />

                  <input
                  aria-label="update-picture"
                    type="file"
                    id="file-upload"
                    name="file"
                    accept=".jpg, .jpeg, .png"
                    onChange={(e) => handlePicture(e)}
                  />
                  <label htmlFor="file">Changer d'image</label>

                </>
                </div>
                    {!isEmpty(errors.format) && <p>{errors.format}</p>}
                    {!isEmpty(errors.maxSize) && <p>{errors.maxSize}</p>}
                   
                  <div className="button-container">
                    <button className="btn" onClick={updateItem}>
                      Valider Modifications
                    </button>
                    <button className="btn" onClick={updateItem}>
                      Annuler les Modifications
                    </button>
                  </div>
                </div>
              )}
              {/* afficher le contenu du post: la partie images ou video */}
              {isUpdated === false && <div className="card-image">
              { post.picture && <img src={post.picture} alt="contenu du post" className="card-pic" />
              }
              </div>}
              {isUpdated && <div className="card-image">
              { postPicture 
              ? (postPicture && <img src={postPicture} alt="contenu du post" className="card-pic" />)
              : (post.picture && <img src={post.picture} alt="contenu du post" className="card-pic" />)
              
              }
              </div>}
              {/* la bloc des commentaire et des j'aimes */}
              <div className="card-footer">
                <div className="comment-icon">
                  <img onClick={() => setShowComments(!showComments)} src="./img/icons/message1.svg" alt="afficher les commentaires" />
                  <span>{post.comments.length}</span>
                </div>
                <LikeButton post={post} />
              </div>
              {showComments && <CardComments post={post} />}
            </div>
          </>
        {/* )} */}
      </li>
  );
};

export default Card;