import http from 'http'
import SubnetsPinger from 'ping-subnet'
import figlet from 'figlet'
import Logger from '~/config/Logger'
import Account from '~/config/Account'
import Server from '~/config/Server'

import '~/config/initializers'

async function init(){
  console.log(figlet.textSync('Crypto Notes Protocol'))
  Logger.info(Logger.SCOPES.CORE,'\tInitializing application Core')
  try {

  if(! Account.isReady){
    await Account.init()
  }

  Server.init()

  const subnetPinger = new SubnetsPinger()

  Logger.info(Logger.SCOPES.PEERS, '\tSearching for responding peers')

  let peersCount = 0

  subnetPinger.on('host:alive', ip => {
    Logger.info(Logger.SCOPES.PEERS, `\tAlive peer ${ip} has been found`)

    const request = http.request({
      host: ip,
      port: 'PORT',
      path: '/status',
      method: 'GET',
    }, (response) => {
      peersCount++
    })

    request.on('error', function(error) {
      Logger.info(Logger.SCOPES.PEERS, `\tPeer ${ip} is not responding`)
    });

    request.end()
  });

  subnetPinger.once('ping:end', () => {
    Logger.info(Logger.SCOPES.PEERS, `\t${peersCount} responding peers has been found`)
  });

  subnetPinger.ping();

  } catch(error){
   Logger.error(error)
  }
}

init()


