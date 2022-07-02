const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;
const fs = require("fs");

//Obtenir les données de tous les utilisateurs
module.exports.getAllUsers = async (req, res) => {
  const users = await UserModel.find().select("-password, -email");
  //les données SAUF le mot de passe et email sont renvoyées, car ce sont des données qui pourraient permettre d'usurper l'identité d'un utilisateur
  res.status(200).json(users);
};

//Obtenir les données d'un seul utilisateur
module.exports.userInfo = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    //Si l'id de la requête n'est pas valide, je m'arrête là, et je réponds avec une erreur
    return res.status(400).send("ID unknown : " + req.params.id);

  UserModel.findById(req.params.id, (err, docs) => {
    //Si l'id de la requête est valide je récupère les données de l'utilisateur concerné, sauf le mot de passe et l'email, pour des raisons de sécurité.
    if (!err) res.send(docs);
    else console.log("ID unknown : " + err);
  }).select("-password, -email");
};

//Updater le profil d'un utilisateur
module.exports.updateUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    await UserModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          bio: req.body.bio,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true },
      (err, docs) => {
        if (!err) return res.send(docs);
        if (err) return res.status(500).send({ message: err });
      }
    );
  } catch (err) {
    return;
  }
};

//Supprimer un utilisateur //Cette fonction n'est pas proposée dans le front, mais elle pourrait être ajoutée en appelant la route concernée.
/*module.exports.deleteUser = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : ' + req.params.id)

    try {
        const docs = await UserModel.findById(req.params.id)
        if (!docs) console.log('Image non supprimée')
        else fs.unlink(docs.picture, () => { })
                
    } catch(err) {
        return console.error(err)
    }

    try {
        await UserModel.remove({ _id: req.params.id }).exec()
        res.status(200).json({ message: "Utilisateur Supprimé." })
    } catch (err) {
        return res.status(500).json({ message: err })
    }
}*/
