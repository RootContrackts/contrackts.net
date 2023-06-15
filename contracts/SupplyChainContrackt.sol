// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title SupplyChain
 * @author [DHIV &JP]
 * @dev This contract represents a supply chain of ERC1155 tokens. It allows the owner to list items for sale,
 * and for buyers to purchase them. Each item has a name, symbol, URI, price, owner, quantity, and a boolean 
 * value indicating whether it's for sale or not. 
 */

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SupplyChain is ERC1155, Ownable {
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

    event ItemListed(uint256 indexed itemId, address indexed seller, uint256 price);
    event ItemPurchased(uint256 indexed itemId, address indexed buyer, uint256 quantity);

    constructor() ERC1155("") {}

    /**
     * @dev Returns the URI of the token with the given ID.
     * @param tokenId ID of the token to query.
     * @return URI string.
     */

    function uri(uint256 tokenId) public view override returns (string memory) {
        return items[tokenId].uri;
    }

    /**
     * @dev Allows the owner to list multiple items for sale.
     * @param names Array of names for the items.
     * @param symbols Array of symbols for the items.
     * @param uris Array of URIs for the items.
     * @param prices Array of prices for the items.
     * @param quantities Array of quantities for the items.
     */
    function listItems(
        string[] memory names,
        string[] memory symbols,
        string[] memory uris,
        uint256[] memory prices,
        uint256[] memory quantities
    ) public onlyOwner {
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

    /**
     * @dev Allows a user to purchase a specific quantity of an item.
     * @param itemId ID of the item being purchased.
     * @param quantity Quantity of the item being purchased.
     */

    function buyItem(uint256 itemId, uint256 quantity) public payable {
        Item storage item = items[itemId];
        require(item.forSale, "Item is not for sale.");
        require(msg.value >= item.price * quantity, "Insufficient payment.");
        require(item.quantity >= quantity, "Insufficient supply.");

        safeTransferFrom(item.owner, msg.sender, itemId, quantity, "");

        item.owner = msg.sender;
        item.quantity -= quantity;

        emit ItemPurchased(itemId, msg.sender, quantity);
    }


    /**
     * @dev Allows the owner of an item to list it for sale.
     * @param itemId ID of the item to be listed.
     * @param price Price of the item to be listed.
     */

    function listForSale(uint256 itemId, uint256 price) public {
        Item storage item = items[itemId];
        require(item.owner == msg.sender, "Only the owner can list the item for sale.");
        item.forSale = true;
        item.price = price;

        emit ItemListed(itemId, msg.sender, price);
    }

    /**
     * @dev Allows the owner of an item to cancel its sale.
     * @param itemId ID of the item to be removed from sale.
     */
    function cancelSale(uint256 itemId) public {
        Item storage item = items[itemId];
        require(item.forSale, "Item is not for sale.");
        require(item.owner == msg.sender, "Only the owner can cancel the sale.");
        item.forSale = false;

        emit ItemListed(itemId, msg.sender, 0);
    }

    /**
     * @dev Allows the owner to update the price of an item.
     * @param itemId ID of the item to update.
     * @param price New price for the item.
     */

    function updateItemPrice(uint256 itemId, uint256 price) public onlyOwner {
        items[itemId].price = price;

        emit ItemListed(itemId, items[itemId].owner, price);
    }

    /**
     * @dev Allows the owner to withdraw the contract's balance.
     */

    function withdraw() public onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }
}