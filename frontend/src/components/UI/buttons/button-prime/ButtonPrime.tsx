import React from 'react';
import cl from './buttonPrime.module.scss'
import classNames from 'classnames';

interface Props {
    clName?: string;
    children?: React.ReactNode;
    style: 'base' | 'delete' | 'add';
    onClick: (e: React.MouseEvent ) => void;
}

const ButtonPrime = ({ children, clName, style, onClick }: Props): JSX.Element => {
    return (
        <button
            className={classNames(clName, cl['reon-amocrm-tg-chat-bot-btn'], cl[style])}
            onClick={onClick}
        >
            {children}
        </button>
    )
}

export default ButtonPrime
