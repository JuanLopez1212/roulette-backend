import express from 'express';
import dbConnect from './config/mongo.config.mjs';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

dbConnect()


app.listen( 3000, () => {
    console.log ( 'Servidor corriendo en el puerto 3000' )
})