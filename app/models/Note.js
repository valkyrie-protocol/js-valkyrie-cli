import crypto2 from 'crypto2'
import DNS from '~/app/models/DNS'
import BaseModel from '~/app/models/BaseModel'
import NoteValidator from '~/app/validators/NoteValidator'
import CryptoModelMixin from '~/app/models/mixins/CryptoModelMixin'

const SENDER_UNDEFINED_ERROR = new Error('Note sender is undefined')

export default class Note extends CryptoModelMixin(BaseModel) {
  constructor(options = {}){
    super()

    this.sender = options.sender
    if(!options.import){
      this.text = options.text || ''
      this.receivers = options.receivers || []
    }
    this.metadata = options.metadata || {}
    this.entries = {}
  }

  get payload(){
    return JSON.stringify((({ sender, entries, metadata }) => ({ sender, entries, metadata }))(this))
  }

  async encrypt(){
    for(let address of [this.sender, ...this.receivers]){
      const {publicKey} = DNS.findByAddress(address)
      this.entries[address] = await crypto2.encrypt.rsa(this.text, publicKey)
    }

    delete this.text
    delete this.receivers

    return this.entries
  }

  async decrypt(address, privateKey){
    return await crypto2.decrypt.rsa(this.entries[address], privateKey)
  }

  export(){
    return (({ hash, sender, entries, metadata, signature }) => ({ hash, sender, entries, metadata, signature }))(this)
  }
}

