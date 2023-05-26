import ILead from "./Lead";

export default interface ITgGroup {
    id: number,
    name: string,
    leads: ILead[]
}