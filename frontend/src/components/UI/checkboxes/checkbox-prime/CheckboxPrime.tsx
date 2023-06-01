import classNames from 'classnames';
import React from 'react';
import cl from './checkboxPrime.module.scss';

interface Props {
    clName?: string,
    name: string,
    value: string,
    onChange: (value: string) => void
    isActive: boolean
}

const CheckboxPrime = ({ name, clName, value, onChange, isActive }: Props): JSX.Element => {

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
        const dataValue = e.target.value;
        onChange(dataValue);
    }

    return (
        <label className={classNames(clName, cl['reon-amocrm-tg-chat-bot-checkbox'], {[cl._active] : isActive})}>
            <input 
                type="checkbox" 
                name={name}
                value={value}
                onChange={onChangeHandler} 
            />
        </label>
    )
}

export default CheckboxPrime
