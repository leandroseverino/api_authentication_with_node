const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
});

userSchema.pre('save', async function(next) {
    try {
        // Generate a salt
        const salt = await bcrypt.genSalt(10);
        const passwordHashed = await bcrypt.hash(this.password, salt);
        this.password = passwordHashed;
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.isValidPassword = async function(plainPassword) {
    try {
        return await bcrypt.compare(plainPassword, this.password);
    } catch (error) {
        throw new Error(error);
    }
}

const User = mongoose.model('user', userSchema);

module.exports=User;