const express = require('express');
const app = express();
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");
const https = require('https');



//Set Variables;
app.set("PORT", process.env.PORT || 5000);



//Set config
// app.use(express.static(path.join(__dirname, 'public')));


//Middlewareas
app.use(express.urlencoded({ extended: true }))
app.use(express.json());

app.use(morgan("dev"));

//Routes
app.use("/api/", require("./whatsapp/routes/whatsapp.routes.js"));


// const privateKey = fs.readFileSync(path.join(__dirname, "..", "..", "certificados", 'blancogusmar.com.key'), 'utf8');
// const certificate = fs.readFileSync(path.join(__dirname, "..", "..", "certificados", 'blancogusmar.com.crt'), 'utf8');
// const credentials = { key: privateKey, cert: certificate, cr: [fs.readFileSync(path.join(__dirname, "..", "..", "certificados", 'SectigoRSADomainValidationSecureServerCA.crt'), 'utf8')] };


// // Configurar rutas y middleware de Express aquí
// const httpsServer = https.createServer(credentials, app);

// httpsServer.listen(5000, () => {

//     console.log('Server running on port, 5000');

// });

app.listen(5000, () => {
    console.log("Server running on port, 5000");
})
















