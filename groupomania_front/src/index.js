import React from "react";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.scss";
import App from "./App";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";
import { configureStore } from "@reduxjs/toolkit";
import { getUsers } from "./actions/users.actions";

//outils de developpement
//import logger from "redux-logger";
//

//Store:
const store = configureStore({
  reducer: rootReducer,
  middleware: [thunk /*, logger*/],
});

store.dispatch(getUsers());

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
