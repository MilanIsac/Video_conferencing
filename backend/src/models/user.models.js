import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    profile_pic: {
        type: String,
        default: ''
    },
    location: {
        type: String,
        default: ''
    },
    isOnboarded: {
        type: Boolean,
        default: false
    },
    friends: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        }
    ],
    bio: {
        type: String,
        default: ''
    },
}, {timestamps: true});

// pre hook

userSchema.pre('save', async function(next) {

    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);

        next();
    }
    catch(error) {
        next(error);
    }
})

userSchema.methods.matchPassword = async function(enteredPassword) {
    const isPasswordValid = await bcrypt.compare(enteredPassword, this.password);
    return isPasswordValid;
}


const User = mongoose.model('User', userSchema);



export default User;