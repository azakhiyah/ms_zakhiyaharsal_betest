import express from 'express';
import {createUser,deleteUser,getUsers,updateUser,getUserById,loginUser} from '../controller/userController.js';
import { authenticateJWT } from '../config/authMiddleware.js';

const router = express.Router();
// Route untuk membuat user baru
router.post('/register', createUser);

router.post('/login', loginUser);

// Route untuk mendapatakan semua user
router.get('/users', authenticateJWT, getUsers);

// Route untuk mendapatkan user by ID
router.get('/users/:id', authenticateJWT, getUserById);

// Route untuk mengupdate user by ID
router.put('/users/:id', authenticateJWT, updateUser);

// Route untuk menghapus user by ID
router.delete('/users/:id', authenticateJWT, deleteUser);

export default router;
