import {
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCategories } from "../hooks/useCategories";

function Home() {
  const navigate = useNavigate();
  const { data: categories = [], isLoading, error } = useCategories();
  const [selected, setSelected] = useState("");

  const handleChange = (event) => {
    const value = event.target.value;
    setSelected(value);
    if (value) {
      navigate(`/products?category=${value}`);
    }
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">Lỗi khi tải dữ liệu</Alert>;
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Trang chủ React + MUI
      </Typography>

      <FormControl fullWidth sx={{ mt: 3 }}>
        <InputLabel>Chọn loại hàng</InputLabel>
        <Select value={selected} label="Chọn loại hàng" onChange={handleChange}>
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Typography variant="body1" sx={{ mt: 3, color: "text.secondary" }}>
        Chọn một danh mục để xem sản phẩm hoặc{" "}
        <Typography
          component="a"
          href="/products"
          sx={{
            color: "primary.main",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          xem tất cả sản phẩm
        </Typography>
      </Typography>
    </div>
  );
}

export default Home;
