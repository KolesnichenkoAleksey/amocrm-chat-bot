import classNames from 'classnames';
import React, { useState } from 'react';
import cl from './selectPrime.module.scss'

interface Props {
    clName?: string,
    onChange: (e: number) => void,
    options: readonly {id: number, name: string}[],
    name: string,
    selected: string,
    withArrow: boolean
}

const SelectPrime = ({ clName, name, onChange, selected, options, withArrow }: Props): JSX.Element => {

    const [isActive, setIsActive] = useState(false)

    const toggleHandler = (e: React.MouseEvent): void => {
        e.stopPropagation();
        setIsActive(prev => !prev);
    }

    const closeHandler = (e: React.MouseEvent): void => {
        e.stopPropagation();
        setIsActive(false);
    }
    
    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
        e.stopPropagation();
        onChange(Number(e.target.value));
    }

    return (
        <div
            className={classNames(cl['reon-amocrm-tg-chat-bot-select'], clName, {[cl._active] : isActive} )}
            onClick={toggleHandler}
        >
            <span
                className={cl['reon-amocrm-tg-chat-bot-select__text']}
            >
                {selected}
            </span>
            {
                withArrow 
                ? <svg 
                        className={cl['reon-amocrm-tg-chat-bot-select__arrow']}
                        width="16px" 
                        height="16px" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M4.29289 8.29289C4.68342 7.90237 5.31658 7.90237 5.70711 8.29289L12 14.5858L18.2929 8.29289C18.6834 7.90237 19.3166 7.90237 19.7071 8.29289C20.0976 8.68342 20.0976 9.31658 19.7071 9.70711L12.7071 16.7071C12.3166 17.0976 11.6834 17.0976 11.2929 16.7071L4.29289 9.70711C3.90237 9.31658 3.90237 8.68342 4.29289 8.29289Z" fill="currentColor"/>
                    </svg> 
                : null
            }
            <div className={cl['reon-amocrm-tg-chat-bot-select__wrapper']}>
                {
                    options.map(filter =>
                        <label 
                            className={cl['reon-amocrm-tg-chat-bot-select__option']}
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
