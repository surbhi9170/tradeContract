# tradeContract
simple trade contract between two parties, a buyer and a seller

# API FUNCTIONALITIES:
create order 
register buyer 
complete order
view order details

NOTE:
Add the pvt key of the buyer and seller in the bearer token.

Assumption: 
Created a dummy erc20 smart contract for putting in orders
As the seller creates the order he has to transfer the requested tokens to the smart contract.
If the buyer is a registered buyer and the signature of the buyer matches the tokens are released from seller to the buyer.
