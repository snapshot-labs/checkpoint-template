import { evm } from '@snapshot-labs/checkpoint';
import Poster from './abis/Poster';
import { Post } from '../../.checkpoint/models';

export function createWriters(indexerName: string) {
  const handleNewPost: evm.Writer<typeof Poster, 'NewPost'> = async ({
    block,
    blockNumber,
    txId,
    rawEvent,
    event
  }) => {
    if (!block || !event || !rawEvent) return;

    const author = event.args.user;
    const content = event.args.content;
    const tag = event.args.tag;

    const post = new Post(`${author}/${txId}`, indexerName);
    post.author = author;
    post.content = content;
    post.tag = tag;
    post.tx_hash = txId;
    post.created_at = Number(block.timestamp);
    post.created_at_block = blockNumber;

    await post.save();
  };

  return {
    handleNewPost
  };
}
