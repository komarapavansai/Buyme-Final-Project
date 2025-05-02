import { Service, Inject, Container } from 'typedi';
import { AuthDto, UserCreateDto } from '../interfaces/IUser';
import HelperService from '../utils/helpers';
import { decode } from 'jwt-simple';
import config from '../config';
import { User } from '../models/user';
import { Session } from '../models/session';

@Service()
export default class AuthService {
    private helperService: HelperService;
    constructor(@Inject('logger') private logger) {
        this.helperService = Container.get(HelperService);
    }

    public buildLoggedInAuthDto(req: any): AuthDto {
        const dto = {
            token: req.claims.token
        } as AuthDto;
        return dto;
    }

    public buildAuthDto(req: any, isLogout: boolean): AuthDto {
        const dto = {
            password: req.body.password ? HelperService.base64EncodeString(req.body.password) : undefined,
            email: req.body.email,
            token: req.body.token // Middleware throws error while decrypting, hence passed through body
        } as AuthDto;

        return dto;
    }

    public async loginWithToken(dto: AuthDto) {
        const session = await this.getSessionWithToken(dto.token);
        let data;
        if (session) {
            data = "User is logged in!";
        } else {
            throw new Error("Session token not found or expired!");
        }

        return { data };
    }

    public async loginWithEmailAndPassword(dto: AuthDto) {
        const userData = await this.getUserWithEmailAndPassword(dto);
        const existingSessionToken = await this.getExistingUserSession(userData);

        let token = undefined;
        if (existingSessionToken) {
            token = existingSessionToken;
            this.logger.info('Existing session token found ....');
        } else {
            this.logger.info('Generating new session token ....');
            const payload = this.helperService.generateJwtForPayload(userData);
            const newToken = await this.createSessionWithUserData({ ...userData, token: payload } as UserCreateDto);
            token = newToken.token;
        }

        return token;
    }


    public async logout(token: string) {
        try {
            const deletedSession = await Session.destroy({ where: { token } })
            if (deletedSession == 0) {
                throw new Error("Logout Failed - Token not found! User likely logged out already!");
            }

            this.logger.info('LOG OUT IS SUCCESSFUL!');
            return { "data": "Logout successful!" };
        } catch (error) {
            throw error;
        }
    }

    private async getSessionWithToken(token: string) {
        const existing = await Session.findOne({ where: { token } });
        if (existing.dataValues.length == 0) {
            this.logger.info('Token not found!');
            return null;
        }

        return existing.dataValues;
    }

    private async getExistingUserSession(dto: UserCreateDto) {
        const existing = await Session.findOne({
            where: { email: dto.email, user_id: dto.user_id }
        });

        if(!existing) return null;

        let token = existing.dataValues.token;
        try {
            const isTokenExpired = decode(token, config.jwtSecret);
            this.logger.info('Existing session is UNEXPIRED. Returning....');
            // Checks if token is expired or not
        } catch (error) {
            this.logger.error('Existing session token EXPIRED!! Deleting from database!');
            await this.logout(token);
            token = null;
        }

        return token;
    }

    private async getUserWithEmailAndPassword(dto: AuthDto) {
        const user = await User.findOne({ where: { email: dto.email, password: dto.password } });
        if (!user) throw new Error("Email / Password combination incorrect!");

        return user.dataValues as UserCreateDto;
    }

    private async createSessionWithUserData(dto: UserCreateDto) {
        try {
            const sessionToken = await Session.create({ ...dto, is_signed_in: true });
            return sessionToken.dataValues;
        } catch (error) {
            throw new Error('Could not login! Check existing session and logout before use!');
        }
    }
}