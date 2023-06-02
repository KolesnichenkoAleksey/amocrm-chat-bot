import React, { useEffect, useState } from 'react'
import { useAppSelector } from '../../hooks/useStore'
import IPipeline from '../../types/Pipeline'
import ButtonPrime from '../UI/buttons/button-prime'
import InputPrime from '../UI/inputs/input-prime'
import SelectPrime from '../UI/selects/select-prime'
import cl from './botCreate.module.scss'
import { getPipelines, getSubdomain } from './../../store/amo-constants/AmoConstantSelector';
import TelegramBotServices from './../../api/services/telegram-bot/index';
import { useAppDispatch } from './../../hooks/useStore';
import { getBotError, getIsBotsLoading } from './../../store/bots/BotSelector';
import classNames from 'classnames';
import Spinner from '../UI/spinner/Spinner'

const BotCreate = (): JSX.Element => {
    const pipelines: IPipeline[] = useAppSelector(getPipelines);
    const [selectedPipeline, setSelectedPipeline] = useState<IPipeline>(pipelines[0])
    const [botApiKey, setBotApiKey] = useState('');
    const subdomain = useAppSelector(getSubdomain);
    const dispatch = useAppDispatch();
    const {addingBotError} = useAppSelector(getBotError);
    const {isAddingBot} = useAppSelector(getIsBotsLoading);

    const changeOption = (value: number) => {
        const newPipeline = pipelines.find(pipe => pipe.id === value)
        if (newPipeline) {
            setSelectedPipeline(newPipeline);
        }
    }

    const handleCreateBot = async () => {
        setBotApiKey('');
        dispatch(TelegramBotServices.addBot({subdomain, pipelineId: selectedPipeline.id, botToken: botApiKey}));
    }

    useEffect(() => {
        if (pipelines) {
            const [mainPipeline] = pipelines.filter(pipe => pipe.is_main === true)
            setSelectedPipeline(mainPipeline)
        }        
    }, [pipelines])

    return (
        <div className={cl['reon-amocrm-tg-chat-bot-bot-create']}>
            <div className={cl['reon-amocrm-tg-chat-bot-bot-create__table']}>
                <div className={classNames(cl['reon-amocrm-tg-chat-bot-bot-create__input'], {[cl._error]: addingBotError})}>
                    <InputPrime
                        type='text'
                        onChange={(e) => setBotApiKey(e.target.value)}
                        value={botApiKey}
                        placeholder={addingBotError || 'Введите Token telegram бота'}
                    />
                </div>
                <div className={cl['reon-amocrm-tg-chat-bot-bot-create__select']}>
                    <SelectPrime
                        clName={cl['reon-amocrm-tg-chat-bot-bot-create__pipelines']}
                        name='reon-amocrm-tg-chat-bot-bot-create-pipeline-select'
                        onChange={changeOption}
                        options={pipelines}
                        selected={selectedPipeline?.name}
                        withArrow={true}
                    />
                </div>
            </div>
            <ButtonPrime
                clName={cl['reon-amocrm-tg-chat-bot-bot-create__btn']}
                style='add'
                onClick={handleCreateBot}
            >
                {
                    isAddingBot 
                    ? <Spinner/>
                    : 'Добавить бота'
                }
            </ButtonPrime>
        </div>
    )
}

export default BotCreate
