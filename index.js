import express from 'express';
import generalRoutes from './Routes/generalRoutes.js'
import userRoutes from './Routes/userRoutes.js'
import db from './db/config.js'
import dotenv from 'dotenv'

dotenv.config({path: '.env'})

//conexión a la base de datos.
try{
    await db.authenticate();  //verifica las credenciales del usuario
    db.sync(); //sincronizo las tablas con los modelos
    console.log("Conexión correcta a la Base de Datos");

}catch(error){
    console.log(error);
}

const app=express()

//Habilitar la lectura de datos de formularios
app.use(express.urlencoded({ extended: true }));


 
//Habilitar Pug 
app.set('view engine', 'pug')
app.set('views', './views')

//Definir la carpeta pública de recursos estáticos (assets)
app.use(express.static('./public'));


// configuramos nuestro servidor web
const port= process.env.BACKEND_PORT; 
app.listen(port, ()=>{
    console.log(`La aplicación ha iniciado al puerto: ${port}`);
})

app.use('/',generalRoutes);
app.use('/auth/',userRoutes);
