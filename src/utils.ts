import * as _ from 'lodash';

/*
 * 0B0000
 * 0B0001
 * 0B0011
 * ......
 */
const BIT_MASKS = _.range(0, 31).map(i => 0xFFFFFFFF >>> i);

/**
 * Input a bit stream which is align right in a Buffer.
 * Normalize it to Buffer whose length is multiple of 4 and fill unused bits at the left with 0.
 */
function normalize(buf: Buffer, bits: number): Buffer {
  const length = Math.ceil(bits / 32) * 4;
  const target = Buffer.allocUnsafe(length);
  buf.copy(target, 0, buf.length - length, length);
  return target;
}

/**
 * Concatenate two bit streams into one.
 * Bit streams are right align in a Buffer. Unused bits at the left of input Buffer are ignored.
 * Length of output Buffer is multiple of 4. Unused bits at the left are filled with 0.
 */
export function concatBits(buf1: Buffer, bits1: number, buf2: Buffer, bits2: number): Buffer {
  const buf = Buffer.allocUnsafe(Math.ceil((bits1 + bits2) / 32) * 4);
  const buf2SignificantBytes = Math.ceil(bits2 / 32) * 4;
  let targetOffset = buf.length - buf2SignificantBytes;

  // copy buf2 into output buf, right align
  buf2.copy(buf, targetOffset, buf2.length - buf2SignificantBytes, buf2SignificantBytes);

  const filledBitsInTarget = bits2 % 32;
  if (filledBitsInTarget > 0) {
    targetOffset++;
  }

  const sourceBuf = normalize(buf1, bits1);
  let sourceReadOffset = sourceBuf.length;

  let uncopiedBytes = sourceBuf.length;
  while (uncopiedBytes > 0) {

    sourceReadOffset -= 4;
    const source4bytes = buf1.readUInt32LE(sourceReadOffset);

    targetOffset -= 4;
    let target4bytes = buf.readUInt32LE(targetOffset);

    target4bytes =
      target4bytes & BIT_MASKS[filledBitsInTarget] |
      source4bytes << filledBitsInTarget;
    buf.writeUInt32LE(target4bytes, targetOffset);

    target4bytes = source4bytes >>> ( 32 - filledBitsInTarget);
    const bytesToWrite = targetOffset > 4 ? 4 : targetOffset;
    buf.writeUIntLE(target4bytes, targetOffset - bytesToWrite, bytesToWrite);

    uncopiedBytes -= 4;
  }

  return buf;
}

/*
export function concatBits_old(buf1: Buffer, bits1: number, buf2: Buffer, bits2: number): Buffer {
  const buf = Buffer.allocUnsafe(Math.ceil((bits1 + bits2) / 32) * 4);
  const buf2SignificantBytes = Math.ceil(bits2 / 32) * 4;
  let targetOffset = buf.length - buf2SignificantBytes;

  // copy buf2 into output buf, right align
  buf2.copy(buf, targetOffset, buf2.length - buf2SignificantBytes, buf2SignificantBytes);

  const filledBitsInTarget = bits2 % 32;
  if (filledBitsInTarget > 0) {
    targetOffset++;
  }
  let buf1UncopiedBits = bits1;
  let buf1ReadOffset = buf1.length;

  while (buf1UncopiedBits > 0) {
    const bytesToCopy =
      buf1UncopiedBits > 32 ?
        (buf1UncopiedBits > 16 ? 2 : 1)
        : 4;
    buf1ReadOffset -= bytesToCopy;
    const sourceBytes = buf1.readUIntLE(buf1ReadOffset, bytesToCopy);
    buf1UncopiedBits -= bytesToCopy * 8;
    targetOffset -= bytesToCopy;
    let targetBytes = buf.readUIntLE(targetOffset, bytesToCopy);

    targetBytes =
      targetBytes & BIT_MASKS[filledBitsInTarget] |
      sourceBytes << filledBitsInTarget & ~ (BIT_MASKS[filledBitsInTarget] << bytesToCopy * 8);
    buf.writeUIntLE(targetBytes, targetOffset, bytesToCopy);

    targetBytes = sourceBytes >>> ( bytesToCopy * 8 - filledBitsInTarget);
    buf.writeUIntLE(targetBytes, targetOffset - bytesToCopy, bytesToCopy);
  }

  return buf;
}
*/