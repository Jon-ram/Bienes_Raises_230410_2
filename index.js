//const express = require('express');
import express from 'express';
import generalRoutes from './routes/generalRoutes.js'
import userRoutes from './routes/userRoutes.js'
import db from './db/config.js'

const app = express();

//Conexion a la base de datos 
try {
   await db.authenticate(); //Verifico las credenciales del usuario
   db.sync(); // Sincroniza las tablas 
   console.log("Conexión establecida");

}catch (error) {
   console.log(error)
}


//Habilitando la lectura de datos del formulario
app.use(express.urlencoded({ extended: true }));

//configurar tempñate engine
app.set('view engine', 'pug')
app.set('views', './views')
app.use(express.static('./public'))
const port = 3000;
app.listen(port, ()=>{
   console.log(`La aplicación ha iniciado en el puesto: ${port}`);
})

// Probamos las rutas para poder presentar mensajes al usuario a través del navegador
app.get("/",function(req,res){
   res.send("Hola Mundo desde node, a traves del navegador")
})

app.use("/", generalRoutes);
app.use("/auth",userRoutes);
