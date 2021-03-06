import base from 'base-x';
import * as _ from 'lodash';

interface Codec {
  encode(buffer: Buffer): string;
  decode(s: string): Buffer;
  bytesForLength(n: number): number;
  padChar(): string;
}

function createCharset(s: string): string {
  const groups = s.match(/^([Aa0]+)([\+-][^\+-]+)?([\+-][^\+-]+)?$/);
  if (!groups) {
    throw new Error(`Invalid encode parameter "${s}"`);
  }
  let chars = '';
  for (const t of groups[1]) {
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
        // For safty. Should never run to here: regex already block unmatched
        throw new Error(`Invalid encoding type "${t}" in "${s}"`);
    }
  }
  for (let i = 2; i < groups.length; i++) {
    const g = groups[i];
    if (g && g[0] === '-') {
      for (const c of _.tail(g)) {
        chars = chars.split(c).join('');
      }
    }
    if (g && g[0] === '+') {
      for (const c of _.tail(g)) {
        chars += c;
      }
    }
  }
  return _.uniq(chars).join('');
}

function codec(charset: string): Codec {
  const chars = createCharset(charset);
  // it's a hack, see https://stackoverflow.com/a/37939791/94148
  const anyBase = <Codec><any>base(chars);
  anyBase.bytesForLength = (n: number) => Math.ceil(Math.log2(chars.length) * n / 8);
  anyBase.padChar = () => chars[0];
  return anyBase;
}

export {
  Codec,
  createCharset, // for test only
  codec
};
