import express from 'express';
import {createUser,deleteUser,getUsers,updateUser,getUserById,loginUser,getUserByAccountNumber, getUserByIdentityNumber} from '../controller/userController.js';
import { authenticateJWT } from '../config/authMiddleware.js';

const router = express.Router();
// Route untuk membuat user baru
router.post('/register', createUser);

router.post('/login', loginUser);

// Route untuk mendapatakan semua user
router.get('/users', authenticateJWT, getUsers);

// Route untuk mendapatkan user by ID
router.get('/users/:id', authenticateJWT, getUserById);

// Route untuk mendapatkan user by accountNumber
router.get('/users/accountNumber/:accountNumber', authenticateJWT, getUserByAccountNumber);

// Route untuk mendapatkan user by identityNumber
router.get('/users/identityNumber/:identityNumber', authenticateJWT, getUserByIdentityNumber);

// Route untuk mengupdate user by ID
router.put('/users/:id', authenticateJWT, updateUser);

// Route untuk menghapus user by ID
router.delete('/users/:id', authenticateJWT, deleteUser);

export default router;
