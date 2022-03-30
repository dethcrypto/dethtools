import { TransactionFactory, TypedTransaction } from '@ethereumjs/tx';
import { toBuffer } from 'ethereumjs-util';

export interface DecodedTx {
  tx: TypedTransaction;
  senderAddr: string;
}

export function decodeTx(rawTx: string): DecodedTx {
  let prefixed = rawTx.trim();

  if (rawTx.trim().substring(0, 2) !== '0x') {
    prefixed = '0x' + rawTx.trim();
  }

  const txDataBuffer = toBuffer(prefixed);

  const tx = TransactionFactory.fromSerializedData(txDataBuffer);
  const senderAddr = tx.getSenderAddress().toString();

  return { tx, senderAddr };
}
