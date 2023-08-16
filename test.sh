# Test script for zkGraph

# Update `config.js` with your own parameters first!
# Then run `sh test.sh`

npm run compile-local &&
npm run exec-local -- 9529146 &&
npm run prove-local -- --inputgen 9529146 fa5db19087920f5d0e71d0373f099bd0c03589da &&
npm run prove-local -- --test 9529146 fa5db19087920f5d0e71d0373f099bd0c03589da

npm run compile &&
npm run exec -- 9529146 &&
npm run prove -- --inputgen 9529146 fa5db19087920f5d0e71d0373f099bd0c03589da &&
npm run prove -- --test 9529146 fa5db19087920f5d0e71d0373f099bd0c03589da
