import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import jwt from 'jsonwebtoken'

export const generateAccessAndRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false})
        return { accessToken, refreshToken}

    } catch (error) {
        return next(new ApiError(500, "Error generating tokens."))
    }
}

export const refreshAccessToken = asyncHandler( async(req, res, next) => {
    const incomingrefreshToken = req.cookies?.refreshToken;

    if(!incomingrefreshToken){
        return next(new ApiError(401, "Refresh token not found."))
    }

    const decodedData = await jwt.verify(incomingrefreshToken, process.env.REFRESH_TOKEN_SECRET)

    if(!decodedData){
        return next(new ApiError(403, "Refresh token invalid."))
    }

    const user = await User.findById(decodedData._id)

    if(!user){
        return next(new ApiError(400, "User not found."))
    }

    if(user.refreshToken !== incomingrefreshToken){
        return next(new ApiError(403, "Refresh token not found."))
    }

    const newAccessToken = await jwt.sign({
        _id: user._id,
        email: user.email
    }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: process.env.ACCESS_TOKEN_EXPIRY})

    const newRefreshToken = await jwt.sign({
        _id: user._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    })

    user.refreshToken = newRefreshToken
    await user.save()

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None"
    }

    return res.status(201)
    .cookie("refreshToken", newRefreshToken, {...options, maxAge:24 * 60 * 60 * 1000})
    .json(
        new ApiResponse(
            201,
            {
                user,
                accessToken: newAccessToken
            },
            "Access token refreshed"
        )
    )
})

export const handleRegister = asyncHandler( async(req, res, next) => {
    // Take details from user
    const { fullName, username, email, password } = req.body;

    // Validate the details
    if(!fullName || !username || !email || !password){
        return next(new ApiError(400, "All fields required."))
    }

    // Check if user already exists
    const existingUser = await User.findOne({
        $or: [{email}, {username}]
    })
    if(existingUser){
        return next(new ApiError(400, "User with this email or username already exists."))
    }

    // If not, Create a user
    const user = await User.create({
        fullName: fullName,
        username: username,
        email: email,
        password: password
    })

    // If user can't be created
    if(!user){
        return next(new ApiError(500, "Couldn't create user. Please try again."))
    }

    // Remove password and refresh token
    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    // Send response to frontend
    return res.status(201).json(
        new ApiResponse(201,
            createdUser,
            "User created successfully."
        )
    )
} ) 

export const handleLogin = asyncHandler( async(req, res, next) => {
    // Data from req.body
    const { email, password } = req.body;
    if(!email || !password){
        return next(new ApiError(400, "All fields are required."))
    }
    // Check if user exists
    const existingUser = await User.findOne({email})
    if(!existingUser){
        return next(new ApiError(400, "User doesn't exist. Sign up first."))
    }
    // Verify password
    const isPasswordCorrect = await existingUser.isPasswordCorrect(password);
    if(!isPasswordCorrect){
        return next(new ApiError(400, "Wrong credentials."))
    }
    // Generate access and refresh and access token
    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(existingUser._id)

    const user = await User.findById(existingUser._id).select("-password -refreshToken")

    // send response
    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(200)
    .cookie("refreshToken", refreshToken, {...options, maxAge: 7 * 24 * 60 * 60 * 1000} )
    .json(
        new ApiResponse(
            200,
            {
                user: user, accessToken,
            },
            "Logged in successfully"
        )
    )
} )

export const handleLogout = asyncHandler( async(req, res, next) => {

    await User.findByIdAndUpdate(req.user._id, 
        {
            $unset: {
                refreshToken: ""
            }
        }
    )

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None"
    }


    return res.status(200).clearCookie("refreshToken", {...options, maxAge: 7 * 24 * 60 * 60 * 1000}).json(
        new ApiResponse(
            200,
            "Logged out successfully."
        )
    )
} )

export const getAllUsers = asyncHandler( async(req, res , next) => {
    const allUsers = await User.find({})

    return res.status(201).json(
        new ApiResponse(
            201,
            allUsers,
            "Users fetched successfully."
        )
    )
} )