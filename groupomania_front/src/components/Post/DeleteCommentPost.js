import React from "react";
import { useDispatch } from "react-redux";
import { DeleteComment } from "../../actions/post.actions";

const DeleteCommentPost = (props) => {
  const dispatch = useDispatch();

  const deleteQuote = () => dispatch(DeleteComment(props.id));

  return (
    <div
      onClick={() => {
        if (window.confirm("Voulez-vous vraiment supprimer cet commentaire?")) {
          deleteQuote();
        }
      }}
    >
      <img src="./img/icons/trash.svg" alt="trash" />
    </div>
  );
};

export default DeleteCommentPost;
