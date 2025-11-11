const { categoryValidator, categoryUpdateValidator } = require("../../validators/category");
const Category = require('../../models/Category');
const { successResponse, errorResponse } = require("../../helpers/response");
const { isValidObjectId } = require("mongoose");

const supportsFormat = [
    "image/jpeg",
    "image/svg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/svg+xml",
]
exports.createCategory = async (req,res,next) => {
    try {
        let { title, slug, parent, description, fillters } = req.body;
        // fillters = JSON.parse(fillters);

        await categoryValidator.validate({
            title,
            slug, 
            parent, 
            description, 
            fillters
        }, { abortEarly: false });

        let icon = null;
        if (req.file) {
            const { filename, mimetype } = req.file;

            if(!supportsFormat.includes(mimetype)) {
                return errorResponse(res,400, 'Unsopported image format !!');
            };

            icon = {
                filename,
                path: `images/category-icons/${filename}`,
            };
        };

        const newCategory = await Category.create({
            title,
            parent,
            description,
            slug,
            fillters,
            icon
        });

        return successResponse(res,200, {
            category: newCategory,
            message: "Create category is successfully :))",
        });
    } catch (err) {
        next(err);
    };
};

exports.getAll = async (req,res,next) => {
    try {
        const { page = 1, limit = 10, search = '', sort = 'createdAt', order = 'desc', parent = null } = req.query;

        const query = {};

        if(search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ]
        };

        if(parent) {
            query.parent = parent === 'null' ? null : parent;
        };

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const categories = await Category.find(query)
            .sort({ [sort]: order === "desc" ? -1 : 1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate("parent", "title slug")
            .lean();

        const total = await Category.countDocuments(query);

        return successResponse(res, 200, {
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            count: categories.length,
            categories,
    });

    } catch (err) {
        next(err);
    };
};

exports.updateCategory = async (req,res,next) => {
    try {
        const { categoryId } = req.params;

        if (!isValidObjectId(categoryId)) {
            return errorResponse(res,404, 'Category id is not valid !!');
        };

        let { title, slug, parent, description, fillters } = req.body;

        await categoryUpdateValidator.validate({
            title,
            slug,
            parent,
            description,
            fillters
        }, { abortEarly: false });

        let icon = {};

        if (req.file) {
            const { filename, mimetype } = req.file;
    
            if(!supportsFormat.includes(mimetype)) {
                return errorResponse(res,400, 'Unsopported image format !!');
            };
    
            icon = {
                filename,
                path: `images/category-icons/${filename}`,
            };
        };

        const updatedCategory = await Category.findByIdAndUpdate(categoryId, {
            title,
            parent,
            slug,
            description,
            fillters,
            icon,
        }, { new: true });
    
        if (!updatedCategory) {
            return errorResponse(res,404, 'Category not found !!');
        };
    
        return successResponse(res,200, { category: updatedCategory});

    } catch (err) {
        next(err);
    };
};

exports.removeCategory = async (req,res,next) => {
    try {
        const { categoryId } = req.params;

        if(!isValidObjectId(categoryId)) {
            return errorResponse(res,404, "Category id is not valid !!");
        };

        const deletedCategory = await Category.findByIdAndDelete(categoryId);

        if(!deletedCategory) {
            return errorResponse(res,404, "Category not found !!");
        };

        return successResponse(res,200, {
            category: deletedCategory,
            message: "Category removed successfully :))",
        });

    } catch (err) {
        next(err);
    };
};
