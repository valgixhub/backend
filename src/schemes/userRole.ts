import { Schema, model } from 'mongoose'

const UserRole = new Schema({

    name: { type: String, unique: true, require: true },
    limit: {
        group: { type: Number, require: true },
        channel: { type: Number, require: true }
    },
    createdAt: { type: Date, require: true },
    createdAtCode: { type: Number, require: true }

})

export default model('UserRole', UserRole)