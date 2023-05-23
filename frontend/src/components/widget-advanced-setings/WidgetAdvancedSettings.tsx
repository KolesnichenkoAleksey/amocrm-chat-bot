import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import BotsTable from './bots-table';
import cl from './widgetAdvancedSettings.module.scss';
import BotCreate from './bot-create/BotCreate';
import axios from 'axios';
import { useFetching } from '../../hooks/useFetching';
import { setPipelines, setSubdomain } from '../../store/reducers/AmoConstantSlice';
import '../../index.css';
import classNameCheck from './../../helpers/classNameCheck';

interface Props {
	SUBDOMAIN: string 
}

const WidgetAdvancedSettings = ({SUBDOMAIN}: Props) => {
    const bots = useAppSelector(state => state.bots.bots);

    const dispatch = useAppDispatch();

	const [fetchPipelines, isFetchingPipelines, fetchingPipelinesErrors] = useFetching(async () => {
		const $api = axios.create({
			baseURL: `https://${SUBDOMAIN}.amocrm.ru/api`,
		})
		const response = await $api.get('/v4/leads/pipelines');
		const pipelines = response.data._embedded.pipelines		

		dispatch(setPipelines(pipelines))
	})

	useEffect(() => {
        dispatch(setSubdomain(SUBDOMAIN))
		fetchPipelines()
	}, [])

	if (isFetchingPipelines) return null

	if (fetchingPipelinesErrors) return (
		<h1>Errors: {fetchingPipelinesErrors}</h1>
	)

    return (
        <div className={cl.settings}>
            <div className={classNameCheck(cl.settings__block, cl.settings__block_table)}>
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
