import crypto2 from 'crypto2'

const addresses = {}



export default class DNS{
  static get addresses(){
    return addresses;
  }
  static async add(publicKey){
    const address = await this.createAddress(publicKey)
    this.addresses[address] = {address, publicKey}
    return address;
  }

  static findByAddress(address){
    return this.addresses[address]
  }

  static findByPublicKey(publicKey){
    return Object.values(this.addresses).find( (dnsObject) => dnsObject.publicKey === publicKey )
  }

  static async createAddress(publicKey){
    const hash = await crypto2.hash(publicKey)
    return `0x${hash.substring(24,64)}`
  }
}
