import crypto2 from 'crypto2'
import fs from 'fs'
import Logger from '~/config/Logger'
import DNS from '~/app/models/DNS'
import accountData from '~/config/account.json'
import inquirer from 'inquirer'
import i18n from '~/config/locales'

const account = {
  publicKey: null,
  privateKey: null,
  address: null,
}

export default class Account{
  static async init(password){
    let publicKey
    let address
    let privateKey
    let secretPrivateKey

    if(accountData){
      Logger.info(Logger.SCOPES.ACCOUNT, i18n.t('init.account.loading'))
      publicKey = accountData.publicKey
      address = accountData.address
    } else {
      Logger.info(Logger.SCOPES.ACCOUNT, i18n.t('init.account.creating'))
      const keys = await crypto2.createKeyPair()
      privateKey = keys.privateKey
      publicKey = keys.publicKey


      const { password } = await inquirer.prompt([{
        name: 'password',
        type: 'password',
        message: 'Enter a password:',
      }])

      secretPrivateKey = await crypto2.encrypt(privateKey, password)

      const fileData = JSON.stringify({
        publicKey,
        address,
        secretPrivateKey,
      });

      await fs.writeFile("./config/account.json", fileData)
    }

    address = await DNS.add(publicKey)
    Logger.info(Logger.SCOPES.ACCOUNT, i18n.t('init.account.address', {address}))

    account.address = address
    account.publicKey = publicKey
    account.privateKey = privateKey
  }

  static async signIn(password){
    if(accountData){
      const secretPrivateKey = accountData.secretPrivateKey
      account.privateKey = await crypto2.decrypt(secretPrivateKey, password)
    }
  }

  static async signOut(){
    account.privateKey = null
  }

  static get isReady(){
    return this.publicKey && this.privateKey && this.address
  }
  static get publicKey(){
    return  account.publicKey
  }
  static get privateKey(){
    return  account.privateKey
  }
  static get address(){
    return  account.address
  }
}
