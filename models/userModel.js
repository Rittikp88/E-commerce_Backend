const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require("crypto");

//name, email, password, confirmPassword, photo
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name.']
    },
    email: {
        type: String,
        required: [true, 'Please enter an email.'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please enter a valid email.']
    },
    photo: String,
    role: {
        type: String,
        // enum: ['user', 'admin', 'seller', 'superAdmin'],
        default: 'user'

    },
    password: {
        type: String,
        required: [true, 'Please enter a password.'],
        minlength: 8
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please confirm your password.'],
        validate: {
            //This validator will only work for save() & create()
            validator: function(val){
                return val == this.password;
            },
            message: 'Password & Confirm Password does not match'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now,
      },
      resetPasswordToken: String,
      resetPasswordExpire: Date,
})

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    //encrypt the password before saving it
    //it will salt the password means adding random string
    this.password = await bcrypt.hash(this.password, 12)
    this.confirmPassword = undefined;
    next();

})

userSchema.methods.getJWTToken = function () {
    return jwt.sign({id: this._id},'asg7-hnkrg-53jjed7-78gggfdfd' ,{
        expiresIn: 1000000 
    })
}

userSchema.methods.comparePasswordInDb = async function(psswd, pswdb){
    return await bcrypt.compare(psswd, pswdb);
}

//Generating Passworrd Reset Token
userSchema.methods.getResetPasswordToken = function () {
    //Generating Password Reset Token 
    userSchema.methods.getResetPasswordToken = function() {
        // Generating Token 
        const resetToken  = crypto.randomBytes(20).toString("hex");

        //Hashing and adding resetPasswordToken to UserSchema 
        this.resetPasswordToken = crypto.createHash("rit256").update(resetToken).digest("hex");

        this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

        return resetToken;
    }
}

const User = mongoose.model('User', userSchema);

module.exports = User;