import BaseValidator from '~/app/validators/BaseValidator'
import NoteValidator from '~/app/validators/NoteValidator'
import CryptoValidatorMixin from '~/app/validators/mixins/CryptoValidatorMixin'
import Note from '~/app/models/Note'

export default class BlockValidator extends CryptoValidatorMixin(BaseValidator){
  verifyRequiredFields(){
    delete this.errors.requiredFields
    const requiredFields = this.object.sender && this.object.signature && this.object.hash && this.object.entries.length > 0
    if(!requiredFields){
      this.errors.requiredFields = 'Some of required fields are undefined'
    }
    return requiredFields
  }

  async verifyEntries(){
    delete this.errors.entries
    let validEntries = true

    for(let entry of this.object.entries){
      validEntries = validEntries && await new NoteValidator(entry).isValid()
    }
    if(!validEntries){
      this.errors.entries = 'Some of entries are invalid'
    }
    return validEntries
  }

  verifyMerkleRoot(){
    delete this.errors.merkleRoot

    const validMerkleRoot = this.object.merkleRoot === this.object.merkleTree.root()
    if(! validMerkleRoot){
      this.errors.merkleRoot = 'Block merkle root is invalid'
    }
    return validMerkleRoot
  }

  async isValid(){
    const validSignature = await this.verifySignature()
    const validHash = await this.verifyHash()
    const validEntries = await this.verifyEntries()
    const validMerkleRoot =  this.verifyMerkleRoot()
    return this.verifyRequiredFields() && validSignature && validHash && validEntries && validMerkleRoot
  }

}
