'use strict';

const IO = require('socket.io-client');
const util = require('util');
const debug = require('debug')('log4js:socket.io');

function socketAppender(config,layout){
    const { url,path = '/' } = config;
    if(!url){
        throw new Error('config.url is null.');
    }

    const socket = IO(config.url,{ path });

    socket.on('connect',() => debug('log4js.socketAppender socket connect success.'));

    socket.on('error',err => debug(`log4js.socketAppender - ${port} Error: ${util.inspect(err)}`));

    const appender = function(loggingEvent){
        const message = layout(loggingEvent);
        socket.send(message);
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
