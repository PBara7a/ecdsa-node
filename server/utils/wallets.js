const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");

function generateWallet() {
  const privateKey = secp.utils.randomPrivateKey();
  const publicKey = secp.getPublicKey(privateKey);
  return { privateKey, publicKey };
}

const wallets = [generateWallet(), generateWallet(), generateWallet()];
wallets.forEach((wallet) => {
  console.log("Private Key: ", toHex(wallet.privateKey));
  console.log("Public Key: ", toHex(wallet.publicKey));
});

module.exports = wallets;
