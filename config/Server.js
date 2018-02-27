import express from 'express'
import http  from 'http'
import WebSocket from 'ws'
import Logger from '~/config/Logger'
import bodyParser from 'body-parser'
import settings from '~/config/settings.json'
import Routes from '~/config/Routes'
import BlocksController from '~/app/controllers/BlocksController'
import i18n from '~/config/locales'

class Server{
  static init(){
    this.app = express()
    this.port = settings.serverPort
    this.app.use(bodyParser.urlencoded({
      extended: true
    }));

    Routes.init(this.app)

    this.server = http.createServer(this.app);
    this.wss = new WebSocket.Server({ server: this.server });

    this.wss.on('connection', function connection(ws, request) {
      // You might use location.query.access_token to authenticate or share sessions
      // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

      ws.on('message', function incoming(message) {
        console.log('received: %s', message)
        new BlocksController({request, response: ws}).index()
      })

    })

    this.server.listen(this.port,  () => Logger.info(Logger.SCOPES.SERVER, i18n.t('init.server.ready', {port: this.port})))
  }
}

export default Server
