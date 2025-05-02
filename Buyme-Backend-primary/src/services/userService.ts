import { Service, Inject, Container } from 'typedi';
import HelperService from '../utils/helpers';
import { User } from '../models/user';
import { UserCreateDto, UserDeleteDto, UserGetDto } from '../interfaces/IUser';
import { Op, Sequelize } from 'sequelize';

@Service()
export default class UserService {
    private helperService: HelperService;
    constructor() {
        this.helperService = Container.get(HelperService);
    }

    public buildGetUserDto(req: any): UserGetDto {
        const dto = new UserGetDto();
        dto.max = req.query.hasOwnProperty('max') ? req.query.max : 10;
        dto.page = req.query.hasOwnProperty('page') ? req.query.page : 0;
        dto.search = req.query.hasOwnProperty('search') ? req.query.search : '';
        dto.user_id = req.params.hasOwnProperty('id') ? req.params.id : undefined;

        return dto;
    }

    public buildCreateOrUpdateUserDto(req: any, isUpdate: boolean): UserCreateDto {
        const dto = new UserCreateDto();
        dto.user_id = req.params.hasOwnProperty('id') ? +req.params.id : undefined
        dto.first_name = req.body.hasOwnProperty('first_name') ? req.body.first_name : undefined;
        dto.last_name = req.body.hasOwnProperty('last_name') ? req.body.last_name : undefined;
        dto.email = req.body.hasOwnProperty('email') ? req.body.email : undefined;
        dto.password = req.body.hasOwnProperty('password') ? req.body.password : undefined;
        dto.phone = req.body.hasOwnProperty('phone') ? req.body.phone : undefined;
        dto.countrycode = req.body.hasOwnProperty('countrycode') ? req.body.countrycode : undefined;

        dto.is_adminPresent = req.body.hasOwnProperty('is_admin');
        dto.is_admin = dto.is_adminPresent ? req.body.is_admin.toString().toLowerCase() == 'true' : false;

        dto.is_customer_reprPresent = req.body.hasOwnProperty('is_customer_repr');
        dto.is_customer_repr = dto.is_customer_reprPresent ? req.body.is_customer_repr.toString().toLowerCase() == 'true' : false;

        dto.is_ivoker_cust_repr = req.claims.is_customer_repr;
        dto.is_ivoker_admin = req.claims.is_admin;

        this.validateUserCrudDto(dto, isUpdate);

        return dto;
    }


    public async getUserByIdOrList(dto: UserGetDto): Promise<{ data: any }> {
        let userData = null;

        if (dto.user_id) {
            userData = await User.findByPk(dto.user_id);
        } else {
            userData = await User.findAll({
                where: {
                    [Op.or]: [
                        Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('first_name')), {
                            [Op.like]: `%${dto.search.toLowerCase()}%`
                        }),
                        Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('last_name')), {
                            [Op.like]: `%${dto.search.toLowerCase()}%`
                        })
                    ]
                },
                limit: dto.max,
                offset: dto.page * dto.max
            });
        }

        return { data: userData };
    }

    public async createUser(dto: UserCreateDto): Promise<{ data: any }> {
        try {
            const user = await User.create({
                first_name: dto.first_name,
                last_name: dto.last_name,
                email: dto.email,
                password: dto.password,
                phone: dto.phone,
                countrycode: dto.countrycode,
                is_customer_repr: dto.is_customer_repr,
                is_admin: dto.is_admin,
            });

            return { data: user };
        } catch (error) {
            throw error;
        }
    }

    public async updateUser(dto: UserCreateDto): Promise<{ data: any }> {
        try {
            HelperService.verifyCustomerReprRole(dto.is_ivoker_cust_repr);

            const user = await User.findByPk(dto.user_id);
            if (user.dataValues.user_id != dto.user_id) {
                throw new Error("You cannot update other seller's Users!");
            }

            const updatedUser = await User.update(
                { ...dto },
                {
                    where: { user_id: dto.user_id },
                    returning: true
                }
            );

            return { data: updatedUser };
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    public async deleteUser(dto: UserCreateDto): Promise<any> {
        try {
            HelperService.verifyCustomerReprRole(dto.is_ivoker_cust_repr);

            const user = await User.findByPk(dto.user_id);
            if (user.dataValues.seller_id != dto.user_id) {
                throw new Error("You cannot delete other seller's Users!");
            }

            const result = await this.removeUser(dto.user_id);
            const data = { message: "User deleted successfully!" };

            return { data };
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    }

    private async removeUser(id: number) {
        try {
            const deletedCount = await User.destroy({
                where: { user_id: id },
            });

            if (deletedCount === 0) {
                throw new Error(`User with id ${id} not found`);
            }

            return { message: `User with id ${id} deleted successfully` };
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    }

    private validateUserCrudDto(dto: UserCreateDto, isUpdate: boolean) {
        if (dto.is_customer_reprPresent && dto.is_customer_repr) {
            HelperService.verifyCustomerReprRole(dto.is_ivoker_cust_repr);
        }

        if(dto.is_adminPresent && dto.is_admin) {
            HelperService.verifyAdminRole(dto.is_ivoker_admin);
        }

        if (!isUpdate) {
            if (!dto.first_name) throw new Error("First name required!");
            if (!dto.last_name) throw new Error("Last name required!");
            if (!dto.email) throw new Error("Email required!");
            if (!dto.password) throw new Error("Password required!");
            if (!dto.phone) throw new Error("Phone required!");
            if (!dto.countrycode) throw new Error("Country code required!");
        } else {
            if (!dto.user_id) throw new Error("User Id required!");
        }

        if (dto.password) {
            dto.password = this.helperService.validatedEncodedPassword(dto.password);
        }
    }
}