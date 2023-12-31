import { useMemo } from "react";
import IBot from '../../../types/Bot';

export const useSearchBots = (bots: IBot[], searchQuery: string) => {
    const searchedBots: IBot[] = useMemo(() => {
		if (!bots.length) return bots;

		const foundBots = bots;
		const treatedSearchQuery = searchQuery.trim().toLowerCase();
		return foundBots.filter(bot =>
            bot.botName.toLowerCase().includes(treatedSearchQuery) ||
            bot.relatedTgGroups.filter(group => group.name.toLowerCase().includes(treatedSearchQuery)).length
        );
    }, [bots, searchQuery]);

    return searchedBots;
}