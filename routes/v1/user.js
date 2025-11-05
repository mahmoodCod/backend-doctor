const express = require('express');
const { auth } = require('../../middlewares/auth');
const roleGuard = require('../../middlewares/roleGuard');

const router = express.Router();

router.route('/').get(auth, roleGuard('ADMIN'), getAll)
.patch(auth, updateUser);
router.route('/role/:userId').put(auth, roleGuard('ADMIN'), changeRole);
router.route('/ban/:userId').post(auth, roleGuard('ADMIN'), banUser);

module.exports = router;