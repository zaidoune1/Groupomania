import {  useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteComment,getPosts, updateComment } from "../../actions/post.actions";

function UpdateComment({ comment, post }) {
  const [isUpdated, setIsUpdated] = useState(false);
  const [textUpdate, setTextUpdate] = useState("");
  const userData = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();

//Pour modifier les commentaires
  const handleEdit = (e) => {
    e.preventDefault();
    dispatch(updateComment(
        post._id,
        comment._id,
        textUpdate,
      ))
      .then(() => {
        dispatch(getPosts());
      })
    setIsUpdated(false);
    setTextUpdate(comment.text);
    cancelUPDATE();
    
   
  };

  //Pour Annuler les commentaires
  const cancelUPDATE = () => {
    setIsUpdated(false);
  };

//Pour Supprimer les commentaires
  function handleDelete() {
    dispatch(
      deleteComment(post._id, comment._id, comment.commenterId, userData._id)
    )
    .then(() => {
      dispatch(getPosts());
    })


  }
 
  return (
    <>
      <div className="comment-content">
        {/* Afficher le contenu du commentaire  */}
      {isUpdated === false &&<div className="comment-bloc"> {comment.text}
          <div className="button-container" >
        {/* Verifier l'utilisateur pour autorisè la modification */}
      {(userData._id===comment.commenterId) && (
          <div onClick={() => setIsUpdated(!isUpdated)}>               
          <img src="./img/icons/edit.svg" alt="modifier le commentaire" />
          </div>
          )}
          <br />
          {/* Verifier l'utilisateur pour autorisè la suppression */}
          {(userData._id === post.posterId || userData.role === "admin" || userData._id===comment.commenterId) && (

          <div
            onClick={() => {
              if (window.confirm("Voulez-vous supprimer ce commentaire ?")) {
                handleDelete();

              }
            }}
          >
          <img src="./img/icons/trash.svg" alt="supprimer le commentaire" />
          </div>
          )}
        </div></div>}  
       {/* Afficher le bloc de la modification */}   
      {isUpdated && (
          <div className="update-comment">
            <textarea
              className="textarea"
              defaultValue={comment.text}
              onChange={(e) => setTextUpdate(e.target.value)}
            ></textarea>
            <div className="button-container-comment">
              <button className="btn" onClick={handleEdit} >
                Valider les modification
              </button>
              <button className="btn" onClick={handleEdit}>
                Annuler les Modifications
              </button>
            </div>
            
          </div>
        )}
       
        
      </div>
    </>
  );
}
export default UpdateComment;