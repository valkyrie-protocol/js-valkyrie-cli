import Blockchain from '~/app/models/Blockchain'

export default class BlockApiService{
  constructor({blockHash, lastBlockHash}){
    this.lastBlockHash = lastBlockHash
    this.blockHash = blockHash
    this.blockchain = new Blockchain(lastBlockHash)
  }

  getPrevPath(block){
    if(block.prevBlockHash){
      return `/blocks/${block.prevBlockHash}`
    }
  }

  async getBlock(){
    return await this.blockchain.getBlock(this.blockHash)
  }

  async call(){
    const block = await this.getBlock()
    const prevPath = this.getPrevPath(block)

    return {block, prevPath}
  }
}

