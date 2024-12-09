const express = require("express");
const userRouter = require("./Routes/user");
const {connectDB} = require("./connection");
const {logReqRes} = require("./Middlewares/index")

const app = express();
const PORT = 8000;

connectDB("mongodb://127.0.0.1:27017/demo-api")
.then(() => 
    console.log("Database Connected")
);

// Middleware : Plugin
app.use(express.urlencoded({extended : false}));

// Middleware 1
app.use(logReqRes("log.txt"));

app.use("/api/users", userRouter);

app.listen(PORT, () => {
    console.log(`Server started at PORT: ${PORT}`);
});
