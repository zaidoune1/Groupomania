const bodyParser = require("body-parser");
const express = require("express");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");
require("dotenv").config({ path: "./config/.env" });
require("./config/db");
const helmet = require("helmet");

const { checkUser, requireAuth } = require("./middleware/auth.middleware");
const cors = require("cors");
const rateLimit = require("express-rate-limit"); // j'appelle mon ratelimiter

const limiter = rateLimit({
  windowMs: 1000 /*ms*/ * 60 /*secondes*/ * 15 /*minutes*/, // soit 15 minutes [c'est a définir en ms donc plutôt que de calculer je prends 1000ms pour une seconde, *le nombre de secondes dans une minute, *le nombre de minutes que je souhaites(et je peux étendre en heures, jours, etc....)]
  max: 50, // Limite chaque IP a 5 requêtes par tranche de 15 minutes
  standardHeaders: true, // Renvoie le statut du ratelimiter aux headers `RateLimit-*`
  legacyHeaders: false, // Désactive le ratelimiter pour les headers `X-RateLimit-*`
});

const app = express();

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  allowedHeaders: ["sessionId", "Content-Type"],
  exposedHeaders: ["sessionId"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
};
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet({crossOriginResourcePolicy: false}));

//secure all - jsonwebtoken
app.get("*", checkUser);
app.get("/jwtid", requireAuth, (req, res) => {
  res.status(200).send(res.locals.user._id);
});


//routes
app.use("/api/user/register", limiter);
app.use("/api/user/login", limiter);
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);


//server
app.listen(process.env.PORT, () => {
  console.log(`listening port ${process.env.PORT}`);
});

