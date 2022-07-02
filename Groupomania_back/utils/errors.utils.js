//messages d'erreur à la création de profil
module.exports.signUpErrors = (err) => {
    let errors = { pseudo: '', email: '', password: '' }
    //le pseudo n'est pas supporté
    if (err.message.includes('pseudo'))
        errors.pseudo = "Pseudo invalide"
    //l'email n'est pas valide en temps qu'email
    if (err.message.includes('email'))
        errors.email = 'Email invalide'
    //mot de passe trop court ou trop long
    if (err.message.includes('password'))
        errors.password = 'Le mot de passe doit faire entre 4 et 44 caractères'
    //le code d'erreur 11000 s'affiche quand un élément unique existe déjà, on distingue simplement les pseudo et mails dans ce cas de figure
    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes('pseudo'))
        errors.pseudo = 'Ce pseudo est déjà enregistré'

    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes('email'))
        errors.email = 'Cet email est déjà enregistré'

    return errors
}
//erreurs à la connexion
module.exports.signInErrors = (err) => {
    let errors = { email: '', password: '' }

    if (err.message.includes('email'))
        errors.email = 'Email Inconnu'

    if (err.message.includes('password'))
        errors.password = 'Le mot de passe ne correspond pas'

        return errors
}

//erreurs d'upload
module.exports.uploadErrors = (err) => {
    let errors = {format: '', maxSize: ''}

    if (err.message.includes('invalid file'))
    errors.format = 'Format incompatible'

    if (err.message.includes('max size'))
    errors.maxSize = 'Le fichier dépasse 5000ko'

    return errors
}