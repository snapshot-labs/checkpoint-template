import { starknet } from '@snapshot-labs/checkpoint';
import { validateAndParseAddress } from 'starknet';
import { longStringToText } from './utils';
import { Post } from '../../.checkpoint/models';

export function createWriters(indexerName: string) {
  const handleNewPost: starknet.Writer = async ({
    block,
    txId,
    rawEvent,
    event
  }) => {
    if (!block || !event || !rawEvent) return;

    const author = validateAndParseAddress(rawEvent.from_address);
    const content = longStringToText(event.content);
    const tag = longStringToText(event.tag);

    const post = new Post(`${author}/${txId}`, indexerName);
    post.author = author;
    post.content = content;
    post.tag = tag;
    post.tx_hash = txId;
    post.created_at = block.timestamp;
    post.created_at_block = block.block_number;

    await post.save();
  };

  return {
    handleNewPost
  };
}
