# Advance Crowdfunding Platform

A Web3-based crowdfunding platform built with Next.js, enabling users to create and back campaigns using blockchain-based payments, with wallet connectivity and KYC verification.

## ✨ Features

- **Wallet Integration** — Connect via RainbowKit / Web3Modal (MetaMask and other wallets supported)
- **Smart Contract Interaction** — On-chain campaign creation and contributions using ethers.js / wagmi / viem
- **User Authentication** — Email/credential-based auth via NextAuth
- **KYC Verification** — User KYC data synced to the blockchain
- **Database** — Managed via Prisma ORM
- **Contact/Support** — Integrated contact form via Formspree
- **Styling** — Tailwind CSS

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 13 |
| Blockchain | ethers.js, wagmi, viem, RainbowKit, Web3Modal |
| Auth | NextAuth.js, bcryptjs |
| Database | Prisma |
| Styling | Tailwind CSS |
| Forms/Notifications | Formspree, react-hot-toast |

## 📋 Prerequisites

- Node.js (v16 or later recommended)
- npm
- A configured `.env.local` file (see below)

## ⚙️ Environment Variables

Create a `.env.local` file in the project root with the required variables for:
- Database connection (Prisma)
- NextAuth configuration (secret, providers)
- Blockchain/RPC provider keys
- Formspree endpoint

> ⚠️ Never commit `.env.local` to version control — it contains sensitive keys/secrets.

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/niks175/Advance-crowdfunding-platform.git
   cd Advance-crowdfunding-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 Available Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run start` — Start production server
- `npm run lint` — Run linter
- `npm run clear` — Remove `node_modules`, lockfile, and build artifacts

## 🗂️ Project Utilities

The repo includes several helper/debug scripts used during development:
- `check_campaign.js` — Inspect campaign data
- `check_kyc_users.js` — Inspect KYC user records
- `syncKycToBlockchain.js` — Sync KYC verification status to the blockchain
- `get_keys.js` — Retrieve configuration/key data

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

