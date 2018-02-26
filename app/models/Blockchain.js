import BlocksDB from '~/config/database/BlocksDB'
import Block from '~/app/models/Block'
import BlockImporter from '~/app/services/BlockImporter'

export default class Blockchain{
  constructor(lastBlockHash){
    this.lastBlockHash = lastBlockHash
  }
  async getLastBlock(){
    if(this.lastBlockHash){
      const blockData = await BlocksDB.get(this.lastBlockHash)
      return await (new BlockImporter()).call(blockData)
    }
  }

  async getBlock(hash){
    const blockData = await BlocksDB.get(hash)
    return await (new BlockImporter()).call(blockData)
  }

  async toArray({limit = null, endBlockHash = null}){
    let block = await this.getLastBlock()

    const blocks = [block]
    while(block.prevBlockHash && ((limit === null) || --limit > 0) && ((endBlockHash === null) || endBlockHash != block.hash) ){
      block = await this.getBlock(block.prevBlockHash)
      blocks.push(block)
    }

    return blocks
  }


}


// BlocksDB.createReadStream()
//         .on('data', async function (data) {
//           console.log(data);
//         });

