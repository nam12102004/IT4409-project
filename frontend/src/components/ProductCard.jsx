import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
} from "@mui/material";

function ProductCard({ product }) {
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 6,
        },
      }}
    >
      <CardMedia
        component="img"
        image={product.image}
        alt={product.name}
        sx={{
          height: 200,
          objectFit: "contain",
          backgroundColor: "#f5f5f5",
          padding: 2,
        }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ mb: 1 }}>
          <Chip label={product.brand} size="small" sx={{ mb: 1 }} />
        </Box>
        <Typography variant="h6" component="h3" gutterBottom noWrap>
          {product.name}
        </Typography>
        <Typography variant="h5" color="primary" fontWeight="bold">
          {product.price.toLocaleString("vi-VN")}₫
        </Typography>
      </CardContent>
    </Card>
  );
}

export default ProductCard;
