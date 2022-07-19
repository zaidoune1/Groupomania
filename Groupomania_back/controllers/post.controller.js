const PostModel = require("../models/post.model");
const UserModel = require("../models/user.model");
const fs = require("fs");
const { uploadErrors } = require("../utils/errors.utils");
const ObjectID = require("mongoose").Types.ObjectId;

//CRUD : Create
module.exports.createPost = async (req, res) => {
  let fileName;

  if (req.file) {
    try {
      //verification du format du fichier (s'assurer que c'est une image, et que son format est supporté)
      if (
        req.file.mimetype !== "image/jpg" &&
        req.file.mimetype !== "image/png" &&
        req.file.mimetype !== "image/jpeg"
      )
        throw Error("Type de fichier invalide");

      //verif du poids du fichier
      if (req.file.size > 500000) throw Error("Fichier trop volumineux");
    } catch (err) {
      const errors = uploadErrors(err);
      return res.status(201).json({ errors });
    }
    //nouveau nom du fichier
    fileName = req.body.posterId + Date.now() + ".jpg";

    //stockage de la nouvelle image.
    fs.writeFile(
      `../groupomania_front/public/uploads/posts/${fileName}`,
      req.file.buffer,
      (err) => {
        if (err) throw err;
      }
    );
  }

  const newPost = new PostModel({
    posterId: req.body.posterId,
    message: req.body.message,
    picture: req.file ? `./uploads/posts/` + fileName : "",
    video: req.body.video,
    likers: [],
    comments: [],
  });

  try {
    const post = await newPost.save();
    return res.status(201).json(post);
  } catch (err) {
    return res.status(400).send(err);
  }
};

//CRUD : Read
module.exports.readPost = (req, res) => {
  PostModel.find((err, docs) => {
    if (!err) res.send(docs);
    else console.log("Erreur dans l'obtention des données : " + err);
  }).sort({ createdAt: -1 });
};



//CRUD : Update
module.exports.updatePost = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    //Je commence dans une certain nombre de cas par vérifier l'existence de l'objet, avant de commencer quelque démarche que ce soit. Si l'objet demandé n'est pas trouvé,
    return res.status(400).send("ID inconnu : " + req.params.id); //une erreur m'en informe
    let fileName;

    if (req.file) {
      try {
        //verification du format du fichier (s'assurer que c'est une image, et que son format est supporté)
        if (
          req.file.mimetype !== "image/jpg" &&
          req.file.mimetype !== "image/png" &&
          req.file.mimetype !== "image/jpeg"
        )
          throw Error("Type de fichier invalide");
  
        //verif du poids du fichier
        if (req.file.size > 500000) throw Error("Fichier trop volumineux");
      } catch (err) {
        const errors = uploadErrors(err);
        return res.status(201).json({ errors });
      }
      //nouveau nom du fichier
      fileName = req.body.posterId + Date.now() + ".jpg";
  
      //stockage de la nouvelle image.
      fs.writeFile(
        `../groupomania_front/public/uploads/posts/${fileName}`,
        req.file.buffer,
        (err) => {
          if (err) throw err;
        }
      );
    }
  
   
  const updatedRecord = {
    message: req.body.message,
    picture: req.file ? `./uploads/posts/` + fileName : "",

  };

  PostModel.findByIdAndUpdate(
    req.params.id,
    { $set: updatedRecord },
    { new: true },
    (err, docs) => {
      if (!err) res.status(200).send(docs);
      else console.log("Erreur lors de la mise à jour : " + err);
    }
  );
};


//CRUD : Delete
module.exports.deletePost = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    //
    return res.status(400).send("ID inconnu : " + req.params.id); //

  PostModel.findByIdAndRemove(req.params.id, (err, docs) => {
    if (!err) {
      fs.unlink(docs.picture, () => {});
      res.send(docs);
    } else console.log("Erreur lors de la suppression : " + err);
  });
};

//like-post
module.exports.likePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    //
    return res.status(400).send("ID inconnu : " + req.params.id); //

  try {
    let updatedLikers = await PostModel.findByIdAndUpdate(
      // mise à jour des utilisateurs ayant like ce post
      req.params.id, //identification du commentaire à modifier dans les parametres de la requete
      { $addToSet: { likers: req.body.id } }, //j'ajoute avec $addToSet l'id figurant dans le corps de la requête dans le tableau likers du post
      { new: true }
    );
    res.json({ updatedLikers });
    let updatedLikes = await UserModel.findByIdAndUpdate(
      req.body.id,
      { $addToSet: { likes: req.params.id } },
      { new: true }
    );
    res.json({ updatedLikes });
  } catch (err) {
    return;
  }
};

//unlike-post
module.exports.unlikePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    //
    return res.status(400).send("ID inconnu : " + req.params.id); //

  try {
    let updatedLikers = await PostModel.findByIdAndUpdate(
      req.params.id,
      { $pull: { likers: req.body.id } },
      { new: true }
    );
    res.json({ updatedLikers });
    let updatedLikes = await UserModel.findByIdAndUpdate(
      req.body.id,
      { $pull: { likes: req.params.id } },
      { new: true }
    );
    res.json({ updatedLikes });
  } catch (err) {
    return;
  }
};

module.exports.commentPost = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    //
    return res.status(400).send("ID inconnu : " + req.params.id); //
  try {
    return PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comments: {
            commenterId: req.body.commenterId,
            commenterPseudo: req.body.commenterPseudo,
            text: req.body.text,
            timestamp: new Date().getTime(),
          },
        },
      },
      (err, docs) => {
        if (!err) return res.send(docs);
        else return res.status(400).send(err);
      }
    );
  } catch (err) {
    return;
  }
};

// UPDATE COMMENT
exports.updateComment = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID inconnu : " + req.params.id); //
    
  PostModel.findById({ _id: req.params.id })
    .then((post) => {
      let newPost = post;
      for (let index = 0; index < post.comments.length; index++) {
        const comment = post.comments[index];

        if (comment._id == req.params.commentId) {
          newPost.comments[index].text=req.params.text;
          newPost.comments[index].timestamp= new Date().getTime();

        }
      }
      PostModel.findByIdAndUpdate(
        { _id: req.params.id },
        { comments: newPost.comments },
      ).then((post) => {
        res.status(200).json({ message: "comment updated" });
      });
    })

    .catch((error) => res.status(401).json({ error }));
};



// DELETE COMMENT
exports.deleteComment = (req, res, next) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID inconnu : " + req.params.id); //

  PostModel.findById({ _id: req.params.id })
    .then((post) => {
      let newPost = post;
      for (let index = 0; index < post.comments.length; index++) {
        const comment = post.comments[index];
        if (comment._id == req.params.commentId) {
          newPost.comments.splice(index, 1);
        }
      }
      PostModel.findOneAndUpdate(
        { _id: req.params.id },
        { comments: newPost.comments }
      ).then((post) => {
        res.status(200).json({ message: "comment deleted" });
      });
    })

    .catch((error) => res.status(401).json({ error }));
};
