import { anyid } from '../src/index';

// There are examples, not test cases. They don't assert the result.
// To run:
//     gulp test -m example

// tslint:disable:no-console

describe('[anyid examples]', () => {

  it('Single section, random value', () => {
    console.log(
      anyid().encode('Aa0').length(21).random().id()
    );
  });

  it('Multiple sections, fix prefix and timestamp', () => {
    console.log(
      anyid()
        .encode('0A-IO')
        .section(anyid().fixed(process.pid))
        .delimiter('-')
        .section(anyid().time())
        .id()
    );
  });

  it('Function value', () => {
    const nanotime = () => {
      return process.hrtime()[1];
    };
    console.log(
      anyid()
        .encode('Aa0')
        .section(anyid().time('s'))
        .delimiter('+')
        .section(anyid().of(nanotime))
        .id()
    );
  });

  it('Use different charset in sections', () => {
    console.log(
      anyid()
        .encode('A-IO')
        .section(anyid().length(3).random())
        .delimiter(' ')
        .section(anyid().encode('0').length(3).random())
        .delimiter(' ')
        .section(anyid().length(3).random())
        .id()
    );
  });

  it('Single variable', () => {
    console.log(
      anyid()
        .encode('Aa0')
        .section(anyid().variable())
        .delimiter('-')
        .section(anyid().time())
        .id(Buffer.from('user-xxx'))
    );
  });

  it('Multiple variables', () => {
    console.log(
      anyid()
        .encode('Aa0')
        .section(anyid().variable('countryId'))
        .delimiter('-')
        .section(anyid().variable('userId'))
        .delimiter('-')
        .section(anyid().length(5).random())
        .id({ countryId: 86, userId: 635023 })
    );
  });

});
