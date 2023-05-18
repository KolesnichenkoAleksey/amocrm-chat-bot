import {model, Schema} from 'mongoose';
import {ILinkedContacts} from "../@types/models/ILinkedContacts";

const LinkedContactsModel = new Schema<ILinkedContacts>({
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