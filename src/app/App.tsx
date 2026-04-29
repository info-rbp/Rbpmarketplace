import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { BusinessForSalePage } from './pages/BusinessForSalePage';
import { BusinessInABoxPage } from './pages/BusinessInABoxPage';
import { SaleProcessPage } from './pages/SaleProcessPage';
import { CustomSolutionsPage } from './pages/CustomSolutionsPage';
import { ContactPage } from './pages/ContactPage';
import { BusinessDetailPage } from './pages/BusinessDetailPage';
import { SellYourBusinessPage } from './pages/SellYourBusinessPage';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/businesses-for-sale" element={<BusinessForSalePage />} />
            <Route path="/business-in-a-box" element={<BusinessInABoxPage />} />
            <Route path="/business/:id" element={<BusinessDetailPage />} />
            <Route path="/sale-process" element={<SaleProcessPage />} />
            <Route path="/custom-solutions" element={<CustomSolutionsPage />} />
            <Route path="/sell-your-business" element={<SellYourBusinessPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}