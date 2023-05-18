import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from '../consts/statusCodes';
import { ApiError } from '../error/ApiError';
import { mainLogger } from '../components/logger/logger';

class WidgetController {
    async installWidget(req: Request, res: Response, next: NextFunction) {
        try {
            // const authCode = String(req.query.code);
            // const subDomain = String(req.query.referer).split('.')[0];
            //
            // if (!authCode || !subDomain) {
            //     mainLogger.debug('Не были переданы authCode или subDomain');
            //     return next(ApiError.badRequest('Не были переданы authCode или subDomain'));
            // }
            //
            // const userLogger = getUserLogger(subDomain);
            // const userApi = new Api(subDomain, authCode);
            //
            // await userApi
            //     .getAccessToken()
            //     .then(() => {
            //         userLogger.debug(`Авторизация ${subDomain} прошла успешно`);
            //     })
            //     .catch((err) => {
            //         userLogger.debug(`Произошла ошибка авторизации ${subDomain}`, err);
            //     });
            //
            // const existAppUser: ILogin | null = await mongoManager.getWidgetUserBySubdomain(subDomain);
            //
            // if (!existAppUser) {
            //
            //     const appUserAccountData = await userApi.getAccountData();
            //
            //     if (!appUserAccountData) {
            //         userLogger.debug('Неверный логин или пароль!');
            //         return next(ApiError.unauthorized('Неверный логин или пароль!'));
            //     }
            //
            //     const newAppUser: ILogin = {
            //         widgetUserSubdomain: subDomain,
            //         accountId: appUserAccountData.id,
            //         authCode: authCode,
            //         paid: false,
            //         installed: true,
            //         testPeriod: true,
            //         startUsingDate: moment().format('DD.MM.YYYY'),
            //         finishUsingDate: moment().add(15, 'days').format('DD.MM.YYYY')
            //     };
            //
            //     await mongoManager.insertUser(newAppUser);
            //
            // } else {
            //
            //     const updatedAppUser: ILogin = {
            //         ...existAppUser,
            //         authCode: authCode,
            //         installed: true
            //     };
            //
            //     await mongoManager.updateUser(updatedAppUser);
            //
            // }
            //
            // userLogger.debug(`Виджет был успешно установлен!`);
            //
            // return res.status(StatusCodes.Ok.Code).json({ message: 'Установка виджета прошла успешно!' });

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

    async deleteWidget(req: Request, res: Response, next: NextFunction) {
        try {

            // const accountId = Number(req.query.account_id);
            //
            // if (!accountId) {
            //     mainLogger.debug('Не был передан account_id!');
            //     return next(ApiError.badRequest('Не был передан account_id!'));
            // }
            //
            // const existAppUser: ILogin | null = await mongoManager.getWidgetUserByAccountId(accountId);
            //
            // if (!existAppUser) {
            //     mainLogger.debug('Пользователя с таким account_id не существует!');
            //     return next(ApiError.notFound('Пользователя с таким account_id не существует!'));
            // }
            //
            // const userLogger = getUserLogger(existAppUser.widgetUserSubdomain);
            //
            // const AMO_TOKEN_PATH = path.resolve(__dirname, '..', 'authclients', `${existAppUser.widgetUserSubdomain}_amo_token.json`);
            //
            // fs.unlinkSync(AMO_TOKEN_PATH);
            //
            // const updatedAppUser: ILogin = {
            //     ...existAppUser,
            //     installed: false
            // };
            //
            // await mongoManager.updateUser(updatedAppUser);
            //
            // await customRequest(`https://vds2151841.my-ihor.ru/del`, {params: req.query}, 'Был успешно удалён аккаунт!', 'Возникли проблемы с редиректом!');
            //
            // userLogger.debug(`Виджет был успешно удалён!`);
            //
            // res.status(StatusCodes.Ok.Code).json({ message: 'Виджет был успешно удалён!' });

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

    async getUserStatus(req: Request, res: Response, next: NextFunction) {
        try {

            // const subdomain = String(req.query.subdomain);
            //
            // if (!subdomain) {
            //     return next(ApiError.badRequest('Не был передан SubDomain!'));
            // }
            //
            // const userLogger = getUserLogger(subdomain);
            //
            // const existWidgetUser: ILogin | null = await mongoManager.getWidgetUserBySubdomain(subdomain);
            //
            // if (!existWidgetUser) {
            //     return next(ApiError.notFound('Пользователя с таким SubDomain не существует!'));
            // }
            //
            // const isSubscribe = new Date(existWidgetUser.finishUsingDate).getTime() - new Date(Date.now()).getTime();
            //
            // const payStatus = {
            //     response: 'paid',
            //     paid: existWidgetUser.paid,
            //     testPeriod: existWidgetUser.testPeriod,
            //     startUsingDate: existWidgetUser.startUsingDate,
            //     finishUsingDate: existWidgetUser.finishUsingDate
            // };
            //
            // if (isSubscribe > 0) {
            //
            //     if (existWidgetUser.testPeriod) {
            //         return res.status(StatusCodes.Ok.Code).json({ ...payStatus, response: 'trial' });
            //     }
            //
            //     await mongoManager.updateUser({ ...existWidgetUser, paid: true });
            //     userLogger.debug(`Статус оплаты изменён на "Оплачено"`);
            //     return res.status(StatusCodes.Ok.Code).json({ ...payStatus, response: 'paid' });
            // }
            //
            // await mongoManager.updateUser({ ...existWidgetUser, testPeriod: false });
            // userLogger.debug(`Отключён тестовый период!`);
            // return res.status(StatusCodes.Ok.Code).json({ ...payStatus, response: 'notPaid' });

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