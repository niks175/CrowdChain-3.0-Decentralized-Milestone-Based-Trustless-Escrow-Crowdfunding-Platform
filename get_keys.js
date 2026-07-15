const { ethers } = require("ethers");
const mnemonic = "test test test test test test test test test test test junk";
for (let i = 0; i < 20; i++) {
    const wallet = ethers.Wallet.fromMnemonic(mnemonic, `m/44'/60'/0'/0/${i}`);
    console.log(`Account #${i}: ${wallet.address}`);
    console.log(`Private Key: ${wallet.privateKey}\n`);
}
