const express = require('express');
const { auth } = require('../../middlewares/auth');
const roleGuard = require('../../middlewares/roleGuard');
const { createCategory, getAll, updateCategory, removeCategory } = require('../../controllers/v1/category');
const { multerStorage } = require('../../utils/multerConfigs');

const upload = multerStorage('public/images/category-icons');

const router = express.Router();

router.route('/').post(auth, roleGuard('ADMIN'), upload.single('icon'), createCategory)
.get(auth, roleGuard('ADMIN'), getAll);

router.route('/:categoryId').patch(auth, roleGuard('ADMIN'), upload.single('icon'), updateCategory)
.delete(auth, roleGuard('ADMIN'), removeCategory);

module.exports = router;