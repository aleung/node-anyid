import {anyid} from '../src/index';

// Single section, random

{
  const generator = anyid().encode('Aa0').length(21).random();
  const id = generator.id();
}

// Multiple sections, fix prefix
/*

{
  const generator = anyid()
    .encode('0A-IO')
    .section(
    anyid().fix(process.pid);
  )
  .delimiter('-')
    .section(
    anyid().time('ms'));
  );
}

// Time and sequence (Twitter Snowflake style)

const generator = anyid()
  .encode('bin')
  .bit(41).time('ms').since(new Date('2016-1-1'))
  .bit(12).seq().resetByTime();
  .bit(10).fix(generatorId);

// Function value

const nanotime = () => {
  return process.hrtime()[1];
};

const generator = anyid()
  .encode('Aa0')
  .section(
  anyid().time('s')
  )
  .section(
  anyid().of(nanotime);
  );

// Different charset in section

const generator = anyid()
  .encode('A')
  .section(
  anyid().time('s');
  )
  .section(
  anyid().encode('Aa0').length(5).random();
  );

// Single variable

const generator = anyid()
  .encode('Aa0')
  .section(
  anyid().var();
  )
  .delimiter('-')
  .section(
  anyid().encode('Aa0').length(5).random();
  );
const id = generator.id(userId);

// Multiple variable

const generator = anyid()
  .encode('Aa0')
  .section(
  anyid().var('countryId');
  )
  .delimiter('-')
  .section(
  anyid().var('userId');
  )
  .delimiter('-')
  .section(
  anyid().encode('Aa0').length(5).random();
  );
const id = generator.id({ countryId, userId });

// Checksum

const generator = anyid()
  .encode('Aa0')
  .section(
  anyid().time();
  )
  .section(
  anyid().length(5).random();
  )
  .checksum('crc16');
const id = generator.id();
generator.validate(id); // true

// Parse

const generator = anyid()
  .encode('Aa0')
  .section(
  anyid().fix(datacenterId);
  )
  .delimiter('-')
  .section(
  anyid().length(6).time()
  )
  .section(
  anyid().length(5).random();
  );
const id = generator.id(userId);
generator.parse(id);
// { section: [
//   { value: [123] },
//   { value: [<Date>, <Buffer>]
//   ] }

*/