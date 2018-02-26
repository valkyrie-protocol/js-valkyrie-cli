import winston from 'winston'
import settings from '~/config/settings.json'

const config = winston.config;
const Logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      timestamp: function() {
        return new Date().toLocaleString();
      },
      formatter: function(options) {
        return options.timestamp() + ' ' +
          config.colorize(options.level, `[${options.level.toUpperCase()}]`) + ' ' +
          (options.message ? options.message : '') +
          (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
      }
    })
  ]
})

if(process.env[settings.appEnv] !== 'production'){
  Logger.level = settings.devLogLevel
}

Logger.SCOPES = {
  CORE: '[Core]',
  ACCOUNT: '[Account]',
  PEERS: '[Peers]',
  SERVER: '[Server]',
}


export default Logger
