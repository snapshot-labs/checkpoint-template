import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import Checkpoint, { LogLevel } from '@snapshot-labs/checkpoint';
import cors from 'cors';
import express from 'express';
import { registerIndexers as registerEvmIndexers } from './evm';
import { registerIndexers as registerStarknetIndexers } from './starknet';

const dir = __dirname.endsWith('dist/src') ? '../' : '';
const schemaFile = path.join(__dirname, `${dir}../src/schema.gql`);
const schema = fs.readFileSync(schemaFile, 'utf8');

const checkpoint = new Checkpoint(schema, {
  logLevel: LogLevel.Info,
  prettifyLogs: true
});

async function run() {
  await registerEvmIndexers(checkpoint);
  await registerStarknetIndexers(checkpoint);

  await checkpoint.resetMetadata();
  await checkpoint.reset();
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
