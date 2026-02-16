

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { postsAPI } from '../utils/api';
import NewsCard from '../components/NewsCard';
import TrendingPost from '../components/TrendingPost';
import { TrendingUp, Clock, Flame } from 'lucide-react';

const Home = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  const searchQuery = searchParams.get('search');
  
  const [posts, setPosts] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [featuredPost, setFeaturedPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('latest'); 

  
  useEffect(() => {
    fetchTrendingPosts();
  }, []); 

  
  useEffect(() => {
    fetchPosts();
  }, [filter, category, searchQuery]);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      
     
      const params = {
        limit: 20,
      };
      
     
      if (filter === 'trending') {
        params.trending = true;
      } else if (filter === 'popular') {
        params.featured = true;
      }
      
      if (category) {
        params.category = category;
      }
      if (searchQuery) {
        params.search = searchQuery;
      }
      
      const response = await postsAPI.getAll(params);
      
      const postsData = response.data.data?.posts || response.data.posts || response.data || [];
      setPosts(postsData);
      
     
      if (postsData.length > 0 && !searchQuery) {
        setFeaturedPost(postsData[0]);
      } else {
        setFeaturedPost(null);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [filter, category, searchQuery]);

  const fetchTrendingPosts = async () => {
    try {
      const response = await postsAPI.getTrending(5);
      const trendingData = response.data.data?.posts || response.data.posts || response.data || [];
      setTrendingPosts(trendingData);
    } catch (error) {
      console.error('Error fetching trending posts:', error);
      setTrendingPosts([]);
    }
  };

  
  const displayPosts = useMemo(() => {
    return searchQuery ? posts : posts.slice(1);
  }, [posts, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
     
      {featuredPost && !searchQuery && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-sm mb-4">
                  {featuredPost.category || 'Featured Story'}
                </span>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  {featuredPost.title}
                </h1>
                <p className="text-lg mb-6 opacity-90">
                  {featuredPost.excerpt || featuredPost.content?.substring(0, 150) + '...'}
                </p>
                <Link
                  to={`/news/${featuredPost._id}`}
                  className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                  Read More
                </Link>
              </div>
              {featuredPost.image && (
                <div className="hidden md:block">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="rounded-lg shadow-2xl w-full h-80 object-cover"
                    loading="lazy"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

     
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
       
        {(category || searchQuery) && (
          <div className="mb-6">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 flex-wrap">
              {category && (
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                  Category: {category}
                </span>
              )}
              {searchQuery && (
                <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium">
                  Search: "{searchQuery}"
                </span>
              )}
              <Link
                to="/"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline ml-2"
              >
                Clear filters
              </Link>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
       
          <div className="lg:col-span-2">
           
            <div className="flex gap-2 sm:gap-4 mb-8 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
              <button
                onClick={() => setFilter('latest')}
                className={`flex items-center gap-2 px-3 sm:px-4 py-3 font-semibold border-b-2 transition whitespace-nowrap ${
                  filter === 'latest'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <Clock size={20} />
                <span className="hidden sm:inline">Latest</span>
              </button>
              <button
                onClick={() => setFilter('popular')}
                className={`flex items-center gap-2 px-3 sm:px-4 py-3 font-semibold border-b-2 transition whitespace-nowrap ${
                  filter === 'popular'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <Flame size={20} />
                <span className="hidden sm:inline">Popular</span>
              </button>
              <button
                onClick={() => setFilter('trending')}
                className={`flex items-center gap-2 px-3 sm:px-4 py-3 font-semibold border-b-2 transition whitespace-nowrap ${
                  filter === 'trending'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <TrendingUp size={20} />
                <span className="hidden sm:inline">Trending</span>
              </button>
            </div>

           
            {loading ? (
              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white dark:bg-dark-800 rounded-lg shadow animate-pulse">
                    <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-t-lg"></div>
                    <div className="p-6">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  {category || searchQuery 
                    ? `No posts found for ${category ? `category "${category}"` : `search "${searchQuery}"`}`
                    : 'No posts available yet. Create your first post in the admin dashboard!'
                  }
                </p>
                {(category || searchQuery) && (
                  <Link
                    to="/"
                    className="inline-block mt-4 text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View all posts
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {displayPosts.map((post) => (
                  <NewsCard key={post._id} post={post} />
                ))}
              </div>
            )}
          </div>

         
          <div className="lg:col-span-1">
           
            <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-6 sticky top-20">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="text-red-500" />
                Trending Now
              </h2>
              {trendingPosts.length > 0 ? (
                <div className="space-y-4">
                  {trendingPosts.map((post, index) => (
                    <TrendingPost key={post._id} post={post} rank={index + 1} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No trending posts yet.
                </p>
              )}
            </div>

           
            <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-6 mt-6">
              <h3 className="text-xl font-bold mb-4">Categories</h3>
              <div className="space-y-2">
                {['Breaking News', 'Finance', 'Sports', 'Entertainment', 'Technology', 'World'].map(
                  (cat) => (
                    <Link
                      key={cat}
                      to={`/?category=${encodeURIComponent(cat)}`}
                      className={`block px-4 py-2 rounded transition ${
                        category === cat
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold'
                          : 'hover:bg-gray-100 dark:hover:bg-dark-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {cat}
                    </Link>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;