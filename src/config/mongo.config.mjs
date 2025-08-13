import mongoose from 'mongoose'

const dbConnect = async () => {
    try {
        await mongoose.connect ( 'mongodb+srv://juanlopez:12120612@cluster0.akncooq.mongodb.net/db-roulette', {})

        console.log ( 'Conexión a la base de datos exitosa' )

    } 
    catch (error) {
        console.error ( error )
        console.log ( 'Error al conectar a la base de datos' )
    }
}

export default dbConnect