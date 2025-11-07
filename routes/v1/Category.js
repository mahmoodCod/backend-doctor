const express = require('express');
const auth = require('../../middlewares/auth');
const roleGuard = require('../../middlewares/roleGuard');

const router = express.Router();

router.route('/').post(auth, roleGuard('ADMIN'), createCategory)
.get(auth, roleGuard('ADMIN'), getAll);

router.route('/category/:categoryId').patch(auth, roleGuard('ADMIN'), updateCategory)
remove(auth, roleGuard('ADMIN'), removeCategory);

module.exports = router;