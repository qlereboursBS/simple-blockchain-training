const hash = require('crypto-js/sha256');

class Block {

  constructor(index, timestamp, data, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return hash(this.index + this.timestamp + this.previousHash + this.nonce + JSON.stringify(this.data)).toString();
  }

  mineBlock(complexity) {
    while(this.hash.substring(0, complexity) !== Array(complexity + 1).join("0")) {
      this.nonce = this.nonce + 1;
      this.hash = this.calculateHash();
    }

    console.log('Block mined', this.hash);
  }
}

class Blockchain {

  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    return new Block(0, '01/01/2021', "First block", '0');
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlock(5);
    this.chain.push(newBlock);
  }

  isValid() {
    for (let blockIndex = 1; blockIndex < this.chain.length; blockIndex++) {
      const currentBlock = this.chain[blockIndex];
      const previousBlock = this.chain[blockIndex - 1];

      if(currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
}

const myCustomBlockchain = new Blockchain();

console.log('Mining block 1...');
myCustomBlockchain.addBlock(new Block(1, "01/02/2021", [{ amount: 100, sender: 'Quentin', receiver: 'Fabien'}]));
console.log('Mining block 2...');
myCustomBlockchain.addBlock(new Block(2, "05/02/2021", [{ amount: 50, sender: 'Fabien', receiver: 'Quentin'}]));

