const bip39 = require("bip39");
const ethers = require("ethers");

async function init() {
  const mnemonic = bip39.generateMnemonic();
  console.log(mnemonic);

  const wallet = await ethers.Wallet.fromMnemonic(mnemonic);
  console.log(wallet.address);
}
init();