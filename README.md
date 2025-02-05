# Server
## step1 
```bash 
npm init -y 
```
## step 2 install nodemon 
```bash
npm install express nodemon cors morgan bcryptjs jsonwebtoken zod prisma
```
## Step 3 Git 
```bash
git init 
git add . 
git commit - m "your_message"
```
next step 
coy code from your repo ก็อป 3 บรรทัดมาจาก github


## Step 4 updates package.json 
```json
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start" : "nodemon index.js"
  },
  ```
and code index.js
```js
const express = require("express")
const app =express()

//start server
const PORT = 8000
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
```
## Step 5 use middlewares
```js
const express = require("express")
const cors = require('cors')
const morgan = require('morgan')
const app =express()


//middlewares
app.use(cors()); // Allow cross Domain
app.use(morgan("dev")) //show log in Terminal
app.use(express.json()) // Read JSON

//Routing


const PORT = 8000
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
```
## Step 6 


## Step 7
create error.js

```js
const handleError = (err, req, res, next) => {
  res
  .status(err.status || 500)
  .json({ message: err.message || "Server Error!" });
};

module.exports = handleError;
```


WHen update code in Github
```bash
git add . 
git commit -m "message"
git push
```

## Step 8 Validate with zod

/middlewares/validators.js

```js
const { z } = require("zod");

//npm i zod
// TEST validate

exports.registerSchema = z.object({
    email : z.string().email(" Email ไม่ถูกต้อง !!!!"),
    firstname : z.string().min(3,"Firstname ต้องมากกว่า 3 อักขระ"),
    lastname : z.string().min(3,"Lastname ต้องมากกว่า 3 อักขระ"),
    password : z.string().min(6,"Password ต้องมากกว่า 6 อักขระ"),
    confirmpassword : z.string().min(6,"ConfirmPassword ต้องมากกว่า 6 อักขระ")
}).refine((data)=>data.password === data.confirmPassword,{
    message : "Confirm Password ไม่ตรงกัน",
    path: ["confirmPassword"],
});

exports.loginSchema = z.object({
    email : z.string().email(" Email ไม่ถูกต้อง !!!!"),
    password : z.string().min(6,"Password ต้องมากกว่า 6 อักขระ"),
})
exports.validateWithZod = (schema) => (req,res,next) => {
    try {
        console.log("Hello middleware");
        schema.parse(req.body);
        next();
    } catch (error) {
        const errMsg = error.errors.map((item)=>item.message);
        const errTxt = errMsg.join(",");
        const mergeError = new Error (errTxt);
        next(mergeError);
        
    }
};
```

and then update code
/routes/auth-route.js
```

const express = require("express");
const authController = require("../controllers/auth-controller");
const { registerSchema, loginSchema, validateWithZod } = require("../middlewares/validators");
const authRouter = express.Router();


authRouter.post("/register",validateWithZod(registerSchema) , authController.register);
authRouter.post("/login" , validateWithZod(loginSchema) , authController.login);

module.exports = authRouter;

```

## Step 9 Prisma
```bash

npx prisma db push
#or
npm prisma migrate dev --name init
```

### Config prisma
/configs/prisma.js
```js
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

module.exports = prisma
```

update code
Register
/controllers/auth-controllers
```js
const prisma = require("../configs/prisma");
const createError = require("../utils/create-error");
const bcrypt = require("bcryptjs")

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
```

## Step 10 Login

```js
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

```