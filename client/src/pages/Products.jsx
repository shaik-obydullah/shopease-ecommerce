import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (category) params.set('category', category);
        if (sort) params.set('sort', sort);
        params.set('page', page);
        params.set('limit', '12');

        const { data } = await api.get(`/products?${params}`);
        setProducts(data.products);
        setPagination({ pages: data.pages, currentPage: data.currentPage });
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/products/categories');
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, [search, category, sort, page]);

  const updateParams = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (key !== 'page') params.set('page', '1');
    setSearchParams(params);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
            <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => updateParams('category', '')}
                className={`text-left px-3 py-2 rounded-lg transition ${!category ? 'bg-primary-50 text-primary-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => updateParams('category', cat)}
                  className={`text-left px-3 py-2 rounded-lg capitalize transition ${category === cat ? 'bg-primary-50 text-primary-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <h3 className="font-semibold text-gray-900 mt-6 mb-4">Sort By</h3>
            <select
              value={sort}
              onChange={(e) => updateParams('sort', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </aside>

        <main className="flex-1">
          {search && (
            <div className="mb-4">
              <p className="text-gray-600">
                Showing results for "<span className="font-medium text-gray-900">{search}</span>"
              </p>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No products found</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {pagination.pages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => updateParams('page', p)}
                      className={`w-10 h-10 rounded-lg transition ${p === pagination.currentPage ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
