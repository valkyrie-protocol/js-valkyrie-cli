import Note from '~/app/models/Note'
import NoteValidator from '~/app/validators/NoteValidator'

export default class NoteImporter{
  constructor(options = {}){
    this.Validator = options.validator || NoteValidator
  }

  async call(data){
    const note = new Note({import: true})

    Object.assign(note, data)

    if(await new this.Validator(note).isValid()){
      return note
    }

    return false
  }
}
