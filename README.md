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