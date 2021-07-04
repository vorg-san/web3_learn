const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require('web3')
const web3 = new Web3(ganache.provider())
const {interface, bytecode} = require('../compile')

let acc
let inbox

beforeEach(async () => {
	acc = await web3.eth.getAccounts()

	inbox = await new web3.eth.Contract(JSON.parse(interface))
		.deploy({data: bytecode, arguments: ['Hi']})
		.send({from: acc[0], gas: '1000000'})
})

describe('Inbox', () => {
	it('deploys', () => {
		assert.ok(inbox.options.address)
	})

	it('has message', async () => {
		let message = await inbox.methods.message().call()
		assert.strictEqual(message, 'Hi')
	})

	it('set message', async () => {
		await inbox.methods.setMessage('yooo').call().send({from:acc[0]})
		let message = await inbox.methods.message().call()
		assert.strictEqual(message, 'yooo')
	})
})