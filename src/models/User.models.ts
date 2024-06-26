import mongoose, { Schema, model, Document } from 'mongoose';

export interface Message extends Document {
    content: string;
    createdAt: Date;
}

//Message Schema follows a schema of type Message
const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now()
    }
});

export interface User extends Document {
    username: string;
    email: string;
    password: string | undefined;
    verifyCode: string | undefined;
    verifyCodeExpiry: Date | undefined;
    isVerified: boolean
    isAcceptingMessage: boolean;
    messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        unique: false
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/, "please use a valid email address"]
    },
    password: {
        type: String || undefined,
        required: [true, "password is required"]
    },
    verifyCode: {
        type: String || undefined,
        required: [true, "Verification code is required"]
    },
    verifyCodeExpiry: {
        type: Date || undefined,
        required: [true, "Verification code expiry is required"]
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true,
    },
    messages: {
        type: [MessageSchema]
    }
});

const User = (mongoose.models.users as mongoose.Model<User>) || model<User>('users', UserSchema);

export default User;
