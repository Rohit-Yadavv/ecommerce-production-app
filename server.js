import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import morgan from 'morgan';
import colors from 'colors';
import authrouter from './routes/authroutes.js';
import categoryrouter from './routes/categoryroutes.js';
import productrouter from './routes/productroutes.js';
import cors from 'cors';

// for deployment 
import path from 'path';
app.use(express.static(path.join(__dirname, "./client/build")));

// configure env
dotenv.config();

// database config
connectDB();

//rest object 
const app = express();

//middlewares
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

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
app.listen(PORT, () => {
    (`server running at ${PORT}`.bgCyan)
});