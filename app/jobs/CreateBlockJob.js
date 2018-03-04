import Account from '~/config/Account'

import Block from '~/app/models/Block'
import NoteImporter from '~/app/services/NoteImporter'

import BlocksDB from '~/config/database/BlocksDB'
import BlocksIndexDB from '~/config/database/BlocksIndexDB'
import NotesDB from '~/config/database/NotesDB'
import BlockMiner from '~/app/services/BlockMiner'

export default class CreateBlockJob{
  async buildBlock(){
    return new Block({
      sender: Account.address,
      prevBlock: await this.getPrevBlock(),
    })
  }

  async getPrevBlock(){
    try{
      const prevBlockHash =  await BlocksIndexDB.get(BlocksIndexDB.LAST_BLOCK_HASH)
      return await BlocksDB.get(prevBlockHash)
    } catch(error){
      console.log(error);
    }
  }

  async execute(){
    const block = await this.buildBlock()
    let notesLength = 0
    NotesDB.createReadStream()
      .on('data', async (data) => {
        const note = await (new NoteImporter()).call(data.value)
        notesLength++
        if(note){
          block.addEntry(note)
        }
        await NotesDB.del(note.hash)
      })
      .on('error', (error) => {
        console.log(error);
      })
      .on('close', async () => {
        if(notesLength){
          new BlockMiner(block).call(() => this.execute())
        } else {
          setTimeout(() => {
            this.execute()
          }, 5000)
        }
      })
  }


}

