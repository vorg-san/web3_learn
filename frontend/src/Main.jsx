import './App.css'
import React, {useEffect, useState} from 'react'
import web3 from './web3'
import lottery from './lottery'

const Main = () => {
  const [manager, setManager] = useState()
  const [players, setPlayers] = useState()
  const [contractBalance, setContractBalance] = useState()
  const [myAccount, setMyAccount] = useState()
  const [myBalance, setMyBalance] = useState()
  const [value, setValue] = useState(0)
  const [message, setMessage] = useState()

  useEffect(() => {
    ;(async () => {
      let manager = await lottery.methods.manager().call()
      let players = await lottery.methods.getPlayers().call()
      let contractBalance = await web3.eth.getBalance(lottery.options.address)
      var account = (await web3.eth.getAccounts())[0]
      let myBalance = await web3.eth.getBalance(account)

      setManager(manager)
      setPlayers(players)
      setContractBalance(contractBalance)
      setMyAccount(account)
      setMyBalance(myBalance)
    })()
  }, [])

  async function onSubmit(e) {
    e.preventDefault()

    setMessage('entering lottery...')

    await lottery.methods.enter().send({
      from: myAccount,
      value: web3.utils.toWei(value, 'ether'),
    })

    setMessage('entered!')
  }

  async function pickWinner() {
		setMessage('picking winner...')

    await lottery.methods.pickWinner().send({from: myAccount})

		setMessage('winner has been picked!')
  }

  return (
    <>
      Manager: {manager}
      <br />
      <br />
      Players {players?.length} competing to win {web3.utils.fromWei(contractBalance ? contractBalance : '0', 'ether')}{' '}
      ether
      <hr />
      <form onSubmit={onSubmit}>
        <h4>try your luck?</h4>
        <div>
          <label>amount of ether to enter</label>
          <input value={value} onChange={(e) => setValue(e.target.value)}></input> (wallet:{' '}
          {web3.utils.fromWei(myBalance ? myBalance : '0', 'ether')} ether)
          <button type='submit'>Enter</button>
        </div>
      </form>
      <hr />
      {message}
      <hr />
      <h4>Pick a winner</h4>
      <button onClick={pickWinner}>Pick!</button>
      <hr />
    </>
  )
}

export default Main
