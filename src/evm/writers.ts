import { evm } from '@snapshot-labs/checkpoint';
import { Post } from '../../.checkpoint/models';

export function createWriters(indexerName: string) {
  const handleNewPost: evm.Writer = async ({
    block,
    blockNumber,
    txId,
    rawEvent,
    event
  }) => {
    if (!block || !event || !rawEvent) return;

    const author = event.args[0];
    const content = event.args[1];

    const post = new Post(`${author}/${txId}`, indexerName);
    post.author = author;
    post.content = content;
    post.tag = 'unavailable';
    post.tx_hash = txId;
    post.created_at = block.timestamp;
    post.created_at_block = blockNumber;

    await post.save();
  };

  return {
    handleNewPost
  };
}
