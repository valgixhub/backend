import dotenv from "dotenv"
import mongoose from 'mongoose'
import { Uws } from '../utils/uws.js'

// Init
export const Init = async () => {

    // ENV
    dotenv.config()

    mongoose.connect(process.env.MONGO)
        .then(r => console.log(`
                -------------
                | DB v${r.version} |
                -------------
        `))
    
    Uws.app.listen(parseInt(process.env.SERVER_PORT || '9001', 10),
        (listenSocket) => {
            if (listenSocket) {
            console.log(`
                --------------------------
                | Server started on ${process.env.SERVER_PORT} |
                --------------------------
            `);
        }
    });

}