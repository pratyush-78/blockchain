const SHA256 = require('crypto-js/sha256');

class Block{
    constructor(index, timestamp, data, previousHash = ''){
        this.index=index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;                         // a random number for making proof of work
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + this.nonce + JSON.stringify(this.data)).toString();
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
        this.difficulty = 1;
    }                                                   // initialized with genesis block

    createGenesisBlock(){
        return new Block(0, '01/01/2021', "Genesis Block", '0');
    }

    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }

    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        // newBlock.hash = newBlock.calculateHash();
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

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
console.log('mining block 1...')
myCoin.addBlock(new Block(1, '02/01/2021', "amount: 30", ));

console.log('mining block 2...')
myCoin.addBlock(new Block(2, '03/01/2021', "amount: 20", ));

console.log('mining block 3...')
myCoin.addBlock(new Block(3, '04/01/2021', "amount: 40", ));

// console.log(JSON.stringify(myCoin, null, 4));
// console.log(JSON.stringify(myCoin,null,2));
console.log(myCoin.isChainValid());

// myCoin.chain[1].data = "amount: 1000";
// myCoin.chain[1].hash = myCoin.chain[1].calculateHash();
console.log(myCoin.isChainValid());
