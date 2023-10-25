const CustomError = require('../Utils/CustomError');
const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');
// const asyncErrorhandler = require('./../Utils/asyncErrorHandler');

const signToken = id => {
    return jwt.sign({id}, 'asg7-hnkrg-53jjed7-78gggfdfd', {
        expiresIn: 1000000 
    })
}

exports.signup = async (req, res, next) => {
    console.log(req.body);
    const newUser = await User.create(req.body)
    .then(newUser => {
        console.log('******', newUser);
        const token = signToken(newUser._id)
        // return res.redirect('back');
        res.status(201).json({
            status: 'success',
            token,
            data: {
                user: newUser
            }
        });
    })
    .catch(err => {
        console.log('error in creating a contact', err);
        return res.redirect('back');
    });
    
    // console.log(newUser);

    
};

exports.login = async(req, res , next) => {
    const {email, password} = req.body;
    if(!email || !password){
        const error = new CustomError('Please provide email Id & Password for login in!', 400);
        return next(error);
    }

    const user = await User.findOne({email}).select('password');

    const isMatch = await user.comparePasswordInDb(password, user.password);

    //check id yhe user exists & password matches
    if(!user || !isMatch){
        const error = new CustomError('Incorrect email or password', 400);
        return next(error);
    }

    const token = signToken(user._id)

    res.status(200).json({
        status: 'success',
        token,
        user
    })
}