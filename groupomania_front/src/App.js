import React, { useEffect, useState } from "react";
import { UidContext } from "./components/AppContext";
import Routes from "./components/Routes";
import axios from "axios";
import { useDispatch } from "react-redux";
import { getUser } from "./actions/user.actions";

const App = () => {
  const [uid, setUid] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchToken = async () => {
      //token pour la navigation
      await axios({
        //envoi requête d'authentification
        method: "get",
        url: `${process.env.REACT_APP_API_URL}jwtid`,
        withCredentials: true,
      })
      
        .then((res) => {
          //si la réponse est positive
          setUid(res.data); //j'attribue la data (l'id utilisateur) comme uid
        })
        .catch((err) => console.log("Utilisateur non connecté : " + err)); //si l'utilisateur n'est pas connecté ou n'a pas de token, j'en suis informée
    };
    fetchToken();

    if (uid) dispatch(getUser(uid));
  }, [uid, dispatch]);

  return (
    //ici j'attribue au plus haut de react l'uid qui permet de charger le contenu de l'utilisateur
    <UidContext.Provider value={uid}>
      <Routes />
    </UidContext.Provider>
  );
};

export default App;
