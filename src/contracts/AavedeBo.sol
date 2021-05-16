// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "./ILendingPool.sol";
import "./ILendingPoolAddressesProvider.sol";
import "./IWETHGateway.sol";

contract AaveDeBo {

    address private lendingPoolAddress;
    address private lpAddressProviderAddress = 0x24a42fD28C976A61Df5D00D0599C34c4f90748c8;
    address private WETHGatewayAddress = 0xcc9a0B7c43DC2a5F023Bb9b738E45B0Ef6B06E04;
    address private daiAddress = 0x6B175474E89094C44Da98b954EedeAC495271d0F;

    ILendingPool private lendingPool;
    ILendingPoolAddressesProvider private provider;
    IWETHGateway private wETHGateway;

    constructor() public {
        provider = ILendingPoolAddressesProvider(lpAddressProviderAddress);
        lendingPoolAddress = provider.getLendingPool();
        lendingPool = ILendingPool(lendingPoolAddress);
        wETHGateway = IWETHGateway(WETHGatewayAddress);
    }

    function depositETHAndBorrowDAI(uint ammountToBorrow) payable external {
        //wETHGateway.depositETH{value:msg.value}(lendingPoolAddress, msg.sender, 0);
        //lendingPool.borrow(daiAddress, ammountToBorrow, 1, 0, msg.sender);
    }    
}