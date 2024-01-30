// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

/**
 * @title TradeContract
 * @dev A smart contract for handling token trades between sellers and registered buyers.
 */
contract TradeContract is Ownable {
    using ECDSA for bytes32;

    enum OrderState { CREATED, COMPLETED, CANCELLED }

    struct Order {
        uint256 orderId;
        address seller;
        uint256 tokenAmount;
        address tokenContract;
        OrderState state;
        mapping(address => bool) registeredBuyers;
        mapping(bytes32 => bool) usedRandomNumbers;
    }

    // Mapping to store orders
    mapping(uint256 => Order) public orders;
    uint256 public nextOrderId;

    // Events to log important contract actions
    event OrderCreated(uint256 orderId, address seller, uint256 tokenAmount, address tokenContract);
    event OrderCompleted(address buyer, uint256 tokenAmount, address tokenContract);
    event OrderCancelled(uint256 orderId);
    event OrderDetails(uint256 orderId, address seller, uint256 tokenAmount, address tokenContract,OrderState state);
    event BuyerDetails(uint256 orderId, address buyer, bool isRegistered, bool isClaimed);

    // Constructor for TradeContract
    constructor() Ownable(msg.sender) {}

    // Modifier to ensure that only registered buyers can call certain functions
    modifier onlyBuyer(uint256 orderId) {
        require(orders[orderId].registeredBuyers[msg.sender], "Only registered buyer can call this");
        _;
    }

    // Modifier to ensure that an order exists
    modifier orderExists(uint256 orderId) {
        require(orders[orderId].orderId != 0, "Order does not exist");
        _;
    }

    /**
     * @dev Creates a new trade order.
     * @param _tokenAmount The amount of tokens to be traded.
     * @param _tokenContract The address of the token contract.
     */
    function createOrder(uint256 _tokenAmount, address _tokenContract) external {
        require(_tokenAmount > 0, "Token amount must be greater than 0");
        require(_tokenContract != address(0), "Invalid token contract address");

        nextOrderId++;
        
        orders[nextOrderId].orderId= nextOrderId;
        orders[nextOrderId].seller= msg.sender;
        orders[nextOrderId].tokenAmount= _tokenAmount;
        orders[nextOrderId].tokenContract= _tokenContract;
        orders[nextOrderId].state= OrderState.CREATED;

        emit OrderCreated(nextOrderId, msg.sender, _tokenAmount, _tokenContract);
    }

    /**
     * @dev Allows a buyer to register for a trade order using a random number.
     * @param orderId The ID of the trade order.
     * @param randomNumber The random number chosen by the buyer.
     */
     function registerBuyer(uint256 orderId, uint256 randomNumber) external {
        require(orders[orderId].state == OrderState.CREATED, "Order is not in CREATED state");
        require(!orders[orderId].registeredBuyers[msg.sender], "Buyer already registered");
        require(randomNumber != 0, "Random number cannot be zero");

        bytes32 hash = keccak256(abi.encodePacked(orderId, msg.sender, randomNumber));
        require(!orders[orderId].usedRandomNumbers[hash], "Random number already used");

        orders[orderId].registeredBuyers[msg.sender] = true;
        orders[orderId].usedRandomNumbers[hash] = true;
    }

    /**
     * @dev Completes a trade order, transferring tokens to the buyer.
     * @param orderId The ID of the trade order.
     * @param chosenRandomNumber The random number chosen by the buyer.
     */
    function completeOrder(uint256 orderId, uint256 chosenRandomNumber) external onlyBuyer(orderId) {
        require(orders[orderId].state == OrderState.CREATED, "Order is not in CREATED state");

        bytes32 hash = keccak256(abi.encodePacked(orderId, msg.sender, chosenRandomNumber));
        require(orders[orderId].usedRandomNumbers[hash], "Invalid random number");

        IERC20 _token = IERC20(orders[orderId].tokenContract);
        require(_token.balanceOf(address(this)) >= orders[orderId].tokenAmount, "Token doesn't exist in the system Please contact the seller ");
        _token.transfer(msg.sender,orders[orderId].tokenAmount);

        orders[orderId].state = OrderState.COMPLETED;

        emit OrderCompleted(msg.sender, orders[orderId].tokenAmount, orders[orderId].tokenContract);
    }

    /**
     * @dev Cancels a trade order (only callable by the owner).
     * @param orderId The ID of the trade order.
     */
    function cancelOrder(uint256 orderId) external onlyOwner orderExists(orderId) {
        require(orders[orderId].state == OrderState.CREATED, "Order is not in CREATED state");

        orders[orderId].state = OrderState.CANCELLED;

        emit OrderCancelled(orderId);
    }

    /**
     * @dev Retrieves details of a trade order.
     * @param orderId The ID of the trade order.
     * @return orderid The ID of the trade order.
     * @return seller The address of the seller.
     * @return tokenAmount The amount of tokens in the order.
     * @return tokenContract The address of the token contract.
     * @return state The state of the trade order.
     */
    function getOrderDetails(uint256 orderId) external view returns(uint256 orderid, address seller, uint256 tokenAmount, address tokenContract,OrderState state) {

        require(orderId <= nextOrderId, "Invalid order ID");

        // emit OrderDetails(orders[orderId].orderId,orders[orderId].seller,orders[orderId].tokenAmount,orders[orderId].tokenContract,orders[orderId].state);

        return (orders[orderId].orderId,orders[orderId].seller,orders[orderId].tokenAmount,orders[orderId].tokenContract,orders[orderId].state);
    }
}
