const express = require('express');
const router = express.Router();
const actions = require('../actions');
const authentication = require('../authentication');



//-------------- USUARIOS Endpoints--------------------------------


/**
 * @swagger
 * /usuarios:
 *   get:
 *     description: Trae todos los usuarios del sistema
 *     parameters:
 *      - in: header
 *        name: token
 *        required: true
 *        descripcion: Parameteros
 *     tags:
 *     - Usuarios
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: todos los usuarios del sistema
 */
router.get('/usuarios', authentication.verifyUser, async (req, res) => {
    const users = await actions.get('SELECT * FROM usuarios');
    res.send(users);

});


/**
 * @swagger
 * /usuario/:id:
 *   get:
 *     description: Trae todos los usuarios del sistema
 *     parameters:
 *      - in: header
 *        name: token
 *        required: true
 *        descripcion: Parameteros
 *     tags:
 *     - Usuarios
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: todos los usuarios del sistema
 */
router.get('/usuario/:id', authentication.verifyUser, async (req, res) => {
    const user = await actions.get('SELECT * FROM usuarios WHERE id = :id', { id: req.params.id });
    res.send(user);
});


/**
 * @swagger
 * /usuarios:
 *   post:
 *     description: Trae todos los usuarios del sistema
 *     parameters:
 *      - in: header
 *        name: token
 *        required: true
 *        descripcion: Parameteros
 *     tags:
 *     - Usuarios
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: todos los usuarios del sistema
 */
// router.post('/usuario', authentication.verifyUser, async (req, res) => {
//     const user = await actions.create(
//         `INSERT INTO usuarios (username, nombre, correo_electronico, telefono, rol, direccion) 
//         VALUES (:username, :nombre, :correo_electronico, :telefono, :rol, :direccion)`,
//         req.body);
//     res.send(user);
// });

//Endpoints para registrar usuario Admin y usuario Cliente

router.post('/usuarioAdmin', async (req, res) => {
    const user = await actions.create(
        `INSERT INTO usuarios (username, nombre, correo_electronico, telefono, rol, direccion, password) VALUES (:username, :nombre, :correo_electronico, :telefono, 1, :direccion, :password)`,
        req.body);
    console.log(user);
    res.send(`Administrador creado satisfactoriamente.`);

});

router.post('/usuarioCliente', async (req, res) => {
    const user = await actions.create(
        `INSERT INTO usuarios (username, nombre, correo_electronico, telefono, rol, direccion, password) VALUES (:username, :nombre, :correo_electronico, :telefono, 2, :direccion, :password)`,
        req.body);
    console.log(user);
    res.send(`Cliente creado satisfactoriamente.`);
});


router.put('/usuario/:id', authentication.verifyUser, async (req, res) => {
    const user = await actions.update(
        `UPDATE usuarios SET username = :username, nombre = :nombre, correo_electronico = :correo_electronico, telefono = :telefono, direccion = :direccion  
        WHERE id = :id`,
        { ...req.body, id: req.params.id });
    res.send(req.body);
});

router.delete('/usuario/:id', authentication.verifyUser, async (req, res) => {
    const user = await actions.delete(
        `DELETE FROM usuarios WHERE id=:id`,
        { id: req.params.id });
    res.send(req.body);
});


module.exports = router;