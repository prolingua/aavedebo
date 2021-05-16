import { ether } from './helpers';

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

                const balance1 = await dai.balanceOf(user1);
                balance1.toString().should.equal('0');

                const amountToDeposit = ether(1);
                const amountToBorrow = ether(1*3600*3/4);
                console.log(amountToBorrow.toString());
                await aaveDeBo.depositETHAndBorrowDAI(amountToBorrow, {from: user1, value: amountToDeposit});

                const balance2 = await dai.balanceOf(user1);
                //balance2.toString().should.equal(amountToBorrow.toString());
            })
        })
    })
})