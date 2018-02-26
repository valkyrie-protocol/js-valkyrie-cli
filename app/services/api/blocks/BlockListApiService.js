import Blockchain from '~/app/models/Blockchain'

const BLOCKS_LIMIT = 100

export default class BlockListApiService{
  constructor({startBlockHash = null, endBlockHash = null, limit = null}){
    this.startBlockHash = startBlockHash
    this.endBlockHash = endBlockHash
    this.limit = limit || BLOCKS_LIMIT
    this.blockchain = new Blockchain(startBlockHash)
  }

  get endBlockHashQuery(){
    return this.endBlockHash ? `&endBlockHash=${endBlockHash}` : ''
  }

  get limitQuery(){
    return this.limit ? `&limit=${this.limit}` : ''
  }

  async call(){
    const blocks = await this.getBlocks()
    const block = blocks[blocks.length - 1]
    const prevPath = this.getPrevPath(block)

    return {blocks, prevPath}
  }

  async getBlocks(){
    return this.blocks = this.blocks || await this.blockchain.toArray({ limit: this.limit, endBlockHash: this.endBlockHash })
  }

  getPrevPath(block){
    if(block.prevBlockHash && this.endBlockHash !== block.hash){
      return `/blocks?startBlockHash=${block.prevBlockHash}${this.endBlockHashQuery}${this.limitQuery}`
    }
  }


}
