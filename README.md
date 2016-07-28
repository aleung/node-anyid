
# AnyID - ID generator for node.js

[![npm version](https://img.shields.io/npm/v/anyid.svg?maxAge=2592000)](https://www.npmjs.com/package/anyid)

_Under development, use at your own risk. Please wait for 1.0 release to use in production._

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Introduction](#introduction)
- [Encode](#encode)
- [Section and Delimiter](#section-and-delimiter)
- [Value](#value)
  - [Random](#random)
  - [Timestamp](#timestamp)
  - [Sequence](#sequence)
  - [Fixed value](#fixed-value)
  - [Function result](#function-result)
  - [Variable _(coming)_](#variable-_coming_)
- [Examples](#examples)
  - [Single section, random value](#single-section-random-value)
  - [Multiple sections, fix prefix and timestamp](#multiple-sections-fix-prefix-and-timestamp)
  - [Sequence and bit stream concatenation](#sequence-and-bit-stream-concatenation)
  - [Function value](#function-value)
  - [Use different charset in sections](#use-different-charset-in-sections)
  - [Single variable _(coming)_](#single-variable-_coming_)
  - [Multiple variables _(coming)_](#multiple-variables-_coming_)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Introduction

AnyID is a simple and flexible API to generate <!-- and parse --> various kinds of string ID / code.

The generated ID is compounded by sections with optional delimiter.
Each section is encoded into specificed chars and may have fix length.

    sdk3ksxjcs-JEDke3x8F-sldle34CZs
    ^^^^^^^^^^          ^
    │                   │
    └ section           └ delimiter

A section may contain one or more values. Multiple values are concatenated into bit stream before encoded.

    ┌───────────────────────┬───────────────┬──────────────────┐
    │  timestamp (41 bits)  │ seq (12 bits) │ worker (10 bits) │
    └───────────────────────┴───────────────┴──────────────────┘

Use it in your code:

``` js
import {anyid} from 'anyid';
const ids = anyid().encode('Aa0').length(21).random();
console.log(ids.id());
```

## Encode

Encode with given charset:

``` typescript
encode(charset: string)
```

Charset is specified by simple letter:

* `A` - Alphabet in upper case
* `a` - Alphabet in lower case
* `0` - Numeric

Individual letters can be exclude by followed after `-`

Example:

* `Aa0` = A-Z a-z 0-9
* `0A-IO` = 0-9 A-Z, excludes `I` and `O`

## Section and Delimiter

A section accepts an `AnyId` object as parameter. For ID containing single section, `section` function is not used.

``` typescript
section( anyid: AnyId )
```

Section length can be fixed or variant. When length is specified, section will be trimmed or padded at beginning side.

``` typescript
length(n: number)
```

For some kinds of value, e.g. random, length must be given.

> **Hint** What length will be if not specified?
>
>     b: value bytes
>     a: charset size
>     length ≧ logₐ256ᵇ = log₂ 256ᵇ / log₂ a = 8b / log₂ a
>
> For example:
>
> Value is 4 bytes UInt32, charset is A-Za-z0-9 which has 62 characters.
> `8 * 4 / log₂ 62 = 5.37`. Maximum length will be 6.

Delimiter can be put between sections. It's output as is and never be encoded.

``` typescript
delimiter( s: string )
```

## Value

AnyID supports several value types:

- random
- timestamp
- sequence
- fix value
- function result
- variable _(coming)_

A section may have more than one values. Values will be concatenated as bit stream before encoded.

You can use `bits` to specify the bit width of a value. Higher bits will be discard if value has more bits than desired.

``` typescript
bits( n: number )
```

### Random

Generate value by random. Length or bits must be specified.

``` typescript
random()
```

### Timestamp

Use current timestamp as value.

``` typescript
time( unit: string = 'ms' )
```

Unit can be `ms`, `s`, `m`, `h`, `d`.

By default, timestamp value is since UNIX epoch time. You can overwrite it to a recent date to save some bits.

``` typescript
since( t: Date )
```

### Sequence

Sequence increases everytime an ID is generated.

``` typescript
seq()
```

By default, sequence starts from 0. You can set it to any non-negative integer.

``` typescript
startWith( n: number )
```

Sequence will be reset after it reaches max value.
It can not exceed `2^32` (max value represented by UInt32).

``` typescript
max( n: number )
```

Or, let it reset when timestamp changes:

``` typescript
resetByTime()
```

To use `resetByTime`, there must be a timestamp value in the ID.


### Fixed value

``` typescript
fixed( n: number | Buffer )
```

Value is either non-negative integer (UInt32) or Buffer (byte array).

### Function result

Similar to fix value, but the value is returned by a function which is called an ID is to be generated.

``` typescript
of( f: () => number | Buffer )
```

### Variable _(coming)_

Similar to fix value, but the value is given in `id` function call. Read example below to check how it's used.

``` typescript
var( name?: string )
```

When there is only one variable used in ID generator, the name can be omitted.

<!--

## Checksum _(coming)_

Append checksum at the end of generated ID:

``` typescript
checksum(algorithm: string, length?: number)
```

Supported checksum algorithms:

- crc8
- crc16
- crc32
- md5
- sha-1

To validate an ID which has checksum:

``` typescript
validate()
```

## Parse _(coming)_

Parse an ID to retrieve encoded values inside is possible when delimiter is used or length/bits is specified.

``` typescript
parse(id: string)
```

It gives you an object containing values like:

``` js
{ sections: [
   { values: [123] },
   { values: [<Date>, <Buffer>]
] }
```

-->

## Examples

### Single section, random value

This id has essence the same low probability of a clash as type 4 (random) UUID:

``` js
const ids = anyid().encode('Aa0').length(21).random()
const id  = ids.id();
```

    1LrKcmd0uk1Ma8szUxtda

### Multiple sections, fix prefix and timestamp

``` js
const ids = anyid()
  .encode('0A-IO')
  .section( anyid().fixed(process.pid) )
  .delimiter('-')
  .section( anyid().time() );
```

It uses human friendly charset: `I` and `O` are excluded because of similarity to `1` and `0`.

    008CL-00TYMZS0P3

### Sequence and bit stream concatenation

It's Twitter Snowflake style ID with timestamp, sequence and worker.

``` js
const ids = anyid()
  .encode('0')
  .bit(41).time().since(new Date('2016-7-1'))
  .bit(12).seq().resetByTime();
  .bit(10).fix(workerId);
```

Timestamp is since 2016-7-1. Sequence is reset every millisecond.

    071243223959339218

### Function value

ID contains second and nanosecond. Nanosecond is retrieved by a function.

``` js
const nanotime = () => {
  return process.hrtime()[1];
};

const ids = anyid()
  .encode('Aa0')
  .section( anyid().time('s') )
  .delimiter('+')
  .section( anyid().of(nanotime) );
```

    BlX6bX+j3Uz0

### Use different charset in sections

The ID has default charset `A-IO`. The second section uses charset `0`.

``` js
const ids = anyid()
  .encode('A-IO')
  .section( anyid().length(3).random() )
  .delimiter(' ')
  .section( anyid().encode('0').length(3).random() )
  .delimiter(' ')
  .section( anyid().length(3).random() );
```

    HQX 552 ATC

### Single variable _(coming)_

``` js
const ids = anyid()
  .encode('Aa0')
  .section( anyid().var() )   // --> userId
  .section( anyid().time() );

const id = ids(userId);
```

### Multiple variables _(coming)_

``` js
const ids = anyid()
  .encode('Aa0')
  .section( anyid().var('countryId') )
  .delimiter('-')
  .section( anyid().var('userId') )
  .delimiter('-')
  .section( anyid().length(5).random() );

const id = ids.id({countryId, userId});
```

<!--

### Checksum _(coming)_

``` js
const ids = anyid()
  .encode('Aa0')
  .section( anyid().time() )
  .section( anyid().length(5).random() )
  .checksum('crc16');

const id = ids();

ids.validate(id); // true
```

### Parse  _(coming)_

``` js
const ids = Id
  .encode('Aa0')
  .section(
    anyid().bits(4).fix(datacenterId)
           .bits(12).fix(workerId)
  )
  .delimiter('-')
  .section( anyid().time() )

const id = ids.id();

ids.parse(id);
// { sections: [
//   { value: [2], [324] },
//   { value: [<Date>] }
// ] }
```

-->