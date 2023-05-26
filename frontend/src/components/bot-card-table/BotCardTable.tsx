import React from 'react'
import IBot from '../../types/Bot';
import cl from './botCardTable.module.scss';
import SelectPrime from '../UI/selects/select-prime';
import IPipeline from '../../types/Pipeline';
import { useAppDispatch, useAppSelector } from '../../hooks/useStore';
import { editBotPipeline, unlinkLead } from '../../store/bots/BotSlice';
import CheckboxPrime from '../UI/checkboxes/checkbox-prime';
import ButtonPrime from '../UI/buttons/button-prime/index';
import classNames from 'classnames';
import { getSubdomain, getPipelines } from '../../store/amo-constants/AmoConstantSelector';

interface Props {
    bot: IBot,
    selectBot: (id: number) => void,
    isSelected: boolean,
}

const BotCardTable = ({bot, selectBot, isSelected}: Props): JSX.Element => {
    const dispatch = useAppDispatch();

    const pipelines: IPipeline[] = useAppSelector(getPipelines);
    const subdomain = useAppSelector(getSubdomain);

    const changeOption = (value: number) => {
        const newPipeline = pipelines.find(pipe => pipe.id === value);
        if (newPipeline) {
            dispatch(editBotPipeline({botId: bot._id, pipeline: newPipeline}));
        }
    }

    const handleUnlinkLead = (botId: number, tgGroupId: number, leadId: number) => {
        dispatch(unlinkLead({botId, tgGroupId, leadId}));
    }

    return (
        <>
            <tr className={cl['bot-card']}>
                <td className={classNames(cl['bot-card__cell'], cl['bot-card__cell_checkbox'])}>
                    <CheckboxPrime
                        name='bots-checkbox'
                        clName={cl['bot-card__checkbox']}
                        value={bot._id}
                        onChange={selectBot}
                        isActive={isSelected}
                    />
                </td>
                <td className={classNames(cl['bot-card__cell'])}>
                    {bot.name}
                </td>
                <td className={classNames(cl['bot-card__cell'])}>{bot.apiKey}</td>
                <td className={classNames(cl['bot-card__cell'], cl['bot-card__select'])}>
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
                    <th colSpan={2} className={classNames(cl['bot-card__cell'], cl['bot-card__cell_header'])}>Название Telegram группы</th>
                    <th colSpan={2} className={classNames(cl['bot-card__cell'], cl['bot-card__cell_header'])}>Название Сделки</th>
                </tr>
                : null
            }
            {
                bot.relatedTgGroups.map( (group) => 
                    <tr className={classNames(cl['bot-card'])} key={group.id}>
                        <td colSpan={2} className={classNames(cl['bot-card__cell'])}>{group.name}</td>
                        <td colSpan={2} className={classNames(cl['bot-card__cell'], cl['bot-card__leads'])}>
                            {
                                group.leads.map( lead => 
                                    <div 
                                        key={lead.id}
                                        className={cl.lead}
                                    >
                                        <a href={`https://${subdomain}.amocrm.ru/leads/detail/${lead.id}`}>{lead.name}</a>
                                        <ButtonPrime
                                            style='base'
                                            onClick={() => handleUnlinkLead(bot._id, group.id, lead.id,)}
                                        >
                                            Отвязать
                                        </ButtonPrime>
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