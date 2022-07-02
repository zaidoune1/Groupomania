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
        throw Error("invalid file");

      //verif du poids du fichier
      if (req.file.size > 500000) throw Error("max size");
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
    else console.log("Error to get data : " + err);
  }).sort({ createdAt: -1 });
};

//CRUD : Update
module.exports.updatePost = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    //Je commence dans une certain nombre de cas par vérifier l'existence de l'objet, avant de commencer quelque démarche que ce soit. Si l'objet demandé n'est pas trouvé,
    return res.status(400).send("ID unknown : " + req.params.id); //une erreur m'en informe

  const updatedRecord = {
    message: req.body.message,
  };

  PostModel.findByIdAndUpdate(
    req.params.id,
    { $set: updatedRecord },
    { new: true },
    (err, docs) => {
      if (!err) res.status(200).send(docs);
      else console.log("update error : " + err);
    }
  );
};

//CRUD : Delete
module.exports.deletePost = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    //
    return res.status(400).send("ID unknown : " + req.params.id); //

  PostModel.findByIdAndRemove(req.params.id, (err, docs) => {
    if (!err) {
      fs.unlink(docs.picture, () => {});
      res.send(docs);
    } else console.log("Deleting error : " + err);
  });
};

//like-post
module.exports.likePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    //
    return res.status(400).send("ID unknown : " + req.params.id); //

  try {
    let updatedLikers = await PostModel.findByIdAndUpdate(
      // mise à jour des utilisateurs ayant like ce post
      req.params.id, //identification du commentaire à modifier dans les parametres de la requete
      { $addToSet: { likers: req.body.id } }, //j'ajoute avec $addToSet l'id figurant dans le corps de la requête dans le tableau likers du post
      { new: true } //true pour renvoyer le document modifié(false par défaut, ne renvoie pas le document modifié)
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
    return res.status(400).send("ID unknown : " + req.params.id); //

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
    return res.status(400).send("ID unknown : " + req.params.id); //
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
