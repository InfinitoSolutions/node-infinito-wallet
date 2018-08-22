
Helper.convertToSatoshi = (amount) => {
  return parseFloat((amount * 100000000).toFixed(0));
}

Helper.convertToBitcoin = (amount) => {
  return parseFloat(amount / 100000000);
}

module.exports = Helper;