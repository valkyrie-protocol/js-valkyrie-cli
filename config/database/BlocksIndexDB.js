import levelup from 'levelup'
import leveldown from 'leveldown'
import encode from 'encoding-down'
import { BLOCKS_INDEX_DB_PATH } from '~/config/database.json'

const BlocksIndexDB = levelup(encode(leveldown(BLOCKS_INDEX_DB_PATH), { valueEncoding: 'json' }))

const LAST_BLOCK_HASH = 'LAST_BLOCK_HASH'

Object.assign(BlocksIndexDB, { LAST_BLOCK_HASH })

export default BlocksIndexDB
export { LAST_BLOCK_HASH }
