
# AnyID - ID generator

_Under development_

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
- [AnyID - ID generator](#anyid---id-generator)
  - [Encode](#encode)
  - [Length](#length)
  - [Value](#value)
    - [Fix value: `fix(n: number | Buffer | string)`](#fix-value-fixn-number--buffer--string)
    - [Function result: `of( f: () => number | Buffer | string )`](#function-result-of-f---number--buffer--string-)
    - [Variable: `var( name?: string )`](#variable-var-name-string-)
    - [Random: `random()`](#random-random)
    - [Time: `time(unit: string = 'ms')`](#time-timeunit-string--ms)
    - [Sequence: `seq()`](#sequence-seq)
  - [Validate by checksum](#validate-by-checksum)
  - [Examples:](#examples)
    - [Single section, random](#single-section-random)
    - [Multiple sections, fix prefix](#multiple-sections-fix-prefix)
    - [Time and sequence (Twitter Snowflake style)](#time-and-sequence-twitter-snowflake-style)
    - [Function value](#function-value)
    - [Different charset in section](#different-charset-in-section)
    - [Single variable](#single-variable)
    - [Multiple variable](#multiple-variable)
    - [Checksum](#checksum)
    - [Parse](#parse)
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

    sdk3ksxjcs-JEDke3x8F-sldle34CZs
    ^         ^
    |         |
    + section + delimiter

ID is compounded by sections with optional delimiter.
Each section has codec and length

## Encode

Encode with given charset.

Charset is specified by simple letter:

* `A` - Alphabet in upper case
* `a` - Alphabet in lower case
* `0` - Numeric

Individual letters can be exclude by followed after `-`

Example:

* `Aa0` = A-Z a-z 0-9
* `0A-IO` = 0-9 A-Z, excludes `I` and `O`

There are special encoding:

* `bin` - output the raw byte array
* `hex` - hex representation

## Length

Section can have fixed length or not. When length is specified, section will be trimmed or padded. For some kinds of value, e.g. random, length must be given.

> **Hint** What length will be?
>
>     b: value bytes
>     a: Charset size
>     length ≧ logₐ256ᵇ = log₂ 256ᵇ / log₂ a = 8b / log₂ a
>
> For example:
>
> Value is 4 bytes UInt32, charset is A-Za-z0-9 which has 62 characters.
> `8 * 4 / log₂ 62 = 5.37`. Maximum length will be 6.

## Value

Value can be:

- fix value
- function result
- variable
- random
- time
- sequence

A section may have more than one values. Values will be concatenated as bit stream before encoded.
You can use `bits(n: number)` to specify the bit width of a value.

### Fix value: `fix(n: number | Buffer | string)`

Value is either non-negative integer (UInt32), Buffer (byte array) or string.

### Function result: `of( f: () => number | Buffer | string )`

Similar to fix value, but the value is returned by a function every time.

### Variable: `var( name?: string )`

Similar to fix value, but the value is specified in `id()` function call.

When there is only one variable used in ID generator, the name can be omitted.

### Random: `random()`

Fills section with random value. Length must be specified.

### Time: `time(unit: string = 'ms')`

Unit can be `ms`, `s`, `m`, `h`, `d`.

`since(t: Date)`

By default, time value is since UNIX epoch time.

### Sequence: `seq()`

`startWith(n: number)`

By default, sequence starts with 0.

`resetByTime()`

There must be a time segment in the ID. Reset when the time value is changed.

`max(n: number)`

Max value of the sequence. Sequence will be reset after it reaches max value.
It can not exceed 2^32 (max value represented by UInt32).

## Validate by checksum

Supported checksum algorithms:

- crc8
- crc16
- crc32
- md5
- sha-1

`checksum(algorithm: string, length?: number)`

## Examples:

### Single section, random

``` js
const generator = Id.encode('Aa0').length(21).random();
const id = generator.id();
```

### Multiple sections, fix prefix

``` js
const generator = Id
  .encode('0A-IO')
  .section(
    Id.fix(process.pid);
  )
  .delimiter('-')
  .section(
    Id.time('ms'));
  );
```

### Time and sequence (Twitter Snowflake style)

``` js
const generator = Id
  .encode('bin')
  .bit(41).time('ms').since(new Date('2016-1-1'))
  .bit(12).seq().resetByTime();
  .bit(10).fix(generatorId);
```

### Function value

``` js
const nanotime = () => {
  return process.hrtime()[1];
};

const generator = Id
  .encode('Aa0')
  .section(
    Id.time('s')
  )
  .section(
    Id.of(nanotime);
  );
```

### Different charset in section

``` js
const generator = Id
  .encode('A')
  .section(
    Id.time('s');
  )
  .section(
    Id.encode('Aa0').length(5).random();
  );
```

### Single variable

``` js
const generator = Id
  .encode('Aa0')
  .section(
    Id.var();
  )
  .delimiter('-')
  .section(
    Id.encode('Aa0').length(5).random();
  );
const id = generator.id(userId);
```

### Multiple variable

``` js
const generator = Id
  .encode('Aa0')
  .section(
    Id.var('countryId');
  )
  .delimiter('-')
  .section(
    Id.var('userId');
  )
  .delimiter('-')
  .section(
    Id.encode('Aa0').length(5).random();
  );
const id = generator.id({countryId, userId});
```

### Checksum

``` js
const generator = Id
  .encode('Aa0')
  .section(
    Id.time();
  )
  .section(
    Id.length(5).random();
  )
  .checksum('crc16');
const id = generator.id();
generator.validate(id); // true
```

### Parse

``` js
const generator = Id
  .encode('Aa0')
  .section(
    Id.fix(datacenterId);
  )
  .delimiter('-')
  .section(
    Id.length(6).time()
  )
  .section(
    Id.length(5).random();
  );
const id = generator.id(userId);
generator.parse(id);
// { section: [
//   { value: [123] },
//   { value: [<Date>, <Buffer>]
//   ] }
```
