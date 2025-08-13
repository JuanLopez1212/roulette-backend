import userModel from "../schemas/user.schema.mjs";

const getProfile = async( req, res ) => {
    const user = req.user
    
    return res.json({
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        balance: user.balance,
        totalDeposited: user.totalDeposited
    })
}

const deposit = async( req, res ) => {
    try {
        const { amount } = req.body
        if ( !amount || isNaN( amount ) || Number( amount ) <= 0 ) {
            return res.status( 400 ).json( { message: 'Monto inválido' } )
        }

        const user = await userModel.findById( req.user._id )
        if ( !user ) {
            return res.status( 404 ).json( { message: 'Usuario no encontrado' } )
        }

        user.totalDeposited.push( { amount: Number( amount )})

        user.balance = user.totalDeposited.reduce( ( total, dep ) => total + dep.amount, 0)
        await user.save()
        return res.json( { message: 'Depósito exitoso', balance: user.balance, totalDeposited: user.totalDeposited } )
    } 
    catch (error) {
        console.error( error )
        return res.status( 500 ).json( { message: 'Error en el servidor' } )
    }
}

const listUsers = async( req, res ) => {
    try {
        const users = await userModel.find().select( '-password' )
        return res.json( users )
    } 
    catch (error) {
        console.error( error )
        return res.status( 500 ).json( { message: 'Error al obtener usuarios' } )
    }
}

const adjustBalance = async( req, res ) => {
    try {
        const { userId } = req.params.id
        const { amount } = req.body
    
    } 
    catch (error) {
        
    }
}