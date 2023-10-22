const express = require('express');
const path = require('path');
const authRouter = require('./routes/authRouter');
const CustomError = require('./Utils/CustomError');
const globalErrorHandler = require('./controller/errorController')

const port = 8000;

const db = require('./config/mongoose')

const app = express();
app.use(express.json());
// app.use(express.urlencoded());

app.get('/' , function(req, res) {
    res.send("<h1>hello! world</h1>")
})

app.use('/api/v1/users', authRouter);
app.all('*', (req, res, next) => {
    // res.status(404).json({
    //     status: 'fail',
    //     message: `Can't find ${req.originalUrl} on the server!`
    // });
    // const err = new Error(`Can't find ${req.originalUrl} on the server!`);
    // err.status = 'fail';
    // err.statusCode = 404;
    const err = new CustomError(`Can't find ${req.originalUrl} on the server!`, 404);
    next(err);
});

app.use(globalErrorHandler);


app.listen(port, function(err){
    if(err){console.log('Error in running the server', err);}

    console.log('Yup!My Express Server is running on port:', port);
})