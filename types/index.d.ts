import {Appender, Layout} from "log4js";

export interface RedisAppender {
    type: 'log4js-socket.io';
    path?: string;
    layout?: Layout;
}

export type Appender = Appender | RedisAppender;
