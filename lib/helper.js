class Helper {
  static convertToSatoshi(amount) {
    return parseFloat((amount * 100000000).toFixed(0));
  }

  static convertToBitcoin(amount) {
    return parseFloat(amount / 100000000);
  }
}

module.exports = Helper;