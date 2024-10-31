import express, { response } from 'express';

const router = express.Router();

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
router.put("/replaceUser/:name/:email/:password", function(a,b){
    b.send(`Se esta solicitando el remplazo de toda la informacion de usuario ${a.params.name},
        con el correo electronico ${a.params.email} y la contraseña ${a.params.password}`);
}) 

//PATCH
router.patch("/updatePassword/:email/:newPassword/:passwordConfirm", function(a, b){
    const {email, newPassword, passwordConfirm} = a.params
    if(newPassword===passwordConfirm){
        b.send(`Se esta solicitando la actualizacion de la contraseña del usuario con el correo ${email}, se aceptan los cambios ya que
            que la contraseña y la confirmacion es la misma`);
    }else{
        b.send(`Se esta solicitando la actualizacion de la contraseña del usuario con sol correo ${email},
            con la nueva contraseña ${newPassword}, pero se rechazo el cambio dado que su nueva contraseña y su confirmacion no coinciden `);
    }
})

//DELETE
router.delete("/deleteUser/:name", function(a,b){
    b.send(`Se esta solicitando eliminar el usuario ${a.params.name}`);
})
export default router;