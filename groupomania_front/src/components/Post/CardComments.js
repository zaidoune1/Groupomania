import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addComment, getPosts } from "../../actions/post.actions";
import { isEmpty, timestampParser } from "../Utils";
import UpdateComment from "./UpdateComment";

const CardComments = ({ post }) => {
  const [text, setText] = useState("");
  const usersData = useSelector((state) => state.usersReducer);
  const userData = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();

  // Ajouter un nouveau commentaire et en
  const handleComment = (e) => {
    e.preventDefault();
//ajouter les données du commentaire au post à l'aide du fonction addComment
    if (text) {
      dispatch(addComment(post._id, userData._id, text, userData.pseudo))
      .then(() => dispatch(getPosts()))//ajout en temps réel du commentaire
      .then(() => setText(""));
    }
  };


  return (
    <ul className="comments-container">
      {/* Afficher la liste des commentaires en utilisant les id  */}
      {post.comments.map((comment) => {
        return (
     
          <li
            className={
              comment.commenterId === userData._id
                ? "comment-container client"
                : "comment-container"
            }
            key={comment._id}
          >
            {/* Afficher l'image de l'utilisateur */}
            <div className="left-part">
              <img
                src={
                  !isEmpty(usersData[0]) &&
                  usersData
                    .map((user) => {
                      if (user._id === comment.commenterId) return user.picture;
                      else return null;
                    })
                    .join("")
                }
                alt="auteur du commentaire"
              />
            </div>
            {/* Afficher le pseudo de l'utilisateur, la date et le contenu du commentaire */}
            <div className="right-part">
              <div className="comment-header">
                <h3>{comment.commenterPseudo}</h3>
                <span>{timestampParser(comment.timestamp)}</span>
              </div>
              <UpdateComment id={comment._id} comment={comment} post={post} />
            </div>
          </li>
        );
      })}
      {/* Ajouter un nouveau commentaire */}
      {userData._id  && (
        <form action="" onSubmit={handleComment} className="comment-form">
          <input
            type="text"
            name="text"
            onChange={(e) => setText(e.target.value)}
            value={text}
            placeholder="Laisser un commentaire ici ..."
          />
          <br />
          <input type="submit" value="Envoyer" />
        </form>
      )}
    </ul>
  );
};

export default CardComments;
