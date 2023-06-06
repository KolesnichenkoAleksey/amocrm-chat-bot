import { Response, NextFunction } from 'express';
import { StatusCodes } from '../consts/statusCodes';
import { ApiError } from '../error/ApiError';
import { getUserLogger, mainLogger } from '../components/logger/logger';
import mongoManager from '../components/mongo/MongoManager';
import { UserInterface } from '../@types/models/UserInterface';
import { customRequest } from '../API/basicMethodsAPI';
import {
    TypedRequestDeleteWidget,
    TypedRequestInstallWidget,
    TypedRequestStatus
} from '../@types/express-custom/RequestWidget';
import ClientApi from '../API/amoAPI';
import amoChatAPI from '../API/amoChatAPI';

class WidgetController {
    async installWidget(req: TypedRequestInstallWidget, res: Response, next: NextFunction) {
        try {
            const authCode = req.query.code || undefined;
            const subDomain = req.query.referer.split('.')[0] || undefined;
            const clientId = req.query.client_id;

            if (!authCode || !subDomain || !clientId) {
                mainLogger.debug('Не были переданы authCode или subDomain');
                return next(ApiError.badRequest('Не были переданы authCode или subDomain'));
            }

            const userLogger = getUserLogger(subDomain);

            const api = new ClientApi({ subDomain, authCode });
            await api
                .getAccessToken()
                .then(() => {
                    userLogger.debug(
                        `Authorization when installing widget for ${subDomain} was successful`
                    );
                })
                .catch((error) => {
                        userLogger.debug(
                            'Authorization error when installing widget',
                            subDomain,
                            error
                        );
                        next(ApiError.internal(error));
                    }
                );

            return res.status(StatusCodes.Ok.Code).json({ message: 'Установка виджета прошла успешно!' });

        } catch (error: unknown) {

            if (error instanceof Error) {
                mainLogger.debug(error.message);
                next(ApiError.internal(error.message));
            }

            if (typeof error === 'string') {
                mainLogger.debug(error);
                next(ApiError.internal(error));
            }

        }
    }

    async deleteWidget(req: TypedRequestDeleteWidget, res: Response, next: NextFunction) {
        try {
            const accountId = Number(req.query.account_id) || undefined;

            if (!accountId) {
                mainLogger.debug('Не был передан account_id!');
                return next(ApiError.badRequest('Не был передан account_id!'));
            }

            const existAppUser: UserInterface | null = await mongoManager.getWidgetUserByAccountId(accountId);

            if (!existAppUser) {
                mainLogger.debug('Пользователя с таким account_id не существует!');
                return next(ApiError.notFound('Пользователя с таким account_id не существует!'));
            }

            const userLogger = getUserLogger(existAppUser.widgetUserSubdomain);

            const updatedAppUser: UserInterface = {
                ...existAppUser,
                amojoId: '',
                amojoScopeId: '',
                access_token: '',
                refresh_token: '',
                installed: false
            };

            await mongoManager.updateUser(updatedAppUser);

            await amoChatAPI.disconnect(existAppUser.amojoId);

            await customRequest(`https://vds2151841.my-ihor.ru/del`, { params: req.query }, 'Был успешно удалён аккаунт!', 'Возникли проблемы с редиректом!');

            userLogger.debug(`Виджет был успешно удалён!`);

            res.status(StatusCodes.Ok.Code).json({ message: 'Виджет был успешно удалён!' });

        } catch (error: unknown) {

            if (error instanceof Error) {
                mainLogger.debug(error.message);
                next(ApiError.internal(error.message));
            }

            if (typeof error === 'string') {
                mainLogger.debug(error);
                next(ApiError.internal(error));
            }

        }
    }

    async getUserStatus(req: TypedRequestStatus, res: Response, next: NextFunction) {
        try {
            const subdomain = req.query.subdomain || undefined;

            if (!subdomain) {
                mainLogger.debug('Не был передан subdomain!');
                return next(ApiError.badRequest('Не был передан SubDomain!'));
            }

            const userLogger = getUserLogger(subdomain);

            const existWidgetUser: UserInterface | null = await mongoManager.getWidgetUserBySubdomain(subdomain);

            if (!existWidgetUser) {
                return next(ApiError.notFound('Пользователя с таким SubDomain не существует!'));
            }

            const isSubscribe = new Date(existWidgetUser.finishUsingDate).getTime() - new Date(Date.now()).getTime();

            const payStatus = {
                response: 'paid',
                paid: existWidgetUser.paid,
                testPeriod: existWidgetUser.testPeriod,
                startUsingDate: existWidgetUser.startUsingDate,
                finishUsingDate: existWidgetUser.finishUsingDate
            };

            if (isSubscribe > 0) {

                if (existWidgetUser.testPeriod) {
                    return res.status(StatusCodes.Ok.Code).json({ ...payStatus, response: 'trial' });
                }

                await mongoManager.updateUser({ ...existWidgetUser, paid: true });
                userLogger.debug(`Статус оплаты изменён на "Оплачено"`);

                return res.status(StatusCodes.Ok.Code).json({ ...payStatus, response: 'paid' });
            }

            await mongoManager.updateUser({ ...existWidgetUser, testPeriod: false });
            userLogger.debug(`Отключён тестовый период!`);

            return res.status(StatusCodes.Ok.Code).json({ ...payStatus, response: 'notPaid' });

        } catch (error: unknown) {

            if (error instanceof Error) {
                mainLogger.debug(error.message);
                next(ApiError.internal(error.message));
            }

            if (typeof error === 'string') {
                mainLogger.debug(error);
                next(ApiError.internal(error));
            }

        }
    }
}

export default new WidgetController();