const express = require("express");
const app = express();
const expressFileUpload = require("express-fileupload");
const fs = require("fs");
const bodyParser = require("body-parser");
const puerto = 3000;

//? Integra expressFileUpload
app.use(
  expressFileUpload({
    limits: { filesize: 5000000 },
    abortOnLimit: true,
    responseOnLimit: "La imagen sobrepasa los 5 MB permitodos para la subida",
  })
);

//? Integra body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//? Libera carpeta public
app.use(express.static("public"));

//? Muestra formulario
app.get("/", (_, res) => {
  res.sendFile(__dirname + "/formulario.html");
});

//? Muestra Collage
app.get("/collage", (_, res) => {
  res.sendFile(__dirname + "/collage.html");
});

//? Guarda imagen en carpeta
app.post("/imagen", (req, res) => {
  const { target_file } = req.files;
  const { posicion } = req.body;
  const name = `imagen-${posicion}`;
  target_file.mv(`${__dirname}/public/imgs/${name}.jpg`, (err) => {
    err ? res.send("Error al subir la imagen") : res.redirect("/collage");
  });
});

//? Elimina imagen
app.get("/deleteImg/:nombre", (req, res) => {
  const { nombre } = req.params;
  fs.unlink(`${__dirname}/public/imgs/${nombre}`, (err) => {
    err ? res.send("Error al eliminar la imagen") : res.redirect("/collage");
  });
});

app.listen(3000, () => console.log(`Escuchando puerto ${puerto}`));
