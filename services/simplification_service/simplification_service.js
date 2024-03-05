'use strict';

const User = require('./../../models/user');

class SimplificationService {
    constructor() {
        this.balances = [];
        this.transactions = {

        };
    }

    getTransactions() {
        return this.transactions;
    }

    async loadBalancesAndSimplify() {

        let users = await User.getAllUsers();
        for (let user of users) {
            this.balances.push({
                user_id: user.user_id,
                balance: user.balance
            });
        }
        this.simplify(this.balances);

    }

    async getUserTransactions(user_id) {
        return this.transactions[user_id];
    }

    simplify(balance) {
        let maxCredit = this.findMaxCredit(balance);
        let maxDebit = this.findMaxDebit(balance);
        if (balance[maxCredit].balance === 0 && balance[maxCredit].balance === 0) {
            return;
        }
        let minAmount = Math.min(balance[maxCredit].balance, -balance[maxDebit].balance);

        balance[maxCredit].balance -= minAmount;
        balance[maxDebit].balance += minAmount;

        let creditUserId = balance[maxCredit].user_id;
        let debitUserId = balance[maxDebit].user_id;

        this.transactions[debitUserId] = (this.transactions[debitUserId] || []);
        this.transactions[creditUserId] = (this.transactions[creditUserId] || []);

        this.transactions[debitUserId].push(`User ${debitUserId} owes User ${creditUserId} Rs. ${minAmount}`);
        this.transactions[creditUserId].push(`User ${debitUserId} owes User ${creditUserId} Rs. ${minAmount}`);

        console.log(`User ${debitUserId} pays ${minAmount} to user ${creditUserId}`);
        this.simplify(balance);
    }

    findMaxDebit(balance) {
        let idx = 0;
        for (let i = 0; i < balance.length; i++) {
            if (balance[i].balance < 0 && balance[i].balance < balance[idx].balance) idx = i;
        }

        return idx;
    }

    findMaxCredit(balance) {
        let idx = 0;
        for (let i = 0; i < balance.length; i++) {
            if (balance[i].balance > 0 && balance[i].balance > balance[idx].balance) idx = i;
        }

        return idx;
    }

}


module.exports = SimplificationService;