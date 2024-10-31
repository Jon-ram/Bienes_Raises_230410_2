import express from 'express';

const router = express.Router()

router.get("/", function(req, res){
    res.send("Hola desde la web en NodeJS")
})
router.get("/quienEres",function(req, res){
    res.json({
        "nombre" : "Jonathan Baldemar Ramirez Reyes",
        "carrera" : "TI DSM",
        "grado" : "4",
        "grupo" : "B"
    })
})

export default router;