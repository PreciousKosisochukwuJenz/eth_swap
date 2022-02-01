 // SPDX license identifier
 pragma solidity >=0.4.21;

import "./Token.sol";

 contract EthSwap{
    string public name = "EthSwap Instance Exchange";
    Token public token;
    uint public rate = 100;

    event TokenPurchased(
        address account,
        address token,
        uint amount,
        uint rate
    );

    // Declare constructor to pass the token contract address when deployed
    constructor(Token _token) public{
         token = _token;
    }

    // Buy token function
    function buyTokens() public payable{
         // Calculate number of tokens to buy
        uint tokenAmount = msg.value * rate;

        // Check if eth swap has enough token for process this transfer
        require(token.balanceOf(address(this)) >= tokenAmount);       

        // send tokens to user
        token.transfer(msg.sender, tokenAmount);

        // Emit
        emit TokenPurchased(msg.sender, address(token), tokenAmount, rate);
    }

    function sellToken(uint _amount) public{
        // Perforom sale to redeem eth
        uint etherAmount = _amount / rate;
        token.transferFrom(msg.sender, address(this), _amount);

        payable(msg.sender).transfer(etherAmount);
    }
 }  