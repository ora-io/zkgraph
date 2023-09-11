# Test script for zkGraph

# Update `config.js` with your own parameters first!
# Then run `sh test.sh`

npm run compile-local &&
npm run exec-local -- 2279547 &&
npm run prove-local -- --inputgen 2279547 a60ecf32309539dd84f27a9563754dca818b815e &&
npm run prove-local -- --test 2279547 a60ecf32309539dd84f27a9563754dca818b815e

npm run compile &&
npm run exec -- 2279547 &&
npm run prove -- --inputgen 2279547 a60ecf32309539dd84f27a9563754dca818b815e &&
npm run prove -- --test 2279547 a60ecf32309539dd84f27a9563754dca818b815e
