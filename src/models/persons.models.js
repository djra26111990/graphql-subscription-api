import mongoose from 'mongoose'

const personSchema = new mongoose.Schema({
    firstName: {
        type: String,
        require: true,
        trim: true
    },
    lastName: {
        type: String,
        require: true,
        trim: true
    },
    age: {
        type: Number,
        require: true,
    },
    role: {
        type: String,
        require: true,
        trim: true,
    }
})

const Person = mongoose.model('Person', personSchema);

export default Person