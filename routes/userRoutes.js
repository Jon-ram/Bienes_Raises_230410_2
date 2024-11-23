import express from 'express';
import { formularioLogin,formularioRegister,formularioPasswordRecovery } from '../controllers/userController.js';
const router = express.Router();

router.get("/busquedaPorID/:id", function (request,response){
    response.send(`Se esta solicitando buscar al usuario con ID: ${request.params.id}`);
})  // 2 componentes de una petición ruta, función callback 

router.post("/newUser", createNewUser)







//GET
router.get("/FindById/:Id", function(request, response){
    response.send(`Se esta solicitando buscar al usuario con ID: ${request.params.Id}`);
})

//POST
router.post("/newUser/:name/:email/:password",function(req, res){
    res.send(`Se ha solicitado la creacion de un nuevo ususario de nombre: ${req.params.name},
        asociado al correo electronico ${req.params.email} y con la contraseña ${req.params.password}`);
})

//PUT
router.put("/replaceUserByEmail/:name/:email/:password", function(a,b){
    b.send(`Se ha solicitado el remplazo de toda la información del usuario ${a.params.name},
     con correo: ${a.params.email} y contraseña: ${a.params.password}`)
})

//PATCH
router.patch("/updatePassword/:email/:newPassword/:newPasswordConfirm", function(request, response){
    const {email, newPassword, newPasswordConfirm} = request.params // Desestructuración de un objeto

    if(newPassword == newPasswordConfirm)
    {
        response.send(`Se ha solicitado la actualización de la contraseña del usuario con correo: ${email}, se aceptan los cambios ya que la contraseña y confirmación son la misma.`)
        console.log(newPassword);
        console.log(newPasswordConfirm);
    }
    else
    {    
        response.send(`Se ha solicitado la actualización de la contraseña del usuario con correo: ${email} con la nueva contraseña ${newPassword}, pero se rechaza el cambio dado que la nueva contraseña y su confirmación no coinciden.`)
        console.log(newPassword);
        console.log(newPasswordConfirm);
    }
})

//DELETE
router.delete("/deleteUser/:email", function(request, response){
    response.send(`Se ha solicitado la eliminación del usuario asociado al correo: ${request.params.email}`)
})


router.get("/login", formularioLogin)
router.get("/register",formularioRegister)
router.get("/passwordRecovery",formularioPasswordRecovery)
router.get("/confirmAccount/:token",confirm) 
export default router;
