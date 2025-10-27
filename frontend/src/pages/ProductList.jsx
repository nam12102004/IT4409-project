import { useState, useMemo } from "react";
import { useProducts } from "../hooks/useProducts";
import { useBrands } from "../hooks/useBrands";
import { useCategories } from "../hooks/useCategories";
import ProductCard from "../components/ProductCard";
import {
  Typography,
  CircularProgress,
  Alert,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  Pagination,
} from "@mui/material";
import { useLocation } from "react-router-dom";

const ITEMS_PER_PAGE = 6;

function ProductList() {
  const { data: products = [], isLoading, error } = useProducts();
  const { data: brands = [] } = useBrands();
  const { data: categories = [] } = useCategories();

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const categoryFromUrl = params.get("category");

  const [filters, setFilters] = useState({
    category: categoryFromUrl || "",
    brand: "",
    minPrice: "",
    maxPrice: "",
  });
  const [sortBy, setSortBy] = useState("none");
  const [page, setPage] = useState(1);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1); // Reset to page 1 when filter changes
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    setPage(1); // Reset to page 1 when sort changes
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Filter products
  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (filters.category) {
      filtered = filtered.filter((p) => p.category === filters.category);
    }

    if (filters.brand) {
      filtered = filtered.filter((p) => p.brand === filters.brand);
    }

    if (filters.minPrice) {
      filtered = filtered.filter((p) => p.price >= Number(filters.minPrice));
    }

    if (filters.maxPrice) {
      filtered = filtered.filter((p) => p.price <= Number(filters.maxPrice));
    }

    return filtered;
  }, [products, filters]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];

    switch (sortBy) {
      case "priceAsc":
        return sorted.sort((a, b) => a.price - b.price);
      case "priceDesc":
        return sorted.sort((a, b) => b.price - a.price);
      case "nameAsc":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "nameDesc":
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return sorted;
    }
  }, [filteredProducts, sortBy]);

  // Pagination
  const paginatedProducts = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return sortedProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [sortedProducts, page]);

  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">Lỗi khi tải dữ liệu</Alert>;
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Danh sách sản phẩm
      </Typography>

      {/* Filters and Sort */}
      <Box sx={{ mb: 4, p: 3, bgcolor: "#f5f5f5", borderRadius: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Danh mục</InputLabel>
              <Select
                value={filters.category}
                label="Danh mục"
                onChange={(e) => handleFilterChange("category", e.target.value)}
              >
                <MenuItem value="">Tất cả</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Thương hiệu</InputLabel>
              <Select
                value={filters.brand}
                label="Thương hiệu"
                onChange={(e) => handleFilterChange("brand", e.target.value)}
              >
                <MenuItem value="">Tất cả</MenuItem>
                {brands.map((brand) => (
                  <MenuItem key={brand} value={brand}>
                    {brand}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              label="Giá tối thiểu (₫)"
              type="number"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange("minPrice", e.target.value)}
              placeholder="0"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              label="Giá tối đa (₫)"
              type="number"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
              placeholder="50000000"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Sắp xếp</InputLabel>
              <Select
                value={sortBy}
                label="Sắp xếp"
                onChange={handleSortChange}
              >
                <MenuItem value="none">Mặc định</MenuItem>
                <MenuItem value="priceAsc">Giá tăng dần</MenuItem>
                <MenuItem value="priceDesc">Giá giảm dần</MenuItem>
                <MenuItem value="nameAsc">Tên A-Z</MenuItem>
                <MenuItem value="nameDesc">Tên Z-A</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Results count */}
      <Typography variant="body1" sx={{ mb: 2, color: "text.secondary" }}>
        Hiển thị {paginatedProducts.length} / {sortedProducts.length} sản phẩm
      </Typography>

      {/* Product Grid */}
      <Grid container spacing={3}>
        {paginatedProducts.length > 0 ? (
          paginatedProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <ProductCard product={product} />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Alert severity="info">Không tìm thấy sản phẩm nào phù hợp</Alert>
          </Grid>
        )}
      </Grid>

      {/* Pagination */}
      {sortedProducts.length > ITEMS_PER_PAGE && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </div>
  );
}

export default ProductList;
