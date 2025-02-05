const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const authRouter = require("./routes/auth-router");
const errorMiddleware = require("./middlewares/error");
const notFound = require("./middlewares/not-found");
const app = express();


app.use(cors());
app.use(morgan("dev"));
//แปลงจาก sting เป็น เป้น JS object และจะสร้าง รีเควส.บอดี้
app.use(express.json());


app.use("/api", authRouter);

app.use(notFound)
app.use(errorMiddleware)

const PORT = 8888;
app.listen(PORT , () => console.log(`Server is running on port ${8888}`));