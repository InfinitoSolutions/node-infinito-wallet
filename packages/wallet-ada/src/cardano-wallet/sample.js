const {instantiateStreaming} =  require("assemblyscript/lib/loader");
// const fetch = require('fetch');

const sample = instantiateStreaming(
    fetch('./cardano_wallet_bg.wasm')
).then(rawModule => Object.assign({}, rawModule, {
    scramble: input => {
        const pInput = rawModule.__retain(rawModule.__allocString(input));

        const pOutput = rawModule.scramble(pInput);

        const result = rawModule.__getString(pOutput);
        rawModule.__release(pInput);
        rawModule.__release(pOutput);
        return result;
    }
}));

console.log(sample);

module.exports = sample;
