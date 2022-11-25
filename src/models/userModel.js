const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const userSchema = new mongoose.Schema({
    title: { type: String, required: true, enum: ["Mr", "Mrs", "Miss"],trim:true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true, },
    email: {type: String,required: true,unique: true,trim:true},
    personalBooks :[{
        type: ObjectId,
        required : true,
        ref : 'BOOK'
    }]

   
   
}, { timestamps: true })

module.exports = mongoose.model("User", userSchema)