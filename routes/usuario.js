// Requires
var express = require('express');

// Inicializar variables
var app = express();
var bcrypt = require('bcrypt');

var jwt = require('jsonwebtoken');

var midAutenticacion = require('../midlewares/autentificacion');

var Usuario = require('../models/usuario');

//====================================================
// Obtener todos los usuarios
//====================================================

// Rutas
app.get('/', (req, res, next) => {

    Usuario.find({}, 'nombre email img role')
        .exec(
            (err, usuarios) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error de Usuarios',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    usuarios: usuarios
                });

            });
});

//====================================================
//EDIT un usuario
//====================================================
app.put('/:id', midAutenticacion.verificatoken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error find Usuarios',
                errors: err
            });
        }
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario' + id + ' no existe',
                errors: { message: 'No existe un usuario con ese id' }
            });
        }
        usuario.nombre = body.nombre
        usuario.email = body.email
        usuario.role = body.role

        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usr',
                    errors: err
                });
            }
            usuarioGuardado.password = ':)';

            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });


        });

    });

});


//====================================================
// Crear un usuario
//====================================================

app.post('/', midAutenticacion.verificatoken, (req, res) => {

    var body = req.body;
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error SAVE Usuarios',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuariotoken: req.usuario
        });

    });


});

//====================================================
// ELIMINAR usuario
//====================================================

app.delete('/:id', midAutenticacion.verificatoken, (req, res) => {
    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error BORRAR Usuarios',
                errors: err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'nO EXISTE UN USUARIO CON ES ID',
                errors: { message: 'nO EXISTE UN USUARIO CON ES ID' }
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioBorrado
        });


    });

});

module.exports = app;