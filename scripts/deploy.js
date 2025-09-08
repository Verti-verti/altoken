// Script de deploy para contratos de SurveyVerse
// Requiere Hardhat para ejecutar

const { ethers } = require("hardhat");

async function main() {
    console.log("🚀 Iniciando deploy de contratos SurveyVerse...");

    // Obtener el deployer
    const [deployer] = await ethers.getSigners();
    console.log("📝 Deploying contracts with account:", deployer.address);
    console.log("💰 Account balance:", (await deployer.getBalance()).toString());

    // 1. Deploy SurveyToken
    console.log("\n📊 Deploying SurveyToken...");
    const SurveyToken = await ethers.getContractFactory("SurveyToken");
    const surveyToken = await SurveyToken.deploy();
    await surveyToken.deployed();
    console.log("✅ SurveyToken deployed to:", surveyToken.address);

    // 2. Deploy SurveyContract
    console.log("\n📋 Deploying SurveyContract...");
    const SurveyContract = await ethers.getContractFactory("SurveyContract");
    const surveyContract = await SurveyContract.deploy(surveyToken.address);
    await surveyContract.deployed();
    console.log("✅ SurveyContract deployed to:", surveyContract.address);

    // 3. Verificar deployment
    console.log("\n🔍 Verificando deployment...");
    
    // Verificar token
    const tokenName = await surveyToken.name();
    const tokenSymbol = await surveyToken.symbol();
    const totalSupply = await surveyToken.totalSupply();
    
    console.log(`📊 Token: ${tokenName} (${tokenSymbol})`);
    console.log(`💰 Total Supply: ${ethers.utils.formatEther(totalSupply)} SURV`);
    
    // Verificar contrato principal
    const platformStats = await surveyContract.getPlatformStats();
    console.log(`📈 Platform Stats: ${platformStats.totalSurveys} surveys, ${platformStats.totalVotes} votes`);

    // 4. Configurar permisos (opcional)
    console.log("\n⚙️ Configurando permisos...");
    
    // Transferir ownership del token al contrato principal (opcional)
    // await surveyToken.transferOwnership(surveyContract.address);
    // console.log("✅ Token ownership transferred to SurveyContract");

    // 5. Guardar direcciones
    const deploymentInfo = {
        network: hre.network.name,
        chainId: hre.network.config.chainId,
        deployer: deployer.address,
        contracts: {
            surveyToken: surveyToken.address,
            surveyContract: surveyContract.address
        },
        timestamp: new Date().toISOString(),
        blockNumber: await ethers.provider.getBlockNumber()
    };

    console.log("\n📄 Deployment Summary:");
    console.log("=" * 50);
    console.log(`Network: ${deploymentInfo.network}`);
    console.log(`Chain ID: ${deploymentInfo.chainId}`);
    console.log(`Deployer: ${deploymentInfo.deployer}`);
    console.log(`SurveyToken: ${deploymentInfo.contracts.surveyToken}`);
    console.log(`SurveyContract: ${deploymentInfo.contracts.surveyContract}`);
    console.log(`Block Number: ${deploymentInfo.blockNumber}`);
    console.log("=" * 50);

    // Guardar en archivo (opcional)
    const fs = require('fs');
    const path = require('path');
    
    const deploymentsDir = path.join(__dirname, '../deployments');
    if (!fs.existsSync(deploymentsDir)) {
        fs.mkdirSync(deploymentsDir, { recursive: true });
    }
    
    const deploymentFile = path.join(deploymentsDir, `${hre.network.name}.json`);
    fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
    console.log(`\n💾 Deployment info saved to: ${deploymentFile}`);

    // 6. Instrucciones post-deploy
    console.log("\n📋 Próximos pasos:");
    console.log("1. Actualizar direcciones en config/web3.js");
    console.log("2. Verificar contratos en block explorer");
    console.log("3. Configurar frontend con nuevas direcciones");
    console.log("4. Probar funcionalidades básicas");
    
    if (hre.network.name === 'baseSepolia') {
        console.log("\n🔗 Block Explorer:");
        console.log(`SurveyToken: https://sepolia.basescan.org/address/${surveyToken.address}`);
        console.log(`SurveyContract: https://sepolia.basescan.org/address/${surveyContract.address}`);
    } else if (hre.network.name === 'base') {
        console.log("\n🔗 Block Explorer:");
        console.log(`SurveyToken: https://basescan.org/address/${surveyToken.address}`);
        console.log(`SurveyContract: https://basescan.org/address/${surveyContract.address}`);
    }

    console.log("\n🎉 Deploy completado exitosamente!");
}

// Función para verificar contratos (opcional)
async function verifyContracts() {
    console.log("\n🔍 Verificando contratos en block explorer...");
    
    try {
        // Verificar SurveyToken
        await hre.run("verify:verify", {
            address: process.env.SURVEY_TOKEN_ADDRESS,
            constructorArguments: [],
        });
        console.log("✅ SurveyToken verified");
        
        // Verificar SurveyContract
        await hre.run("verify:verify", {
            address: process.env.SURVEY_CONTRACT_ADDRESS,
            constructorArguments: [process.env.SURVEY_TOKEN_ADDRESS],
        });
        console.log("✅ SurveyContract verified");
        
    } catch (error) {
        console.log("❌ Error verifying contracts:", error.message);
    }
}

// Ejecutar deploy
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Deploy failed:", error);
        process.exit(1);
    });

// Exportar funciones para uso en otros scripts
module.exports = {
    main,
    verifyContracts
};
