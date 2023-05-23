import React, { useEffect } from 'react'
import {createPortal} from 'react-dom';
import ButtonPrime from '../../UI/buttons/button-prime';
import cl from './deleteBotModal.module.scss';
import classNameCheck from './../../../helpers/classNameCheck';

interface Props {
    isActive: boolean
    closeModal: () => void,
    deleteBot: () => void,
    dataType: string,
}

const DeleteBotModal = ({ closeModal, dataType, deleteBot, isActive }: Props) => {

    const handleDeleteBot = () => {
        closeModal()
        deleteBot()
    }

    return createPortal(
    <div 
        className={classNameCheck(cl.modal, isActive ? cl._active : '')} 
        data-type={dataType} 
        onClick={closeModal}
    >
        <div className={cl.container} onClick={e => e.stopPropagation()}>
            <h2 className={cl.title}>Вы действительно хотите удалить выбранные элементы?</h2>
            <div className={cl.container__btns}>
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
                Да, удалить
            </ButtonPrime>
            </div>

        </div>
    </div>, document.body)
}

export default DeleteBotModal
