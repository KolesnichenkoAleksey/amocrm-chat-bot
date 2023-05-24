import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks/useStore'
import IPipeline from '../../types/Pipeline'
import ButtonPrime from '../UI/buttons/button-prime'
import InputPrime from '../UI/inputs/input-prime'
import SelectPrime from '../UI/selects/select-prime'
import cl from './botCreate.module.scss'
import { getPipelines } from './../../store/amo-constants/AmoConstantSelector';

const BotCreate = (): JSX.Element => {

    const pipelines: IPipeline[] = useAppSelector(getPipelines)
    const dispatch = useAppDispatch()
    const [selectedPipeline, setSelectedPipeline] = useState<IPipeline>(pipelines.filter(pipe => pipe.is_main === true)[0])
    const [botApiKey, setBotApiKey] = useState('');

    const changeOption = (value: number) => {
        const newPipeline = pipelines.find(pipe => pipe.id === value)
        if (newPipeline) {
            setSelectedPipeline(newPipeline)
        }
    }

    const handleCreateBot = () => {
        const newBot = {
            apiKey: botApiKey,
            pipeline: selectedPipeline
        }
        setBotApiKey('')
        console.log(newBot);
    }

    return (
        <div className={cl['bot-create']}>
            <div className={cl['bot-create__table']}>
                <div className={cl['bot-create__input']}>
                    <InputPrime
                        type='text'
                        onChange={(e) => setBotApiKey(e.target.value)}
                        value={botApiKey}
                        placeholder='API ключ Telegram бота'
                    />
                </div>
                <div className={cl['bot-create__select']}>
                    <SelectPrime
                        name='bot-create-pipeline-select'
                        onChange={changeOption}
                        options={pipelines}
                        selected={selectedPipeline?.name}
                        clName={cl['bot-create__pipelines']}
                    />
                </div>
            </div>
            <ButtonPrime
                clName={cl['bot-create__btn']}
                style='add'
                onClick={handleCreateBot}
            >
                Добавить бота
            </ButtonPrime>
        </div>
    )
}

export default BotCreate
