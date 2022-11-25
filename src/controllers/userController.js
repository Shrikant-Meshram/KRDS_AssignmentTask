const userModel = require("../models/userModel")
const bookModel = require("../models/bookModel")

//#######################################################################################################################################################################
//Here We Requiring All the validation function from util/validations
const { isValid, isValidRequestBody, isValidTitle } = require("../utils/validations")
//#######################################################################################################################################################################

const userCreate = async function (req, res) {
    try {
        const requestBody = req.body
        const { title, name, phone, email, password, address } = requestBody

        let nameRegex = /^[a-zA-Z ]{2,30}$/
        let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        let phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/

        if (!isValidRequestBody(requestBody)) return res.status(400).send({ status: false, messsage: "Invalid request parmeters,please provide user details" })

        if (!title) return res.status(400).send({ status: false, message: "Title is Required ..." })
        if (!isValidTitle(title)) return res.status(400).send({ status: false, message: `${title} --> Title Should be among Mr,Mrs,Miss ` })

        if (!name) return res.status(400).send({ status: false, message: "Name is Required ..." })
        if (!isValid(name)) return res.status(400).send({ status: false, message: "Name Should be valid ..." })
        if (!name.match(nameRegex)) return res.status(400).send({ status: false, message: "Name Should not contain Number and length between 2-30 " })

        if (!phone) return res.status(400).send({ status: false, message: "Phone Number is Required ..." })
        

        if (!email) return res.status(400).send({ status: false, message: "Email Id is Required ...." })
        if (!email.trim().match(emailRegex)) return res.status(400).send({ status: false, message: `${email} Please enter valid Email Id...` })
        if (await userModel.findOne({ email: email })) return res.status(400).send({ status: false, message: `Please enter unique Email Id....` })

        if (!password) return res.status(400).send({ status: false, message: " Password is Required ...." })
        if (password.length < 8 || password.length > 15) return res.status(400).send({ status: false, message: " Password Length Should be Between 8 and 15 ..." })

        if (address) {
            const { street, city, pincode } = address
            if (street)
                if (!isValid(street)) return res.status(400).send({ status: false, message: "Street Should be valid ... " })
            if (city)
                if (!isValid(city)) return res.status(400).send({ status: false, message: "City Should be valid ... " })
            if (!city.match(nameRegex)) return res.status(400).send({ status: false, message: "City Name Should not contain Number" })
            if (pincode) {
                if (!isValid(pincode)) return res.status(400).send({ status: false, message: "Pincode Should be valid ... " })
                if (!pincode.trim().match(/^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/)) return res.status(400).send({ status: false, Message: `${pincode} --> Pincode Should be Valid Indian pincode...` })
            }
        }

        const emailAlready = await userModel.findOne({ email: email })
        if (emailAlready) return res.status(400).send({ status: false, message: "Email Already Exist" })

        const userCreated = await userModel.create(requestBody)
        return res.status(201).send({ status: true, message: "User Created Successfully ", data: userCreated })
    }
    catch (err) {
        res.status(500).send({ Error: err.message })
    }
} 
//#######################################################################################################################################################################
const login = async (req, res) => {
    try {
        let profile = req.user;
        if (!req.user)
            return res.redirect('api/auth');

        let userDoc = {
            name: profile.displayName,
            email: profile.emails[0].value,
            image: profile.photos,
            token: profile.id
        }

        let isExist = await userModel.findOne({ email: profile.emails[0].value })

        if (isExist) return res.status(200).json({ success: true, data: isExist, message: "login successfull" })

        let document = await userModel.create(userDoc)
        return res.status(200).json({ success: true, data: document, message: "login successfull" })

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const createlist = async (req, res) => {
    try {
        let userId = req.params.id
        let data = req.body

        if (!data.bookId) return res.status(400).json({ message: "body is empty, provide bookId  to add in your list" })
        const book = await bookModel.findById(data.bookId)
        if (!book) return res.status(404).json({ message: "No book found" })
        const bookId = book._id

        const list = await userModel.findOneAndUpdate(
            { _id: userId },
            { $push: { personalList: bookId } }, { new: true })

        return res.status(201).json({ data: list, message: "Book added to your personal list" })
    } catch (err) {
        res.status(500).send({ message: err.message })
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
        if(!requestBody) return res.status(400).send({msg:"please provide query"})

        let bookData = await bookModel.find(requestBody).sort({ title: 1 }).select({ _id: 1, title: 1, userId: 1,ISBN:1, category: 1 })
        
        if (bookData.length===0){
            
             return res.status(404).send({ status: false, message: "No Book found" })
        }

        return res.status(200).send({ status: true, message: "Found successfully", data: bookData })

    } catch (err) {
        return res.status(500).send({ status: false, Error: err.message })
    }
}



//#######################################################################################################################################################################
module.exports = { userCreate,login,createlist, bookByQuery }