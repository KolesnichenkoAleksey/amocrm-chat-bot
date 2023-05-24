import React, { useState } from 'react';
import { useAppDispatch } from '../../hooks/useStore';
import { delBotsById,  } from '../../store/bots/BotSlice';
import IBot from '../../types/Bot';
import InputPrime from '../UI/inputs/input-prime';
import BotCardTable from '../bot-card-table';
import DeleteBotModal from '../delete-bot-modal';
import { useSearchBots } from './hooks/searchBots';
import cl from './botsTable.module.scss';
import CheckboxPrime from '../UI/checkboxes/checkbox-prime/index';
import ButtonPrime from '../UI/buttons/button-prime/index';
import classNames from 'classnames';

interface Props {
    bots: IBot[]
}

let searchTimer: NodeJS.Timeout;

const BotsTable = ({bots}: Props): JSX.Element => {
    const dispatch = useAppDispatch()
    const [searchValue, setSearchValue] = useState('')
    const [searchQuery, setSearchQuery] = useState('')
    const [isDeleteModalActive, setIsDeleteModalActive] = useState(false)
    const [selectedBots, setSelectedBots] = useState(() => new Set<number>())
    const searchedBots = useSearchBots(bots, searchQuery)

    const search = (query: string) => {
        setSearchQuery(query);
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        clearTimeout(searchTimer);
        const query = e.target.value;
        setSearchValue(query);
        searchTimer = setTimeout(() => search(query), 500);
    }

    const closeDeleteModal = () => {
        setIsDeleteModalActive(false)
        document.body.classList.remove('_scroll-lock')
        setSelectedBots(new Set<number>())
    }

    const openDeleteBotModal = () => {
        document.body.classList.add('_scroll-lock')
        setIsDeleteModalActive(true)
    }

    const handleDeleteBots = () => {
        if (selectedBots.size) {
            const botsToDeleting = Array.from(selectedBots);
            setSelectedBots(new Set<number>())
            dispatch(delBotsById(botsToDeleting))
        }
            
    }

    const handleAllBotsSelection = () => {
        if (!selectedBots.size) {
            setSelectedBots(new Set<number>(bots.map(bot => bot._id)))
        } else {
            setSelectedBots(new Set<number>())
        }
    }

    const handleSelectBot = (id: number) => {
        if (id === -1) return;
        if (selectedBots.has(id)) {
            setSelectedBots(prev => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });
        } else {
            setSelectedBots(prev => new Set(prev).add(id));
        }
    }    

    return (
        <div>
            <table className={cl.table}>
                <tr className={cl.table__header}>
                    <th className={classNames(cl['table__cell'], cl['table__cell_header'], cl['table__cell_checkbox'])}>
                        <CheckboxPrime
                            isActive={selectedBots.size !== 0 && selectedBots.size === bots.length}
                            clName={selectedBots.size && selectedBots.size !== bots.length 
                                ? cl.table__checkbox_cancel 
                                : ''
                            }
                            name={'bots-checkbox'}
                            onChange={handleAllBotsSelection}
                        />
                    </th>
                    <th className={classNames(cl['table__cell'], cl['table__cell_header'])}>
                        <InputPrime
                            clName={cl['table__search-input']}
                            placeholder='Поиск (имя бота или Telegram группы)'
                            value={searchValue}
                            onChange={handleSearch}
                            type='text'
                        />
                    </th>
                    <th className={classNames(cl['table__cell'], cl['table__cell_header'])}>API ключ Telegram бота</th>
                    <th className={classNames(cl['table__cell'], cl['table__cell_header'])}>Воронка для создания новых Сделок</th>
                </tr>
                {
                    searchedBots.map( bot => 
                        <BotCardTable
                            key={bot._id}
                            bot={bot}
                            selectBot={handleSelectBot}
                            isSelected={selectedBots.has(bot._id)}
                        />
                    )
                }

                <div className={classNames(cl['table__edit-menu'], {[cl._active]: selectedBots.size})}>
                    <ButtonPrime
                        style='base'
                        onClick={openDeleteBotModal}
                        clName={cl['edit-menu__delete-btn']}
                    >
                        <svg className="svg-icon svg-common--trash-dims"><use xlinkHref="#common--trash"></use></svg>
                        удалить
                    </ButtonPrime>
                </div>
            </table>
            <DeleteBotModal
                dataType='delete-bot-modal'
                closeModal={closeDeleteModal}
                deleteBot={handleDeleteBots}
                isActive={isDeleteModalActive}
            />
        </div>
    )
}

export default BotsTable
