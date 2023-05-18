import {model, Schema} from 'mongoose';
import {IUser} from "../@types/models/IUser";

const User = new Schema<IUser>({
    widgetUserSubdomain: {type: String, require: true},
    accountId: {type: Number, require: true},
    authCode: {type: String, require: true},
    paid: {type: Boolean, require: true},
    installed: {type: Boolean, require: true},
    testPeriod: {type: Boolean, require: true},
    startUsingDate: {type: String, require: true},
    finishUsingDate: {type: String, require: true}
});

export default model('User', User);