var SEED = require('../config/config').SEED;
var jwt = require('jsonwebtoken');

//====================================================
//Verificar usr MIDLEWARE
//====================================================

exports.verificatoken = function(req, res, next) {
    var token = req.query.token;
    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'tOKEN iNCOREDCTO',
                errors: err
            });
        }

        req.usuario = decoded.usuario

        next();


    });
}