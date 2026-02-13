import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components/layout/Layout/Layout";
import { HomePage } from "./pages/HomePage";
import { LocationPage } from "./pages/LocationPage";
import { ProductsPage } from "./pages/ProductsPage";
import { ServicesPage } from "./pages/ServicesPage";
import { TeamPage } from "./pages/TeamPage";
import "./styles/global.css";
import "./styles/variables.css";

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
