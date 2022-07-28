const fs = require("fs");
const mnemonicPhrase = fs.readFileSync(".secret").toString().trim();
const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
    networks: {
        dev: {
            provider: () =>
                new HDWalletProvider({
                    mnemonic: mnemonicPhrase,
                    providerOrUrl: `http://10.15.15.133:8545`,
                    numberOfAddresses: 10,
                }),
            network_id: "1337",
            gas: 999999999999999,
            gasPrice: 0,
            timeoutBlocks: 200,
        },
        stg: {
            provider: () =>
                new HDWalletProvider({
                    mnemonic: mnemonicPhrase,
                    providerOrUrl: `https://stgrpc.openpost.co.jp`,
                    numberOfAddresses: 10,
                }),
            network_id: "1337",
            gas: 999999999999999,
            gasPrice: 0,
            confirmations: 2,
            timeoutBlocks: 200,
        },
        stgTest: {
            provider: () =>
                new HDWalletProvider({
                    mnemonic: mnemonicPhrase,
                    providerOrUrl: `https://stgrpc.openpost.co.jp`,
                    numberOfAddresses: 10,
                }),
            network_id: "1337",
            gas: 999999999999999,
            gasPrice: 0,
            timeoutBlocks: 200,
        },
        awsTest: {
            provider: () =>
                new HDWalletProvider({
                    mnemonic: mnemonicPhrase,
                    providerOrUrl: `http://52.197.39.247:8545`,
                    numberOfAddresses: 10,
                }),
            network_id: "1337",
            gas: 999999999999999,
            gasPrice: 0,
            timeoutBlocks: 200,
        },
        test: {
            provider: () =>
                new HDWalletProvider({
                    mnemonic: mnemonicPhrase,
                    providerOrUrl: `http://10.15.15.133:8545`,
                    numberOfAddresses: 10,
                }),
            network_id: "1337",
            gas: 999999999999999,
            gasPrice: 0,
            timeoutBlocks: 200,
        },
        omar: {
            provider: () =>
                new HDWalletProvider({
                    mnemonic: mnemonicPhrase,
                    providerOrUrl: `http://18.182.51.175:8545`,
                    numberOfAddresses: 10,
                }),
            network_id: "1337",
            gas: 999999999999999,
            gasPrice: 0,
            timeoutBlocks: 200,
        },
        avalance: {
            provider: () =>
                new HDWalletProvider({
                    mnemonic: mnemonicPhrase,
                    providerOrUrl: `http://192.168.72.115:9650/ext/bc/C/rpc`,
                    numberOfAddresses: 10,
                }),
            network_id: "43112",
            gas: 525000,
            gasPrice: 0,
            timeoutBlocks: 200,
        },
        ganache: {
            provider: () =>
                new HDWalletProvider({
                    mnemonic: mnemonicPhrase,
                    providerOrUrl: `HTTP://127.0.0.1:7545`,
                    numberOfAddresses: 10,
                }),
            network_id: "5777",
            gas: 6721975,
            gasPrice: 20000000000,
            timeoutBlocks: 200,
        },
    },

    compilers: {
        solc: {
            version: "0.8.2",
            settings: {
                optimizer: {
                    enabled: false,
                    runs: 200,
                },
                evmVersion: "istanbul",
            },
        },
    },
};
