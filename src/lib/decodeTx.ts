import { TransactionFactory, TypedTransaction } from '@ethereumjs/tx';
import { toBuffer } from 'ethereumjs-util';

export interface DecodedTx {
  tx: TypedTransaction;
  senderAddr: string;
}

export function decodeTx(rawTx: string): DecodedTx {
  const txDataBuffer = toBuffer(rawTx);

  const tx = TransactionFactory.fromSerializedData(txDataBuffer);
  const senderAddr = tx.getSenderAddress().toString();

  return { tx, senderAddr };
}
