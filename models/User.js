const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    roles: {
        type: [String],
        enum: ['ADMIN','USER'],
        default: ['USER'],
    },
    password: {
        type: String,
        required: true,
    }
}, { timestamps: true });

const model = mongoose.model('User', userSchema);

module.exports = model;