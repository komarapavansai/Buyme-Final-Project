export class UserCreateDto {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone: number;
    countrycode: number;
    is_customer_repr: boolean = false;
    is_customer_reprPresent: boolean;
    is_admin: boolean = false;
    is_adminPresent: boolean;

    is_ivoker_cust_repr: boolean;
    is_ivoker_admin: boolean;
    sessionToken: any;
}

export class UserGetDto {
    max: number;
    page: number;
    search: string;
    user_id: number;
}

export class UserDeleteDto {
    user_id: number;
}

export class AuthDto {
    email: string;
    password: string;
    token: string;
}