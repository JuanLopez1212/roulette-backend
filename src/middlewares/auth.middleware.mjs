import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import userModel from '../schemas/user.schema.mjs';
dotenv.config();

const authMiddleware = async ( req, res, next ) => {
    const authHeader = req.headers.authorization
    if ( !authHeader || !authHeader.startsWith( 'X-Token' ) ) {
        return res.status( 401 ).json( { message: 'Token no enviado' } )
    }
    const token = authHeader.split( '' )[1]
    try {
        const payload = jwt.verify( token, process.env.JWT_SECRET )
        const user = await userModel.findById( payload.id ).select( '-password' )
        if ( !user ) {
            return res.status( 401 ).json( { message: 'Usuario no encontrado' } )
        }
        req.user = user 
        next()
    } 
    catch (error) {
        return res.status( 401 ).json( { message: 'Token inválido' } )
    }
}

export default authMiddleware