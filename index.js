//const express = require('express');
import express from 'express';
import generalRoutes from './routes/generalRoutes.js'
import userRoutes from './routes/userRoutes.js'



const app = express();
//configurar tempñate engine
app.set('views engine', 'pug')
app.set('views', './views')
app.use(express.static('./public'))
const port = 3000;
app.listen(port, ()=>{
   console.log(`La aplicación ha iniciado en el puesto: ${port}`);
})

app.use("/", generalRoutes);
app.use("/auth",userRoutes);
app.use(express.static('./public'))