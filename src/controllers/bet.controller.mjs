import betModel from "../schemas/bet.schema.mjs"
import gameModel from "../schemas/game.schema.mjs"
import userModel from "../schemas/user.schema.mjs"

const placeBet = async( req, res ) => {
    try {
        const { rouletteId } = req.params 
        const { bets } = req.body 
        
        if ( !Array.isArray( bets ) || bets.length === 0 ) {
            return res.status( 400 ).json( { message: "Debe enviar un arreglo de apuestas" } )
        }

        const game = await gameModel.findById( rouletteId )
        if ( !game ) {
            return res.status( 404 ).json( { message: "Juego no encontrado" } )
        }
        if ( game.status !== "open" ) {
            return res.status( 400 ).json( { message: "El juego no está abierto para apuestas" } )
        }

        // Sumar total al apostar
        const totalAmount = bets.reduce(( s, b ) => s + Number( b.amount || 0 ), 0 )
        if ( totalAmount <= 0 ) {
            return res.status( 400 ).json( { message: "El monto total de las apuestas debe ser mayor a 0" } )
        }

        const user = await userModel.findById( req.user._id )
        if ( !user ) {
            return res.status( 404 ).json( { message: "Usuario no encontrado" } )
        }
        if ( user.balance < totalAmount ) {
            return res.status( 400 ).json( { message: "Saldo insuficiente" } )
        }

        // Validar cada apuesta: Tipo y valor 
        for ( const bet of bets ) {
            if ( ![ 'numero', 'color' ].includes( b.type)) {
                return res.status( 400 ).json( { message: "Tipo de apuesta inválido" } )
            }
            if ( b.type === 'numero' ) {
                const num = Number( b.value )
                if ( isNaN( num ) || num < 0 || num > 36 ) {
                    return res.status( 400 ).json( { message: "Valor de número inválido" } )
                } 
                else {
                    const val = String( b.value ).toLowerCase()
                    if ( ![ 'rojo', 'negro' ].includes( val ) ) {
                        return res.status( 400 ).json( { message: 'Color inválido (usar "rojo" o "negro"' } )
                    }
                    b.value = val 
                }
            }
            if ( isNaN( b.amount ) || Number( b.amount ) <= 0 ) {
                return res.status( 400 ).json( { message: 'Monto de apuesta inválido' } )
            }
        }

        // Deducir fondos 
        user.balance -= totalAmount
        await user.save()

        const betDoc = new betModel({
            user: user._id,
            game: game._id,
            bets: bets.map( b => ({ type: b.type, value: b.value, amount: Number( b.amount ) } ) )
        })
        await betDoc.save()

        return res.status( 201 ).json( { message: 'Apuesta realizada', betId: betDoc._id, balance: user.balance } )
    } 
    catch (error) {
        console.error ( error )
        return res.status( 500 ).json( { meesage: 'Error al realizar la apuesta' } )
    }
}

const listUserBets = async( req, res ) => {
    try {
        const bets = await betModel.find( { user: req.user._id } ).populate( 'game' ).sort( { createdAt: -1 } ).limit( 100 )  
        return res.json( bets )  
    } 
    catch (error) {
        console.error( error )
        return res.status( 500 ).json( { message: 'Error al obtener las apuestas del usuario' } )
    }
}

export {
    placeBet,
    listUserBets
}