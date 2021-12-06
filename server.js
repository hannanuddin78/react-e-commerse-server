require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require('cors');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const path = require('path');

app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use(fileUpload({
    useTempFiles: true
}))


// Connect to mongodb
//const URI = process.env.MONGODB_URL
const monDB_url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.nonze.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`

mongoose.connect(monDB_url, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err =>{
    if(err) throw err;
    console.log('Connected to MongoDB')
})

if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'))
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
    })
}

const port = process.env.PORT || 7000;

app.get('/', (req, res) => {
    res.json(`Hello World,,connect my server is running ${port}`)
})

// Routes
app.use('/user', require('./routes/userRouter'))
app.use('/api', require('./routes/categoryRouter'))
app.use('/api', require('./routes/upload'))
app.use('/api', require('./routes/productRouter'))
app.use('/api', require('./routes/paymentRouter'))

app.listen(port, () =>{
    console.log('Server is running on port', port)
})