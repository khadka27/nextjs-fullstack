import { Message } from "@/model/User";
export interface ApiResponse {
  success: boolean;
  message: string;
  isAccesptingMassage?: boolean;
  messages?: Array<Message>;
}
