'use client';

interface SearchBarProps {
  searchQuery: {
    name: string;
    category: string;
    minPrice: string;
    maxPrice: string;
  };
  setSearchQuery: (query: any) => void;
  onSearch: () => void;
}

export default function SearchBar({ searchQuery, setSearchQuery, onSearch }: SearchBarProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  const handleReset = () => {
    setSearchQuery({ name: '', category: '', minPrice: '', maxPrice: '' });
    onSearch();
  };

  return (
    <div className="mb-8 glass bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-soft border border-gray-100/50 animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={searchQuery.name}
              onChange={(e) => setSearchQuery({ ...searchQuery, name: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent shadow-sm hover:shadow-md transition-all duration-200"
              placeholder="Search by name..."
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <input
              type="text"
              id="category"
              value={searchQuery.category}
              onChange={(e) => setSearchQuery({ ...searchQuery, category: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent shadow-sm hover:shadow-md transition-all duration-200"
              placeholder="Search by category..."
            />
          </div>
          <div>
            <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-1">
              Min Price
            </label>
            <input
              type="number"
              step="0.01"
              id="minPrice"
              value={searchQuery.minPrice}
              onChange={(e) => setSearchQuery({ ...searchQuery, minPrice: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent shadow-sm hover:shadow-md transition-all duration-200"
              placeholder="0.00"
            />
          </div>
          <div>
            <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-1">
              Max Price
            </label>
            <input
              type="number"
              step="0.01"
              id="maxPrice"
              value={searchQuery.maxPrice}
              onChange={(e) => setSearchQuery({ ...searchQuery, maxPrice: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent shadow-sm hover:shadow-md transition-all duration-200"
              placeholder="999.99"
            />
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            type="submit"
            className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl hover:from-amber-700 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 font-semibold"
          >
            Search
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-2.5 bg-white text-gray-700 rounded-xl hover:bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 font-medium"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}

