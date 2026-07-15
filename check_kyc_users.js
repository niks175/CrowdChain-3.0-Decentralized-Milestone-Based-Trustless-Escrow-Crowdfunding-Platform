const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const kycs = await prisma.kYCRequest.findMany();
    for (const k of kycs) {
        const u = await prisma.user.findUnique({ where: { id: k.userId } });
        console.log(`KYC User: ${u.userId} (${u.walletAddress}) - Status: ${k.status}`);
    }
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    });
