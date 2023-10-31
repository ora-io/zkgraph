import { Mock as mock, WasmBenchmark as bm, Compiler } from "zkwasm-toolchain"
import { Input } from "zkwasm-toolchain";

import { ethers, providers } from "ethers";

const rpcUrl = 'https://rpc.ankr.com/eth_sepolia/c5c31b8d18d23b8e3495b781316564cb473409820bd7fe162433e9e50368824f'
const provider = new providers.JsonRpcProvider(rpcUrl);
const addr = '0xa60ecf32309539dd84f27a9563754dca818b815e';
const key0 = '0x0000000000000000000000000000000000000000000000000000000000000008';
const key1 = '0x0000000000000000000000000000000000000000000000000000000000000009';
// const blocknum = 4546117;


const blocknum = await provider.getBlockNumber();

async function getProof(ethersProvider, address, keys, blockid) {
    return await ethersProvider.send("eth_getProof", [address, keys, blockid]);
}

async function prepareInputs(){

    let input = new Input()
    input.addInt(1, false) // block count
    input.addVarLenHexString('0xf9023ba0471046357a104b659365e6cf9751fb2b82c7c57ad40ce6577187433280787a91a01dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347940000000000000000000000000000000000000000a0632a7359190018d7a9874f757fd3b9719bf1aa8b84c66c53027f3bda220676b0a009218adecad9f3c086e5bed1e2c42f2bf89f95042855c52d379d13acaf631ad0a0cd74a2298267317f57c3b454e39dcc20f1d5c1c02dc5ac6d33d6e81499306ccdb901002881080818140000c07854415cf181c104898088020c06008860c40200124c0208a000704940401031013802d0480880208a340254260140022101004324a222a10aa01058a23429998010388ca996009027185814a44398200a40000010a28e0fa4400cc6a24210028900a480020bd90201428020000400c1820212458284304002040512102131216004c848516580501905a0010c8c00891000808442046707188023010080222008004000000c08180ae0588a90004a00209108240a40102012000b402328560cb064051300042010602330020a06008290d7480168681292d302054091203180000602a23128044a408038201010054204a020264c50408083455e458401c9c38083b0818b846536428899d883010d01846765746888676f312e32312e31856c696e7578a083a009e788fed9edb6444cd1305367be5090da1993f8958930cd54a44ce1f8118800000000000000008516d9f2e506a0adef2eee900e520200c9d53d7b56fee4d685a3ef5391ba4beed002fe110e887d', false) // header rlp //4546117
    input.addInt(1, false) // account count
    input.addHexString(addr, false) // address

    const ethproof = await getProof(provider, addr, [key0, key1], ethers.utils.hexValue(blocknum))
    // console.log(ethproof)
    // TODO this is still fake
    input.addVarLenHexString('0xaaaaaa', false) // account rlp
    input.addVarLenHexStringArray(ethproof.accountProof, false) // account proof
    
    input.addInt(2, false) // slot count
    
    // slot #0
    input.addHexString(key0, false)
    input.addVarLenHexString(ethproof.storageProof[0].value, false)
    input.addVarLenHexStringArray(ethproof.storageProof[0].proof, false)

    // slot #1
    input.addHexString(key1, false)
    input.addVarLenHexString(ethproof.storageProof[1].value, false)
    input.addVarLenHexStringArray(ethproof.storageProof[1].proof, false)
    
    // expected_state
    input.addVarLenHexString(ethproof.storageProof[0].value, true)
    // blockhash_latest
    input.addHexString('0xcccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc', true)
    return input
}

async function runMapping(entryFile, wasmPath, watPath){
    try{
        // console.log(Compiler.assembleCompileCommand(entryFile, wasmPath, 'node_modules/@hyperoracle/zkgraph-lib/common/type/abort', watPath, null, `--lib ${mappingPath}`))
        Compiler.compile(entryFile, wasmPath, 'node_modules/@hyperoracle/zkgraph-lib/common/type/abort', watPath, null)
    } catch (error) {
        process.exit(1);
    }
    let input = await prepareInputs();
    console.log('Private Input:', input.getPrivateInputStr())
    console.log('Public Input:', input.getPublicInputStr())
    
    console.log('Mock Result:', await mock.dryrunWithPath(wasmPath, input.getPrivateInputStr(), input.getPublicInputStr()))
    let loc = bm.watLocByPath(watPath)
    let size = bm.wasmSizeByPath(wasmPath)
    console.log('Loc:', loc, 'lines')
    console.log('Size:', size, 'bytes')
}

await runMapping('node_modules/@hyperoracle/zkgraph-lib/main_state.ts', 'build/state.wasm', 'build/state.wat')