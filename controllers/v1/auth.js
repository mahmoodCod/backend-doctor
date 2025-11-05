const { errorResponse, successResponse } = require("../../helpers/response");
const { registerValidator, loginValidator } = require("../../validators/auth");
const userModel = require('../../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { isValidObjectId } = require("mongoose");

exports.register = async (req,res,next) => {
    try {
        await registerValidator.validate(req.body,{ abortEarly: false });

        const { email, password } = req.body;

        const isUserExist = await userModel.findOne({
           $or : [{email}],
        });
        if (isUserExist) {
            return errorResponse(res, 409, "email is duplicated");
        };

        const isUserBan = await userModel.find({ email });
        if (isUserBan.length) {
            return errorResponse(res,409, " This email your ban !!");
        };

        const countOfUser = await userModel.countDocuments();
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            email,
            password: hashedPassword,
            role: countOfUser > 0 ? 'USER' : 'ADMIN',
        });

        const userObject = user.toObject();
        Reflect.deleteProperty(userObject , 'password');

        const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn : '30 day',
    });
    return res.status(201).json({ user: userObject , accessToken });
    } catch(err) {
        next(err);
    };
};

exports.login = async (req,res,next) => {
    try {
        await loginValidator.validate(req.body, { abortEarly: false });

        const { identifir, password } = req.body;

        const user = await userModel.findOne({
            $or: [{ email: identifir},{ username: identifir}],
        });
        if (!user) {
            return errorResponse(res,401, "this is no user with email or username");
        };

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return errorResponse(res,401, "Password is not valid !!");
        };

        const accessToken = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
            expiresIn: "30 day",
        },
        );

        return successResponse(res, 200, {
            accessToken,
            message: "Login successfully :))",
        });
    } catch(err) {
        next(err);
    };
};

exports.getMe = async (req,res,next) => {
    try {
        return successResponse(res,200, {
            message: "User profile fetched successfully :))",
            user: req.user,            
        });
    } catch(err) {
        next(err);
    };
};
