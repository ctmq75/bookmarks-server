
function makeBookmarksArray() {
  
    return [
      { id: 1,
        title: 'ESPN',
        url: 'https://www.espn.com',
        description: 'Sports Scores & News',
        rating: 2 },
      { id: 2,
        title: 'Amazon',
        url: 'https://www.amazon.com',
        description: 'Buy anything and everything',
        rating: 5 }
    ]
  }
  
  module.exports = {
    makeBookmarksArray,
  }