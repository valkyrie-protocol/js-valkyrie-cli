import levelup from 'levelup'
import leveldown from 'leveldown'
import encode from 'encoding-down'
import { BLOCKS_DB_PATH } from '~/config/database.json'

const BlocksDB = levelup(encode(leveldown(BLOCKS_DB_PATH), { valueEncoding: 'json' }))

export default BlocksDB
