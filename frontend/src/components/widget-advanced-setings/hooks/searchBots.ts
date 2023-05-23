import { useMemo } from "react";
import IBot from '../../../types/Bot';

export const useSearchBots = (bots: IBot[], searchQuery: string) => {
    const searchedBots: IBot[] = useMemo(() => {
      let foundBots = structuredClone(bots);
      const searchArray = searchQuery.trim().toLowerCase().split(' ');
      for (const search of searchArray) {
        foundBots = foundBots.filter(bot =>
          bot.name.toLowerCase().includes(search) ||
          bot.relatedTgGroups.filter(group => group.name.toLowerCase().includes(search)).length
        );
      }
      return foundBots;
    }, [bots, searchQuery]);
  
    return searchedBots;
  }