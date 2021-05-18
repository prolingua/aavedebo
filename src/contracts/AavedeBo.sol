// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "./ILendingPool.sol";
import "./ILendingPoolAddressesProvider.sol";
import "./IWETHGateway.sol";
import "./IERC20.sol";

contract AaveDeBo {

    address private lendingPoolAddress;
    address private wETHAddress;
    //address private lpAddressProviderAddress = 0x24a42fD28C976A61Df5D00D0599C34c4f90748c8;  // this is the address for v1
    address private lpAddressProviderAddress = 0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5;    // this is the address for v2; use this one!!
    address private WETHGatewayAddress = 0xcc9a0B7c43DC2a5F023Bb9b738E45B0Ef6B06E04;
    address private daiAddress = 0x6B175474E89094C44Da98b954EedeAC495271d0F;

    ILendingPool private lendingPool;
    ILendingPoolAddressesProvider private provider;
    IWETHGateway private wETHGateway;
    IERC20 private dai;

    constructor() public {
        provider = ILendingPoolAddressesProvider(lpAddressProviderAddress);
        lendingPoolAddress = provider.getLendingPool();
        lendingPool = ILendingPool(lendingPoolAddress);
        wETHGateway = IWETHGateway(WETHGatewayAddress);
        wETHAddress = wETHGateway.getWETHAddress();
        dai = IERC20(daiAddress);
    }

    function depositETHAndBorrowDAI(uint amountToBorrow) payable external {
        wETHGateway.depositETH{value:msg.value}(lendingPoolAddress, address(this), 0);
        lendingPool.setUserUseReserveAsCollateral(wETHAddress,true);
        lendingPool.borrow(daiAddress, amountToBorrow, 1, 0, address(this));
        dai.transfer(msg.sender, amountToBorrow);
    }    
}