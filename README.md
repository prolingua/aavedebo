# aavedebo
deposit ETH to and borrow DAI from Aave 

AaveDeBo should deposit a certain amount of ETH to AAVE Lending Pool and borrow a certain amount from the Lending Pool.
However, at moment, WETHGateway.depositETH function called in depositETHAndBorrowDAI in AaveDeBo.sol is not working.

The front-end is ready.

Instructions:
1. Install all dependencies by running 'npm install' on a prompt command at the project directory.
2. Fork the Ethereum Mainnet by running 'ganache-cli -f https://mainnet.infura.io/v3/{your infura project id}' 
   on a prompt command.
3. On a another prompt command run 'truffle migrate' to deploy the smart contract.
4. Run 'npm start' on a prompt command at the project directory to run the front end.
5. Connect Metamask to Localhost with port setting 8545 and import one of the accounts created in step 2

Note:
If you get this error when running step 2: The fork provider errored when checking the nonce for account...
just try again.

If you get this error when running step 3: project ID does not have access to archive state
abort the forking of the Etherum Mainnet and run step 2 again. The forking works only for 128 blocks which takes about 30 minutes.
So every 30 minutes you need to abort the fork and rerun again
