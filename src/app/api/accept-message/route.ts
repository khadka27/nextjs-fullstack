import dbConnection from "@/lib/dbConnection";
import userModel from "@/model/User";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(request: Request) {
  await dbConnection();

  const session = await getServerSession(authOptions);
  const user: User = session?.user;

  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "Not Authentication" },
      { status: 401 }
    );
  }

  const userId = user._id;

  const { acceptMessage } = await request.json();

  try {
    const updateUser = await userModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessage },
      { new: true }
    );

    if (!updateUser) {
      return Response.json(
        {
          success: false,
          message: "Failed to update user status to accept message ",
        },
        { status: 401 }
      );
    }
    return Response.json(
      { success: true, message: "Message accepted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("faild to accept message", error);

    return Response.json(
      { success: false, message: "Error accepting message" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  await dbConnection();

  const session = await getServerSession(authOptions);
  const user: User = session?.user;

  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "Not Authentication" },
      { status: 401 }
    );
  }

  const userId = user._id;

  try {
    const foundUser = await userModel.findById(userId);

    if (!foundUser) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User found",
        isAcceptingMessage: foundUser.isAcceptingMessages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("faild to get user", error);

    return Response.json(
      { success: false, message: "Error getting message accepting.......!!" },
      { status: 500 }
    );
  }
}
