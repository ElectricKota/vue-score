import * as constantsCZ from "./CZ/messages";
import * as constantsEN from "./EN/messages";
import { MessageConstants } from './CZ/messages'

export default {
    getConstantsByLanguage(language: string): MessageConstants {
        if (language === "cz" || language === 'CZ') {
            return new constantsCZ.MessageConstants;
        }
        else {
            return new constantsEN.MessageConstants;
        }
    }
}