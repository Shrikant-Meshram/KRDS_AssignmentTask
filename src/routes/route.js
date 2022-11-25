const express = require("express");
const router = express.Router();
const passport = require('passport')
const { userCreate, userLogin } = require("../controllers/userController")
const { createBook, getBookByQueryParams, getBookById, updateBookById, deleteById } = require("../controllers/bookController")

const { authentication ,authorization } = require("../middlewares/auth")
const {addToList, bookByQuery} = require("../controllers/listContoller");
const { login } = require("../controllers/usercontroller");

router.get('/', (req, res) => {
    res.send("<button><a href='/auth'>Login With Google</a></button>")
});
 
router.get('/auth' , passport.authenticate('google', { scope:
    [ 'email', 'profile' ]
}));
  
router.get( '/auth/callback',
    passport.authenticate( 'google', {
        successRedirect: '/auth/callback/success',
        failureRedirect: '/auth/callback/failure'
}));
  
router.get('/auth/callback/success' , (req , res) => {

    // 
    // console.log(req.session, req.user)
    if(!req.user)
        return res.redirect('/login');
    // user is in DB? , Add user in DB

    res.send("Welcome " + req.user.email);
    // return res.redirect('/');
    
});
  

const isAuthenticated = (req, res,next) =>{
    // 
    if(req.isAuthenticated()) {return next()}
    else res.redirect('/')
}


router.get("/protected", isAuthenticated ,(req,res)=>{
    res.send("PROTECTED")
})

router.get('/auth/callback/failure' , (req , res) => {
    res.send("Error");
})

//----------User's Api-------------------//
router.post("/register", userCreate)
router.get("/login",login)

//----------Book's Api-------------------//
router.post("/books", createBook)
router.get("/books", getBookByQueryParams)
router.get("/books/:bookId"  ,getBookById)
router.put("/books/:bookId",isAuthenticated, updateBookById)
router.delete("/books/:bookId",isAuthenticated, deleteById)

//----------Review's Api-------------------//
router.post("/list/:userId",isAuthenticated ,addToList)
router.get("/fetchBook",isAuthenticated,bookByQuery)


module.exports = router