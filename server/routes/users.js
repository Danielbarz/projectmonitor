const router = require('express').Router();
const userController = require('../controllers/userController');

// GET all users (maybe for admin only later)
router.get('/', userController.getAllUsers);

// GET user profile
router.get('/profile/:id', userController.getUserProfile);

// UPDATE user profile
router.put('/profile/:id', userController.updateUserProfile);

// UPDATE user (Role & Password)
router.put('/:id', userController.updateUser);

// DELETE user
router.delete('/:id', userController.deleteUser);

module.exports = router;