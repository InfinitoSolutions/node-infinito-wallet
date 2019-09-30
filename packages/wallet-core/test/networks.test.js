const Assert = require('assert');
const chai = require('chai');
const { Networks, getNetwork } = require('../src/networks');

chai.should();

describe('networks', async() => {

  describe('getNetwork', async() => {

    it('null', async () => {
      let network = getNetwork(null);
      Assert.equal(null, network);

      network = getNetwork(null, true);
      Assert.equal(null, network);
    });

    it('undefined', async () => {
      let network = getNetwork(undefined);
      Assert.equal(null, network);

      network = getNetwork(undefined, true);
      Assert.equal(null, network);
    });

    it('not exist', async () => {
      let network = getNetwork('INVALID');
      Assert.equal(null, network);

      network = getNetwork('INVALID', true);
      Assert.equal(null, network);
    });

    it('BTC', async () => {
      let network = getNetwork('BTC');
      Assert.equal(JSON.stringify(Networks.bitcoin), JSON.stringify(network));

      network = getNetwork('BTC', true);
      Assert.equal(JSON.stringify(Networks.testnet), JSON.stringify(network));
    });

    it('BCH', async () => {
      let network = getNetwork('BCH');
      Assert.equal(JSON.stringify(Networks.bitcoin), JSON.stringify(network));

      network = getNetwork('BCH', true);
      Assert.equal(JSON.stringify(Networks.testnet), JSON.stringify(network));
    });

    it('LTC', async () => {
      let network = getNetwork('LTC');
      Assert.equal(JSON.stringify(Networks.litecoin), JSON.stringify(network));

      network = getNetwork('LTC', true);
      Assert.equal(JSON.stringify(Networks.litecoinTestnet), JSON.stringify(network));
    });

    it('DOGE', async () => {
      let network = getNetwork('DOGE');
      Assert.equal(JSON.stringify(Networks.dogecoin), JSON.stringify(network));

      network = getNetwork('DOGE', true);
      Assert.equal(JSON.stringify(Networks.dogecoinTestnet), JSON.stringify(network));
    });

    it('DASH', async () => {
      let network = getNetwork('DASH');
      Assert.equal(JSON.stringify(Networks.dash), JSON.stringify(network));
      network = getNetwork('DASH', true);
      Assert.equal(JSON.stringify(Networks.dashTestnet), JSON.stringify(network));
    });

    it('Others', async () => {
      let platforms = ['NEO', 'ETH', 'ETC', 'ADA', 'EOS', 'ONT', 'OMNI', 'TESTNET'];

      platforms.forEach(platform => {
        let network = getNetwork(platform);
        Assert.equal(null, network);

        network = getNetwork(platform, true);
        Assert.equal(null, network);
      });
    });

  });
});