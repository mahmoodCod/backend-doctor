const { default: mongoose } = require("mongoose");
const bcrypt = require('bcrypt');

const doctorInfoSchema = new mongoose.Schema({
    fullname: {
        type: String,
        trim: true,
    },
    slug: {
        type: String,
        trim: true,
        unique: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    address: { 
        type: String,
        trim: true, 
    },
    city: {
        type: String, 
        trim: true,
    },
    province: { 
        type: String, 
        trim: true,
    },
    bio: { 
        type: String, 
        trim: true, 
    },
    experience: { 
        type: Number, 
        default: 0, 
    },
    price: { 
        type: Number, 
        default: 0, 
    },
    rating: { 
        type: Number, 
        default: 0, 
    },
    visitStatus: { 
        type: Boolean, 
        default: false, 
    },
    category: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category',
    },
    avatar: {
      filename: { type: String },
      path: { type: String },
    },
    workTimes: {
      type: [
        {
          day: { type: String },
          from: { type: String },
          to: { type: String },
        },
      ],
      default: [],
    },
});

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        enum: ['ADMIN','USER', 'DOCTOR'],
        default: 'USER',
    },
    password: {
        type: String,
        required: true,
    },
    isBanned: {
        type: Boolean,
        default: false,
    },
    doctorInfo: {
        type: doctorInfoSchema,
        default: {},
    },
}, { timestamps: true });

// Hash password before save
    userSchema.pre('save', async function (next) {
        if (!this.isModified('password')) return next();
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    });

const model = mongoose.model('User', userSchema);

module.exports = model;