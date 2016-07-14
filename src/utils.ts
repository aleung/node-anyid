import * as assert from 'assert';
import * as _ from 'lodash';

// for debug
function logBin(n: number) {
  const bin = _.padStart((n >>> 0).toString(2), 32, '0');
  const hex = _.padStart((n >>> 0).toString(16), 8, '0');
  console.log(bin, hex);
}

/*
 * 0B0000
 * 0B0001
 * 0B0011
 * ......
 */
const BIT_MASKS = _.range(0, 31).map(i => ~ (0xFFFFFFFF << i));

/**
 * Input a bit stream which is align right in a Buffer.
 * Normalize it to Buffer whose length is multiple of 4 and fill unused bits at the left with 0.
 */
export function normalize(source: Buffer, bits: number): Buffer {
  const sourceSignificantBytes = Math.ceil(bits / 8);
  assert(source.length >= sourceSignificantBytes, 'Source buffer has no enought bits');
  const targetLength = Math.ceil(bits / 32) * 4;
  const target = Buffer.alloc(targetLength);
  source.copy(target, targetLength - sourceSignificantBytes,
    source.length - sourceSignificantBytes);
  // fill usused bits at the left with 0
  const unusedBits = targetLength * 8 - bits;
  if (unusedBits > 0) {
    let highestBytes = target.readUInt32BE(0);
    highestBytes = highestBytes & BIT_MASKS[32 - unusedBits];
    target.writeUInt32BE(highestBytes, 0);
  }

  return target;
}

/**
 * Concatenate two bit streams into one.
 * Bit streams are right align in a Buffer. Unused bits at the left of input Buffer are ignored.
 * Length of output Buffer is multiple of 4. Unused bits at the left are filled with 0.
 */
export function concatBits(buf1: Buffer, bits1: number, buf2: Buffer, bits2: number): Buffer {
  const buf = Buffer.allocUnsafe(Math.ceil((bits1 + bits2) / 32) * 4);
  const buf2SignificantBytes = Math.ceil(bits2 / 8);
  let targetOffset = buf.length - buf2SignificantBytes;

  // copy buf2 into output buf, right align
  buf2.copy(buf, targetOffset, buf2.length - buf2SignificantBytes);

  targetOffset = buf.length - Math.ceil(bits2 / 32) * 4;
  const filledBitsInTarget = bits2 % 32;
  if (filledBitsInTarget === 0) {
    targetOffset -= 4;
  }

  const sourceBuf = normalize(buf1, bits1);
  let sourceReadOffset = sourceBuf.length;

  let uncopiedBytes = sourceBuf.length;
  while (uncopiedBytes > 0) {
    sourceReadOffset -= 4;
    const source4bytes = sourceBuf.readUInt32BE(sourceReadOffset);

    let target4bytes = buf.readUInt32BE(targetOffset);

    target4bytes =
      (target4bytes & BIT_MASKS[filledBitsInTarget] |
      source4bytes << filledBitsInTarget)
      >>> 0;
    buf.writeUInt32BE(target4bytes, targetOffset);

    if (filledBitsInTarget > 0) {
      target4bytes = source4bytes >>> ( 32 - filledBitsInTarget);
      const bytesToWrite = targetOffset > 4 ? 4 : targetOffset;
      buf.writeUIntBE(target4bytes, targetOffset - bytesToWrite, bytesToWrite);
    }

    targetOffset -= 4;
    uncopiedBytes -= 4;
  }

  return buf;
}
