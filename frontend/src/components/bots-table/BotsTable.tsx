import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useStore';
import { delBotsByToken } from '../../store/bots/BotSlice';
import IBot from '../../types/Bot';
import InputPrime from '../UI/inputs/input-prime';
import BotCardTable from '../bot-card-table';
import DeleteBotModal from '../delete-bot-modal';
import { useSearchBots } from './hooks/searchBots';
import cl from './botsTable.module.scss';
import CheckboxPrime from '../UI/checkboxes/checkbox-prime/index';
import ButtonPrime from '../UI/buttons/button-prime/index';
import classNames from 'classnames';
import useSearchDebounce from '../../hooks/useSearchDebounce';
import TelegramBotServices from './../../api/services/telegram-bot/index';
import { getSubdomain } from '../../store/amo-constants/AmoConstantSelector';

interface Props {
    bots: IBot[]
}

const BotsTable = ({bots}: Props): JSX.Element => {
    const dispatch = useAppDispatch();
    const subdomain = useAppSelector(getSubdomain);
    const [searchValue, setSearchValue] = useState('');
    const [isDeleteModalActive, setIsDeleteModalActive] = useState(false);
    const [selectedBots, setSelectedBots] = useState(() => new Set<string>());
    const searchQuery = useSearchDebounce(searchValue);
    const searchedBots = useSearchBots(bots, searchQuery); 

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const query = e.target.value;
        setSearchValue(query);
    }

    const closeDeleteModal = (): void => {
        setIsDeleteModalActive(false);
        document.body.classList.remove('_scroll-lock');
        setSelectedBots(new Set<string>());
    }

    const openDeleteBotModal = (): void => {
        document.body.classList.add('_scroll-lock');
        setIsDeleteModalActive(true);
    }

    const handleDeleteBots = async (): Promise<void> => {
        if (selectedBots.size) {
            const botTokens = Array.from(selectedBots);
            setSelectedBots(new Set<string>());
            await dispatch(TelegramBotServices.deleteBots({subdomain, botTokens}))
            dispatch(delBotsByToken(botTokens));
        }
    }

    const handleAllBotsSelection = (): void => {
        if (!selectedBots.size) {
            setSelectedBots(new Set<string>(bots.map(bot => bot.botToken)));
        } else {
            setSelectedBots(new Set<string>());
        }
    }

    const handleSelectBot = (token: string): void => {
        if (selectedBots.has(token)) {
            setSelectedBots(prev => {
                const next = new Set(prev);
                next.delete(token);
                return next;
            });
        } else {
            setSelectedBots(prev => new Set(prev).add(token));
        }
    }    

    return (
        <>
            <table className={cl['reon-amocrm-tg-chat-bot-table']}>
                <tr className={cl['reon-amocrm-tg-chat-bot-table__header']}>
                    <th className={classNames(cl['reon-amocrm-tg-chat-bot-table__cell'], cl['reon-amocrm-tg-chat-bot-table__cell_header'], cl['reon-amocrm-tg-chat-bot-table__cell_checkbox'])}>
                        <CheckboxPrime
                            isActive={selectedBots.size !== 0 && selectedBots.size === bots.length}
                            clName={classNames({[cl['reon-amocrm-tg-chat-bot-table__checkbox_cancel']]: selectedBots.size && selectedBots.size !== bots.length})}
                            name={'reon-amocrm-tg-chat-bot-bots-checkbox'}
                            onChange={handleAllBotsSelection}
                            value={'select-all'}
                        />
                    </th>
                    <th className={classNames(cl['reon-amocrm-tg-chat-bot-table__cell'], cl['reon-amocrm-tg-chat-bot-table__cell_header'])}>
                        <InputPrime
                            clName={cl['reon-amocrm-tg-chat-bot-table__search-input']}
                            placeholder='Поиск (имя бота или Telegram группы)'
                            value={searchValue}
                            onChange={handleSearch}
                            type='text'
                        />
                    </th>
                    <th className={classNames(cl['reon-amocrm-tg-chat-bot-table__cell'], cl['reon-amocrm-tg-chat-bot-table__cell_header'])}>Token Telegram бота</th>
                    <th className={classNames(cl['reon-amocrm-tg-chat-bot-table__cell'], cl['reon-amocrm-tg-chat-bot-table__cell_header'])}>Воронка для создания новых Сделок</th>
                </tr>
                {
                    searchedBots.map( bot => 
                        <BotCardTable
                            key={bot._id}
                            bot={bot}
                            selectBot={handleSelectBot}
                            isSelected={selectedBots.has(bot.botToken)}
                        />
                    )
                }
                <div className={classNames(cl['reon-amocrm-tg-chat-bot-table__edit-menu'], {[cl._active]: selectedBots.size})}>
                    <ButtonPrime
                        style='base'
                        onClick={openDeleteBotModal}
                        clName={cl['reon-amocrm-tg-chat-bot-edit-menu__delete-btn']}
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
        </>
    )
}

export default BotsTable
