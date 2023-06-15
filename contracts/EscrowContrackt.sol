// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title Escrow Contract
 * @author [DHIV &JP]
 * @dev This contract implements an escrow service for ERC1155 tokens, allowing a payee to deposit tokens, an owner to withdraw tokens, 
 * and intermediaries to update the status of the tokens. 
 */

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Receiver.sol";

contract Escrow is Ownable, ReentrancyGuard, ERC1155Receiver {
    using SafeMath for uint256;

    address payable public agent;
    mapping(address => mapping(uint256 => uint256)) public deposits;
    mapping(uint256 => address[]) public intermediaries;
    mapping(uint256 => mapping(address => string)) public tokenStatus;

    constructor () {
        agent = payable(msg.sender);
    }

    /**
     * @dev Deposits a specified amount of ERC1155 tokens to the escrow for a given payee.
     * @param payee The address of the payee.
     * @param tokenId The ID of the token being deposited.
     * @param amount The amount of the token being deposited.
     * @param token The ERC1155 token contract.
     */

    function deposit (address payee, uint256 tokenId, uint256 amount, IERC1155 token) public onlyOwner nonReentrant {
        token.safeTransferFrom(msg.sender, address(this), tokenId, amount, "");
        deposits[payee][tokenId] = deposits[payee][tokenId].add(amount);
    }

    /**
     * @dev Withdraws a specified amount of ERC1155 tokens from the escrow for a given payee.
     * @param payee The address of the payee.
     * @param tokenId The ID of the token being withdrawn.
     * @param amount The amount of the token being withdrawn.
     * @param token The ERC1155 token contract.
     */
     
    function withdraw(address payable payee, uint256 tokenId, uint256 amount, IERC1155 token) public onlyOwner nonReentrant {
        uint256 payment = deposits[payee][tokenId];
        require(payment >= amount, "Insufficient funds");
        deposits[payee][tokenId] = payment.sub(amount);
        token.safeTransferFrom(address(this), payee, tokenId, amount, "");
    }

    /**
     * @dev Adds intermediaries for a given token.
     * @param tokenId The ID of the token to add intermediaries for.
     * @param newIntermediaries An array of intermediary addresses to add.
     */

    function addIntermediaries(uint256 tokenId, address[] memory newIntermediaries) public onlyOwner {
        intermediaries[tokenId] = newIntermediaries;
    }
    /**
     * @dev Updates the status of a given token by an intermediary.
     * @param tokenId The ID of the token to update the status for.
     * @param status The new status to set for the token.
     */

    function updateTokenStatus(uint256 tokenId, string memory status) public {
        bool isIntermediary = false;
        for (uint i = 0; i < intermediaries[tokenId].length; i++) {
            if (intermediaries[tokenId][i] == msg.sender) {
                isIntermediary = true;
                break;
            }
        }
        require(isIntermediary, "Only intermediaries can update the token status");
        tokenStatus[tokenId][msg.sender] = status;
    }

    /**
    * @dev Gets the status of a given token for a given intermediary.
    * @param intermediary The address of the intermediary.
    * @param tokenId The ID of the token.
    * @return A string representing the current status of the token for the given intermediary.
    */

    function getTokenStatus(address intermediary, uint256 tokenId) public view returns (string memory) {
        return tokenStatus[tokenId][intermediary];
    }

    /**
    * @dev ERC1155 Receiver function that is called when a single token is transferred to this contract.
    * @return Returns bytes4(keccak256("onERC1155Received(address,address,uint256,uint256,bytes)")).
    */ 
        function onERC1155Received(address, address, uint256, uint256, bytes memory) public pure override returns(bytes4) {
        return this.onERC1155Received.selector;
    }


    /**
     * @dev ERC1155 Receiver function that is called when multiple tokens are transferred to this contract.
     * @return Returns bytes4(keccak256("onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)")).
    */

    function onERC1155BatchReceived(address, address, uint256[] memory, uint256[] memory, bytes memory) public pure override returns(bytes4) {
        return this.onERC1155BatchReceived.selector;
    }
}