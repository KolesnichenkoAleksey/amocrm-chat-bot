import classNames from 'classnames';
import React, { useState } from 'react';
import cl from './selectPrime.module.scss'

interface Props {
    clName?: string,
    onChange: (e: number) => void,
    options: readonly {id: number, name: string}[],
    name: string,
    selected: string
}

const SelectPrime = ({clName, name, onChange, selected, options}: Props): JSX.Element => {

    const [isActive, setIsActive] = useState(false)

    const toggleHandler = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsActive(prev => !prev);
    }

    const closeHandler = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsActive(false);
    }
    
    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
        onChange(+e.target.value);
    }

    return (
        <div
            className={classNames(cl.select, clName, {[cl._active] : isActive} )}
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
