const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const bookSchema = new mongoose.Schema({
    title: { type: String,required: true,unique: true,trim:true},
    
   
    ISBN: { type: String, required: true, unique: true ,trim:true},
    category: { type: String, required: true ,trim:true},
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true })

module.exports = mongoose.model("Book", bookSchema)