import { model, Schema } from 'mongoose';
import { UserInterface } from '../@types/models/UserInterface';

const User = new Schema<UserInterface>({
    widgetUserSubdomain: { type: String, require: true },
    accountId: { type: Number, require: true },
    amojoScopeId: { type: String, require: true },
    amojoId: { type: String, require: true },
    paid: { type: Boolean, require: true },
    installed: { type: Boolean, require: true },
    testPeriod: { type: Boolean, require: true },
    startUsingDate: { type: String, require: true },
    finishUsingDate: { type: String, require: true },
    access_token: { type: String, required: true },
    refresh_token: { type: String, required: true },
    initializingBots: {
        type: Array({
            botToken: { type: String, require: true },
            botName: { type: String, require: true },
            amoChatsSource: {
                type: Object({
                    id: { type: Number, require: true },
                    name: { type: String, require: true },
                    external_id: { type: String, require: true },
                }), require: true
            },
            pipeline: {
                type: Object({
                    id: { type: Number, require: true },
                    name: { type: String, require: true }
                }), require: true
            }
        }), require: true
    }
});

export default model('User', User);




