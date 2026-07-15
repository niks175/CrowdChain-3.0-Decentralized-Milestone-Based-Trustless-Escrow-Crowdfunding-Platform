const fs = require('fs');
const path = require('path');

const transactionsPath = path.join(__dirname, 'transactions.json');
const outputPath = path.join(__dirname, 'output.txt');

function ensureTransactionsFile() {
    if (!fs.existsSync(transactionsPath)) {
        const sampleTransactions = [
            {
                id: 1,
                from: '0xUserA',
                to: '0xCampaign1',
                amount: 2.5,
                currency: 'ETH',
                type: 'deposit',
                status: 'completed',
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                from: '0xUserB',
                to: '0xCampaign2',
                amount: 1.2,
                currency: 'ETH',
                type: 'deposit',
                status: 'completed',
                createdAt: new Date().toISOString()
            }
        ];
        fs.writeFileSync(transactionsPath, JSON.stringify(sampleTransactions, null, 2), 'utf8');
    }
}

function loadTransactions() {
    ensureTransactionsFile();
    const raw = fs.readFileSync(transactionsPath, 'utf8');
    return JSON.parse(raw);
}

function saveTransactions(transactions) {
    fs.writeFileSync(transactionsPath, JSON.stringify(transactions, null, 2), 'utf8');
}

function getNextTransactionId(transactions) {
    return transactions.reduce((maxId, tx) => Math.max(maxId, tx.id), 0) + 1;
}

function formatTransaction(tx) {
    return `${tx.id} - ${tx.from} -> ${tx.to} - ${tx.amount} ${tx.currency} - ${tx.type} - ${tx.status} - ${tx.createdAt}`;
}

function addTransaction({ from, to, amount, currency = 'ETH', type = 'deposit', status = 'completed' }) {
    const transactions = loadTransactions();
    const transaction = {
        id: getNextTransactionId(transactions),
        from,
        to,
        amount,
        currency,
        type,
        status,
        createdAt: new Date().toISOString()
    };
    transactions.push(transaction);
    saveTransactions(transactions);
    return transaction;
}

async function main() {
    const args = process.argv.slice(2);
    const command = args[0] || 'list';
    let out = '';

    if (command === 'add') {
        const [from, to, amountRaw, currency = 'ETH', type = 'deposit', status = 'completed'] = args.slice(1);
        if (!from || !to || !amountRaw) {
            console.error('Usage: node check_db_proper.js add <from> <to> <amount> [currency] [type] [status]');
            process.exit(1);
        }

        const amount = Number(amountRaw);
        if (Number.isNaN(amount) || amount <= 0) {
            console.error('Amount must be a positive number.');
            process.exit(1);
        }

        const transaction = addTransaction({ from, to, amount, currency, type, status });
        out += 'Added transaction:\n';
        out += `${formatTransaction(transaction)}\n\n`;
    } else if (command !== 'list') {
        console.error('Unknown command:', command);
        console.error('Supported commands: list, add');
        process.exit(1);
    }

    const transactions = loadTransactions();
    out += 'TRANSACTIONS:\n';
    transactions.forEach(tx => {
        out += `${formatTransaction(tx)}\n`;
    });

    fs.writeFileSync(outputPath, out, 'utf8');
    console.log(out);
}

main().catch(e => {
    console.error(e);
    process.exit(1);
});
