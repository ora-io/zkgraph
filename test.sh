# Test script for zkGraph

# Update `config.js` with your own parameters first!
# Then run `sh test.sh`

npm install &&
npm run compile-local &&
npm run exec-local -- 17633573 &&
npm run prove-local -- --inputgen 0x10d1125 0x0000000000000000000000000000000000000000000000000466ba8760e97fb2 &&
npm run prove-local -- --test 0x10d1125 0x0000000000000000000000000000000000000000000000000466ba8760e97fb2

npm run compile &&
npm run exec -- 17633573 &&
npm run prove -- --inputgen 0x10d1125 0000000000000000000000000000000000000000000000000466ba8760e97fb2 &&
npm run prove -- --test 0x10d1125 0000000000000000000000000000000000000000000000000466ba8760e97fb2
