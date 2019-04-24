'use strict';

const util = require('util');
const IO = require('socket.io-client');
const debug = require('debug')('log4js:socket.io');

function socketAppender(config,layout){
    const { url,path,event = 'message' } = config;
    if(!url){
        throw new Error('config.url is null.');
    }

    const socket = IO(config.url,{ path });

    socket.on('connect_error',err => debug(`connect_error ${util.inspect(err)}`));
    socket.on('connect_timeout',err => debug(`connect_timeout ${util.inspect(err)}`));
    socket.on('connect',() => debug('socket connect success.'));
    socket.on('reconnect',() => debug('socket reconnect success.'));
    socket.on('disconnect',() => debug('socket disconnect.'));
    socket.on('reconnecting',() => debug('socket reconnecting.'));

    socket.on('error',err => debug(`log4js.socketAppender - ${port} Error: ${util.inspect(err)}`));

    const appender = function(loggingEvent){
        const message = layout(loggingEvent);
        if(socket.connected){
            socket.emit(event,message);
        }else{
            debug(`socket disconnected,discard the message:${JSON.stringify(message)}`);
        }
    };

    appender.shutdown = (cb) => socket.close(cb);

    return appender;
}

function configure(config,layouts){
    let layout = layouts.messagePassThroughLayout;
    if(config.layout){
        layout = layouts.layout(config.layout.type,config.layout);
    }

    return socketAppender(config,layout);
}

module.exports.configure = configure;
