import express from 'express'
import { getAllUsers, handleLogin, handleLogout, handleRegister, refreshAccessToken } from '../controllers/user.controller.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.post("/register", handleRegister)
router.post("/login", handleLogin)
router.post("/logout", verifyJWT, handleLogout)
router.get("/refresh", refreshAccessToken)
router.get("/getall", verifyJWT, getAllUsers)

export default router;