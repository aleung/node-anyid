const anyid = require("anyid").anyid;


console.log('Single section, random value:',
  anyid().encode('Aa0').length(21).random().id()
);


console.log('Multiple sections, fix prefix and timestamp:',
  anyid()
    .encode('0A-IO')
    .section(anyid().fixed(process.pid))
    .delimiter('-')
    .section(anyid().time())
    .id()
);


const nanotime = () => {
  return process.hrtime()[1];
};
console.log('Function value:',
  anyid()
    .encode('Aa0')
    .section(anyid().time('s'))
    .delimiter('+')
    .section(anyid().of(nanotime))
    .id()
);


console.log('Use different charset in sections:',
  anyid()
    .encode('A-IO')
    .section(anyid().length(3).random())
    .delimiter(' ')
    .section(anyid().encode('0').length(3).random())
    .delimiter(' ')
    .section(anyid().length(3).random())
    .id()
);


console.log('Single variable:',
  anyid()
    .encode('Aa0')
    .section(anyid().variable())
    .delimiter('-')
    .section(anyid().time())
    .id(Buffer.from('user-xxx'))
);


console.log('Multiple variables:',
  anyid()
    .encode('Aa0')
    .section(anyid().variable('countryId'))
    .delimiter('-')
    .section(anyid().variable('userId'))
    .delimiter('-')
    .section(anyid().length(5).random())
    .id({ countryId: 86, userId: 635023 })
);
