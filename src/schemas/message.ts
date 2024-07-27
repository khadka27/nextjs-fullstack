import {z} from "zod"

export const MessageSchema = z.object({
  message: z.string().min(10).max(300 , {message: "Message must be between 10 and 300 characters"}),
})