import React, { useState } from "react";
import axios from "axios";

const SignInForm = () => {//formulaire de connexion
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();//empêcher le rechargement de la page
    const emailError = document.querySelector(".email.error");              //recup des erreurs éventuelles
    const passwordError = document.querySelector(".password.error");        //

    axios({ //axios pour envoyer la requête
      method: "post",
      url: `${process.env.REACT_APP_API_URL}api/user/login`, //${url de l'api}api/"cheminDeLaRequete"
      withCredentials: true,
      data: { //contenu de la requête
        email,
        password,
      },
    })
      .then((res) => {              //ce qu'on fait de la réponse
        if (res.data.errors) {      //si il y a une erreur dans la reponse
          emailError.innerHTML = res.data.errors.email;
          passwordError.innerHTML = res.data.errors.password;
        } else {                    //si il n'y a pas d'erreur dans la réponse, je redirige vers la page d'accueil
          window.location = "/Home";
        }
      })
      .catch((err) => {             //catch en cas d'erreur survenue, et log de l'erreur dans la console.
        console.log(err);
      });
  };

  return (
      <form action="http://localhost:3000/Home" method="get" onSubmit={handleLogin} id="sign-up-form">
      <label htmlFor="email">Email</label>
      <br />
      <input
        type="text"
        name="email"
        id="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
      <div className="email error"></div>
      <br />
      <label htmlFor="password">Mot de passe</label>
      <br />
      <input
        type="password"
        name="password"
        id="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />
      <div className="password error"></div>
      <br />
      <input type="submit" value="Se connecter" />
    </form>
  );
};

export default SignInForm;
