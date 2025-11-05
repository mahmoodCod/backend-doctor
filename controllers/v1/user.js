const { successResponse } = require('../../helpers/response');
const User = require('../../models/User');
const { createPaginationData } = require('../../utils');
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

    } catch (err) {
        next(err);
    };
};
