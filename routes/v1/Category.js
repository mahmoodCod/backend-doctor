const express = require('express');
const auth = require('../../middlewares/auth');
const roleGuard = require('../../middlewares/roleGuard');
const { multerStorage } = require('../../utils/multerConfigs');

const upload = multerStorage('public/images/category-icons');

const router = express.Router();

router.route('/').post(auth, roleGuard('ADMIN', upload.single('icon')), createCategory)
.get(auth, roleGuard('ADMIN'), getAll);

router.route('/category/:categoryId').patch(auth, roleGuard('ADMIN', upload.single('icon')), updateCategory)
remove(auth, roleGuard('ADMIN'), removeCategory);

module.exports = router;