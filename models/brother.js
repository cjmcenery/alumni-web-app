const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose');

const brotherSchema = new mongoose.Schema({
    id: {
        type: Date,
        required: true
    },
    email: {
        type: String,
        required:true
    },
    password: {
        type: String,
        required:true
    },
    first_name: {
        type: String,
        required:true
    },
    last_name: {
        type: String,
        required:true
    },
    year: {
        type: String,
        required:true
    },
    number: {
        type: String,
        required:true
    },
    address1: {
        type: String,
        required:true
    },
    address2: {
        type: String,
        required:true
    },
    city: {
        type: String,
        required:true
    },
    state: {
        type: String,
        required:true
    },
    zip: {
        type: String,
        required:true
    },
    account_type: {
        type: String,
        required: true
    }
})

brotherSchema.plugin(passportLocalMongoose);


module.exports = mongoose.model('Brother', brotherSchema, 'Brother')