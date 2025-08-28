import Checkpoint, { evm } from '@snapshot-labs/checkpoint';
import { createConfig } from './config';
import { createWriters } from './writers';

const sepoliaConfig = createConfig('sep');

const sepoliaIndexer = new evm.EvmIndexer(createWriters('sep'));

export async function registerIndexers(checkpoint: Checkpoint) {
  checkpoint.addIndexer('sep', sepoliaConfig, sepoliaIndexer);
}
