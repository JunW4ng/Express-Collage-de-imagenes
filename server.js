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

app.use(express.static("imgs"));

//? Muestra formulario
app.get("/", (_, res) => {
  res.sendFile(__dirname + "/formulario.html");
});

//? Muestra Collage
app.get("/collage", (_, res) => {
  res.sendFile(__dirname + "/collage.html");
});

app.post("/imagen", (req, res) => {
  const { target_file } = req.files;
  const { posicion } = req.body;
  const name = `imagen-${posicion}`;
  target_file.mv(`${__dirname}/imgs/${name}.jpg`, (err) => {
    err
      ? res.send("Error al subir la imagen")
      : res.send("Imagen cargada con exito");
  });
});

//? Elimina imagen
app.get("/deleteImg/:nombre", (req, res) => {
  const { nombre } = req.params;
  fs.unlink(`${__dirname}/imgs/${nombre}`, (err) => {
    err
      ? res.send("Error al eliminar la imagen")
      : res.send(`Imagen ${nombre} fue eliminada con exito`);
  });
});

app.listen(3000, () => console.log(`Escuchando puerto ${puerto}`));
