import { useMemo } from "react";
import IBot from '../../../types/Bot';

export const useSearchBots = (bots: IBot[], searchQuery: string) => {
    const searchedBots: IBot[] = useMemo(() => {
      let foundBots = structuredClone(bots);
      searchQuery = searchQuery.trim().toLowerCase();
      foundBots = foundBots.filter(bot =>
        bot.name.toLowerCase().includes(searchQuery) ||
        bot.relatedTgGroups.filter(group => group.name.toLowerCase().includes(searchQuery)).length
      );
      return foundBots;
    }, [bots, searchQuery]);
  
    return searchedBots;
  }