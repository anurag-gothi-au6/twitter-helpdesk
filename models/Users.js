const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

// User Schema
const userSchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
            trim: true
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        enterprise: {
            type: Schema.Types.ObjectId,
            ref: 'enterprise'
        }
    },
    { timestamps: true }
);

//static method to find User by email and password
userSchema.statics.findByEmailAndPassword = async (email, password) => {
    try {
        console.log(email,password)
        const user = await User.findOne({ email: email }).populate('enterprise');
        console.log(user)
        if (!user) throw new Error("Invalid Credentials");
        if (process.env.NODE_ENV != 'test') {
            console.log('password',password)
            const isMatched = await bcrypt.compare(password, user.password);
            console.log(user.password)
            console.log(isMatched)
            if (!isMatched) throw new Error("Invalid Credentials");
        }
        return user;
    } catch (err) {
        err.name = 'AuthError';
        throw err;
    }
};

//static method to null the accessToken of the User
userSchema.statics.nullifyToken = async (token) => {
    try {
        const user = await User.findOne({ accessToken: token })
        user.accessToken = null;
        user.save();
        return user

    } catch (err) {
        console.log(err.message)
    }
}

//static method to find User by email 
userSchema.statics.findByEmail = async (email) => {
    try {
        const user = await User.find({ email: email })
        if (!user) throw new Error("Invalid Credentials");
        return user
    } catch (err) {
        err.name = 'AuthError';
        throw err;
    }
};

userSchema.pre("save", async function (next) {
    const user = this;
    try {
        if (user.isModified("password")) {
            const hashedpassword = await bcrypt.hash(user.password, 10);
            user.password = hashedpassword;
            next()
        }
    } catch (err) {
        console.log(err.message)
        next(err)
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;