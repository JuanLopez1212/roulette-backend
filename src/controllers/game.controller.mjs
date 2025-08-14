import { spinWheel, calculatePayoutForBets } from '../utils/roulette.mjs';
import gameModel from '../schemas/game.schema.mjs';
import betsModel from '../schemas/bet.schema.mjs';

const createGame = async( req, res ) => {
    try {
        const last = await gameModel.findOne().sort( { gameNumber: -1 } )
        const gameNumber = last ? last.gameNumber + 1 : 1
        const game = new gameModel( { gameNumber, status: 'abierto' } )  
        await game.save()
        res.status( 201 ).json( { message: 'Juego creado exitosamente', game } )  
    } 
    catch (error) {
        console.error( error )
        res.status( 500 ).json( { message: 'Error al crear el juego' } )
    }
}

const openGame = async( req, res ) => {
    try {
        const { id } = req.params    
        const game = await gameModel.findById( id )
        if ( !game ) {
            return res.status( 404 ).json( { message: 'Juego no encontrado' } )
        }
        game.status = 'abierto'
        game.closedAt = undefined
        game.finishedAt = undefined
        game.winningNumber = undefined
        game.winningColor = undefined
        await game.save()
        return res.status( 200 ).json( { message: 'Juego abierto exitosamente', game } )
    } 
    catch (error) {
        console.error( error )
        return res.status( 500 ).json( { message: 'Error al abrir el juego' } )
    }
}

const closeAndSpinGame = async( req, res ) => {
    try {
        const { id } = req.params
        const game = await gameModel.findById( id )
        if ( !game ) {
            return res.status( 404 ).json( { message: 'Juego no encontrado' } )
        }
        if ( game.status !== 'abierto' ) {
            return res.status( 400 ).json( { message: 'El juego no está abierto' } )
        }
        
        game.status = 'cerrado'
        game.closedAt = new Date()
        await game.save()

        // Spin
        const { winningNumber, winningColor } = spinWheel()
        game.winningNumber = winningNumber
        game.winningColor = winningColor
        game.status = 'cerrado'
        game.finishedAt = new Date()
        await game.save()

        // Bets
        const bets = await betsModel.find( { game: game._id, result: 'pendiente' } )
        for ( const bet of bets ) {
            const payout = calculatePayoutForBets( bet.bets, winningNumber, winningColor )
            bet.payout = payout 
            bet.result = payout > 0 ? 'ganado' : 'perdido'
            await bet.save()

            if ( payout > 0 ) {
                const user = await userModel.findById( bet.user )
                if ( user ) {
                    user.balance += payout 
                    await user.save()
                }
            }
        }
        return res.json({
            message: 'Ruleta cerrada y resultado generado',
            game: { winningNumber, winningColor },
            processedBets: bets.length
        })
    } 
    catch (error) {
        console.error( error )
        return res.status( 500 ).json( { message: 'Error al cerrar el juego y generar el resultado' } )
    }
}

const listGames = async( req, res ) => {
    const games = await gameModel.find().sort( { createdAt: -1 } ).limit( 50 )
    return res.json( games )
}

const getGame = async( req, res ) => {
    const { id } = req.params
    const game = await gameModel.findById( id )

    if ( !game ) {
        return res.status( 404 ).json( { message: 'Juego no encontrado' } )
    }
    return res.json( game )
} 

export {
    createGame,
    openGame,
    closeAndSpinGame,
    listGames,
    getGame
}