import { TransactionFactory, TypedTransaction } from '@ethereumjs/tx';
import { toBuffer } from 'ethereumjs-util';

export function decodeTx(rawTx: string): DecodedTx | undefined {
  try {
    const txDataBuffer = toBuffer(rawTx);
    const tx = TransactionFactory.fromSerializedData(txDataBuffer);
    const senderAddr = tx.getSenderAddress().toString();
    return { tx, senderAddr };
  } catch (error) {
    throw new Error(
      `Failed to decode transaction: ${(error as Error).message}`,
    );
  }
}

export interface DecodedTx {
  tx: TypedTransaction;
  senderAddr: string;
}
