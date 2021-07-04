const HDWalletProvider = require('truffle-hdwallet-provider')
const Web3 = require('web3')
const {interface, bytecode} = require('./compile')

const provider = new HDWalletProvider(process.env.mnemonic, 'https://rinkeby.infura.io/v3/96ec84f81ac840078a8d106efafbe3f6')
const web3 = new Web3(provider)

// const address = '0x99dC4fAeA501B2b872f3dDdFfe0092A38DF46eF0'