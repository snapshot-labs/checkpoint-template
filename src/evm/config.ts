import { CheckpointConfig } from '@snapshot-labs/checkpoint';
import Poster from './abis/Poster';

const CONFIG = {
  sep: {
    networkNodeUrl: 'https://rpc.snapshot.org/11155111',
    contract: '0x000000000000cd17345801aa8147b8D3950260FF',
    start: 9082950
  }
};

export function createConfig(
  indexerName: keyof typeof CONFIG
): CheckpointConfig {
  const { networkNodeUrl, contract, start } = CONFIG[indexerName];

  return {
    network_node_url: networkNodeUrl,
    optimistic_indexing: false,
    sources: [
      {
        contract,
        start,
        abi: 'Poster',
        events: [
          {
            name: 'NewPost(address,string,string)',
            fn: 'handleNewPost'
          }
        ]
      }
    ],
    abis: {
      Poster
    }
  };
}
