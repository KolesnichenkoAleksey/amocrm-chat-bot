import React, { useState } from 'react'
import classNameCheck from '../../../../helpers/classNameCheck'
import cl from './selectPrime.module.scss'

interface Props {
    clName?: string,
    onChange: (e: number) => void,
    options: readonly {id: number, name: string}[],
    name: string,
    selected: string
}

const SelectPrime = ({clName, name, onChange, selected, options}: Props) => {

    const [isActive, setIsActive] = useState(false)

    const toggleHandler = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsActive(prev => !prev)
    }

    const closeHandler = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsActive(false)
    }
    
    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
        onChange(+e.target.value)
    }

    return (
        <div
            className={classNameCheck(cl.select, clName, isActive ? cl._active : '' )}
            onClick={toggleHandler}
    >
        <span>{selected}</span>
        <div className={cl.select__wrapper}>
            {
                options.map(filter =>
                    <label 
                        className={cl.select__option}
                        key={filter.id}
                        onClick={closeHandler}
                    >
                        {filter.name}
                        <input
                            type='radio'
                            name={name}
                            value={filter.id}
                            onChange={onChangeHandler}
                        />
                    </label>
                )
            }
        </div>
    </div>
    )
}

export default SelectPrime
