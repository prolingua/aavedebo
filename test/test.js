import { ether, tokens } from './helpers';

const AaveDeBo = artifacts.require('./aaveDeBo');
const IERC20 = artifacts.require("IERC20");

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
            it('checks the ether deposit and dai borrow', async () => {                

                const etherBalance1 = await web3.eth.getBalance(user1); // ether balance before depositing

                const daiBalance1 = Number(await dai.balanceOf(user1)); // dai balance before borrowing

                const amountToDeposit = ether(1);
                const amountToBorrow = tokens(1*3600*3/4);

                await aaveDeBo.depositETHAndBorrowDAI(amountToBorrow, {from: user1, value: amountToDeposit});

                const etherBalance2 = await web3.eth.getBalance(user1); // ether balance after depositing
                const daiBalance2 = Number(await dai.balanceOf(user1));  // dai balance after borrowing

                const daiBalance3 = Number(daiBalance2 - daiBalance1);  // dai borrowed

                expect(daiBalance3.toString()).to.eq((Number(amountToBorrow)).toString()); // dai borrowed must be the same as dai calculated to borrow
                expect(Number(etherBalance1)).to.be.above(Number(etherBalance2)); // initial ether balance must be greater than ether balance after depositing
            })
        })
    })
})