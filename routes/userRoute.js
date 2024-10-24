import express from 'express';
import {createUser,deleteUser,getUsers,updateUser,getUserById,loginUser} from '../controller/userController.js';
import { authenticateJWT } from '../config/authMiddleware.js';

const router = express.Router();
// Route to create a new user
router.post('/register', createUser);

router.post('/login', loginUser);

// Route to get all users
router.get('/users', authenticateJWT, getUsers);

// Route to get a single user by ID
router.get('/users/:id', authenticateJWT, getUserById);

// Route to update a user
router.put('/users/:id', authenticateJWT, updateUser);

// Route to delete a user
router.delete('/users/:id', authenticateJWT, deleteUser);

export default router;
