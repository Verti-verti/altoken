// Configuración de Hardhat para SurveyVerse
// Instalar: npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
        version: "0.8.19",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200
            }
        }
    },
    
    networks: {
        // Base Sepolia (Testnet)
        baseSepolia: {
            url: "https://sepolia.base.org",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 84532,
            gasPrice: 1000000000, // 1 gwei
        },
        
        // Base Mainnet
        base: {
            url: "https://mainnet.base.org",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 8453,
            gasPrice: 1000000000, // 1 gwei
        },
        
        // Local development
        hardhat: {
            chainId: 31337,
            accounts: {
                count: 10,
                initialIndex: 0,
                mnemonic: "test test test test test test test test test test test junk",
                path: "m/44'/60'/0'/0",
            },
        },
        
        // Localhost (para testing)
        localhost: {
            url: "http://127.0.0.1:8545",
            chainId: 31337,
        }
    },
    
    // Configuración para verificación de contratos
    etherscan: {
        apiKey: {
            base: process.env.BASESCAN_API_KEY || "",
            baseSepolia: process.env.BASESCAN_API_KEY || "",
        },
        customChains: [
            {
                network: "base",
                chainId: 8453,
                urls: {
                    apiURL: "https://api.basescan.org/api",
                    browserURL: "https://basescan.org"
                }
            },
            {
                network: "baseSepolia",
                chainId: 84532,
                urls: {
                    apiURL: "https://api-sepolia.basescan.org/api",
                    browserURL: "https://sepolia.basescan.org"
                }
            }
        ]
    },
    
    // Configuración de gas
    gasReporter: {
        enabled: process.env.REPORT_GAS !== undefined,
        currency: "USD",
        gasPrice: 1,
        coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    },
    
    // Configuración de paths
    paths: {
        sources: "./contracts",
        tests: "./test",
        cache: "./cache",
        artifacts: "./artifacts"
    },
    
    // Configuración de mocha (para tests)
    mocha: {
        timeout: 40000
    }
};
