// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract contracktV001 is ERC1155, Ownable, ReentrancyGuard {
    using SafeMath for uint256;

    struct Item {
        uint256 itemId;
        uint256 quantity;
        string name;
        string uri;
        address seller;

    }

    struct Order{
        uint256 orderId;
        uint256 saleItemId;
        uint256 quantity;
        address seller;
        address buyer;
        string status;
        address[] intermediaries;
    }

    struct SaleItem {
        uint256 itemId;
        uint256 quantity;
        uint256 price;
        string uri;
        address seller;

    }
    
    mapping(uint256 => Item) public items;
    mapping(uint256 => Order) public orders;
    mapping(uint256 => SaleItem) public saleItems;
    mapping(uint256 => mapping (address => string[])) intermediaryStatus;
    mapping(address => mapping (uint256 => bool)) intermediaryAccess;

    uint256 public itemCount;
    uint256 public orderCount;
    address public manager;
    uint256 public saleItemCount;

    // constructor(string memory uri_) ERC1155(uri_) {
        constructor() ERC1155("{id}") {

        manager = msg.sender;
    }

    function setManager(address _manager) public onlyOwner {
        manager = _manager;
    }

    function createItem(string memory name, uint256 quantity, string memory uri) public onlyOwner{
        items[itemCount] = Item(itemCount, quantity , name , uri, msg.sender);
        itemCount = itemCount.add(1);
    }
    
    function listItemForSale(uint256 itemId, uint256 quantity, uint256 price) public onlyOwner{
        require(items[itemId].quantity >= 0, "Insufficient quantity in the item");
        items[itemId].quantity = items[itemId].quantity.sub(quantity);
        saleItems[saleItemCount] = SaleItem(itemId, quantity, price, items[itemId].uri, msg.sender);
        _mint(msg.sender, itemId, quantity, "");
        saleItemCount = saleItemCount.add(1);
    }

    function buyItem(uint256 saleItemId, uint256 quantity) public {
        require(saleItems[saleItemId].quantity >= quantity, "Item is not listed for sale or insufficient quantity");
        address[] memory initialIntermediaries = new address[](1);
        initialIntermediaries[0] = manager;
        orders[orderCount] = Order(orderCount, saleItemId, quantity, saleItems[saleItemId].seller, msg.sender, "Pending",initialIntermediaries);
        intermediaryStatus[orderCount][manager].push("Booked");
        intermediaryAccess[manager][orderCount] = true;
        saleItems[saleItemId].quantity = saleItems[saleItemId].quantity.sub(quantity);
        orderCount = orderCount.add(1);
    }

    function cancelItem(uint256 orderId) public {
        require(orders[orderId].buyer != address(0), "Order does not exist");
        require(msg.sender == orders[orderId].buyer, "Only the buyer can cancel the item");
        uint256 saleItemId = orders[orderId].saleItemId;
        uint256 quantity = orders[orderId].quantity;
        orders[orderId].status = "Cancelled by Buyer";
        saleItems[saleItemId].quantity = saleItems[saleItemId].quantity.add(quantity);
    }

    function addIntermediary(uint256 orderId, address intermediary) public onlyOwner {
        require(orders[orderId].buyer != address(0), "Order does not exist");
        orders[orderId].intermediaries.push(intermediary);
        intermediaryAccess[intermediary][orderId] = true;
        intermediaryStatus[orderId][intermediary].push("Pending");
    }

    function controllIntermediaryAccessHold(uint256 orderId, address intermediary, bool access) public onlyOwner {
        require(orders[orderId].buyer != address(0), "Order does not exist");
        intermediaryAccess[intermediary][orderId] = access;
    }

    function renounceIntermediary(uint256 orderId) public onlyOwner {
        require(orders[orderId].buyer != address(0), "Order does not exist");
        Order storage order = orders[orderId];
        for (uint256 i = 0; i < order.intermediaries.length; i++) {
            address iaddress = order.intermediaries[i]; 
            intermediaryAccess[iaddress][orderId] = false;
            
        }
    }

    function isIntermediaryOfOrder(uint256 _orderId, address _intermediary) public view returns (bool) {
        Order storage order = orders[_orderId];
        
        for (uint256 i = 0; i < order.intermediaries.length; i++) {
            if (order.intermediaries[i] == _intermediary) {
                return true;
            }
        }

        return false;
    }

    function isIntermediaryAccessActive(uint256 orderId, address intermediary) public view returns (bool) {
        require(orders[orderId].buyer != address(0), "Order does not exist");

        bool accessStatus = intermediaryAccess[intermediary][orderId];
        return accessStatus;
    }

    function updateOrderStatus(uint256 orderId, string memory status) public {
        require(orders[orderId].buyer != address(0), "Order does not exist");
        require(isIntermediaryOfOrder(orderId, msg.sender), "Not an assigned intermediary");
        require(isIntermediaryAccessActive(orderId, msg.sender), "Intermediary access not active");
        require(keccak256(bytes(orders[orderId].status)) != keccak256(bytes("Delivered")), "Order Delivered");
        intermediaryStatus[orderId][msg.sender].push(status);
    }

    function getIntermediariesAndStatus(uint256 _orderId) public view returns (address[] memory, string[][] memory) {
        require(orders[_orderId].buyer != address(0), "Order ID does not exist");

        address[] memory intermediaries = orders[_orderId].intermediaries;
        string[][] memory statuses = new string[][](intermediaries.length);

        for (uint256 i = 0; i < intermediaries.length; i++) {
            uint256 statusCount = intermediaryStatus[_orderId][intermediaries[i]].length;
            statuses[i] = new string[](statusCount);

            for (uint256 j = 0; j < statusCount; j++) {
                statuses[i][j] = intermediaryStatus[_orderId][intermediaries[i]][j];
            }
        }
        return (intermediaries, statuses);
    }

    function deliverItem(uint256 _orderId) public onlyOwner {
        require(orders[_orderId].buyer != address(0), "Order ID does not exist");

        uint256 saleItemId = orders[_orderId].saleItemId;
        uint256 quantity = orders[_orderId].quantity;

        safeTransferFrom(msg.sender, orders[_orderId].buyer, saleItemId, quantity, "");
        orders[_orderId].status = "Delivered";
    }
}
