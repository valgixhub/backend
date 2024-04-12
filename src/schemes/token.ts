import { Schema, model } from 'mongoose'

const Token = new Schema({

    owner_id: { type: String, unique: true, require: true },
    token: { type: String, require: true },
    device: { type: String, require: true },
    createdAt: { type: Date, require: true },
    createdAtCode: { type: Number, require: true }

})

export default model('Token', Token)