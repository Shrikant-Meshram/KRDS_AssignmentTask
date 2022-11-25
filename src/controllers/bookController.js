const bookModel = require("../models/bookModel")
const userModel = require("../models/userModel")


//#######################################################################################################################################################################
//Here We Requiring All the validation function from util/validations
const {isValid,isValidRequestBody,isValidObjectId,isValidDate} = require("../utils/validations")
//#######################################################################################################################################################################

const createBook = async (req, res) => {
    try {
        const requestBody = req.body
        let { title, ISBN, category } = requestBody
        const ISBNRagex = /^[\d*\-]{10}|[\d*\-]{13}$/

        if (!isValidRequestBody(requestBody)) return res.status(400).send({ status: false, message: "Invalid request parmeters,Please provide Book details" })

        

        if (!title) return res.status(400).send({ status: false, message: "Title is Required ..." })
        if (!isValid(title)) return res.status(400).send({ status: false, message: "Title Should be Valid..." })
        if (await bookModel.findOne({ title })) return res.status(400).send({ status: false, message: "Title Already Used by Someone...Provide Unique Title" })

       

        if (!ISBN) return res.status(400).send({ status: false, message: "ISBN is Required ..." })
        if (!isValid(ISBN)) return res.status(400).send({ status: false, message: "ISBN Should be Valid..." })
        
        if (!category) return res.status(400).send({ status: false, message: "Category is Required ..." })
        if (!isValid(category)) return res.status(400).send({ status: false, message: "Category Should be Valid..." })

   

        

        const createdBook = await bookModel.create(requestBody)
        return res.status(201).send({ status: true, message: "created successfully", data: createdBook })

    } catch (err) {
        res.status(500).send({ status: false, Error: err.message })
    }
}

//#######################################################################################################################################################################
const getBookByQueryParams = async (req, res) => {
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

//#######################################################################################################################################################################


//#######################################################################################################################################################################

const updateBookById = async (req, res) => {
    try {
        const bookId = req.params.bookId
        const requestUpdateBody = req.body
        const { title, ISBN  } = requestUpdateBody
        const ISBNRagex = /^[\d*\-]{10}|[\d*\-]{13}$/

        if (!isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "bookId is not valid" })
        if (!isValidRequestBody(requestUpdateBody)) return res.status(400).send({ status: false, message: "Please Provide something to Update" })

        if (title != undefined) {
            if (!isValid(title)) return res.status(400).send({ status: false, message: "Title Should be Valid..." })
            if (await bookModel.findOne({ title })) return res.status(400).send({ status: false, message: "Title Already Used by Someone.. or You Already Updated it With Provided Title" })
        }
        
        if (ISBN != undefined) {
            if (!isValid(ISBN)) return res.status(400).send({ status: false, message: "ISBN Should be Valid..." })
            if (!ISBN.match(ISBNRagex)) return res.status(400).send({ status: false, message: "ISBN Should only contain Number and - and length of 10 and 13 only " })
            if (await bookModel.findOne({ ISBN })) return res.status(400).send({ status: false, message: "ISBN Already Used by SomeBody... or You Already Updated it With Provided ISBN" })
        }
        
        const bookToBeUpdated = await bookModel.findOne({ _id: bookId, isdeleted: false })
        if (!bookToBeUpdated) return res.status(404).send({ status: false, massage: "This book does not exist or Maybe Deleted" })

        const updatedBooks = await bookModel.findOneAndUpdate({ _id: bookId }, { title: title, excerpt: excerpt, ISBN: ISBN, releasedAt: releasedAt }, { new: true })
        res.status(200).send({ status: true, message: "update successfully", data: updatedBooks })

    } catch (err) {
        return res.status(500).send({ status: false, Error: err.message })

    }
}

//#######################################################################################################################################################################

const deleteById = async (req, res) => {
    try {
        const bookId = req.params.bookId

        if (!isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "book id is not valid" })

        const bookToBeDeleted = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!bookToBeDeleted) return res.status(404).send({ status: false, message: "Book Not Found" })

        const deletedBook = await bookModel.findOneAndUpdate({ _id: bookToBeDeleted._id }, { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true })
        return res.status(200).send({ status: true, message: "Book deleted succesfully", data: deletedBook })
    } catch (err) {
        return res.status(500).send({ status: false, Error: err.message })
    }
}

//#######################################################################################################################################################################


module.exports = { createBook, getBookByQueryParams, updateBookById, deleteById }