import {anyid} from '../src/index';

// Single section, random

{
  const generator = anyid().encode('Aa0').length(21).random();
  console.log('1. Single section, random');
  console.log(generator.id());
}

// Multiple sections, fix prefix
{
  const generator = anyid()
    .encode('0A-IO')
    .section(anyid().fixed(process.pid))
    .delimiter('-')
    .section(anyid().time('ms'));
  console.log('2. Multiple sections, fix value and time');
  console.log(generator.id());
}

// Time and sequence (Twitter Snowflake style)

{
  const generatorId = 1234;

  const generator = anyid()
    .encode('0')
    .bits(41).time('ms').since(new Date('2016-1-1'))
    .bits(12).seq().resetByTime()
    .bits(10).fixed(generatorId);

  console.log('3. Time and sequence (Twitter Snowflake style). Bit stream merge');
  console.log(generator.id());
}

// Function value

{
  const nanotime = () => {
    return process.hrtime()[1];
  };

  const generator = anyid()
    .encode('Aa0')
    .section(anyid().time('s'))
    .delimiter('+')
    .section(anyid().of(nanotime));

  console.log('4. Function value');
  console.log(generator.id());
}


// Different charset in section

{
  const generator = anyid()
    .encode('A-IO')
    .section(anyid().length(3).random())
    .delimiter(' ')
    .section(anyid().encode('0').length(3).random())
    .delimiter(' ')
    .section(anyid().length(3).random());

  console.log('5. Different charset in sections');
  console.log(generator.id());
}

// Single variable
/*
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