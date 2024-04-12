import { Schema, model } from 'mongoose'

const User = new Schema({

    email: { type: String, unique: true },
    password: { type: String, require: true },
    role: { type: String, require: true },
    unicode: { type: String, require: true },
    createdAt: { type: Date, require: true },
    createdAtCode: { type: Number, require: true }

})

export default model('User', User)