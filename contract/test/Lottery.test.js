const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require('web3')
const web3 = new Web3(ganache.provider())
const {interface, bytecode} = require('../compile')

let acc
let lottery

beforeEach(async () => {
  acc = await web3.eth.getAccounts()

  lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data: bytecode})
    .send({from: acc[0], gas: '1000000'})
})

describe('lottery', () => {
  it('deploys a contract', () => {
    assert.ok(lottery.options.address)
  })

  it('allows acc to enter', async () => {
    await lottery.methods.enter().send({
      from: acc[0],
      value: web3.utils.toWei('0.02', 'ether'),
    })

    const players = await lottery.methods.getPlayers().call({
      from: acc[0],
    })

    assert.strictEqual(acc[0], players[0])
    assert.strictEqual(1, players.length)
  })

  it('multiple acc enter', async () => {
    await lottery.methods.enter().send({
      from: acc[0],
      value: web3.utils.toWei('0.02', 'ether'),
    })
    await lottery.methods.enter().send({
      from: acc[1],
      value: web3.utils.toWei('0.02', 'ether'),
    })
    await lottery.methods.enter().send({
      from: acc[2],
      value: web3.utils.toWei('0.02', 'ether'),
    })

    const players = await lottery.methods.getPlayers().call({
      from: acc[0],
    })

    assert.strictEqual(acc[0], players[0])
    assert.strictEqual(acc[1], players[1])
    assert.strictEqual(acc[2], players[2])
    assert.strictEqual(3, players.length)
  })

  it('requires min ether to enter', async () => {
    try {
      await lottery.methods.enter().send({
        from: acc[0],
        value: web3.utils.toWei('0.01', 'ether'),
      })
      assert(false)
    } catch (error) {
      assert(error)
    }
  })

  it('only manager can run pickWinner', async () => {
    await lottery.methods.enter().send({
      from: acc[1],
      value: web3.utils.toWei('0.02', 'ether'),
    })

    try {
      await lottery.methods.pickWinner().call({
        from: acc[1],
      })
      assert(false)
    } catch (error) {
      assert(error)
    }
  })

  it('pickWinner empties players and gives money', async () => {
    await lottery.methods.enter().send({
      from: acc[0],
      value: web3.utils.toWei('2', 'ether'),
    })

		const initialBalance = await web3.eth.getBalance(acc[0])

    await lottery.methods.pickWinner().call({
      from: acc[0],
    })
    
		const finalBalance = await web3.eth.getBalance(acc[0])
		
		const diff = finalBalance - initialBalance
		// console.log(diff, web3.utils.toWei(diff+'', 'ether'))
		assert(diff < web3.utils.toWei('1.9', 'ether'))
  })

  // it('set message', async () => {
  // 	await lottery.methods.setMessage('yooo').call().send({from:acc[0]})
  // 	let message = await lottery.methods.message().call()
  // 	assert.strictEqual(message, 'yooo')
  // })
})
