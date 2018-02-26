import crypto2 from 'crypto2'

const CryptoModelMixin = (superclass = Object) => class extends superclass {
  async sign(privateKey){
    return this.signature = await crypto2.sign(this.payload, privateKey)
  }

  async generateHash(){
    return this.hash = await crypto2.hash(this.payload)
  }
}

export default CryptoModelMixin
