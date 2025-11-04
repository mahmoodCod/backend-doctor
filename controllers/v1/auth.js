const { errorResponse } = require("../../helpers/response");
const { registerValidator } = require("../../validators/auth");
const userModel = require('../../models/User');

exports.register = async (req,res,next) => {
    try {
        const registerResult = registerValidator(req.body);
        if (registerResult !== true) {
            return errorResponse(req,422, registerResult);
        };

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

    } catch(err) {
        next(err);
    };
};

exports.getMe = async (req,res,next) => {
    try {

    } catch(err) {
        next(err);
    };
};
