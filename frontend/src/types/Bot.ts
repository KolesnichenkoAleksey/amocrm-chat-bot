import IPipeline from "./Pipeline";
import ITgGroup from "./TgGroup";

export default interface IBot {
    _id: number,
    name: string,
    apiKey: string,
    pipeline: IPipeline,
    relatedTgGroups: ITgGroup[]
}