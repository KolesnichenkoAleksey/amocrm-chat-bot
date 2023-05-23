import React from 'react';
import cl from './checkboxPrime.module.scss';
import classNameCheck from './../../../../helpers/classNameCheck';

interface Props {
    clName?: string,
    name: string,
    value?: number,
    onChange: (value: number) => void
    isActive: boolean
}

const CheckboxPrime = ({ name, clName, value, onChange, isActive }: Props) => {

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
        const value = e.target.getAttribute('data-value') ? Number(e.target.getAttribute('data-value')) : undefined
        if (value) onChange(value);
        else onChange(-1);
    }

    return (
        <label className={classNameCheck(clName, cl.checkbox, isActive ? cl._active : '')}>
            <input 
                type="checkbox" 
                name={name}
                data-value={value}
                onChange={onChangeHandler} 
            />
        </label>
    )
}

export default CheckboxPrime
