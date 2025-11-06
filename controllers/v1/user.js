const { successResponse, errorResponse } = require('../../helpers/response');
const User = require('../../models/User');
const { createPaginationData } = require('../../utils');
const Ban = require('../../models/Ban');
const bcrypt = require('bcrypt');
const userModel = require('../../models/User');
const { isValidObjectId } = require('mongoose');
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
        const { email, password } = req.body;

    const updateData = {};

    if (email) updateData.email = email;

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await userModel.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true }
    ).select('-password').lean();

    return successResponse(res, 200, { user });

    } catch (err) {
        next(err);
    };
};

exports.changeRole = async(req,res,next) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;

        if (!isValidObjectId(userId)) {
          return errorResponse(res, 409, 'User ID is not valid!');
        };

        const validRoles = ['USER', 'DOCTOR', 'ADMIN'];
        if (!validRoles.includes(role)) {
          return errorResponse(res, 400, 'Invalid role type!');
        }

        const user = await User.findById(userId);
        if (!user) {
          return errorResponse(res, 404, 'User not found!');
        }

        if (user.role === 'ADMIN' && req.user._id.toString() === user._id.toString()) {
          return errorResponse(res, 403, 'You cannot change your own role!');
        }

        user.role = role;
        await user.save();

        return successResponse(res, 200, {
          user: {
            _id: user._id,
            email: user.email,
            role: user.role,
          },
          message: `User role changed successfully to ${role}`,
        });
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

        if (user.role === 'ADMIN') {
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

exports.getDoctors = async (req,res,next) => {
    try {
        const doctors = await User.find({ role: 'DOCTOR', 'doctorInfo.visitStatus': true , isBanned: false })
        .select('-password -__v')
        .populate('doctorInfo.category', 'title slug')
        .lean();

        if (!doctors.length) {
            return errorResponse(res, 404, 'No doctors found!');
        }

        return successResponse(res, 200, {
            count: doctors.length,
            doctors,
        });

    } catch (err) {
        next(err);
    };
};

exports.updateDoctorInfo = async (req,res,next) => {
    try {
        if (req.user.role !== 'DOCTOR') {
            return errorResponse(res, 403, 'Only doctors can update their info!');
        };
      
        const {
            fullname,
            phone,
            address,
            city,
            province,
            bio,
            experience,
            price,
            category,
            workTimes,
        } = req.body;
      
        const updateData = {
            'doctorInfo.fullname': fullname,
            'doctorInfo.phone': phone,
            'doctorInfo.address': address,
            'doctorInfo.city': city,
            'doctorInfo.province': province,
            'doctorInfo.bio': bio,
            'doctorInfo.experience': experience,
            'doctorInfo.price': price,
            'doctorInfo.category': category,
            'doctorInfo.workTimes': workTimes,
            'doctorInfo.visitStatus': true,
        };
      
        const updatedDoctor = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updateData },
            { new: true }
        )
            .select('-password')
            .populate('doctorInfo.category', 'title slug');
      
        return successResponse(res, 200, {
            message: 'Doctor profile updated successfully!',
            doctor: updatedDoctor,
        });

    } catch (err) {
        next(err);
    };
};