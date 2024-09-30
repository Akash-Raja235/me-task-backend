import express from 'express'
import { login, logout, regsisterUser } from '../contraollers/user.controller.js'
import { verifyJWT } from '../middleware/auth.middleware.js'
const router = express.Router()


router.post('/register',regsisterUser)

    router.post("/login",login)

    // secure Route

    router.get("/logout",verifyJWT,logout)


export default router