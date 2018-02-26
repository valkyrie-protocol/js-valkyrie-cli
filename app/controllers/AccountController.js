import ApplicationController from '~/app/controllers/ApplicationController'
import Account from '~/config/Account'


export default class BlocksController extends ApplicationController{
  async create(){
      try {
        const {password} = this.request.body
        await Account.signIn(password)
        return this.render("OK 200")
      } catch(error){
        console.log(error);
        this.render('ERROR 500')
      }
  }
  async destroy(){
      try {
        Account.signOut()
        return this.render("OK 200")
      } catch(error){
        console.log(error);
        this.render('ERROR 500')
      }
  }
}
