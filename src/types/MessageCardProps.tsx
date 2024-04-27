import { Message } from "@/models/User.models";
export interface MessageCardProps {
    message: Message;
    onMessageDelete: (messageId: string) => void;
}