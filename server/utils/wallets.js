const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");

function generateWallet() {
  const privateKey = secp.utils.randomPrivateKey();
  const publicKey = secp.getPublicKey(privateKey);
  const address = getAddress(publicKey);
  return { privateKey, publicKey, address };
}

function getAddress(publicKey) {
  const slicedKey = publicKey.slice(1);
  const keyHash = keccak256(slicedKey);
  return `0x${toHex(keyHash.slice(keyHash.length - 20))}`;
}

function hashMessage(message) {
  const bytes = utf8ToBytes(message);
  return keccak256(bytes);
}

const wallets = [generateWallet(), generateWallet(), generateWallet()];
wallets.forEach((wallet) => {
  console.log("Private Key: ", toHex(wallet.privateKey));
  console.log("Address: ", wallet.address);
});

module.exports = {
  wallets,
  hashMessage,
  getAddress,
};
