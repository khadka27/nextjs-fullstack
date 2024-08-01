import dbConnection from "@/lib/dbConnection";
import userModel from "@/model/User";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

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

  const userId = new mongoose.Types.ObjectId(user._id); //get user id from session user object

  try {
    const user = await userModel.aggregate(
      //get user messages and sort them by date
      [
        { $match: { _id: userId } }, //match user id
        { $unwind: "$messages" }, //unwind messages array
        { $sort: { "messages.createdAt": -1 } }, //  sort messages by date -1 for descending order
        {
          $group: {
            //group messages by user id
            _id: "$_id",
            messages: { $push: "$messages" }, //push messages to messages array
          },
        },
      ]
    );

    if (!user || user.length === 0) {
      return Response.json(
        { success: false, message: "User not found 404!!!!" },
        { status: 401 }
      );
    }

    return Response.json(
      { success: true, messages: user[0].messages },
      { status: 200 }
    );
  } catch (error) {}
}
