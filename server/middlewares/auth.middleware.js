import jwt from 'jsonwebtoken'
import { asyncHandler } from '../utils/asyncHandler.js'
import { User } from '../models/user.model.js'
import { ApiError } from '../utils/ApiError.js'

export const verifyJWT = asyncHandler(async (req, res, next) => {

    try {
        const authHeader = req.headers["authorization"];
        let token;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(' ')[1];
        }
        
        if (!token) {
            return next(new ApiError(401, "Token not found."))
        }

        const decodedData = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedData._id).select("-password -refreshToken")

        if (!user) {
            return next(new ApiError(403, "Unauthorized access."))
        }

        req.user = user

        next()
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return next(new ApiError(401, "Access token expired."))
        }
        if (error.name === 'JsonWebTokenError') {
            return next(new ApiError(401, "Invalid access token."))
        }
        return next(new ApiError(401, "Token verification failed."))
    }
})