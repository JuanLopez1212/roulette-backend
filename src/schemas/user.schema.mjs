import mongoose from 'mongoose'

const userSchema = new mongoose.Schema ({
    username: {
        type: String,
        required: [ true, 'El nombre de usuario es obligatorio' ],
        unique: true, 
        trim: true,
        minlength: [ 3, 'El nombre de usuario debe tener al menos 3 caracteres' ],
        maxlength: [ 30, 'El nombre de usuario no debe exceder los 30 caracteres' ]
    },
    email: {
        type: String,
        required: [ true, 'El correo electrónico es obligatorio' ],
        unique: true,
        trim: true,
        match: [ /^\S+@\S+\.\S+$/, 'El correo electrónico no es válido' ]
    },
    password: {
        type: String,
        required: [ true, 'La contraseña es obligatoria' ],
        minlength: [ 6, 'La contraseña debe tener al menos 6 caracteres' ]
    },
    role: {
        type: String,
        enum: [ 'player', 'admin' ],
        default: 'player'
    },
    balance: {
        type: Number,
        default: 1000,
        min: 0
    },
    totalDeposited: [
        {
            amount: {
                type: Number,
                required: [ true, 'El monto del depósito es obligatorio' ],
                min: 0
            },
            date: {
                type: Date,
                default: Date.now
            } 
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: Date
})

const userModel = mongoose.model ( 'user', userSchema )

export default userModel