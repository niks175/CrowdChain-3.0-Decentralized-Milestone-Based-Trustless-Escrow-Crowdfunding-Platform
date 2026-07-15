/**
 * Sync KYC statuses from Prisma DB to the local Hardhat blockchain.
 * 
 * This script:
 * 1. Reads all APPROVED KYC requests from the database
 * 2. Gets the associated user wallet addresses
 * 3. Calls setKYCStatus(wallet, true) on the smart contract for each
 * 
 * Run: node syncKycToBlockchain.js
 */

const { PrismaClient } = require('@prisma/client');
const { ethers } = require('ethers');

const prisma = new PrismaClient();

// Contract details
const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const RPC_URL = 'http://127.0.0.1:8545';

// Minimal ABI for setKYCStatus and isKYCApproved
const ABI = [
    "function setKYCStatus(address _user, bool _status) external",
    "function isKYCApproved(address) view returns (bool)",
    "function owner() view returns (address)"
];

async function main() {
    // Connect to local Hardhat node
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

    // Use the first Hardhat account (deployer/owner) to sign transactions
    const signer = provider.getSigner(0);
    const signerAddress = await signer.getAddress();
    console.log("Using signer (contract owner):", signerAddress);

    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

    // Verify we are the owner
    const owner = await contract.owner();
    console.log("Contract owner:", owner);
    if (owner.toLowerCase() !== signerAddress.toLowerCase()) {
        console.error("ERROR: Signer is not the contract owner! Cannot set KYC status.");
        process.exit(1);
    }

    // Get all approved KYC requests from database
    const approvedKycs = await prisma.kYCRequest.findMany({
        where: { status: "APPROVED" },
        include: { user: true },
    });

    console.log(`\nFound ${approvedKycs.length} approved KYC request(s) in the database.\n`);

    for (const kyc of approvedKycs) {
        const wallet = kyc.user?.walletAddress;
        const username = kyc.user?.userId;

        if (!wallet) {
            console.log(`SKIP: User "${username}" has no wallet address in the database.`);
            continue;
        }

        // Check current on-chain status
        const currentStatus = await contract.isKYCApproved(wallet);
        if (currentStatus) {
            console.log(`OK: User "${username}" (${wallet}) is already KYC approved on-chain.`);
            continue;
        }

        // Set KYC status on-chain
        console.log(`SYNCING: Setting KYC for user "${username}" (${wallet}) to true...`);
        const tx = await contract.setKYCStatus(wallet, true);
        await tx.wait();
        console.log(`  ✅ Transaction mined: ${tx.hash}`);

        // Verify
        const newStatus = await contract.isKYCApproved(wallet);
        console.log(`  Verified on-chain isKYCApproved: ${newStatus}`);
    }

    // Also set KYC for the admin/owner address so admin can create campaigns too
    const adminStatus = await contract.isKYCApproved(signerAddress);
    if (!adminStatus) {
        console.log(`\nSYNCING: Setting KYC for Admin (${signerAddress}) to true...`);
        const tx = await contract.setKYCStatus(signerAddress, true);
        await tx.wait();
        console.log(`  ✅ Admin KYC set. Transaction: ${tx.hash}`);
    } else {
        console.log(`\nOK: Admin (${signerAddress}) is already KYC approved on-chain.`);
    }

    console.log("\n🎉 KYC sync complete!");
}

main()
    .catch((e) => {
        console.error("Error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
