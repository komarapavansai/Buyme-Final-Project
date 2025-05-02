import { Service, Inject, Container } from 'typedi';
import HelperService from '../utils/helpers';
import { AlertInputDto, AlertCrudDto } from '../interfaces/IAlert';
import { Alerts } from '../models/alert';
import NotificationService from './notificationService';

@Service()
export default class AlertService {
    private helperService: HelperService;
    private notificationService: NotificationService;

    constructor(@Inject('logger') private logger) {
        this.helperService = Container.get(HelperService);
        this.notificationService = Container.get(NotificationService);
    }

    public buildGetAlertoDto(req: any): AlertInputDto {
        const dto = new AlertInputDto();
        dto.alert_id = req.params.id;
        dto.user_id = req.claims.user_id;
        dto.item_category = req.body.hasOwnProperty('item_category') ? req.body.item_category : undefined;

        return dto;
    }

    public buildAlertCRUDdto(req: any, isUpdate: boolean): AlertCrudDto {
        const dto = new AlertCrudDto();
        dto.alert_id = req.params.id;
        dto.user_id = req.claims.user_id;
        dto.item_category = req.body.hasOwnProperty('item_category') ? req.body.item_category : undefined;
        dto.prize_lt = req.body.hasOwnProperty('prize_lt') ? +req.body.prize_lt : undefined;
        dto.prize_gt = req.body.hasOwnProperty('prize_gt') ? +req.body.prize_gt : undefined;

        if (isUpdate) {
            if (!dto.alert_id) throw new Error('Alert Id required to update!');
        }
        if (!dto.item_category) throw new Error('Field item_category is required!');
        if (!dto.prize_lt) throw new Error('Field prize_lt is required!');
        if (!dto.prize_gt) throw new Error('Field prize_gt is required!');

        return dto;
    }

    public async getAllAlertsForUser(dto: AlertInputDto): Promise<{ data: any }> {
        try {
            const alertList = await Alerts.findAll({
                where: { user_id: dto.user_id }
            });

            return { data: alertList };
        } catch (error) {
            throw error;
        }
    }

    public async deleteAlert(dto: AlertInputDto): Promise<{ data: any }> {
        try {
            const alert = await Alerts.findByPk(dto.alert_id);
            if(!alert) throw new Error(`Alert with id ${dto.alert_id} not found!`);

            if (alert.dataValues.user_id != dto.user_id) {
                throw new Error("You cannot delete other users's Alerts!");
            }

            const data = await Alerts.destroy({
                where: { alert_id: dto.alert_id },
            });

            return { data: "Deleted alert successfully!" };
        } catch (error) {
            throw error;
        }
    }


    public async createAlert(dto: AlertCrudDto): Promise<{ data: any }> {
        try {
            const alert = await Alerts.create({
                user_id: dto.user_id,
                item_category: dto.item_category,
                prize_lt: dto.prize_lt,
                prize_gt: dto.prize_gt,
            });

            return { data: alert };
        } catch (error) {
            throw error;
        }
    }

    public async updateAlert(dto: AlertCrudDto): Promise<{ data: any }> {
        try {
            const alert = await Alerts.findByPk(dto.alert_id);
            if (alert.dataValues.user_id != dto.user_id) {
                throw new Error("You cannot update other users's Alerts!");
            }

            const updatedAlert = await Alerts.update(
                { ...dto },
                {
                    where: { user_id: dto.user_id },
                    returning: true
                }
            );

            return { data: "Updated Alert Successfully!" };
        } catch (error) {
            console.error('Error creating alert:', error);
            throw error;
        }
    }
}