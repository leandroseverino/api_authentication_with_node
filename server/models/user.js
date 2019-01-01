const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    method: {
        type: String,
        enum: [ 'local', 'google', 'facebook'],
        required: true
    },
    local: {
        email: {
            type: String,
            lowercase: true
        },
        password: {
            type: String
        }
    },
    google: {
        id: {
            type: String
        },
        email: {
            type: String,
            lowercase: true
        }
    },
    facebook: {
        id: {
            type: String
        },
        email: {
            type: String,
            lowercase: true
        }
    }    
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
});

userSchema.pre('save', async function(next) {
    try {

        if (this.method !== 'local') {
            next();
        }
        // Generate a salt
        const salt = await bcrypt.genSalt(10);
        const passwordHashed = await bcrypt.hash(this.local.password, salt);
        this.local.password = passwordHashed;
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.isValidPassword = async function(plainPassword) {
    try {
        return await bcrypt.compare(plainPassword, this.local.password);
    } catch (error) {
        throw new Error(error);
    }
}

const User = mongoose.model('user', userSchema);

module.exports=User;