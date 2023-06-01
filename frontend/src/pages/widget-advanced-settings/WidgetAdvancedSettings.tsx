import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useStore';
import BotsTable from '../../components/bots-table';
import cl from './widgetAdvancedSettings.module.scss';
import BotCreate from '../../components/bot-create/BotCreate';
import { setAccountId, setSubdomain } from '../../store/amo-constants/AmoConstantSlice';
import classNames from 'classnames';
import { getBots, getIsBotsLoading } from '../../store/bots/BotSelector';
import AmoServices from '../../api/services/amo';
import TelegramBotServices from './../../api/services/telegram-bot/index';

interface Props {
	subdomain: string,
    accountId: number,
}

const WidgetAdvancedSettings = ({subdomain, accountId}: Props): JSX.Element => {
    const bots = useAppSelector(getBots);
    const dispatch = useAppDispatch();
    const {isGettingBots} = useAppSelector(getIsBotsLoading);

	useEffect(() => {
        dispatch(AmoServices.getPipelines(subdomain));
        dispatch(setSubdomain(subdomain));
        dispatch(setAccountId(accountId));
        // dispatch(TelegramBotServices.getBots({subdomain}))
	}, [])

    return (
        <div className={cl['reon-amocrm-tg-chat-bot-settings']}>
            <div className={classNames(cl['reon-amocrm-tg-chat-bot-settings__block'], cl['reon-amocrm-tg-chat-bot-settings__block_table'])}>
                <h2 className={cl['reon-amocrm-tg-chat-bot-block__title']}>Таблица ботов</h2>
                {
                    isGettingBots 
                    ? <div className={cl['reon-amocrm-tg-chat-bot-loading-table']}></div>
                    : <BotsTable bots={bots} />
                }                
            </div>
            <div className={cl['reon-amocrm-tg-chat-bot-settings__block']}>
                <h2 className={cl['reon-amocrm-tg-chat-bot-block__title']}>Добавить бота</h2>
                <BotCreate/>
            </div>
        </div>
    );
}

export default WidgetAdvancedSettings;
