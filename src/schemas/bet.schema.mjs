import mongoose from 'mongoose'

const betSchema = new mongoose.Schema ({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true 
    },
    game: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'game',
    },
    bets: [
        {
            type: {
                type: String,
                enum: [ 'numero', 'color' ],
                required: [ true, 'El tipo de apuesta es obligatorio' ]
            },
            value: {
                type: mongoose.Schema.Types.Mixed,
                required: [ true, 'El valor de la apuesta es obligatorio' ]
            },
            amount: {
                type: Number,
                required: [ true, 'El monto de la apuesta es obligatorio' ],
                min: 0
            }
        }
    ],
    result: {
        type: String,
        enum: [ 'ganada', 'perdida', 'pendiente' ],
        default: 'pendiente'
    },
    payout: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const betModel = mongoose.model ( 'bet', betSchema )

export default betModel