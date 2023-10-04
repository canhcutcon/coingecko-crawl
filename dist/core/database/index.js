var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongoose from "mongoose";
import AppConfig from "../config";
export const MongoEvent = {
    Timeout: "timeout",
    Error: "error",
    Reconnected: "reconnected",
};
export const DbLogMessage = {
    ReconnectSuccess: "Reconnect MongoDB success !!!",
    ReconnectFailed: "Reconnect MongoDB success !!!",
    ConnectFailed: "Could not connect to MongoDB !!!",
    ConnectSuccess: "Connect MongoDB success !!!",
    Timeout: "db: mongodb timeout",
};
export default class DatabaseService {
    static connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield mongoose.connect(AppConfig.database.uri);
                console.log(DbLogMessage.ConnectSuccess);
            }
            catch (error) {
                console.error(DbLogMessage.ConnectFailed);
                console.error(error);
                throw error;
            }
        });
    }
    static reconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield mongoose.connect(AppConfig.database.uri);
                console.log(DbLogMessage.ReconnectSuccess);
            }
            catch (error) {
                console.error(DbLogMessage.ReconnectFailed);
                throw error;
            }
        });
    }
    static listenEvent() {
        mongoose.connection.on(MongoEvent.Timeout, function (e) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    console.error(DbLogMessage.Timeout, e);
                    // reconnect here
                    yield mongoose.disconnect();
                    yield DatabaseService.reconnect();
                }
                catch (error) {
                    console.log(error);
                }
            });
        });
        mongoose.connection.on(MongoEvent.Error, function (e) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    console.error(DbLogMessage.ConnectFailed, e);
                    // reconnect here
                    yield mongoose.disconnect();
                    yield DatabaseService.reconnect();
                }
                catch (error) {
                    console.log(error);
                }
            });
        });
        mongoose.connection.on(MongoEvent.Reconnected, function () {
            return __awaiter(this, void 0, void 0, function* () {
                console.error(DbLogMessage.ReconnectSuccess);
            });
        });
    }
}
