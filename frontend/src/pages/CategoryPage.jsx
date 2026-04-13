import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ChevronDown, SlidersHorizontal, ShoppingBag } from 'lucide-react';
import { getProducts } from '../api/productApi';
import ProductCard from '../components/ProductCard';
import SidebarFilters from '../components/SidebarFilters';

const CategoryPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [pagination, setPagination] = useState({ totalPages: 1, currentPage: 1 });

    // Filter state derived from URL
    const filters = useMemo(() => ({
        style: searchParams.get('style') || '',
        category: searchParams.get('category') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        color: searchParams.get('color') || '',
        size: searchParams.get('size') || '',
        sort: searchParams.get('sort') || 'newest',
        page: searchParams.get('page') || '1'
    }), [searchParams]);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params = Object.fromEntries(
                    Object.entries(filters).filter(([_, v]) => v !== '')
                );
                const res = await getProducts(params);
                setProducts(res.data);
                setPagination({
                    totalPages: res.totalPages,
                    currentPage: res.currentPage
                });
            } catch (err) {
                console.error('Failed to fetch products', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
        window.scrollTo(0, 0);
    }, [filters]);

    const handleFilterChange = (newFilters) => {
        const params = Object.fromEntries(
            Object.entries(newFilters).filter(([_, v]) => v !== '')
        );
        // Reset to page 1 when filters change
        params.page = '1';
        setSearchParams(params);
        setShowMobileFilters(false);
    };

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > pagination.totalPages) return;
        const params = Object.fromEntries(searchParams.entries());
        params.page = newPage.toString();
        setSearchParams(params);
    };

    const activeStyle = filters.style || 'Shop';

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-black/60 text-sm mb-8 font-satoshi">
                <Link to="/" className="hover:text-black">Home</Link>
                <ChevronRight size={16} />
                <span className="text-black font-medium capitalize">{activeStyle}</span>
            </nav>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar - Desktop */}
                <aside className="hidden lg:block w-[295px] shrink-0">
                    <SidebarFilters filters={filters} onFilterChange={handleFilterChange} />
                </aside>

                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-4">
                            <h1 className="text-2xl md:text-3xl font-black font-integral uppercase tracking-tight">
                                {activeStyle}
                            </h1>
                            <button 
                                onClick={() => setShowMobileFilters(!showMobileFilters)}
                                className="lg:hidden p-2 bg-[#F0F0F0] rounded-full"
                            >
                                <SlidersHorizontal size={20} />
                            </button>
                        </div>

                        <div className="flex items-center gap-4 text-black/60 text-sm md:text-base font-satoshi">
                            <span>Showing 1-9 of {products.length * pagination.totalPages} Products</span>
                            <div className="flex items-center gap-1 group cursor-pointer relative">
                                Sort by: <span className="text-black font-bold flex items-center gap-1">
                                    {filters.sort === 'price-low' ? 'Price: Low' : filters.sort === 'price-high' ? 'Price: High' : 'Newest'}
                                    <ChevronDown size={16} />
                                </span>
                                <div className="absolute top-full right-0 mt-2 w-40 bg-white border border-black/10 rounded-xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
                                    <button onClick={() => handleFilterChange({...filters, sort: 'newest'})} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-black">Newest</button>
                                    <button onClick={() => handleFilterChange({...filters, sort: 'price-low'})} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-black">Price: Low</button>
                                    <button onClick={() => handleFilterChange({...filters, sort: 'price-high'})} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-black">Price: High</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Products Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-7 animate-pulse">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
                                <div key={i} className="aspect-[3/4] bg-gray-100 rounded-[20px]"></div>
                            ))}
                        </div>
                    ) : products.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-7 pb-10 border-b border-black/10">
                                {products.map((product) => (
                                    <ProductCard key={product._id} {...product} activeColor={filters.color} />
                                ))}
                            </div>

                            {/* Pagination Controls */}
                            <div className="mt-8 flex items-center justify-between font-satoshi">
                                <button 
                                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                                    disabled={pagination.currentPage === 1}
                                    className="flex items-center gap-2 px-4 py-2 border border-black/10 rounded-xl text-sm font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
                                >
                                    <ChevronLeft size={16} /> Previous
                                </button>

                                <div className="flex items-center gap-1">
                                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${pagination.currentPage === page ? 'bg-[#F0F0F0] text-black' : 'text-black/40 hover:text-black'}`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>

                                <button 
                                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                                    disabled={pagination.currentPage === pagination.totalPages}
                                    className="flex items-center gap-2 px-4 py-2 border border-black/10 rounded-xl text-sm font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
                                >
                                    Next <ChevronRight size={16} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="py-20 text-center flex flex-col items-center gap-4">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                                <ShoppingBag size={32} />
                            </div>
                            <h2 className="text-2xl font-black font-integral uppercase">No Products Found</h2>
                            <p className="text-black/60 font-satoshi">Try adjusting your filters to find what you're looking for.</p>
                            <button 
                                onClick={() => handleFilterChange({ style: filters.style })} 
                                className="bg-black text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm mt-2"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Filters Overlay */}
            {showMobileFilters && (
                <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm lg:hidden flex items-end">
                    <div className="bg-white w-full max-h-[90vh] rounded-t-[32px] overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300">
                        <div className="flex justify-between items-center p-6 border-b border-black/5">
                            <h2 className="text-xl font-bold font-satoshi">Filters</h2>
                            <button onClick={() => setShowMobileFilters(false)} className="p-2 -mr-2"><ChevronDown className="rotate-180" /></button>
                        </div>
                        <div className="overflow-y-auto p-6 flex-1">
                            <SidebarFilters filters={filters} onFilterChange={handleFilterChange} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryPage;
