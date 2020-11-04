pragma solidity ^0.5.0;

contract SocialNetwork {
  string public name;
  uint public postCount = 0;
  mapping(uint => Post) posts;  // key: value pair {uint: Post} for posts

  // Model the structure of a Post
  struct Post {
    uint id;
    string content;
    uint tipAmount;
    address author;
  }

  // Event to be triggered on call external consumers can subscribe to these events
  event PostCreated(
    uint id,
    string content,
    uint tipAmount,
    address author
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





  /**
    Must create Posts
    List all posts
    Tip Posts
   */
}
