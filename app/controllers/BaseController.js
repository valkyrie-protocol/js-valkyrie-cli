export default class BaseController{
  constructor({request, response}){
    this.request = request
    this.response = response
  }

  get headers(){
    return this.request.headers
  }

  get params(){
    return this.request.params || {}
  }

  get body(){
    return this.request.body || {}
  }

  get query(){
    return this.request.query || {}
  }

  get host(){
    return request.headers.host
  }

  render(data){
    return this.response.send(data)
  }
}
