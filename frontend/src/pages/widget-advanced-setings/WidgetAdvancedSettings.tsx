import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useStore';
import BotsTable from '../../components/bots-table';
import cl from './widgetAdvancedSettings.module.scss';
import BotCreate from '../../components/bot-create/BotCreate';
import { setSubdomain } from '../../store/amo-constants/AmoConstantSlice';
import classNames from 'classnames';
import { getBots } from './../../store/bots/BotSelector';
import AmoServices from '../../api/services/amo';

interface Props {
	subdomain: string 
}

const WidgetAdvancedSettings = ({subdomain}: Props): JSX.Element => {
    const bots = useAppSelector(getBots);

    const dispatch = useAppDispatch();

	useEffect(() => {
        dispatch(AmoServices.getPipelines(subdomain));
        dispatch(setSubdomain(subdomain));
	}, [])

    return (
        <div className={cl.settings}>
            <div className={classNames(cl.settings__block, cl.settings__block_table)}>
                <h2 className={cl.block__title}>Таблица ботов</h2>
                <BotsTable
                    bots={bots}
                />
            </div>
            <div className={cl.settings__block}>
                <h2 className={cl.block__title}>Добавить бота</h2>
                <BotCreate/>
            </div>
        </div>
    );
}

export default WidgetAdvancedSettings;
