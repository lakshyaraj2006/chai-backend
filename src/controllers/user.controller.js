import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { NODE_ENV, REFRESH_TOKEN_SECRET, ACCESS_TOKEN_SECRET } from "../constants.js";
import jwt from "jsonwebtoken";

const registerUser = asyncHandler(
    async (req, res) => {
        // get user details from frontend
        // validation - not empty
        // check if user already exists:username, email
        // check for images, check for avatar
        // upload them to cloudinary, avatar
        // create user object - create entry in db
        // remove password and refreshtoken field from response
        // check for user creation
        // return res

        const { fullName, email, username, password } = req.body;

        if (
            [fullName, email, username, password].some((field) => !field || field.trim() === "")
        ) {
            throw new ApiError(400, "All fields are required");
        }

        const existedUser = await User.findOne({
            $or: [{ username }, { email }]
        })

        if (existedUser) {
            throw new ApiError(409, "User with email or username already exists");
        }

        const user = new User({
            fullName,
            email,
            password,
            username: username.toLowerCase()
        })

        const avatarLocalPath = req.files?.avatar[0]?.path;

        if (!avatarLocalPath) {
            throw new ApiError(400, "Avatar file is required");
        }

        const avatar = await uploadOnCloudinary(avatarLocalPath, "avatars/", "avatar_" + user.username);

        if (!avatar) throw new ApiError(500, "Failed to upload avatar");
        user.avatar = avatar.secure_url;

        let coverImageLocalPath;
        let coverImage;

        if (req.files?.coverImage) {
            coverImageLocalPath = req.files?.coverImage[0]?.path;
            coverImage = await uploadOnCloudinary(coverImageLocalPath, "covers/", "cover_" + user.username);

            if (!coverImage) throw new ApiError(500, "Failed to upload cover image");

            user.coverImage = coverImage;
        }

        await user.save();

        const createdUser = await User.findById(user._id);

        if (!createdUser) {
            throw new ApiError(500, "Something went wrong while registering user");
        }

        delete createdUser['refreshToken'];

        return res.status(201).json(
            new ApiResponse(201, createdUser, "User registered successfully")
        )

    }
)

const loginUser = asyncHandler(
    async (req, res) => {
        // req body -> data
        // username or email
        // find the user
        // password check
        // access and refresh token
        // send cookies

        console.log(req.body);


        const { identifier, password } = req.body;

        if (!identifier || !password) throw new ApiError(400, "All fields are required");

        let user;

        const usernameRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z0-9]+$/;
        const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i;

        if (usernameRegex.test(identifier)) {
            user = await User.findOne({ username: identifier.toLowerCase() }).select("+password");
        } else if (emailRegex.test(identifier)) {
            user = await User.findOne({ email: identifier.toLowerCase() }).select("+password");
        }

        if (!user) {
            throw new ApiError(401, "Invalid credentials!");
        } else {
            const isCorrectPassword = await user.isPasswordCorrect(password);

            if (isCorrectPassword) {
                const accessToken = user.generateAccessToken();
                const refreshToken = user.generateRefreshToken();

                await user.updateOne({
                    $set: {
                        refreshToken
                    }
                });

                const options = {
                    httpOnly: true,
                    secure: NODE_ENV === "production",
                    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
                }

                const loggedInUser = await User.findById(user._id).select('-refreshToken');

                return res
                    .status(200)
                    .cookie('accesstoken', accessToken, {
                        ...options,
                        maxAge: 15 * 60 * 1000
                    })
                    .cookie('refreshtoken', refreshToken, {
                        ...options,
                        maxAge: 20 * 24 * 60 * 60 * 1000
                    })
                    .json(
                        new ApiResponse(
                            200,
                            {
                                user: loggedInUser,
                                accessToken,
                                refreshToken
                            },
                            "User loggedin successfully"
                        )
                    )
            } else {
                throw new ApiError(401, "Invalid credentials!")
            }
        }
    }
)

const logoutUser = asyncHandler(
    async (req, res) => {
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $unset: {
                    refreshToken: 1
                }
            },
            {
                new: true
            }
        )

        return res
            .status(200)
            .clearCookie('accesstoken')
            .clearCookie('refreshtoken')
            .json(
                new ApiResponse(
                    200,
                    null,
                    "User logged out successfully"
                )
            )
    }
)

const refreshAccessToken = asyncHandler(
    async (req, res) => {
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

        if (!incomingRefreshToken) throw new ApiError(401, "Unauthorized request");

        try {
            const decodedToken = jwt.verify(incomingRefreshToken, REFRESH_TOKEN_SECRET);

            const user = await User.findById(decodedToken.id);

            if (!user) throw new ApiError(401, "Invalid refresh token");

            if (incomingRefreshToken !== user.refreshToken) {
                throw new ApiError(401, "Refresh token is expired or used");
            }

            const accessToken = user.generateAccessToken();
            const refreshToken = user.generateRefreshToken();

            await user.updateOne({
                $set: {
                    refreshToken
                }
            });

            const options = {
                httpOnly: true,
                secure: NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
            }

            return res
                .status(200)
                .cookie('accesstoken', accessToken, {
                    ...options,
                    maxAge: 15 * 60 * 1000
                })
                .cookie('refreshtoken', refreshToken, {
                    ...options,
                    maxAge: 20 * 24 * 60 * 60 * 1000
                })
                .json(
                    new ApiResponse(
                        200,
                        {
                            accessToken,
                            refreshToken
                        },
                        "Access token refreshed"
                    )
                )
        } catch (error) {
            throw new ApiError(401, error?.message || "Invalid refresh token")
        }
    }
)

export { registerUser, loginUser, logoutUser, refreshAccessToken };