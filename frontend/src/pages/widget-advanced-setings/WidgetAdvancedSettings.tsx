import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useStore';
import BotsTable from '../../components/bots-table';
import cl from './widgetAdvancedSettings.module.scss';
import BotCreate from '../../components/bot-create/BotCreate';
import { setSubdomain } from '../../store/amo-constants/AmoConstantSlice';
import '../../index.css';
import classNames from 'classnames';
import { getBots } from './../../store/bots/BotSelector';
import AmoServices from '../../api/services/amo';

interface Props {
	SUBDOMAIN: string 
}

const WidgetAdvancedSettings = ({SUBDOMAIN}: Props): JSX.Element => {
    const bots = useAppSelector(getBots);

    const dispatch = useAppDispatch();

	useEffect(() => {
        dispatch(AmoServices.getPipelines(SUBDOMAIN));
        dispatch(setSubdomain(SUBDOMAIN));
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
