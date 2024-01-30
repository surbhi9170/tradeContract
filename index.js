const express = require('express');
const bodyParser = require('body-parser');
const { ethers } = require('ethers');

const app = express();
app.use(bodyParser.json());

// Replace with your contract address and ABI
const contractAddress = '0xb05cA051155F6BA1396a4FB403B00456E49fd905';
const contractABI = [
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
        "outputs": [
            {
                "internalType": "uint256",
                "name": "orderid",
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

// Create ethers provider instance
const provider = new ethers.providers.JsonRpcProvider('HTTP://127.0.0.1:7545');

// Middleware to handle seller private key and create instances
const login = (req, res, next) => {
    const authHeader = req.headers['authorization'];
  
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Bearer token missing' });
    }
  
    const token = authHeader.split(' ')[1];
    const sellerPrivateKey = token;
  
    if (!sellerPrivateKey) {
      return res.status(401).json({ error: 'Seller private key not provided' });
    }
  
    const sellerWallet = new ethers.Wallet(sellerPrivateKey, provider);
    const contract = new ethers.Contract(contractAddress, contractABI, sellerWallet);

    req.sellerWallet = sellerWallet;
    req.contract = contract;
    next();
  };  

// API to create an order
app.post('/createOrder', login, async (req, res) => {
  const tokenAmount= req.body.tokenAmount;
  const tokenContract=req.body.tokenContract;
  console.log(req.body.tokenAmount)
  try {
    const createOrderTx = await req.contract.createOrder(tokenAmount, tokenContract);
    await createOrderTx.wait();

    res.json({ message: `Order created successfully! Transfer the ${tokenAmount} tokens to ${contractAddress}` });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API to register a buyer
app.post('/registerBuyer', login, async (req, res) => {
  const orderId = req.body.orderId;
  const message = req.body.message;
  try {
    const registerBuyerTx = await req.contract.registerBuyer(orderId, message);
    await registerBuyerTx.wait();
    res.json({ message: 'Buyer registered successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API to complete an order
app.post('/completeOrder', login, async (req, res) => {
    const orderId = req.body.orderId;
    const signature = req.body.message;
  try {
    const completeOrderTx = await req.contract.completeOrder(orderId, signature);
    await completeOrderTx.wait();
    res.json({ message: 'Order completed successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API to view order details
app.get('/viewOrderDetails/:orderId', login, async (req, res) => {
  const { orderId } = req.params;
  console.log("order id",orderId)
  try {
    const getOrderDetailsTx = await req.contract.getOrderDetails(orderId);
    console.log(getOrderDetailsTx.seller)

    
    const orderid=getOrderDetailsTx.orderId;
    const seller=getOrderDetailsTx.seller;
    const tokenAmount=getOrderDetailsTx.tokenAmount.toNumber();
    const tokenContract=getOrderDetailsTx.tokenContract;
    const orderstate=getOrderDetailsTx.state;

    const response = {
        orderId,
        seller,
        tokenAmount,
        tokenContract,
        orderstate,
      };
    
      console.log(response)
    res.json({ message: 'Order details retrieved successfully!', orderDetails: response });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
