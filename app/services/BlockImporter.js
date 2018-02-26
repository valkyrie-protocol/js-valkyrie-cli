import Block from '~/app/models/Block'
import BlockValidator from '~/app/validators/BlockValidator'
import NoteImporter from '~/app/services/NoteImporter'

export default class BlockImporter{
  constructor(options = {}){
    this.Validator = options.validator || BlockValidator
  }

  async call(data){
    const block = new Block({import: true})

    Object.assign(block, data)

    for(let i = 0; i < block.entries.length; i++){
      block.entries[i] = await (new NoteImporter()).call(block.entries[i])
    }

    if(await new this.Validator(block).isValid()){
      return block
    }

    return false
  }
}
