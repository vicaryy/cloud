export interface ServerResponse<T> {
    status: number;
    message?: string;
    data?: T;
    error?: any;
}

export interface NewBagRequest {
    name: string,
    directory: string
}
