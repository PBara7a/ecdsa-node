import * as secp from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes } from "ethereum-cryptography/utils";

export function hashMessage(message) {
  const bytes = utf8ToBytes(message);
  return keccak256(bytes);
}

export async function signMessage(message, privateKey) {
  const msgHash = hashMessage(message);
  return secp.sign(msgHash, privateKey, { recovered: true });
}
