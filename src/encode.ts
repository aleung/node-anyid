import * as baseX from 'base-x';

/**
 * Unsigned byte array
 */
interface EncodeBuffer {
  [index: number]: number;
  length: number;
}

interface Codec {
  encode(buffer: EncodeBuffer): string;
  decode(s: string): number[];
  bytesForLength(n: number): number;
  padChar(): string;
}

function createCharset(s: string): string {
  let chars = '';
  const [charTypes, excludedChars] = s.split('-');
  for (let t of charTypes) {
    switch (t) {
      case '0':
        chars += '0123456789';
        break;
      case 'A':
        chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        break;
      case 'a':
        chars += 'abcdefghijklmnopqrstuvwxyz';
        break;
      default:
        throw new Error(`Invalid encoding type "${t}" in "${s}"`);
    }
  }
  if (excludedChars) {
    for (let c of excludedChars) {
      chars = chars.split(c).join('');
    }
  }
  return chars;
}

function codec(charset: string): Codec {
  const chars = createCharset(charset);
  const codec = <Codec>baseX(chars);
  codec.bytesForLength = (n: number) => Math.ceil(Math.log2(chars.length) * n / 8);
  codec.padChar = () => chars[0];
  return codec;
}

export {
EncodeBuffer, Codec,
createCharset, // for test only
codec
}