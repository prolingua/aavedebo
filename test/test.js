import { ether, tokens, EVM_REVERT } from './helpers';

const AaveDeBo = artifacts.require('AaveDeBo');
const IERC20 = artifacts.require("IERC20");

import axios from 'axios';

const daiAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F';


require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Test', ([deployer, user1]) => {
    let aaveDeBo;
    let dai;
    
    beforeEach(async () => {
        aaveDeBo = await AaveDeBo.new();
        dai = await IERC20.at(daiAddress);
       

    })

    describe('testing aaveDeBo contract...', () => {

        

        describe('success', () => {
            let etherToDai = 3000; // assuming 1 eth is 3000 dai if can't get from api.nomics.com

            beforeEach(async () => {
                let exchangeRates = [];
                let etherRate;
                let daiRate;
        
                try{
                    var result = await axios.get("https://api.nomics.com/v1/prices?key=803597763badf130692517ef11c70422917e4642");
                    exchangeRates = result.data;
                    etherRate = exchangeRates.filter(ex => ex.currency == "ETH");
                    daiRate = exchangeRates.filter(ex => ex.currency == "DAI");
                    //console.log(etherRate);
                    //console.log(etherRate[0].price);    
                    //console.log(daiRate);
                    //console.log(daiRate[0].price);
                    etherToDai = (etherRate[0].price/daiRate[0].price).toFixed(0);
                    //console.log(etherToDai);
                  }
                  catch(err){
                    console.log(err);
                  }
            })

            it('checks the ether deposit and dai borrow', async () => {                

                const etherBalance1 = await web3.eth.getBalance(user1); // ether balance before depositing

                const daiBalance1 = await dai.balanceOf(user1); // dai balance before borrowing

                const amountToDeposit = ether(1);
                const amountToBorrow = tokens(1*etherToDai*3/4);

                await aaveDeBo.depositETHAndBorrowDAI(amountToBorrow, {from: user1, value: amountToDeposit});

                const etherBalance2 = await web3.eth.getBalance(user1); // ether balance after depositing
                const daiBalance2 = await dai.balanceOf(user1);  // dai balance after borrowing                

                const daiBalanceBeforeInDai = await web3.utils.fromWei(daiBalance1.toString());
                console.log(daiBalanceBeforeInDai);

                const daiToBorrowInDai = await web3.utils.fromWei(amountToBorrow.toString());
                console.log(daiToBorrowInDai);

                const daiBalanceAfterInDai = await web3.utils.fromWei(daiBalance2.toString());
                console.log(daiBalanceAfterInDai);

                console.log(daiBalanceBeforeInDai * 1 + daiToBorrowInDai * 1);

                daiBalanceAfterInDai.toString().should.be.equal((daiBalanceBeforeInDai * 1 + daiToBorrowInDai * 1).toString());
                expect(Number(daiBalance2)).to.be.above(Number(daiBalance1)); // dai balance now must be greater than dai balance before depositing
                expect(Number(etherBalance1)).to.be.above(Number(etherBalance2)); // initial ether balance must be greater than ether balance after depositing
            })
        })
    
        describe('failure', () => {
            it('rejects borrowing dai more than the 75% of thevalue of the collateral eth', async () => {
                const amountToDeposit = ether(1);
                const amountToBorrow = tokens(10000);  // assuming 1 eth is 3000 dai; 10000 will be too much to borrow thus should throw an error

                await aaveDeBo.depositETHAndBorrowDAI(amountToBorrow, {from: user1, value: amountToDeposit}).should.be.rejectedWith(EVM_REVERT);
            })
        })
    })
})