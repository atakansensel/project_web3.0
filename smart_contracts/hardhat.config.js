//https://eth-ropsten.alchemyapi.io/v2/WhgVTx-C_NddlPMkQ3ngx5ybytOmG72A
require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity:'0.8.0',
  networks: {
    ropsten:{
      url:'https://eth-ropsten.alchemyapi.io/v2/WhgVTx-C_NddlPMkQ3ngx5ybytOmG72A',
      accounts: ['d84d0e3d01bf203e5a371c047cb30ff8e7fead1753da68377088e05577807893']
    }
  }
}