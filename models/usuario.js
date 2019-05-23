var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var usuarioSchema = new Schema({

    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    email: { type: String, unique: true, required: [true, 'El correo es necesario'] },
    password: { type: String, required: [true, 'La contrasenia es necesario'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE' }
});

//usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' });
module.exports = mongoose.model('Usuario', usuarioSchema);