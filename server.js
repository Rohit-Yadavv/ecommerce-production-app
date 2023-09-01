import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import morgan from 'morgan';
import authrouter from './routes/authroutes.js';
import categoryrouter from './routes/categoryroutes.js';
import productrouter from './routes/productroutes.js';
import cors from 'cors';

// for deployment

import path from 'path';
import { fileURLToPath } from 'url';


// configure env
dotenv.config();


// es6 fix we can't use __dirname in es6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// database config


//rest object 
const app = express();

app.use(morgan('dev'));
app.use(cors());

// for deployment 
app.use(express.static(path.join(__dirname, "./client/build")));



//routes
app.use('/api/v1/auth', authrouter);
app.use('/api/v1/category', categoryrouter);
app.use('/api/v1/product', productrouter);



// rest api deployment
app.use("*", function (req, res) {
    res.sendFile(path.join(__dirname, "./client/build/index.html"))
})


// rest api normal
// app.get('/', (req, res) => {
//     res.send('<h1>welcome to ecommerce app api</h1>')
// })

//PORT
const PORT = process.env.PORT || 8080;

//run listen
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("listening for requests");
    })
})