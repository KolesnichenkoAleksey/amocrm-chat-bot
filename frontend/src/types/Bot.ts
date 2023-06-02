import IPipeline from "./Pipeline";
import ITgGroup from "./TgGroup";

export default interface IBot {
    _id: string,
    botName: string,
    botToken: string,
    pipeline: IPipeline,
    relatedTgGroups: ITgGroup[]
}