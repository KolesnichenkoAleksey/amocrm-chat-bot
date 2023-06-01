import classNames from 'classnames';
import React from 'react'
import {createPortal} from 'react-dom';
import { useAppSelector } from '../../hooks/useStore';
import { getIsBotsLoading } from '../../store/bots/BotSelector';
import ButtonPrime from '../UI/buttons/button-prime';
import Spinner from '../UI/spinner/Spinner';
import cl from './deleteBotModal.module.scss';

interface Props {
    isActive: boolean
    closeModal: () => void,
    deleteBot: () => Promise<void>,
    dataType: string,
}

const DeleteBotModal = ({ closeModal, dataType, deleteBot, isActive }: Props): JSX.Element => {
    const {isDeletingBots} = useAppSelector(getIsBotsLoading)

    const handleDeleteBot = async () => {
        await deleteBot();
        closeModal();
    }

    return createPortal(
    <div 
        className={classNames(cl['reon-amocrm-tg-chat-bot-modal'], {[cl._active] : isActive})} 
        data-type={dataType} 
        onClick={closeModal}
    >
        <div className={cl['reon-amocrm-tg-chat-bot-container']} onClick={e => e.stopPropagation()}>
            <h2 className={cl['reon-amocrm-tg-chat-bot-container__title']}>Вы действительно хотите удалить выбранные элементы?</h2>
            <div className={cl['reon-amocrm-tg-chat-bot-container__btns']}>
            <ButtonPrime
                style='add'
                onClick={closeModal}
            >
                Нет, отмена
            </ButtonPrime>
            <ButtonPrime
                style='delete'
                onClick={handleDeleteBot}
            >
                {
                    isDeletingBots
                    ? <Spinner/>
                    : 'Да, удалить'
                }
                
            </ButtonPrime>
            </div>
        </div>
    </div>, document.body)
}

export default DeleteBotModal
