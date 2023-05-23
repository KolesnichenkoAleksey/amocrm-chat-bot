import {model, Schema} from 'mongoose';
import {LinkedContactsInterface} from "../@types/models/LinkedContactsInterface";

const LinkedContactsModel = new Schema<LinkedContactsInterface>({
    widgetUserId: {type: Number, require: true},
    linkedContact: {
        type: Array({
            amoCRMContactId: {type: Number, require: true},
            telegramUserId: {type: Number, require: true},
            telegramName: {type: String, require: true}
        }),
        require: true
    },
});

export default model('LinkedContactsModel', LinkedContactsModel);