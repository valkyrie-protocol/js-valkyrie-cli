import levelup from 'levelup'
import leveldown from 'leveldown'
import encode from 'encoding-down'
import { NOTES_DB_PATH } from '~/config/database.json'

const NotesDB = levelup(encode(leveldown(NOTES_DB_PATH), { valueEncoding: 'json' }))

export default NotesDB
