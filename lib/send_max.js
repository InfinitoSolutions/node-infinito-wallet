var TX_EMPTY_SIZE = 4 + 1 + 1 + 4;
var TX_INPUT_BASE = 32 + 4 + 1 + 4;
var TX_INPUT_PUBKEYHASH = 107;
var TX_OUTPUT_BASE = 8 + 1;
var TX_OUTPUT_PUBKEYHASH = 25;

function inputBytes(input) {
  return TX_INPUT_BASE + (input.script ? input.script.length : TX_INPUT_PUBKEYHASH);
}

function outputBytes(output) {
  return TX_OUTPUT_BASE + (output.script ? output.script.length : TX_OUTPUT_PUBKEYHASH);
}

function dustThreshold(output, feeRate) {
  return inputBytes({}) * feeRate;
}

function transactionBytes(inputs, outputs) {
  return TX_EMPTY_SIZE +
    inputs.reduce(function (a, x) { return a + inputBytes(x) }, 0) +
    outputs.reduce(function (a, x) { return a + outputBytes(x) }, 0);
}

function uintOrNaN(v) {
  if (typeof v !== 'number') return NaN;
  if (!isFinite(v)) return NaN;
  if (Math.floor(v) !== v) return NaN;
  if (v < 0) return NaN;
  return v;
}

function sumForgiving(range) {
  return range.reduce(function (a, x) { return a + (isFinite(x.value) ? x.value : 0) }, 0);
}

function sumOrNaN(range) {
  return range.reduce(function (a, x) { return a + uintOrNaN(x.value) }, 0);
}

var BLANK_OUTPUT = outputBytes({})

function finalize(inputs, outputs, feeRate) {
  var bytesAccum = transactionBytes(inputs, outputs);
  var feeAfterExtraOutput = feeRate * (bytesAccum + BLANK_OUTPUT);
  var remainderAfterExtraOutput = sumOrNaN(inputs) - (sumOrNaN(outputs) + feeAfterExtraOutput);

  if (remainderAfterExtraOutput > dustThreshold({}, feeRate)) {
    outputs = outputs.concat({ value: remainderAfterExtraOutput });
  }

  var fee = sumOrNaN(inputs) - sumOrNaN(outputs);
  if (!isFinite(fee)) {
    return { fee: feeRate * bytesAccum };
  }

  return {
    inputs: inputs,
    outputs: outputs,
    fee: fee
  }
}

function sendMax(utxos, outputs, feeRate) {
  if (!isFinite(uintOrNaN(feeRate))) {
    return {};
  }
  var sumInput = sumOrNaN(utxos);
  outputs[0].value = sumInput;
  if (!outputs[0].address) {
    outputs[0].address = '0000000000000000000000000000000000';
  }
  var bytesAccum = transactionBytes(utxos, outputs)
  var fee = feeRate * bytesAccum
  var outputValue = sumInput - fee;
  outputs[0].value = outputValue;

  return {
    inputs: utxos,
    outputs: outputs,
    fee: fee
  }
}

module.exports = {
  dustThreshold: dustThreshold,
  finalize: finalize,
  inputBytes: inputBytes,
  outputBytes: outputBytes,
  sumOrNaN: sumOrNaN,
  sumForgiving: sumForgiving,
  transactionBytes: transactionBytes,
  uintOrNaN: uintOrNaN,
  sendMax: sendMax
}
