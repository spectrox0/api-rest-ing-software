const express = require("express");
const app = express();
const mongoose = require("mongoose");   // ORM mongoose 
const isAuth = require("./middlewares/auth");  //Middleware de auth por token
const cors = require("cors"); // Simple Usage (Enable All CORS Requests)
var bodyParser = require("body-parser");
const routes = require("./routes"); //routes
//Configuramos bodyParser para que convierta el body de nuestras peticiones a JSON
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(isAuth);

app.use("/api", routes);  //se declaran todas las rutas de nuestra api

const PORT = process.env.PORT || 4000; //Se define el puerto donde escuchara nuestro server

// conectamos con nuestra base de datos alojada en MongoDB Atlas
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@apirestingsoftware-tb9kl.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
  )
  .then(() =>
    app.listen(PORT, () => {
      console.log("El servidor está inicializado en el puerto " + PORT);
    })
  )
  .catch(err => {
    console.log(err);
  });
  
module.exports = app;
