import { spawn } from 'threads'
import Account from '~/config/Account'
import BlocksDB from '~/config/database/BlocksDB'
import BlocksIndexDB from '~/config/database/BlocksIndexDB'
import Logger from '~/config/Logger'
import i18n from '~/config/locales'

export default class BlockMiner{
  constructor(block){
    this.thread = spawn(this.mine)
    this.block = block
  }
  async mine(args = {}, done){
    const crypto2 = require('crypto2')
    if(args && args.privateKey && args.payload){
      const privateKey = args.privateKey
      const DIFFICULTY = 5
      let payload = JSON.parse(args.payload)
      let hash = await crypto2.hash(args.payload)
      while(hash.substring(0, DIFFICULTY) !== new Array(DIFFICULTY + 1).join('0') && payload.nonce > 0){
        payload.nonce += 1
        hash = await crypto2.hash(JSON.stringify(payload))
      }
      const minedAt = new Date().getTime()
      done({nonce: payload.nonce, minedAt})
    }
  }
  async call(callback){
    await this.block.calculateMerkleRoot()
    Logger.info(Logger.SCOPES.BLOCKS,i18n.t('blocks.startMining'))
    this.thread.send({payload: this.block.payload, privateKey: Account.privateKey})
      .on('message', async({nonce, minedAt}) => {
        this.block.nonce = nonce
        this.block.minedAt = minedAt
        await this.block.sign(Account.privateKey)
        await this.block.generateHash()
        await BlocksDB.put(this.block.hash,this.block.export())
        await BlocksIndexDB.put(BlocksIndexDB.LAST_BLOCK_HASH, this.block.hash)
        Logger.info(Logger.SCOPES.BLOCKS,i18n.t('blocks.endMining', {hash: this.block.hash}))
        this.thread.kill()
        callback && callback()
      })
  }

}
