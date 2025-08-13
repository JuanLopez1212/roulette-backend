import mongoose from 'mongoose'

const gameSchema = new mongoose.Schema ({
    gameNumber: {
        type: Number,
        required: [ true, 'El número del juego es obligatorio' ],
        unique: true
    },
    status: {
        type: String,
        enum: [ 'abierto', 'cerrado', 'en curso' ],
        default: 'abierto'
    },
    winningNumber: {
        type: Number,
        min: 0,
        max: 36
    },
    winningColor: {
        type: String,
        enum: [ 'rojo', 'negro', 'verde' ]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    closedAt: Date,
    finishedAt: Date
})

const gameModel = mongoose.model ( 'game', gameSchema )

export default gameModel