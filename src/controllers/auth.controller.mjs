import userModel from '../schemas/user.schema.mjs'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

function generateToken( userModel ) {
    return jwt.sign( { id: userModel._id, role: userModel.role }, process.env.JWT_SECRET, { expiresIn: '1h' } )
}

const register = async( req, res ) => {
    try {
        const { username, email, password, role, totalDeposited } = req.body
        if ( !username || !email || !password ) {
            return res.status( 400 ).json( { message: 'Todos los campos son obligatorios' } )
        }

        const totalBalance = Array.isArray( totalDeposited ) ? totalDeposited.reduce( ( acc, dep ) => acc + Number( dep.amount || 0), 0 )
        : 0

        const existsEmail = await userModel.findOne( { email } )
        if ( existsEmail ) {
            return res.status( 400 ).json( { message: 'El correo ya existe' } )
        }

        const salt = bcrypt.genSaltSync( 10 )
        const hash = bcrypt.hashSync( password, salt )

        const user = new userModel( { username, email, password: hash, totalDeposited: totalDeposited || [], balance: totalBalance } )
        await user.save()
        return res.status( 201 ).json( { message: 'Usuario registrado correctamente' } )
    } 
    catch (error) {
        console.error( error )
        return res.status( 500 ).json( { message: 'Error en el servidor' } )
    }
}

const login = async( req, res ) => {
    try {
        const { email, password } = req.body
        if ( !email || !password ) {
            return res.status( 400 ).json( { message: 'Todos los campos son obligatorios' } )
        }
        
        const user = await userModel.findOne( { email } )
        if ( !user ) {
            return res.status( 400 ).json( { message: 'Credenciales inválidas' } )
        }

        const valid = bcrypt.compareSync( password, user.password )
        if ( !valid ) {
            return res.status( 400 ).json( { message: 'Credenciales inválidas' } )
        }

        const token = generateToken( user )
        return res.json( { token, user: { id: userModel._id, username: userModel.username, email: userModel.email, role: userModel.role } } )
    } 
    catch (error) {
        console.error( error )
        return res.status( 500 ).json( { message: 'Error en el servidor' } )
    }
}

export {
    register,
    login
}