import dbConnection from "@/lib/dbConnection";
import userModel from "@/model/User";
import { sendVerificationEmail } from "@/utils/sendVerificationEmail";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await dbConnection();
  try {
    const { email, password, username } = await request.json();

    const existingUserVerifiedByUsername = await userModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username already exists",
        },
        {
          status: 400,
        }
      );
    }

    const existingUserVerifiedByEmail = await userModel.findOne({ email });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString(); //generate a random 6 digit number

    if (existingUserVerifiedByEmail) {
      if (existingUserVerifiedByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "Email already exists",
          },
          {
            status: 400,
          }
        );
      } else {
        const hasedPassword = await bcrypt.hash(password, 10); //hash the password

        existingUserVerifiedByEmail.password = hasedPassword;
        existingUserVerifiedByEmail.verifyCode = verifyCode;
        existingUserVerifiedByEmail.isVerified = false;
        existingUserVerifiedByEmail.verifyCodeExpiry = new Date(
          Date.now() + 3600000
        ); //set expiry date to 1 hour from now

        await existingUserVerifiedByEmail.save();
      }
    } else {
      const salt = await bcrypt.genSalt(10); //generate salt (10 rounds)
      const hashedPassword = await bcrypt.hash(password, salt); //hash the password

      const expiryDate = new Date(); //expiry date for the verification token
      expiryDate.setHours(expiryDate.getHours() + 1); //set expiry date to 1 hour from now

      const newUser = new userModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessages: true,
        messages: [],
        verificationTokenExpiry: expiryDate,
      });

      await newUser.save();
    }

    //send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      verifyCode,
      username
    );

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse,
        },
        {
          status: 500,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully . Please verify your email",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error registering users", error);

    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      {
        status: 500,
      }
    );
  }
}
