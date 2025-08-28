import Checkpoint, { starknet } from '@snapshot-labs/checkpoint';
import checkpointBlocks from './checkpoints.json';
import { createConfig } from './config';
import { createWriters } from './writers';

const mainnetConfig = createConfig('sn');
const sepoliaConfig = createConfig('sn-sep');

const mainnetIndexer = new starknet.StarknetIndexer(createWriters('sn'));
const sepoliaIndexer = new starknet.StarknetIndexer(createWriters('sn-sep'));

export async function registerIndexers(checkpoint: Checkpoint) {
  checkpoint.addIndexer('sn', mainnetConfig, mainnetIndexer);
  checkpoint.addIndexer('sn-sep', sepoliaConfig, sepoliaIndexer);

  await checkpoint.seedCheckpoints('sn', checkpointBlocks);
}
