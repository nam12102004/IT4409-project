import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Container, Typography } from "@mui/material";

function Home() {
  return <Typography variant="h4">Trang chủ React + MUI</Typography>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Container sx={{ mt: 5 }}>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}
