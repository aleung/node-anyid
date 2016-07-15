``` js
const ids = anyid()
  .encode('0')
  .section( anyid().time('m').since(new Date('2016-7-1')) )
  .section( anyid().seq().startWith(10000000).max(99999999) );
```

