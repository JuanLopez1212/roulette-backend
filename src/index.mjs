import express from 'express';
import dbConnect from './config/mongo.config.mjs';

const app = express();

dbConnect()
app.use(express.json());

app.listen( 3000, () => {
    console.log ( 'Servidor corriendo en el puerto 3000' )
})