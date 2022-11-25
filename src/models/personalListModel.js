const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId


const listSchema = new mongoose.Schema({
    userId : {
        type : ObjectId,
        ref : 'User',
        required : true

    },

    personalBooks :[{
        type: ObjectId,
        required : true,
        ref : 'BOOK'
    }]

}, {timeStamp :true})


module.exports = mongoose.model('personalList',listSchema)


