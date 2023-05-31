import React, { useState } from 'react'
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
import copyToClipboard from './../../utils/copyToClipboard';
import CopyBlock from './../UI/copy-block/CopyBlock';

interface Props {
    bot: IBot,
    selectBot: (token: string) => void,
    isSelected: boolean,
}

const BotCardTable = ({bot, selectBot, isSelected}: Props): JSX.Element => {
    const dispatch = useAppDispatch();
    const pipelines: IPipeline[] = useAppSelector(getPipelines);
    const subdomain = useAppSelector(getSubdomain);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    const changeOption = (value: number) => {
        const newPipeline = pipelines.find(pipe => pipe.id === value);
        if (newPipeline) {
            dispatch(editBotPipeline({botId: bot._id, pipeline: newPipeline}));
        }
    }

    const handleUnlinkLead = (botId: string, tgGroupId: number, leadId: number) => {
        dispatch(unlinkLead({botId, tgGroupId, leadId}));
    }


    return (
        <>
            <tr className={classNames(cl['reon-amocrm-tg-chat-bot-bot-card'], {[cl._active]: isSelected})}>
                <td className={classNames(cl['reon-amocrm-tg-chat-bot-bot-card__cell'], cl['reon-amocrm-tg-chat-bot-bot-card__cell_checkbox'])}>
                    <CheckboxPrime
                        name='bots-checkbox'
                        clName={cl['reon-amocrm-tg-chat-bot-bot-card__checkbox']}
                        value={bot.botToken}
                        onChange={selectBot}
                        isActive={isSelected}
                    />
                </td>
                <td 
                    className={classNames(cl['reon-amocrm-tg-chat-bot-bot-card__cell'], cl['reon-amocrm-tg-chat-bot-bot-card__cell_bot-name'], cl['reon-amocrm-tg-chat-bot-bot-card__cell_dropdown'])} 
                    title={bot.botName}
                    onClick={() => setIsDropdownOpen(prev => !prev)}
                >
                    <div className={classNames(cl['reon-amocrm-tg-chat-bot-bot-card__dropdown'], cl['reon-amocrm-tg-chat-bot-dropdown'], {[cl._active]: isDropdownOpen})}>
                        <span className={cl['reon-amocrm-tg-chat-bot-dropdown__title']}>{bot.botName}</span>
                        {
                            bot.relatedTgGroups.length ? 
                            <svg 
                                className={cl['reon-amocrm-tg-chat-bot-dropdown__arrow']}
                                width="16px" 
                                height="16px" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M4.29289 8.29289C4.68342 7.90237 5.31658 7.90237 5.70711 8.29289L12 14.5858L18.2929 8.29289C18.6834 7.90237 19.3166 7.90237 19.7071 8.29289C20.0976 8.68342 20.0976 9.31658 19.7071 9.70711L12.7071 16.7071C12.3166 17.0976 11.6834 17.0976 11.2929 16.7071L4.29289 9.70711C3.90237 9.31658 3.90237 8.68342 4.29289 8.29289Z" fill="currentColor"/>
                            </svg>
                            : null
                        }
                    </div>
                </td>
                <td 
                    className={classNames(cl['reon-amocrm-tg-chat-bot-bot-card__cell'], cl['reon-amocrm-tg-chat-bot-bot-card__cell_copy'])} 
                    title={bot.botToken}
                >
                    <CopyBlock 
                        clName={cl['reon-amocrm-tg-chat-bot-bot-card__copy']}
                        visibility='hover'
                    >
                        {bot.botToken}
                    </CopyBlock>
                </td>
                <td className={classNames(cl['reon-amocrm-tg-chat-bot-bot-card__cell'], cl['reon-amocrm-tg-chat-bot-bot-card__select'])}>
                    <SelectPrime
                        clName={cl['reon-amocrm-tg-chat-bot-bot-card__pipelines']}
                        onChange={changeOption}
                        options={pipelines}
                        name={`reon-amocrm-tg-chat-bot-bot-pipeline-select-${bot._id}`}
                        selected={'нужен объект воронки с бэка'} 
                        withArrow={false}   
                    />
                </td>
            </tr>
            {   
                isDropdownOpen && bot.relatedTgGroups.length ?
                <tr className={classNames(cl['reon-amocrm-tg-chat-bot-bot-card'], {[cl._active]: isSelected})}>
                    <th colSpan={2} className={classNames(cl['reon-amocrm-tg-chat-bot-bot-card__cell'], cl['reon-amocrm-tg-chat-bot-bot-card__cell_header'])}>Название Telegram группы</th>
                    <th colSpan={2} className={classNames(cl['reon-amocrm-tg-chat-bot-bot-card__cell'], cl['reon-amocrm-tg-chat-bot-bot-card__cell_header'])}>Название Сделки</th>
                </tr>
                : null
            }
            {
                isDropdownOpen && bot.relatedTgGroups.map( (group) => 
                    <tr 
                        className={classNames(cl['reon-amocrm-tg-chat-bot-bot-card'], {[cl._active]: isSelected})} 
                        key={group.id} 
                        title={group.name}
                        onClick={() => copyToClipboard(group.name)}
                    >
                        <td colSpan={2} className={classNames(cl['reon-amocrm-tg-chat-bot-bot-card__cell'])}>{group.name}</td>
                        <td colSpan={2} className={classNames(cl['reon-amocrm-tg-chat-bot-bot-card__cell'], cl['reon-amocrm-tg-chat-bot-bot-card__leads'])}>
                            {
                                group.leads.map( lead => 
                                    <div 
                                        key={lead.id}
                                        className={cl['reon-amocrm-tg-chat-bot-bot-card__lead']}
                                        title={lead.name}
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
