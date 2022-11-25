const bookModel = require('../models/bookModel')
const userModel= require('../models/userModel')
const personalListModel = require('../models/personalListModel')
const {isValid,isValidRequestBody,isValidObjectId,isValidDate} = require("../utils/validations")

const createList = async function(req, res){
try{
    let requestBody = req.body

    let {bookName, PersonalBook} = requestBody

    const createdlist = await personalListModel.create(requestBody)
    return res.status(201).send({msg:"List Created Sucessfully",data:createdlist})
}
catch(err){
    return res.status(500).send({status:false,Error: err.message})
}
}

const bookByQuery = async (req, res) => {
    try {
        const requestBody = req.query
       
      
        const filterQuery = {isDeleted:false}

        if (isValidRequestBody(requestBody)) {
            if (requestBody.title) {filterQuery.title = requestBody.title.trim()}
            if (requestBody.ISBN) {filterQuery.ISBN = requestBody.ISBN.trim()}
           
            
        }

        let bookData = await bookModel.find(filterQuery).sort({ title: 1 }).select({ _id: 1, title: 1, userId: 1,ISBN:1, category: 1 })
        
        if (bookData.length===0){
            
             return res.status(404).send({ status: false, message: "No Book found" })
        }

        return res.status(200).send({ status: true, message: "Found successfully", data: bookData })

    } catch (err) {
        return res.status(500).send({ status: false, Error: err.message })
    }
}
const addToList = async (req, res) => {
    try {
        let userId = req.params.userId
        let data = req.body.personalBooks

        if (!data) return res.status(400).json({ message: "please provide bookID" })
        console.log(userId);
        if(!userId) return res.status(400).json({message:"provide userId in params"})
      
        
        let listCreate = await personalListModel.findOneAndUpdate({_id :userId} ,{$push:{personalBooks : data}} )
        return res.status(201).json({ data: listCreate, message: "Book added to your personal list" })
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}



module.exports = {createList,bookByQuery,addToList}
