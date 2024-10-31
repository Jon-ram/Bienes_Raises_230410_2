import express from 'express';
//const express = require('express');
const port = 3001;
const app = express();

app.listen(port, () =>
    console.log(`La aplicacionha iniciado en el puerto: ${port}`))
// ? Routing - Enrutacion para peticiones
app.get("/", function(req, res){
    res.send("Hola desde la web en NodeJS")
})
app.get("/quienEres",function(req, res){
    res.json({
        "nombre" : "Jonathan Baldemar Ramirez Reyes",
        "carrera" : "TI DSM",
        "grado" : "4",
        "grupo" : "B"
    })
})