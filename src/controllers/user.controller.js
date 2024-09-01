import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
  // Destructure user details from the request body
  const { fullName, email, username, password } = req.body;

  // Validation: Check if any required field is missing or empty
  const isAnyFieldMissing = [fullName, email, username, password].some(
    (field) => !field || field.trim() === ""
  );

  // If any required field is missing, throw an error
  if (isAnyFieldMissing) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if a user already exists with the same username or email
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  // If a user already exists, throw a conflict error
  if (existedUser) {
    throw new ApiError(409, "User already exists");
  }

  // Get file paths for avatar and cover image from the request
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  // Validate presence of avatar; if not provided, throw an error
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  // Upload avatar to Cloudinary and get the upload result
  const avatar = await uploadOnCloudinary(avatarLocalPath);

  // Upload cover image to Cloudinary, if provided, and get the upload result
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  // If the avatar upload fails, throw an error
  if (!avatar) {
    throw new ApiError(400, "Avatar upload failed");
  }

  // Create a new user in the database with provided details and Cloudinary URLs
  const user = await User.create({
    fullName,
    email,
    username: username.toLowerCase(), // Convert username to lowercase for consistency
    password,
    avatar: avatar.url, // URL from Cloudinary upload
    coverImage: coverImage?.url || "", // URL from Cloudinary upload or empty string if not provided
  });

  // Retrieve the newly created user without sensitive fields like password and refreshToken
  const createdUser = await User.findById(user?._id).select(
    "-password -refreshToken"
  );

  // If user creation fails, throw a server error
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while creating the user");
  }

  // Send a successful response with the newly created user details
  res.status(201).json(
    new ApiResponse(201, createdUser, "User Created Successfully")
  );
});

export { registerUser };
