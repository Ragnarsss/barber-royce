import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { HomePage } from "./pages/HomePage";
import { ServicesPage } from "./pages/ServicesPage";
import { ProductsPage } from "./pages/ProductsPage";
import { TeamPage } from "./pages/TeamPage";
import { LocationPage } from "./pages/LocationPage";
import "./styles/variables.css";
import "./styles/global.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="servicios" element={<ServicesPage />} />
          <Route path="productos" element={<ProductsPage />} />
          <Route path="equipo" element={<TeamPage />} />
          <Route path="ubicacion" element={<LocationPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
