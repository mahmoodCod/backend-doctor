const { categoryValidator } = require("../../validators/category");
const Category = require('../../models/Category');
const { successResponse, errorResponse } = require("../../helpers/response");

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
        let = { title, slug, parent, description, fillters } = req.body;
        fillters = JSON.parse(fillters);

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
        })

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

    } catch (err) {
        next(err);
    };
};

exports.updateCategory = async (req,res,next) => {
    try {

    } catch (err) {
        next(err);
    };
};

exports.removeCategory = async (req,res,next) => {
    try {

    } catch (err) {
        next(err);
    };
};
