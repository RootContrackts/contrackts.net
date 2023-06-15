// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";



contract SupplyChain is ERC1155, Ownable, ReentrancyGuard {
    using SafeMath for uint256;

    struct Item {
        string name;
        string symbol;
        string uri;
        uint256 price;
        address owner;
        uint256 quantity;
        bool forSale;
    }

    mapping(uint256 => Item) public items;
    uint256 public itemCount;
    address public escrow;

    event ItemListed(uint256 indexed itemId, address indexed seller, uint256 price, uint quantity);
    event ItemPurchased(uint256 indexed itemId, address indexed buyer, uint256 quantity);

    constructor() ERC1155("") {}
    
    
    function setEscrow(address _escrow) public onlyOwner nonReentrant {
        escrow = _escrow;
    }


    function uri(uint256 tokenId) public view override returns (string memory) {
        return items[tokenId].uri;
    }

    function listItems(
        string[] memory names,
        string[] memory symbols,
        string[] memory uris,
        uint256[] memory prices,
        uint256[] memory quantities
    ) public onlyOwner nonReentrant {
        require(
            names.length == symbols.length &&
            names.length == uris.length &&
            names.length == prices.length &&
            names.length == quantities.length,
            "Arrays must be the same length."
        );

        for (uint256 i = 0; i < names.length; i++) {
            itemCount++;
            items[itemCount] = Item({
                name: names[i],
                symbol: symbols[i],
                uri: uris[i],
                price: prices[i],
                owner: msg.sender,
                quantity: quantities[i],
                forSale: false
            });
            _mint(msg.sender, itemCount, quantities[i], "");
        }
    }

    function transferToEscrow(uint256 itemId,  uint256 quantity, uint256 price) public onlyOwner nonReentrant {
        Item storage item = items[itemId];
        // require(item.forSale, "Item is not for sale.");
        require(item.quantity >= quantity, "Insufficient supply.");
        require(item.owner == msg.sender, "Only the owner can list the item for sale.");
        
        item.forSale = true;
        item.price = price;

        safeTransferFrom(item.owner, escrow, itemId, quantity, "");

        item.owner = msg.sender;
        //  item.quantity -= quantity;
        item.quantity = item.quantity.sub(quantity);
        emit ItemListed(itemId, msg.sender, price, quantity);
    }


    function withdraw() public onlyOwner nonReentrant {
        payable(msg.sender).transfer(address(this).balance);
    }
}
