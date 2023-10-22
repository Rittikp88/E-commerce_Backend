const User = require('./../models/userModel');
// const asyncErrorhandler = require('./../Utils/asyncErrorHandler');

exports.signup = async (req, res, next) => {
    console.log(req.body);
    const newUser = await User.create(req.body)
    .then(newUser => {
        console.log('******', newUser);
        // return res.redirect('back');
        res.status(201).json({
            status: 'success',
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