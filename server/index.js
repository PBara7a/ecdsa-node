const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const secp = require("ethereum-cryptography/secp256k1");
const { wallets, hashMessage, getAddress } = require("./utils/wallets");

const balances = {
  [wallets[0].address]: 100,
  [wallets[1].address]: 50,
  [wallets[2].address]: 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", async (req, res) => {
  const { recipient, amount, signedTransaction } = req.body;

  const [signatureObj, recoveryBit] = signedTransaction;
  const signature = Uint8Array.from(Object.values(signatureObj));

  const messageHash = hashMessage(recipient + amount)
  const senderPublicKey = secp.recoverPublicKey(messageHash, signature, recoveryBit);

  const isValidTransaction = secp.verify(signature, messageHash, senderPublicKey);

  const sender = getAddress(senderPublicKey);

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (!isValidTransaction) {
    return res.status(400).send({ message: "Invalid Transaction!" });
  }

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
