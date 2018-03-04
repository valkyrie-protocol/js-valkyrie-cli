import http from 'http'
import SubnetsPinger from 'ping-subnet'
import figlet from 'figlet'
import inquirer from 'inquirer'
import settings from '~/config/settings.json'
import Logger from '~/config/Logger'
import Account from '~/config/Account'
import Server from '~/config/Server'
import CreateBlockJob from '~/app/jobs/CreateBlockJob'
import i18n from '~/config/locales'

import '~/config/initializers'


async function main(){
  console.log(figlet.textSync(settings.appName))

  const { lng } = await inquirer.prompt([{
    name: 'lng',
    type: 'list',
    message: 'Language:',
    choices: ['en', 'pl']
  }])

  i18n.changeLanguage(lng)

  Logger.info(Logger.SCOPES.CORE,i18n.t('init.core'))
  try {

  if(! Account.isReady){
    await Account.init()
  }

  Server.init()

  const subnetPinger = new SubnetsPinger()

  Logger.info(Logger.SCOPES.PEERS, i18n.t('init.peers.searching'))

  let peersCount = 0

  subnetPinger.on('host:alive', ip => {
    Logger.info(Logger.SCOPES.PEERS, i18n.t('init.peers.found', {ip}))

    const request = http.request({
      host: ip,
      port: 'PORT',
      path: '/status',
      method: 'GET',
    }, (response) => {
      peersCount++
    })

    request.on('error', function(error) {
      Logger.info(Logger.SCOPES.PEERS, i18n.t('init.peers.notResponding', {ip}))
    });

    request.end()
  });

  subnetPinger.once('ping:end', () => {
    Logger.info(Logger.SCOPES.PEERS, i18n.t('init.peers.connected', {peersCount}))
  });

  subnetPinger.ping();

  const createBlockJob = new CreateBlockJob()
  createBlockJob.execute()

  } catch(error){
   Logger.error(error)
   console.log(error)
  }
}

main()


