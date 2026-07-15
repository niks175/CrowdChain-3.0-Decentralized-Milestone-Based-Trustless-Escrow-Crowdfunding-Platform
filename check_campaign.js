const { ethers } = require('ethers');

const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const RPC_URL = 'http://127.0.0.1:8545';
const ABI = [
    {
        "inputs": [{ "internalType": "uint256", "name": "_campaignId", "type": "uint256" }],
        "name": "getCampaign",
        "outputs": [
            {
                "components": [
                    { "internalType": "uint256", "name": "id", "type": "uint256" },
                    { "internalType": "address payable", "name": "creator", "type": "address" },
                    { "internalType": "string", "name": "title", "type": "string" },
                    { "internalType": "string", "name": "description", "type": "string" },
                    { "internalType": "string", "name": "metadataHash", "type": "string" },
                    { "internalType": "uint256", "name": "targetAmount", "type": "uint256" },
                    { "internalType": "uint256", "name": "raisedAmount", "type": "uint256" },
                    { "internalType": "uint256", "name": "deadline", "type": "uint256" },
                    { "internalType": "bool", "name": "withdrawn", "type": "bool" },
                    { "internalType": "bool", "name": "active", "type": "bool" },
                    { "internalType": "uint256", "name": "createdAt", "type": "uint256" },
                    { "internalType": "uint256", "name": "contributorsCount", "type": "uint256" }
                ],
                "internalType": "struct CrowdfundingMarketplace.Campaign",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

async function main() {
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
    const campaign = await contract.getCampaign(1);
    console.log("Campaign 1 data:");
    console.log(campaign);
}
main().catch(console.error);
