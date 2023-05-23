import React, { useState } from 'react'
import IBot from '../../../types/Bot';
import cl from './botCardTable.module.scss';
import SelectPrime from '../../UI/selects/select-prime';
import IPipeline from './../../../types/Pipeline';
import { useAppDispatch, useAppSelector } from './../../../app/hooks';
import { editBotPipeline } from './../../../store/reducers/BotSlice';
import classNameCheck from './../../../helpers/classNameCheck';
import CheckboxPrime from '../../UI/checkboxes/checkbox-prime';

interface Props {
    bot: IBot,
    selectBot: (id: number) => void,
    isSelected: boolean,
}

const BotCardTable = ({bot, selectBot, isSelected}: Props) => {
    const dispatch = useAppDispatch()

    const pipelines: IPipeline[] = useAppSelector(state => state.amoConstants.PIPELINES)
    const SUBDOMAIN = useAppSelector(state => state.amoConstants.SUBDOMAIN)

    const changeOption = (value: number) => {
        const newPipeline = pipelines.find(pipe => pipe.id === value)
        if (newPipeline) {
            dispatch(editBotPipeline({botId: bot._id, pipeline: newPipeline}))
        }
    }

    return (
        <>
            <tr className={cl['bot-card']}>
                <td className={classNameCheck(cl['bot-card__cell'], cl['bot-card__cell_checkbox'])}>
                    <CheckboxPrime
                        name='bots-checkbox'
                        clName={cl['bot-card__checkbox']}
                        value={bot._id}
                        onChange={selectBot}
                        isActive={isSelected}
                    />
                </td>
                <td className={classNameCheck(cl['bot-card__cell'])}>
                    {bot.name}
                </td>
                <td className={classNameCheck(cl['bot-card__cell'])}>{bot.apiKey}</td>
                <td className={classNameCheck(cl['bot-card__cell'], cl['bot-card__select'])}>
                    <SelectPrime
                        clName={cl['bot-card__pipelines']}
                        onChange={changeOption}
                        options={pipelines}
                        name={`bot-pipeline-select-${bot._id}`}
                        selected={bot.pipeline.name}
                    />
                </td>
            </tr>
            {   
                bot.relatedTgGroups.length ?
                <tr className={cl['bot-card']}>
                    <th colSpan={2} className={classNameCheck(cl['bot-card__cell'], cl['bot-card__cell_header'])}>Название Telegram группы</th>
                    <th colSpan={2} className={classNameCheck(cl['bot-card__cell'], cl['bot-card__cell_header'])}>Название Сделки</th>
                </tr>
                : null
            }
            {
                bot.relatedTgGroups.map( (group) => 
                    <tr className={classNameCheck(cl['bot-card'])}>
                        <td colSpan={2} className={classNameCheck(cl['bot-card__cell'])}>{group.name}</td>
                        <td colSpan={2} className={classNameCheck(cl['bot-card__cell'], cl['bot-card__leads'])}>
                            {
                                group.leads.map( lead => 
                                    <div 
                                        key={lead.id}
                                        className={cl.lead}
                                    >
                                        <a href={`https://${SUBDOMAIN}.amocrm.ru/leads/detail/${lead.id}`}>{lead.name}</a>
                                    </div>
                                )
                            }
                        </td>
                    </tr>                 
                )
            }
        </>
    )
}

export default BotCardTable
