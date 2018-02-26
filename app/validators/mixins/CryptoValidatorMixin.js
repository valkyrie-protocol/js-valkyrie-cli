import crypto2 from 'crypto2'
import DNS from '~/app/models/DNS'

const CryptoValidatorMixin = (superclass = Object) => class extends superclass {
  async verifySignature(){
    delete this.errors.signature
    const {publicKey} = DNS.findByAddress(this.object.sender)
    if(await crypto2.verify(this.object.payload, publicKey, this.object.signature)){
      return true
    }
    this.errors.signature = 'Note signature is invalid'
    return false;
  }

  async verifyHash(){
    delete this.errors.signature
    if(this.object.hash === await crypto2.hash(this.object.payload)){
      return true;
    }
    this.errors.hash = 'Note signature is invalid'
    return false
  }
};

export default CryptoValidatorMixin
