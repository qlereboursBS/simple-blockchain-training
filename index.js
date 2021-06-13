const hash = require('crypto-js/sha256');

class Block {

  constructor(index, timestamp, data, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return hash(this.index + this.timestamp + this.previousHash + JSON.stringify(this.data)).toString();
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
    newBlock.hash = newBlock.calculateHash();
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

myCustomBlockchain.addBlock(new Block(1, "01/02/2021", [{ amount: 100, sender: 'Quentin', receiver: 'Fabien'}]));
myCustomBlockchain.addBlock(new Block(2, "05/02/2021", [{ amount: 50, sender: 'Fabien', receiver: 'Quentin'}]));
console.log('is valid?', myCustomBlockchain.isValid());

myCustomBlockchain.chain[1].data[0].amount = 50;
myCustomBlockchain.chain[1].hash = myCustomBlockchain.chain[1].calculateHash();

console.log('is valid?', myCustomBlockchain.isValid());
console.log(JSON.stringify(myCustomBlockchain, null, 4));

