// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

contract ProductPricing {
    address private admin;
    uint public productRatingCount = 0;
    mapping(uint => Product) public products;

    struct Product {
        uint id; // Id sản phẩm
        string name;
        uint price; // Giá đánh giá
        address sender;
        uint numRatings; // Số người đã đánh giá 
        bool active;
        uint256 creationTime; // Thời gian tạo
        uint256 time;   // Thời gian giới hạn
        string picAdd; // Địa chỉ hình ảnh sản phẩm
    }
    // Chỉ cho phép Admin sử dụng
    modifier onlyAdimn() {
        require(msg.sender == admin, "Only admin can call this function.");
        _;
    }
    // Lấy số thứ tự đánh giá cuối cùng của sản phẩm
    function getLatest(uint _id) public view returns (uint) {
        require( _id <= getNumberProduct());
        for (uint i = 1 ; i <= productRatingCount; i++) {
            if (products[i].id == _id ) {
                return i;
            }
        }
        return 0;
    }
    // Check người dùng đã đánh giá sản phẩm chưa
    function check(uint _id) public view returns (bool) {
        require( _id <= getNumberProduct());
        address _add = msg.sender;
        for (uint i = 1 ; i <= productRatingCount; i++) {
            if (products[i].id == _id && products[i].sender== _add) {
                return true;
            }
        }
        return false;
    }
    // Cho phép nhiều người dùng định giá sản phẩm
    function setPrice(uint _id, uint _price) public {
        Product memory _product = products[getLatest(_id)];
        require(_price >= 1, "Price must bigger than 1"); // Yêu cầu giá lớn hơn 1
        require(_product.numRatings <= 10, "The number of reviewers has reached the limit"); //Yêu cầu số đánh giá bé hơn 10
        require(_product.active, "Rating time has expired"); // yêu cầu chưa bị đóng phiên đánh giá
        require((block.timestamp - products[getNumRating(_id,1)].creationTime) <= products[getNumRating(_id,1)].time , "Rating time has expired"); //yêu cầu còn thời gian đánh giá
        require(!check(_id));
        _product.numRatings++;
        productRatingCount++;
        products[productRatingCount] = Product(_product.id, _product.name, _price,msg.sender, _product.numRatings, true, block.timestamp, _product.time , _product.picAdd);
        emit PriceSet(_product.id, _product.name, _price,msg.sender, _product.numRatings, true, block.timestamp, _product.time , _product.picAdd);
    }
    // Lấy số thứ tự đánh giá bất kỳ của sản phẩm
    function getNumRating(uint _id, uint _numRating) public view returns (uint) {
        for (uint i = 1 ; i <= productRatingCount; i++) {
            if (products[i].id == _id && products[i].numRatings == _numRating ) {
                return i;
            }
        }
        return 0;
    }
    // Lấy giá trị tuyệt đối
    function abs(uint a, uint b) public pure returns (uint) {
        return a > b ? a - b : b - a;
    }
    // Lấy giá trung bình của sản phẩm
    function getAveragePrice(uint _id) public view returns (uint) {
        uint finalP = 0;
        uint beginP = products[getNumRating(_id , 1)].price;
        uint totalP = 0;
        uint totalD = 0;
        for (uint i = 1 ; i <= productRatingCount; i++) {
            if (products[i].id == _id ) {
                uint d = 0;
                uint x = abs( products[i].price , beginP );
                d = x * 100 / beginP;
                totalP += products[i].price * (100-d);
                totalD += 100 - d;
            }
        }
        finalP = totalP / totalD;
        return finalP;
    }
    // Lấy số lượng sản phẩm
    function getNumberProduct() public view returns (uint) {
        uint max=0;
        for (uint i = 1 ; i <= productRatingCount; i++) {
            if (products[i].id > max ) {
                max = products[i].id;
            }
        }
        return max;
    }
    // Tạo sản phẩm
    function createProduct(string memory _name, uint _price, uint256 _time, string memory _picAdd) public {
        require(bytes(_name).length > 0);
        require(_price > 0);
        productRatingCount++;
        uint id = getNumberProduct();
        products[productRatingCount] = Product( id + 1, _name, _price, msg.sender, 1, true, block.timestamp, _time, _picAdd);
        emit ProductCreated(id + 1, _name, _price, msg.sender, 1, true, block.timestamp, _time, _picAdd);
    }
    // Dừng phiên đánh giá
    function stopPricing(uint _id) public {
        Product memory _product = products[getLatest(_id)];
        require(_product.active, "Rating time has expired"); // yêu cầu sản phảm chưa bị dừng
        products[productRatingCount] = Product(_product.id, _product.name, 0, msg.sender , _product.numRatings, false, block.timestamp, _product.time , _product.picAdd);
        emit ProductStoped(_product.id, _product.name, 0, msg.sender , _product.numRatings, false, block.timestamp, _product.time , _product.picAdd);
    }
    event ProductCreated (
        uint id, 
        string name,
        uint price,
        address sender,
        uint numRatings, 
        bool active,
        uint256 creationTime,
        uint256 time,
        string picAdd
    );
    event ProductStoped (
        uint id, 
        string name,
        uint price,
        address sender,
        uint numRatings, 
        bool active,
        uint256 creationTime,
        uint256 time,
        string picAdd
    );
    event PriceSet (
        uint id, 
        string name,
        uint price,
        address sender,
        uint numRatings, 
        bool active,
        uint256 creationTime,
        uint256 time,
        string picAdd
    );
    function getInfoProduct(uint _id)public view returns (Product memory){
        Product memory _product = products[getLatest(_id)];
        _product.creationTime = products[getNumRating(_id,1)].creationTime;
        _product.price = getAveragePrice(_id);
        return _product;
    }
}