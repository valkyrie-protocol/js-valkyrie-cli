import ApplicationController from '~/app/controllers/ApplicationController'
import BlockListApiService from '~/app/services/api/blocks/BlockListApiService'
import BlockApiService from '~/app/services/api/blocks/BlockApiService'
import BlocksIndexDB from '~/config/database/BlocksIndexDB'

const BLOCKS_LIMIT = 10

export default class BlocksController extends ApplicationController{
  constructor({request, response}){
    super({request, response})
  }

  async index(){
    try{
      const {startBlockHash, endBlockHash, limit}  = this.query

      const service = await new BlockListApiService({
        startBlockHash: startBlockHash || await BlocksIndexDB.get(BlocksIndexDB.LAST_BLOCK_HASH),
        endBlockHash,
        limit
      })

      return this.render(await service.call())
    } catch(e){
      console.log(e);
      return this.render('Empty blockchain')
    }
  }

  async show(){
    try{
      const lastBlockHash =  await BlocksIndexDB.get(BlocksIndexDB.LAST_BLOCK_HASH)
      const blockHash = this.params.hash

      const service = new BlockApiService({blockHash, lastBlockHash})

      return this.render(await service.call())
    } catch(e){
      console.log(e);
      return this.render('Empty blockchain')
    }
  }
}
