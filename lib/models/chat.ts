import { ObjectId } from "mongodb";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type Chat = {
  _id?: ObjectId;
  userId: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
};