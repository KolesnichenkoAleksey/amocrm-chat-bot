import React from 'react'
import classNames from 'classnames';
import cl from './copyBlock.module.scss'
import copyToClipboard from '../../../utils/copyToClipboard';
import { visibilityOptionsType } from '../../../types/VisibilityOptions';

interface Props {
    children: string,
    clName?: string,
    visibility: visibilityOptionsType
}

function CopyBlock({children, clName, visibility}: Props) {
    return (
        <div 
            className={classNames(cl['reon-amocrm-tg-chat-bot-copy-block'], cl[visibility], clName)}
        >
            <div className={cl['reon-amocrm-tg-chat-bot-copy-block__content']}>
                {children}
            </div>
            <button
                className={classNames(cl['reon-amocrm-tg-chat-bot-copy-block__btn'])}
                onClick={() => copyToClipboard(children)}
            >
                <svg 
                    width="16px" 
                    height="16px" 
                    viewBox="0 0 32 32" 
                    version="1.1" 
                    xmlns="http://www.w3.org/2000/svg" 
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                >
                    <path d="M27.845 7.385l-5.384-5.384h-11.845v4.307h-6.461v23.69h17.229v-4.307h6.461v-18.306zM22.461 3.524l3.861 3.861h-3.861v-3.861zM5.232 28.922v-21.537h9.692v5.384h5.384v16.153h-15.076zM16 7.831l3.861 3.861h-3.861v-3.861zM21.384 24.615v-12.922l-5.384-5.384h-4.307v-3.231h9.692v5.384h5.384v16.153h-5.384z" fill="currentColor"></path>
                </svg>
            </button>
        </div>
    )
}

export default CopyBlock
