import {model, Schema} from 'mongoose';
import {UserInterface} from "../@types/models/UserInterface";

const User = new Schema<UserInterface>({
    widgetUserSubdomain: {type: String, require: true},
    accountId: {type: Number, require: true},
    authCode: {type: String, require: true},
    paid: {type: Boolean, require: true},
    installed: {type: Boolean, require: true},
    testPeriod: {type: Boolean, require: true},
    startUsingDate: {type: String, require: true},
    finishUsingDate: {type: String, require: true},
    initializingBots: {
        type: Array({
            botToken: {type: String, require: true},
            botName: {type: String, require: true}
        }), require: true
    }
});

export default model('User', User);

