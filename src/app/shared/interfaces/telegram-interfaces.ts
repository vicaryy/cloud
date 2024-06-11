export interface TelegramResponse<T> {
    ok: boolean;
    result: T;
}

export interface Update {
    update_id: number;
    message: Message;
}

export interface Message {
    message_id: number;
    from: User;
    text: string;
    document: Document;
}

export interface User {
    id: number;
    is_bot: boolean;
    first_name: string;
}

export interface SendMessage {
    chat_id: string;
    text: string;
}

export interface SendDocument {
    chat_id: string;
    document: InputFile;
}

export interface InputFile {
    file: File;
}

export interface Document {
    file_id: string;
}
