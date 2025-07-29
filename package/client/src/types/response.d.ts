export interface ResponseInterface<T = any> {
    data?: T | null;
    msg: string;
}