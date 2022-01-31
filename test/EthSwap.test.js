const { assert } = require("chai");
const { default: Web3 } = require("web3");

const EthSwap = artifacts.require("EthSwap");
const Token = artifacts.require("Token");

require("chai").use(require("chai-as-promised")).should();

contract("EthSwap", ([deployer, investor]) => {

    let ethSwap, token;
    before(async()=>{
        token = await Token.new();
        ethSwap = await EthSwap.new(token.address);

        // Transfer all token to ethSwap
        await token.transfer(ethSwap.address, tokens("1000000")); 
    })
   
    // Helper
    function tokens(n){
        return web3.utils.toWei(n,"ether");
    }

    describe("Token deployment", async()=>{
        it("contract has name", async()=>{
            const name = await token.name();
            assert.equal(name, "Jenz Token")
        });
    });

    describe("EthSwap deployment", async()=>{
        it("contract has name", async()=>{
            const name = await ethSwap.name();
            assert.equal(name, "EthSwap Instance Exchange")
        });
    });

    describe("Validate Token", async()=>{
        it("EthSwap contract has token", async()=>{
            const balance = await token.balanceOf(ethSwap.address);
            assert.equal(balance.toString(), tokens("1000000"));
        });
    });

    describe("buyTokens()", async ()=>{
        let result;
        //Purchase tokens before each examples
        before(async()=>{
            result = await ethSwap.buyTokens({from: investor, value: web3.utils.toWei('1',"ether")});
        });


        it("Allow user to instance purchase token from EthSwap for a fixed price", async()=>{
            // Check investor balance
            const investorBalance = await token.balanceOf(investor);
            assert.equal(investorBalance.toString(), tokens('100'));

            let ethSwapBalance;
            ethSwapBalance = await token.balanceOf(ethSwap.address);
            assert.equal(ethSwapBalance.toString(), tokens("999900"));

            ethSwapBalance = await web3.eth.getBalance(ethSwap.address);
            assert.equal(ethSwapBalance, web3.utils.toWei('1',"ether"))

            const event = result.logs[0].args;

            assert.equal(event.account, investor);
            assert.equal(event.token, token.address);
            assert.equal(event.amount.toString(), tokens('100').toString())
            assert.equal(event.rate.toString(), '100');
        })
    })
})