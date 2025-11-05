const { successResponse, errorResponse } = require('../../helpers/response');
const User = require('../../models/User');
const { createPaginationData } = require('../../utils');
const Ban = require('../../models/Ban');
exports.getAll = async(req,res,next) => {
    try {
        let { page = 1, limit = 10 } = req.query;

        const users = await User.find({}).skip((page - 1)* limit) .limit(limit);

        const totalUsers = await User.countDocuments();

        return successResponse(res,200, {
            users,
            pagination: createPaginationData(page, limit, totalUsers, 'User')
        });
    } catch (err) {
        next(err);
    };
};

exports.updateUser = async(req,res,next) => {
    try {

    } catch (err) {
        next(err);
    };
};

exports.changeRole = async(req,res,next) => {
    try {

    } catch (err) {
        next(err);
    };
};

exports.banUser = async(req,res,next) => {
    try {
        const { userId } = req.params;

        const user = await User.findOne({ _id: userId });
        if (!user) {
            return errorResponse(res,404, "User not found");
        };

        if (user.roles.includes("ADMIN")) {
            return errorResponse(res, 403, "You cannot ban an admin !!");
        };

        const deleteUser = await User.findOneAndDelete({ _id: userId });
        
        await Ban.create({ email: user.email });

        return successResponse(res,200, {
            user : deleteUser,
            message: "User banned successfully, user and posts removed",
        });

    } catch (err) {
        next(err);
    };
};
