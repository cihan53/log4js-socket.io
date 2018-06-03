# Socket.io Appender for log4js-node

Plugin for log4js > 2.x
```bash
npm install log4js-socket.io
```

## Configuration

* `type` - `socketIO`
* `path` - `string` (optional, defaults to `/`) 
* `layout` - `object` (optional, defaults to `messagePassThroughLayout`) - the layout to use for log events (see [layouts](layouts.md)).

The appender will use the Redis PUBLISH command to send the log event messages to the channel.

## Example

```javascript
log4js.configure({
  appenders: {
    io: { type: 'log4js-socket.io',url:'http://io.net', path: '/admin' }
  },
  categories: { default: { appenders: ['io'], level: 'info' } }
});
```

