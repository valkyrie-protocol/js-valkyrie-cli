import BaseValidator from '~/app/validators/BaseValidator'
import CryptoValidatorMixin from '~/app/validators/mixins/CryptoValidatorMixin'

export default class NoteValidator extends CryptoValidatorMixin(BaseValidator){
  verifyRequiredFields(){
    delete this.errors.requiredFields

    const requiredFields = this.object.sender && this.object.signature && this.object.hash && Object.keys(this.object.entries).length > 0

    if(!requiredFields){
      this.errors.requiredFields = 'Some of required fields are undefined'
    }

    return requiredFields
  }

  async isValid(){
    const validSignature = await this.verifySignature()
    const validHash = await this.verifyHash()

    return this.verifyRequiredFields() && validSignature && validHash
  }
}
