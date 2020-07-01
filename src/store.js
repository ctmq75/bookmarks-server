const { v4: uuid } = require('uuid');

const bookmarks = [
  { id: uuid(),
    title: 'ESPN',
    url: 'https://www.espn.com',
    description: 'Sports Scores & News',
    rating: 2 },
  { id: uuid(),
    title: 'Amazon',
    url: 'https://www.amazon.com',
    description: 'Buy anything and everything',
    rating: 4 },
    { id: uuid(),
      title: 'Bloc',
      url: 'https://www.bloc.io',
      description: 'Learning',
      rating: 5 },
]

module.exports = { bookmarks }