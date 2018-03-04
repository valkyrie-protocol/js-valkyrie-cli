import BlocksController from '~/app/controllers/BlocksController'
import NotesController from '~/app/controllers/NotesController'
import AccountController from '~/app/controllers/AccountController'

export default class Routes{
  static init(router){
    router.get('/status', (request, response) => {
      response.send('OK 200')
    })
    router.get('/blocks', (request, response) => {
      new BlocksController({request, response}).index()
    })
    router.get('/blocks/:hash', (request, response) => {
      new BlocksController({request, response}).show()
    })
    // router.post('/blocks', (request, response) => {
    //   new BlocksController({request, response}).create()
    // })
    router.post('/account/sign_in', (request, response) => {
      new AccountController({request, response}).create()
    })
    router.post('/account/sign_out', (request, response) => {
      new AccountController({request, response}).destroy()
    })
    router.post('/notes', (request, response) => {
      new NotesController({request, response}).create()
    })

  }
}
