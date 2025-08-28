import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import Checkpoint, { LogLevel, starknet } from '@snapshot-labs/checkpoint';
import cors from 'cors';
import express from 'express';
import checkpointBlocks from './checkpoints.json';
import { createConfig } from './config';
import { createStarknetWriters } from './writers';

const dir = __dirname.endsWith('dist/src') ? '../' : '';
const schemaFile = path.join(__dirname, `${dir}../src/schema.gql`);
const schema = fs.readFileSync(schemaFile, 'utf8');

const mainnetConfig = createConfig('mainnet');
const sepoliaConfig = createConfig('sepolia');

const mainnetIndexer = new starknet.StarknetIndexer(
  createStarknetWriters('mainnet')
);
const sepoliaIndexer = new starknet.StarknetIndexer(
  createStarknetWriters('sepolia')
);

const checkpoint = new Checkpoint(schema, {
  logLevel: LogLevel.Info,
  prettifyLogs: true
});

checkpoint.addIndexer('mainnet', mainnetConfig, mainnetIndexer);
checkpoint.addIndexer('sepolia', sepoliaConfig, sepoliaIndexer);

async function run() {
  await checkpoint.resetMetadata();
  await checkpoint.reset();
  await checkpoint.seedCheckpoints('mainnet', checkpointBlocks);
  await checkpoint.start();
}

run();

const app = express();
app.use(express.json({ limit: '4mb' }));
app.use(express.urlencoded({ limit: '4mb', extended: false }));
app.use(cors({ maxAge: 86400 }));
app.use('/', checkpoint.graphql);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`));
