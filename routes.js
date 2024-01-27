const { ethers } = require('ethers');

// Update with your contract address and ABI
const contractAddress = '0x5C7A9f2c139AeA61Ed8dAf55E5B92de9c9D49883';
const contractABI =  [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "OwnableInvalidOwner",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "OwnableUnauthorizedAccount",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "orderId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "buyer",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "isRegistered",
                "type": "bool"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "isClaimed",
                "type": "bool"
            }
        ],
        "name": "BuyerDetails",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "orderId",
                "type": "uint256"
            }
        ],
        "name": "OrderCancelled",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "buyer",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "tokenAmount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "tokenContract",
                "type": "address"
            }
        ],
        "name": "OrderCompleted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "orderId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "seller",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "tokenAmount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "tokenContract",
                "type": "address"
            }
        ],
        "name": "OrderCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "orderId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "seller",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "tokenAmount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "tokenContract",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "enum TradeContract.OrderState",
                "name": "state",
                "type": "uint8"
            }
        ],
        "name": "OrderDetails",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "orderId",
                "type": "uint256"
            }
        ],
        "name": "cancelOrder",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "orderId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "chosenRandomNumber",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "buyer",
                "type": "address"
            }
        ],
        "name": "completeOrder",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_tokenAmount",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "_tokenContract",
                "type": "address"
            }
        ],
        "name": "createOrder",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "orderId",
                "type": "uint256"
            }
        ],
        "name": "getOrderDetails",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "nextOrderId",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "orders",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "orderId",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "seller",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenAmount",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "tokenContract",
                "type": "address"
            },
            {
                "internalType": "enum TradeContract.OrderState",
                "name": "state",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "orderId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "randomNumber",
                "type": "uint256"
            }
        ],
        "name": "registerBuyer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]; 

// Replace with your private key
const sellerPrivateKey = 'f17393a6ba0a9711b2f7511eb21dd493f3e22330d7cd413ddcbf50211d26844c';

// Create ethers provider and wallet instances
const provider = new ethers.providers.JsonRpcProvider('HTTP://127.0.0.1:7545');
const sellerWallet = new ethers.Wallet(sellerPrivateKey, provider);
const contract = new ethers.Contract(contractAddress, contractABI, sellerWallet);

async function createOrder(tokenAmount, tokenContract) {
  const createOrderTx = await contract.createOrder(tokenAmount, tokenContract);
  await createOrderTx.wait();
  console.log('Order created successfully!');
}

async function registerBuyer(orderId, message) {
  const registerBuyerTx = await contract.registerBuyer(orderId,message);
  await registerBuyerTx.wait();
  console.log('Buyer registered successfully!');
}

async function completeOrder(orderId, signature) {
  const completeOrderTx = await contract.completeOrder(orderId, signature,'0xe6B4Ed1AEE2e4B69e9D31e5DCD939C4310cFf4C6');
  await completeOrderTx.wait();
  console.log('Order completed successfully!');
}

async function viewOrderDetails(orderId) {
  const getOrderDetailsTx = await contract.getOrderDetails(orderId);
  await getOrderDetailsTx.wait();
  console.log('Order details retrieved successfully!');
}

// Example usage
const tokenAmount = 100;
const tokenContract = '0x16185CdFb1417D15e5a3fdDaFA98180aB89cAd66'; // Replace with the actual token contract address
const orderId = 1; // Replace with the actual order ID
const message = 12;
const signature = 'SignatureFromSeller'; // Replace with the actual signature

// createOrder(tokenAmount, tokenContract)
//registerBuyer(orderId, message)
completeOrder(orderId, message)
//   .then(() => registerBuyer(orderId, message))
//   .then(() => completeOrder(orderId, signature))
//   .then(() => viewOrderDetails(orderId))
//   .catch(error => console.error('Error:', error));
