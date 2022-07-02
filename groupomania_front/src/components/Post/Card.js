import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePost } from "../../actions/post.actions";
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
  const dispatch = useDispatch();

  const updateItem = () => {
    if (textUpdate) {
      dispatch(updatePost(post._id, textUpdate));
    }
    setIsUpdated(false);
  };

  useEffect(() => {
    !isEmpty(usersData[0]) && setIsLoading(false);
  }, [usersData]);

  return (
      <li className="card-container" key={post._id}>
        {isLoading ? (
          <i className="fas fa-spinner fa-spin"></i>
        ) : (
          <>
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
                <span>{dateParser(post.createdAt)}</span>
              </div>
              <br />
              {isUpdated === false && <p>{post.message}</p>}
              {isUpdated && (
                <div className="update-post">
                  <textarea
                    defaultValue={post.message}
                    onChange={(e) => setTextUpdate(e.target.value)}
                  />
                  <div className="button-container">
                    <button className="btn" onClick={updateItem}>
                      Valider Modifications
                    </button>
                  </div>
                </div>
              )}
              {post.picture && (
                <img src={post.picture} alt="contenu du post" className="card-pic" />
              )}
              {(userData._id === post.posterId || userData.role === "admin") && (
                <div className="button-container">
                  <div onClick={() => setIsUpdated(!isUpdated)}>
                    <img src="./img/icons/edit.svg" alt="modifier le post" />
                  </div>
                  <DeleteCard id={post._id} />
                </div>
              )}
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
        )}
      </li>
  );
};

export default Card;