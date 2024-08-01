import dbConnection from "@/lib/dbConnection";
import userModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(request: Request) {
  await dbConnection();

  const { username, content } = await request.json();//get username and content from request body

  try {
    const user = await userModel.findOne({ username });

    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    //is user accepting messages
    if (!user.isAcceptingMessages) {
      return Response.json(
        { success: false, message: "User is not accepting messages" },
        { status: 403 }
      );
    }

    const newMessgae = { content, createdAt: new Date() };//create new message
    user.messages.push(newMessgae as Message); //add message to user messages

    await user.save();

    return Response.json(
      { success: true, message: "Message sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("An unexpected error accure :", error);
    return Response.json(
      { success: false, message: "Error sending message" },
      { status: 500 }
    );
  }
}
