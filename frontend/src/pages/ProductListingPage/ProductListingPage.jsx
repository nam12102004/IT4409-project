import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../../api/productsApi";
import ProductCard from "../../components/product/ProductCard";
import ProductCardSkeleton from "../../components/product/ProductCard/ProductCardSkeleton";
import Breadcrumb from "../../components/common/Breadcrumb";
import FilterSidebar from "../../components/filters/FilterSidebar";
import ProductToolbar from "../../components/product/ProductToolbar";
import LoadMoreButton from "../../components/common/LoadMoreButton";
import ScrollToTop from "../../components/common/ScrollToTop";
import SEO from "../../components/common/SEO";
import {
  slugToCategoryName,
  getCategoryBySlug,
  getFilterTypeBySlug,
} from "../../data/categories";
import "./ProductListingPage.css";

const ProductListingPage = () => {
  const { category: categorySlug } = useParams(); // Đổi tên để rõ ràng hơn
  const [searchParams] = useSearchParams();
  const brandFromUrl = searchParams.get("brand");
  const modelFromUrl = searchParams.get("model");
  const searchQuery = searchParams.get("search");

  // Sử dụng React Query để cache và quản lý data
  const {
    data: products = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    staleTime: 5 * 60 * 1000, // Cache 5 phút
    cacheTime: 10 * 60 * 1000, // Giữ cache 10 phút
    refetchOnWindowFocus: false, // Không refetch khi focus lại tab
  });

  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(12);

  // Sort state
  const [sortBy, setSortBy] = useState("default");

  // Filter state - Đơn giản hóa chỉ còn: brands, price, RAM/SSD (laptop), colors (others)
  const [filters, setFilters] = useState({
    brands: [],
    priceRange: null,
    rams: [],
    ssds: [],
    colors: [],
  });

  // Lấy tên category từ slug để filter đúng
  const categoryName = useMemo(() => {
    if (!categorySlug) return null;
    return slugToCategoryName[categorySlug] || null;
  }, [categorySlug]);

  // Lấy filterType từ slug để hiển thị bộ lọc phù hợp
  const filterType = useMemo(() => {
    if (!categorySlug) return "default";
    return getFilterTypeBySlug(categorySlug) || "default";
  }, [categorySlug]);

  // Lấy thông tin category đầy đủ từ slug
  const categoryInfo = useMemo(() => {
    if (!categorySlug) return null;
    return getCategoryBySlug(categorySlug);
  }, [categorySlug]);

  // Category name mapping cho breadcrumb và SEO - sử dụng từ categories.jsx
  const categoryDisplayName = useMemo(() => {
    if (categoryInfo) return categoryInfo.name;
    return categorySlug || "Tất cả sản phẩm";
  }, [categoryInfo, categorySlug]);

  // Dynamic Breadcrumb
  const breadcrumbItems = useMemo(() => {
    const items = [
      { label: "Trang chủ", path: "/" },
      { label: "Sản phẩm", path: "/products" },
    ];

    if (searchQuery) {
      items.push({
        label: `Tìm kiếm: "${searchQuery}"`,
        path: `/products?search=${searchQuery}`,
      });
    } else if (categorySlug && categoryDisplayName) {
      items.push({
        label: categoryDisplayName,
        path: `/products/${categorySlug}`,
      });
    }

    return items;
  }, [categorySlug, categoryDisplayName, searchQuery]);

  // Lọc sản phẩm theo category trước (để tính brands đúng)
  const categoryFilteredProducts = useMemo(() => {
    if (!categoryName) return products;

    return products.filter((p) => {
      const productCategoryName =
        typeof p.category === "string" ? p.category : p.category?.name || "";
      return productCategoryName === categoryName;
    });
  }, [products, categoryName]);

  // Calculate brands từ sản phẩm đã lọc theo category
  const brandsData = useMemo(() => {
    const brandCount = {};
    categoryFilteredProducts.forEach((product) => {
      const brandName = product.brand?.name || "";
      if (brandName) {
        brandCount[brandName] = (brandCount[brandName] || 0) + 1;
      }
    });
    return Object.entries(brandCount)
      .filter(([name]) => name)
      .map(([name, count]) => ({
        name,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [categoryFilteredProducts]);

  // Filter products - Lọc theo tất cả bộ lọc mới
  const filteredProducts = useMemo(() => {
    // Debug: Log một vài sản phẩm để xem cấu trúc specs
    if (categoryFilteredProducts.length > 0) {
      const sample = categoryFilteredProducts[0];
      console.log(
        "Sample product:",
        sample.name,
        "Brand:",
        sample.brand,
        "Specs:",
        sample.specs
      );
    }

    // Bắt đầu từ sản phẩm đã lọc theo category
    let result = [...categoryFilteredProducts];

    // Step 1: Filter by search query from URL
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((p) => {
        const name = (p.name || "").toLowerCase();
        const brand = (p.brand?.name || "").toLowerCase();
        const categoryValue =
          typeof p.category === "string"
            ? p.category.toLowerCase()
            : (p.category?.name || "").toLowerCase();

        return (
          name.includes(query) ||
          brand.includes(query) ||
          categoryValue.includes(query)
        );
      });
    }

    // Step 2: Filter by brand from URL
    if (brandFromUrl) {
      result = result.filter(
        (p) =>
          (p.brand?.name || "").toLowerCase() === brandFromUrl.toLowerCase()
      );
    }

    // Step 3: Filter by model from URL (search in product name)
    if (modelFromUrl) {
      const modelQuery = modelFromUrl.toLowerCase();
      result = result.filter((p) =>
        (p.name || "").toLowerCase().includes(modelQuery)
      );
    }

    // Step 4: Filter by brands from filter sidebar
    if (filters.brands.length > 0) {
      console.log("Filtering by brands:", filters.brands);
      result = result.filter((p) => {
        const productBrand = p.brand?.name || "";
        const isMatch = filters.brands.includes(productBrand);
        if (!isMatch && productBrand) {
          console.log("Brand not match:", productBrand, "vs", filters.brands);
        }
        return isMatch;
      });
    }

    // Step 5: Filter by price range
    if (filters.priceRange) {
      result = result.filter(
        (p) =>
          p.price >= filters.priceRange.min && p.price <= filters.priceRange.max
      );
    }

    // Step 6: Filter by RAM options (chỉ áp dụng cho Laptop)
    if (filters.rams.length > 0) {
      result = result.filter((p) => {
        const ram = p.specs?.ram || p.specs?.RAM || "";
        if (!ram) return false;
        const ramLower = ram.toLowerCase();
        return filters.rams.some((opt) => {
          const optClean = opt.toLowerCase().replace(/\s/g, "");
          const ramClean = ramLower.replace(/\s/g, "");
          return ramClean.includes(optClean) || optClean.includes(ramClean);
        });
      });
    }

    // Step 7: Filter by SSD/storage options (chỉ áp dụng cho Laptop)
    if (filters.ssds.length > 0) {
      result = result.filter((p) => {
        const storage = p.specs?.storage || p.specs?.ssd || p.specs?.SSD || "";
        if (!storage) return false;
        const storageLower = storage.toLowerCase();
        return filters.ssds.some((opt) => {
          const optClean = opt.toLowerCase().replace(/\s/g, "");
          const storageClean = storageLower.replace(/\s/g, "");
          return (
            storageClean.includes(optClean) || optClean.includes(storageClean)
          );
        });
      });
    }

    // Step 8: Filter by colors (áp dụng cho các danh mục không phải Laptop)
    if (filters.colors.length > 0) {
      result = result.filter((p) => {
        const color = p.color || p.specs?.color || "";
        if (!color) return false;
        const colorLower = color.toLowerCase();
        return filters.colors.some((opt) =>
          colorLower.includes(opt.toLowerCase())
        );
      });
    }

    return result;
  }, [
    categoryFilteredProducts,
    filters,
    brandFromUrl,
    modelFromUrl,
    searchQuery,
  ]);

  // Sort products
  const sortedProducts = useMemo(() => {
    let result = [...filteredProducts];

    switch (sortBy) {
      case "price-asc":
        return result.sort((a, b) => a.price - b.price);

      case "rating":
        return result.sort((a, b) => b.rating - a.rating);

      case "bestseller":
        return result.sort((a, b) => {
          // Ưu tiên isBestSeller trước
          if (a.isBestSeller && !b.isBestSeller) return -1;
          if (!a.isBestSeller && b.isBestSeller) return 1;
          // Nếu cùng isBestSeller, sort theo số reviews
          return b.reviews - a.reviews;
        });

      case "default":
      default:
        return result; // Giữ nguyên thứ tự
    }
  }, [filteredProducts, sortBy]);

  // Update displayed products when filters or sort change
  // Reset filters when category changes (but not when search query changes)
  useEffect(() => {
    setFilters({
      brands: [],
      needs: [],
      priceRange: null,
      sources: [],
      conditions: [],
      cpus: [],
      rams: [],
      ssds: [],
      screenSizes: [],
      refreshRates: [],
      resolutions: [],
      advanced: [],
      colors: [],
    });
    setSortBy("default");
    setItemsToShow(12);
  }, [categorySlug, brandFromUrl, modelFromUrl]);

  // Update displayed products when sorted products or itemsToShow changes
  useEffect(() => {
    setDisplayedProducts(sortedProducts.slice(0, itemsToShow));
  }, [sortedProducts, itemsToShow]);

  // Handle Load More - use useCallback to prevent recreation
  const handleLoadMore = useCallback(() => {
    setLoadingMore(true);

    // Simulate loading delay (optional - có thể bỏ)
    setTimeout(() => {
      setItemsToShow((prev) => prev + 12);
      setLoadingMore(false);
    }, 300);
  }, []);

  // Handle filter changes - use useCallback
  const handleFilterChange = useCallback((filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  }, []);

  // Clear all filters - use useCallback
  const handleClearFilters = useCallback(() => {
    setFilters({
      brands: [],
      needs: [],
      priceRange: null,
      sources: [],
      conditions: [],
      cpus: [],
      rams: [],
      ssds: [],
      screenSizes: [],
      refreshRates: [],
      resolutions: [],
      advanced: [],
      colors: [],
    });
  }, []);

  // React Query đã xử lý việc load products, không cần useEffect nữa

  if (loading) {
    return (
      <div className="product-listing-page">
        <Breadcrumb items={breadcrumbItems} />

        <div className="plp-container">
          {/* Filter Sidebar Skeleton */}
          <aside className="filter-sidebar" style={{ opacity: 0.6 }}>
            <div style={{ padding: "20px" }}>
              <div
                style={{
                  height: "30px",
                  background: "#f0f0f0",
                  borderRadius: "4px",
                  marginBottom: "20px",
                }}
              ></div>
              <div
                style={{
                  height: "200px",
                  background: "#f0f0f0",
                  borderRadius: "4px",
                }}
              ></div>
            </div>
          </aside>

          <main className="plp-main">
            {/* Toolbar Skeleton */}
            <div
              style={{
                height: "60px",
                background: "#f9fafb",
                borderRadius: "8px",
                marginBottom: "24px",
              }}
            ></div>

            {/* Product Grid Skeleton */}
            <div className="plp-grid">
              {[...Array(12)].map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Tạo title và description động dựa trên category và search
  const pageTitle = searchQuery
    ? `Tìm kiếm: ${searchQuery}`
    : categoryDisplayName
    ? `${categoryDisplayName}`
    : "Tất cả sản phẩm";

  const pageDescription = searchQuery
    ? `Kết quả tìm kiếm cho "${searchQuery}" - ${filteredProducts.length} sản phẩm`
    : categoryDisplayName
    ? `Danh sách ${categoryDisplayName} chính hãng, giá tốt nhất. ${filteredProducts.length} sản phẩm.`
    : `Khám phá ${filteredProducts.length} sản phẩm công nghệ chính hãng.`;

  return (
    <div className="product-listing-page">
      {/* ===== SEO META TAGS ===== */}
      <SEO
        title={pageTitle}
        description={pageDescription}
        keywords={`${categoryDisplayName || "sản phẩm"}, ${
          searchQuery || ""
        }, laptop, pc, công nghệ, tech geeks`}
      />

      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Main Container */}
      <div className="plp-container">
        {/* Filter Sidebar */}
        <FilterSidebar
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          filterType={filterType}
          brands={brandsData}
        />

        {/* Main Content */}
        <main className="plp-main">
          {/* Toolbar with Sort */}
          <ProductToolbar
            totalProducts={filteredProducts.length}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          {/* Product Grid */}
          {displayedProducts.length > 0 ? (
            <div className="plp-grid">
              {displayedProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="product-card-wrapper"
                  style={{
                    animationDelay: `${index * 0.05}s`,
                  }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="plp-empty">
              <h3>Không tìm thấy sản phẩm</h3>
              <p>Vui lòng thử điều chỉnh bộ lọc hoặc tìm kiếm khác</p>
              <button className="clear-filter-btn" onClick={handleClearFilters}>
                Xóa bộ lọc
              </button>
            </div>
          )}

          {/* Load More Button */}
          {displayedProducts.length > 0 && (
            <LoadMoreButton
              currentCount={displayedProducts.length}
              totalCount={sortedProducts.length}
              onLoadMore={handleLoadMore}
              isLoading={loadingMore}
            />
          )}
        </main>
      </div>

      {/* Scroll to Top Button */}
      <ScrollToTop showAfter={500} />
    </div>
  );
};

export default ProductListingPage;
