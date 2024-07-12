const listHelper = require('../utils/list_helper');

test('dummy returns one', () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  expect(result).toBe(1);
});

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '1',
      title: 'Single blog',
      author: 'Author One',
      url: 'http://example.com/1',
      likes: 5,
      __v: 0,
    },
  ];

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    expect(result).toBe(5);
  });

  const blogs = [
    {
      _id: '2',
      title: 'Blog One',
      author: 'Author One',
      url: 'http://example.com/2',
      likes: 3,
      __v: 0,
    },
    {
      _id: '3',
      title: 'Blog Two',
      author: 'Author Two',
      url: 'http://example.com/3',
      likes: 4,
      __v: 0,
    },
    {
      _id: '4',
      title: 'Blog Three',
      author: 'Author One',
      url: 'http://example.com/4',
      likes: 7,
      __v: 0,
    },
  ];

  test('when list has multiple blogs, calculates the total likes correctly', () => {
    const result = listHelper.totalLikes(blogs);
    expect(result).toBe(14);
  });
});

describe('favorite blog', () => {
  const blogs = [
    {
      _id: '5',
      title: 'Blog A',
      author: 'Author A',
      url: 'http://example.com/5',
      likes: 10,
      __v: 0,
    },
    {
      _id: '6',
      title: 'Blog B',
      author: 'Author B',
      url: 'http://example.com/6',
      likes: 15,
      __v: 0,
    },
    {
      _id: '7',
      title: 'Blog C',
      author: 'Author A',
      url: 'http://example.com/7',
      likes: 8,
      __v: 0,
    },
  ];

  test('finds the blog with the most likes', () => {
    const result = listHelper.favoriteBlog(blogs);
    expect(result).toEqual(blogs[1]);
  });
});

describe('most blogs', () => {
  const blogs = [
    {
      _id: '8',
      title: 'Alpha Blog',
      author: 'Author Alpha',
      url: 'http://example.com/8',
      likes: 3,
      __v: 0,
    },
    {
      _id: '9',
      title: 'Beta Blog',
      author: 'Author Beta',
      url: 'http://example.com/9',
      likes: 5,
      __v: 0,
    },
    {
      _id: '10',
      title: 'Gamma Blog',
      author: 'Author Alpha',
      url: 'http://example.com/10',
      likes: 2,
      __v: 0,
    },
    {
      _id: '11',
      title: 'Delta Blog',
      author: 'Author Delta',
      url: 'http://example.com/11',
      likes: 7,
      __v: 0,
    },
    {
      _id: '12',
      title: 'Epsilon Blog',
      author: 'Author Beta',
      url: 'http://example.com/12',
      likes: 4,
      __v: 0,
    },
  ];

  test('finds the author with the most blogs', () => {
    const result = listHelper.mostBlogs(blogs);
    expect(result).toEqual({
      author: 'Author Alpha',
      blogs: 2,
    });
  });
});

describe('most likes', () => {
  const blogs = [
    {
      _id: '13',
      title: 'Zeta Blog',
      author: 'Author Zeta',
      url: 'http://example.com/13',
      likes: 6,
      __v: 0,
    },
    {
      _id: '14',
      title: 'Eta Blog',
      author: 'Author Eta',
      url: 'http://example.com/14',
      likes: 8,
      __v: 0,
    },
    {
      _id: '15',
      title: 'Theta Blog',
      author: 'Author Zeta',
      url: 'http://example.com/15',
      likes: 10,
      __v: 0,
    },
  ];

  test('finds the author with most likes', () => {
    const result = listHelper.mostLikes(blogs);
    expect(result).toEqual({
      author: 'Author Zeta',
      likes: 16,
    });
  });
});
