import crypto2 from 'crypto2'
import fs from 'fs'
import Logger from '~/config/Logger'
import DNS from '~/app/models/DNS'
import inquirer from 'inquirer'
import i18n from '~/config/locales'

let account = null

export default class Account{
  static async init(password){
    Logger.info(Logger.SCOPES.ACCOUNT, i18n.t('init.account.loading'))
    await this.loadAccount()
    Logger.info(Logger.SCOPES.ACCOUNT, i18n.t('init.account.address', {address: account.address}))
  }

  static async signIn(password){
    if(account){
      const secretPrivateKey = account.secretPrivateKey
      account.privateKey = await crypto2.decrypt(secretPrivateKey, password)
    }
  }

  static async signOut(){
    account.privateKey = null
  }

  static async createAccount(){
    Logger.info(Logger.SCOPES.ACCOUNT, i18n.t('init.account.creating'))

    const keys = await crypto2.createKeyPair()
    account = {
      privateKey: keys.privateKey,
      publicKey: keys.publicKey,
      address: await DNS.add(keys.publicKey),
    }

    const secretPrivateKey = await crypto2.encrypt(keys.privateKey, await this.getPassword())

    const fileData = JSON.stringify({
      publicKey: account.publicKey,
      address: account.address,
      secretPrivateKey,
    })

    await fs.writeFileSync('./data/account.dat', new Buffer(fileData).toString('base64'))
  }

  static async getPassword(){
    const { password } = await inquirer.prompt([{
      name: 'password',
      type: 'password',
      message: 'Enter a password:',
    }])

    return password
  }

  static async loadAccount(){
    try {
      const fileData = fs.readFileSync('./data/account.dat')
      account = JSON.parse(new Buffer(fileData.toString('ascii'), 'base64').toString('ascii'))
    } catch(error){
      Logger.debug(Logger.SCOPES.ACCOUNT, i18n.t('init.account.notExists'))
      await this.createAccount()
    }
  }

  static get isReady(){
    return account && account.publicKey && account.privateKey && account.address
  }


}
