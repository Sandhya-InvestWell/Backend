const express = require("express")
const morgan = require("morgan")
const cors = require("cors");
const database = require("./repositories/connectDb");
const router = require("./routes");

// Creating an instance of express
const app = express();
app.use(express.json())
app.use(morgan('dev')) // using morgan for logging details
app.use(cors()); // cors to connect frontend and backend

database; // Calling databse

const PORT = 8000; // defining port

app.use('/user', router); // Defining router 

// Listening on port
app.listen(PORT, ()=> {
    console.log(`Listening on Port - ${PORT}`);
})