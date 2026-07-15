const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany();
    console.log("Users:");
    users.forEach(u => console.log(`${u.userId} - ${u.walletAddress} - ${u.role}`));

    const kycs = await prisma.kYCRequest.findMany();
    console.log("KYCs:");
    kycs.forEach(k => console.log(`${k.id} - ${k.userId} - ${k.status}`));
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
