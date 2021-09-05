const SHA256 = require('crypto-js/sha256');

class Transaction {
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block{
    constructor( timestamp, transactions, previousHash = ''){
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;                         // a random number for making proof of work
    }

    calculateHash(){
        return SHA256(this.previousHash + this.timestamp + this.nonce + JSON.stringify(this.data)).toString();
    }

    mineBlock(difficulty){
        let arr = new Array(difficulty).fill(0);
        while(this.hash.substring(0,difficulty) != arr)
        {
            this.hash = this.calculateHash();
            this.nonce++;
        }
        console.log("block mined : " + this.hash);
    }

}

class Blockchain {
    constructor(){
        this.chain = [this.createGenesisBlock()];        // array of blocks
                                                        // initialized with genesis block
        this.difficulty = 1;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }                                                   

    createGenesisBlock(){
        return new Block( '01/01/2021', "Genesis Block", '0');
    }

    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }

    minePendingTransactions(miningRewardAddress){
        let block = new Block( Date.now(), this.pendingTransactions);   //creating the blok
        block.mineBlock(this.difficulty);                               // now, lets mine it

        console.log('block successfully mined');
        this.chain.push(block);

        this.pendingTransactions = []           // reset the pending to empty array
        let tr = new Transaction(null, miningRewardAddress, this.miningReward)
                                                // to give the miner his reward, and also add this transacction
                                                // to pending diary,
                                                // parameters: sender is null, receiver is miner, awards/coins received is amount
        this.pendingTransactions.push(tr);
    }

    createTransaction(trans){
        this.pendingTransactions.push(trans);
    }

    getBalanceOfAddress(address){
        let balance = 0;
        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress == address)
                    balance -= trans.amount;
                
                if(trans.toAddress == address)
                    balance += trans.amount;
            }
        }

        return balance;
    }    



    // addBlock(newBlock){
    //     newBlock.previousHash = this.getLatestBlock().hash;
    //     // newBlock.hash = newBlock.calculateHash();
    //     newBlock.mineBlock(this.difficulty);
    //     this.chain.push(newBlock);
    // }

    isChainValid(){
        for(let i=1; i<this.chain.length; i++)
        {
            const currentBlock = this.chain[i];
            const prevBlock = this.chain[i-1];

            if(currentBlock.hash != currentBlock.calculateHash())
                return false;

            if(currentBlock.previousHash != prevBlock.hash)
                return false;
        }
        return true;
    }
}


// instance of Blockchain

let myCoin = new Blockchain();

myCoin.createTransaction(new Transaction('addr1', 'addr2', 200));
myCoin.createTransaction(new Transaction('addr2', 'addr3', 100));

console.log("\n starting the miner...");
myCoin.minePendingTransactions('my-addr');

console.log('my balance is : $' + myCoin.getBalanceOfAddress('my-addr'));

console.log("\n starting the miner again...");
myCoin.minePendingTransactions('my-addr');
console.log('my balance is : $' + myCoin.getBalanceOfAddress('my-addr'));


