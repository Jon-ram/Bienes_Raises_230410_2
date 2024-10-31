//const express = require('express');
import express from 'express';
import generalRoutes from './routes/generalRoutes.js'
import userRoutes from './routes/userRoutes.js'

const port = 3000;

const app = express();

app.listen(port, ()=>{
   console.log(`La aplicación ha iniciado en el puesto: ${port}`);
})

app.use("/", generalRoutes);
app.use("/usuario/",userRoutes);