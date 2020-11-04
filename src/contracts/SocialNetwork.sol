pragma solidity ^0.5.0;

contract SocialNetwork {
  string public name;
  uint public postCount = 0;
  mapping(uint => Post) public posts;  // key: value pair {uint: Post} for posts

  // Model the structure of a Post
  struct Post {
    uint id;
    string content;
    uint tipAmount;
    address payable author;
  }

  // Event to be triggered on call external consumers can subscribe to these events
  event PostCreated(
    uint id,
    string content,
    uint tipAmount,
    address payable author
  );

  event PostTipped(
    uint id,
    string content,
    uint tipAmount,
    address payable author
  );

  constructor() public {
    name = "Dapp University Social Network Tutorial";
  }

  function createPost(string memory _content) public {
    // Require valid content
    require(bytes(_content).length > 0);
    postCount++;  // increment post count
    // _post = Post(postCount, _content, 0, msg.sender); // create a Post using the struct
    // posts[postCount] = _post; // assign the new Post to the mapping
    posts[postCount] = Post(postCount, _content, 0, msg.sender); // one-line solution for previous 2 lines

    emit PostCreated(postCount, _content, 0, msg.sender);
  }

  function tipPost(uint _id) public payable {
    require(_id > 0 && _id <= postCount);
      // Fetch the post
      Post memory _post = posts[_id]; // creates a copy of the post in memory, does not affect the blockchain
      // Fetch the post's author
      address payable _author = _post.author;
      // pay the author
      address(_author).transfer(msg.value);
      // increment tip amount
      // 1 Ether === 100000000000000000 WEI
      _post.tipAmount = _post.tipAmount + msg.value;
      // update the post
      posts[_id] = _post; // updates the post on the blockchain
      // trigger an event
      emit PostTipped(postCount, _post.content, _post.tipAmount, _author);
  }



  /**
    Must create Posts
    List all posts
    Tip Posts
   */
}
