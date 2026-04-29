import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { HomePage } from './pages/HomePage';
import { BusinessForSalePage } from './pages/BusinessForSalePage';
import { BusinessInABoxPage } from './pages/BusinessInABoxPage';
import { SaleProcessPage } from './pages/SaleProcessPage';
import { CustomSolutionsPage } from './pages/CustomSolutionsPage';
import { ContactPage } from './pages/ContactPage';
import { BusinessDetailPage } from './pages/BusinessDetailPage';
import { SellYourBusinessPage } from './pages/SellYourBusinessPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Admin
import { AdminAuthProvider } from './admin/AdminAuthContext';
import { ProtectedRoute } from './admin/components/ProtectedRoute';
import { AdminLoginPage } from './admin/pages/AdminLoginPage';
import { AdminDashboardPage } from './admin/pages/AdminDashboardPage';
import { AdminNewListingPage } from './admin/pages/AdminNewListingPage';
import { AdminEditListingPage } from './admin/pages/AdminEditListingPage';

export default function App() {
  return (
    <AdminAuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* ── Admin routes (no public Header/Footer) ── */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/listings/new"
            element={
              <ProtectedRoute>
                <AdminNewListingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/listings/edit/:id"
            element={
              <ProtectedRoute>
                <AdminEditListingPage />
              </ProtectedRoute>
            }
          />

          {/* ── Public routes (with Header / Footer) ── */}
          <Route
            path="/*"
            element={
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
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            }
          />
        </Routes>
      </Router>
    </AdminAuthProvider>
  );
}
