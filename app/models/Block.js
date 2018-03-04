import crypto2 from 'crypto2'
import merkle from 'merkle'
import DNS from '~/app/models/DNS'
import BaseModel from '~/app/models/BaseModel'
import NoteValidator from '~/app/validators/NoteValidator'
import BlockValidator from '~/app/validators/BlockValidator'
import CryptoModelMixin from '~/app/models/mixins/CryptoModelMixin'

const DIFFICULTY = 2

export default class Block extends CryptoModelMixin(BaseModel) {
  constructor(options = {}){
    super()

    options.prevBlock = options.prevBlock || { height: -1 }

    this.sender = options.sender
    this.prevBlockHash = options.prevBlock.hash
    this.height = options.prevBlock.height + 1
    this.nonce = 1
    this.entries = []
  }

  get payload(){
    return JSON.stringify((({ sender, prevBlockHash, nonce, merkleRoot }) => ({ sender, prevBlockHash, nonce, merkleRoot }))(this))
  }

  get merkleLeaves(){
    return this.entries.map( entry => entry.payload )
  }

  get merkleTree(){
    const USE_UPPERCASE = false;
    return merkle('sha256', USE_UPPERCASE).sync(this.merkleLeaves);
  }

  calculateMerkleRoot(){
    this.merkleRoot = this.merkleTree.root()
    return this.merkleRoot;
  }


  addEntry(entry){
    return this.entries.push(entry)
  }

  addEntries(newEntries){
    return this.entries.concat(newEntries)
  }

  export(){
    return (({ hash, sender, prevBlockHash, height, nonce, minedAt, merkleRoot, entries, signature }) => ({ hash, sender, prevBlockHash, height, nonce, minedAt, merkleRoot, entries, signature }))(this)
  }
}
