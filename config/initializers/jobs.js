import util from 'util'

const exec = util.promisify(require('child_process').exec);

async function createBlock(){
  const { stdout, stderr }  = await exec('yarn run create-block')
}

setInterval(createBlock, 2000)
