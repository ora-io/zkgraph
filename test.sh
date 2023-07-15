# Test script for zkGraph

# Update `config.js` with your own parameters first!
# Then run `sh test.sh`

npm install &&
npm run compile-local &&
npm run exec-local -- 17633573 &&
npm run prove-local -- --inputgen 0x10d1125 0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc &&
npm run prove-local -- --test 0x10d1125 0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc

npm run compile &&
npm run exec -- 17633573 &&
npm run prove -- --inputgen 0x10d1125 0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc &&
npm run prove -- --test 0x10d1125 0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc