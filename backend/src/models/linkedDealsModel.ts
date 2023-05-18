import {model, Schema} from 'mongoose';
import {ILinkedDeals} from "../@types/models/ILinkedDeals";

const LinkedDealsModel = new Schema<ILinkedDeals>({
    widgetUserId: {type: Number, require: true},
    linkedGroups: {
        type: Array({
                telegramGroupId: {type: Number, require: true},
                dealsIds: {type: [Number], require: true}
        }),
        require: true
    },
});

export default model('LinkedDealsModel', LinkedDealsModel);