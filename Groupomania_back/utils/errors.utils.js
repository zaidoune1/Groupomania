module.exports.signUpErrors = (err) => {
    let errors = { pseudo: "", email: "", password: "" };
  
    if (err.message.includes("pseudo")) errors.pseudo = "3 caractères minimum";
  
    if (err.message.includes("email")) errors.email = "verifier votre e-mail";
  
    if (err.message.includes("password"))
      errors.password = "6 caractères minimum";
  
    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("pseudo"))
      errors.pseudo = "Nom d'utilisateur déjà utilisé";
  
    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("email"))
      errors.email = "e-mail déjà utilisé";
  
    return errors;
  };
  
  // erreur connexion
  module.exports.signInErrors = (err) => {
    let errors = { email: "", password: "" };
  
    if (err.message.includes("Email")) errors.email = "e-mail inconnu";
  
    if (err.message.includes("Password"))
      errors.password = "Mot de passe incorrect";
    return errors;
  };
  
  module.exports.uploadErrors = (err) => {
    let errors = { format: "", maxSize: "" };
  
    if (err.message.includes("invalid file"))
      errors.format = "Mauvais format de fichier";
  
    if (err.message.includes("max size"))
      errors.maxSize = "Fichier de 1mo maximum";
    return errors;
  };