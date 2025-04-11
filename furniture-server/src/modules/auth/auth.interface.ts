export interface ITokens {
    access_token: string;
    refresh_token: string;
}

export interface IUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    isActive: boolean;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUserRegister {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}