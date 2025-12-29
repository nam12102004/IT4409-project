import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getProducts } from "../../api/productsApi";
import ProductCard from "../../components/product/ProductCard";
import ProductCardSkeleton from "../../components/product/ProductCard/ProductCardSkeleton";
import Breadcrumb from "../../components/common/Breadcrumb";
import FilterSidebar from "../../components/filters/FilterSidebar";
import ProductToolbar from "../../components/product/ProductToolbar";
import LoadMoreButton from "../../components/common/LoadMoreButton";
import ScrollToTop from "../../components/common/ScrollToTop";
import SEO from "../../components/common/SEO";
import "./ProductListingPage.css";

const ProductListingPage = () => {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const brandFromUrl = searchParams.get("brand");
  const modelFromUrl = searchParams.get("model");
  const searchQuery = searchParams.get("search");

  const [products, setProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(12);

  // Sort state
  const [sortBy, setSortBy] = useState("default");

  // Filter state
  const [filters, setFilters] = useState({
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

  // Category name mapping
  const categoryNames = {
    laptop: "Laptop",
    phone: "Điện thoại",
    tablet: "Máy tính bảng",
    keyboard: "Bàn phím",
    mouse: "Chuột",
    headphone: "Tai nghe",
  };

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
    } else if (category) {
      const categoryLabel = categoryNames[category.toLowerCase()] || category;
      items.push({
        label: categoryLabel,
        path: `/products/${category}`,
      });
    }

    return items;
  }, [category, searchQuery]);

  // Calculate categories and brands from products
  const categoriesData = useMemo(() => {
    const categoryCount = {};
    products.forEach((product) => {
      categoryCount[product.category] =
        (categoryCount[product.category] || 0) + 1;
    });
    return Object.entries(categoryCount).map(([name, count]) => ({
      name,
      count,
    }));
  }, [products]);

  const brandsData = useMemo(() => {
    const brandCount = {};
    products.forEach((product) => {
      brandCount[product.brand] = (brandCount[product.brand] || 0) + 1;
    });
    return Object.entries(brandCount)
      .map(([name, count]) => ({
        name,
        count,
      }))
      .sort((a, b) => b.count - a.count); // Sort by count descending
  }, [products]);

  // Filter products - Lọc theo tất cả bộ lọc mới
  const filteredProducts = useMemo(() => {
    // Step 1: Filter by URL category first
    const categoryParam = category ? category.toLowerCase() : "";
    let result = category
      ? products.filter((p) => {
          const pcat = (p.category || "").toLowerCase();
          // allow exact match or contains (handle slug vs name differences)
          return (
            pcat === categoryParam ||
            pcat.includes(categoryParam) ||
            categoryParam.includes(pcat)
          );
        })
      : [...products];

    // Step 2: Filter by search query from URL
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((p) => {
        const name = (p.name || "").toLowerCase();
        const brand = (p.brand || "").toLowerCase();
        const categoryValue = (p.category || "").toLowerCase();

        return (
          name.includes(query) ||
          brand.includes(query) ||
          categoryValue.includes(query)
        );
      });
    }

    // Step 3: Filter by brand from URL
    if (brandFromUrl) {
      result = result.filter(
        (p) => (p.brand || "").toLowerCase() === brandFromUrl.toLowerCase()
      );
    }

    // Step 4: Filter by model from URL (search in product name)
    if (modelFromUrl) {
      const modelQuery = modelFromUrl.toLowerCase();
      result = result.filter((p) =>
        (p.name || "").toLowerCase().includes(modelQuery)
      );
    }

    // Step 5: Filter by brands from filter sidebar
    if (filters.brands.length > 0) {
      result = result.filter((p) => filters.brands.includes(p.brand));
    }

    // Step 6: Filter by price range
    if (filters.priceRange) {
      result = result.filter(
        (p) =>
          p.price >= filters.priceRange.min && p.price <= filters.priceRange.max
      );
    }

    // Step 7: Filter by CPU options
    if (filters.cpus.length > 0) {
      result = result.filter((p) => {
        const cpu = p.specs?.cpu || "";
        if (!cpu) return false;
        const cpuLower = cpu.toLowerCase();
        return filters.cpus.some((opt) => cpuLower.includes(opt.toLowerCase()));
      });
    }

    // Step 8: Filter by RAM options
    if (filters.rams.length > 0) {
      result = result.filter((p) => {
        const ram = p.specs?.ram || "";
        if (!ram) return false;
        const ramLower = ram.toLowerCase();
        return filters.rams.some((opt) => ramLower.includes(opt.toLowerCase()));
      });
    }

    // Step 9: Filter by SSD/storage options
    if (filters.ssds.length > 0) {
      result = result.filter((p) => {
        const storage = p.specs?.storage || "";
        if (!storage) return false;
        const storageLower = storage.toLowerCase();
        return filters.ssds.some((opt) =>
          storageLower.includes(opt.toLowerCase())
        );
      });
    }

    // Step 10: Filter by screen size ranges (approximate by inches in specs.screen)
    if (filters.screenSizes.length > 0) {
      result = result.filter((p) => {
        const screen = p.specs?.screen || "";
        if (!screen) return false;
        const match = screen.match(/(\d+(?:\.\d+)?)/);
        const size = match ? parseFloat(match[1]) : null;
        if (!size) return false;

        return filters.screenSizes.some((label) => {
          switch (label) {
            case "Khoảng 13 inches":
              return size >= 12.5 && size < 13.6;
            case "Khoảng 14 inches":
              return size >= 13.6 && size < 14.6;
            case "Khoảng 15 inches":
              return size >= 14.6 && size < 16.1;
            case "Trên 16 inches":
              return size >= 16.1;
            default:
              return true;
          }
        });
      });
    }

    // Step 11: Filter by refresh rate (Hz) in screen specs
    if (filters.refreshRates.length > 0) {
      result = result.filter((p) => {
        const screen = p.specs?.screen || "";
        if (!screen) return false;
        const screenLower = screen.toLowerCase();
        return filters.refreshRates.some((opt) => {
          const num = opt.replace(/[^0-9]/g, "");
          return num && screenLower.includes(num.toLowerCase());
        });
      });
    }

    // Step 12: Filter by resolution labels
    if (filters.resolutions.length > 0) {
      result = result.filter((p) => {
        const screen = p.specs?.screen || "";
        if (!screen) return false;
        const screenLower = screen.toLowerCase();
        return filters.resolutions.some((opt) =>
          screenLower.includes(opt.toLowerCase())
        );
      });
    }

    // Step 13: Filter by advanced options (e.g., OLED)
    if (filters.advanced.length > 0) {
      result = result.filter((p) => {
        const screen = p.specs?.screen || "";
        const specsAll = `${screen} ${p.specs?.display || ""}`.toLowerCase();
        return filters.advanced.some((opt) =>
          specsAll.includes(opt.toLowerCase())
        );
      });
    }

    // Note: needs, sources, conditions, colors hiện chưa có field tương ứng trong dữ liệu sản phẩm,
    // nên chưa áp dụng lọc chi tiết cho các bộ lọc này.

    return result;
  }, [products, filters, category, brandFromUrl, modelFromUrl, searchQuery]);

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
  }, [category, brandFromUrl, modelFromUrl]);

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

  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Lỗi load sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

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
    : category
    ? `${categoryNames[category] || category}`
    : "Tất cả sản phẩm";

  const pageDescription = searchQuery
    ? `Kết quả tìm kiếm cho "${searchQuery}" - ${filteredProducts.length} sản phẩm`
    : category
    ? `Danh sách ${
        categoryNames[category] || category
      } chính hãng, giá tốt nhất. ${filteredProducts.length} sản phẩm.`
    : `Khám phá ${filteredProducts.length} sản phẩm công nghệ chính hãng.`;

  return (
    <div className="product-listing-page">
      {/* ===== SEO META TAGS ===== */}
      <SEO
        title={pageTitle}
        description={pageDescription}
        keywords={`${category || "sản phẩm"}, ${
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
              <div className="empty-icon">📦</div>
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
