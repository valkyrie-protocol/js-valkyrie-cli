export default class BlockchainSelector {
  constructor(blockchain){
    this.blockchain = blockchain
  }

  findBlock(hash){
    return this.blockchain.blocks.find( block => block.hash === hash)
  }
}
