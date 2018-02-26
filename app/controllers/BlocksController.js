import ApplicationController from '~/app/controllers/ApplicationController'

import BlockListApiService from '~/app/services/api/blocks/BlockListApiService'
import BlockApiService from '~/app/services/api/blocks/BlockApiService'

import Account from '~/config/Account'

import Block from '~/app/models/Block'
import Blockchain from '~/app/models/Blockchain'

import NoteImporter from '~/app/services/NoteImporter'

import BlocksDB from '~/config/database/BlocksDB'
import BlocksIndexDB from '~/config/database/BlocksIndexDB'
import NotesDB from '~/config/database/NotesDB'

const BLOCKS_LIMIT = 10

async function createBlock(prevBlock = null){

  const block = new Block({
    sender: Account.address,
    prevBlock
  })

  NotesDB.createReadStream()
          .on('data', async (data) => {
            const note = await (new NoteImporter()).call(data.value)
            if(note){
              block.addEntry(note)
            }
            await NotesDB.del(note.hash)
          })
          .on('error', (error) => {
            console.log(error);
            return this.render('Empty blockchain')
          })
          .on('close', async () => {
            block.calculateMerkleRoot()
            await block.mine()
            await block.sign(Account.privateKey)
            await block.generateHash()
            await BlocksDB.put(block.hash,block.export())
            await BlocksIndexDB.put(BlocksIndexDB.LAST_BLOCK_HASH, block.hash)
            return this.render(block)
          })
}

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
  async create(){
    let prevBlockHash = null;
    let prevBlock = null;

    try{
      prevBlockHash =  await BlocksIndexDB.get(BlocksIndexDB.LAST_BLOCK_HASH)
      prevBlock = await BlocksDB.get(prevBlockHash)
    } catch(error){
      console.log(error);
    }
    try{
      createBlock.bind(this)(prevBlock)
    } catch(error){
      console.log(error);
      return this.render('Empty blockchain')
    }
  }
}
