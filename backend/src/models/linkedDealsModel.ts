import {model, Schema} from 'mongoose';
import {LinkedDealsInterface} from "../@types/models/LinkedDealsInterface";

const LinkedDealsModel = new Schema<LinkedDealsInterface>({
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