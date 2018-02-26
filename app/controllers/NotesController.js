import ApplicationController from '~/app/controllers/ApplicationController'
import Account from '~/config/Account'
import Note from '~/app/models/Note'
import NotesDB from '~/config/database/NotesDB'
import NoteValidator from '~/app/validators/NoteValidator'

async function createNote(text, receivers = [], metadata = {}){
  const note = new Note({
    text,
    sender: Account.address,
    receivers,
    metadata,
  })

  await note.encrypt()
  await note.sign(Account.privateKey)
  await note.generateHash()

  const validator = new NoteValidator(note)
  if(validator.isValid){
    await NotesDB.put(note.hash, note.export())
    return note;
  }
  return {errors: validator.errors}
}

export default class BlocksController extends ApplicationController{
  async create(){
      try {
        const {text, receivers, metadata} = this.request.body
        const result = await createNote(text, receivers, metadata)
        return this.render(result)
      } catch(error){
        console.log(error);
        this.render('ERROR 500')
      }
  }
}
