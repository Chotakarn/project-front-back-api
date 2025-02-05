const prisma = require("../configs/prisma");
const createError = require("../utils/create-error");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const authController = {} ;



authController.register = async(req , res , next ) => {
    try {
        // step 1 req.body
        const {email, firstname, lastname, password, confirmpassword} = req.body
       

        // step 2 validate
       const checkEmail = await prisma.profile.findFirst({
        where: {
            email: email,
        },
       })
       console.log(checkEmail)
       if(checkEmail){
        return createError(400,"Email is already exits!!!")
       }
        // step 3 check already
        // step 4 Encrypt bcrypt
        // const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, 10)
        // console.log(hashedPassword)
        // step 5 insert to DB
        const profile = await prisma.profile.create({
            data:{
                email: email,
                firstname : firstname,
                lastname : lastname , 
                password : hashedPassword,
            },
        });
        // step 6 Response




        res.json({message: "Register"})
    } catch (error) {
        next(error);
    }
}


authController.login = async(req , res , next ) => {
    try {
        // Step 1 req.body
        const{ email , password } = req.body;
        // Step 2 Check email and password
        const profile = await prisma.profile.findFirst({
            where : {
                email:email,
            },
        });
        if(!profile){
            return createError(400,"Error, Password is invalid!!")
        }
        const isMatch = bcrypt.compareSync(password,profile.password)
        if(!isMatch){
            return createError(400, " Password is invalid!!")
        }
        // Step 3 Generate token
        const payload = {
            id : profile.id,
            email:profile.email,
            firstname:profile.firstname,
            lastname:profile.lastname,
            role : profile.role,
        }
        const token = jwt.sign(payload,process.env.SECRET,{
            expiresIn: "1d" ,
        });


        console.log(payload)
        // Step 4 Response



        res.status(201).json({
            message : "login",
            payload : payload,
            token : token,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = authController;