import React from 'react';
import cl from './buttonPrime.module.scss'
import classNameCheck from './../../../../helpers/classNameCheck';

interface Props {
    clName?: string;
    children?: React.ReactNode;
    style: 'base' | 'delete' | 'add';
    onClick: (e: React.MouseEvent ) => void;
}

const ButtonPrime = ({ children, clName, style, onClick }: Props) => {
    return (
        <button
            className={classNameCheck(clName, cl.btn, cl[style])}
            onClick={onClick}
        >
            {children}
        </button>
    )
}

export default ButtonPrime
