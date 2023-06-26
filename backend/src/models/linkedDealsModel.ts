import {model, Schema} from 'mongoose';
import {LinkedDealsInterface} from "../@types/models/LinkedDealsInterface";

const LinkedDealsModel = new Schema<LinkedDealsInterface>({
    widgetUserId: {type: Number, require: true},
    linkedGroups: {
        type: Array({
            telegramBotToken: {type: String, require: true},
            telegramGroupId: {type: Number, require: true},
            telegramGroupName: {type: String, require: true},
            amoChatIds: [{ type: String }],
            deals: [{
                type: Object({
                    id: {type: Number, require: true},
                    name: {type: String, require: true}
                }),
                require: true
            }],
            lastMessageFromAMO: {
                type: Object({
                    time: {type: Number, require: true},
                    senderId: {type: String, require: true},
                    text: {type: String, require: true}
                }),
                require: false
            }
        }),
        require: true
    },
});

export default model('LinkedDealsModel', LinkedDealsModel);