import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navbar, { LanguageProvider } from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// Page Imports - Only existing pages
import Home from "./pages/Home";
import SurveyForm from "./pages/SurveyForm";
import IDCardGenerator from "./pages/IDCardGenerator";
import UserIDCardPage from "./pages/UserIDCardPage";
import IDCardTemplateManager from "./pages/IDCardTemplateManager";
import DonationPage from "./pages/DonationPage"; // Import DonationPage
import MutharaiyarPage from "./pages/MutharaiyarPage";
import ServicesPage from "./pages/ServicesPage";
import FeedbackForm from "./pages/FeedbackForm";
// New page imports
import FAQPage from "./pages/FAQPage";
import ForwardSurveyPage from "./pages/ForwardSurveyPage";
import SubcastesPage from "./pages/SubcastesPage";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 overflow-x-hidden">
            <Navbar />
            <main className="flex-1 pt-16 sm:pt-20">
              <Routes>
                <Route path="/" element={<SurveyForm />} />
                <Route path="/home" element={<Home />} />
                
                {/* ID Card routes */}
                <Route path="/idcards" element={<Navigate to="/idcards/generate" replace />} />
                <Route path="/idcards/generate" element={<IDCardGenerator />} />
                <Route path="/idcards/user" element={<UserIDCardPage />} />
                <Route path="/idcards/templates" element={<IDCardTemplateManager />} />
                <Route path="/donation" element={<DonationPage />} />
                <Route path="/mutharaiyar" element={<MutharaiyarPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/feedback" element={<FeedbackForm />} />
                
                {/* New routes */}
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/forward-survey" element={<ForwardSurveyPage />} />
                <Route path="/29-subcastes" element={<SubcastesPage />} />
                
                {/* Redirect old hash-based routes */}
                <Route
                  path="/#services"
                  element={<Navigate to="/services" replace />}
                />
                
                <Route path="/reports" element={
                  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary-50 to-accent-50">
                    <div className="text-center bg-white/80 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-white/20 animate-scale-in">
                      <div className="w-20 h-20 bg-gradient-to-r from-secondary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <span className="text-3xl">📊</span>
                      </div>
                      <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-secondary-600 to-accent-600 bg-clip-text text-transparent mb-4">Survey Reports</h1>
                      <p className="text-xl text-neutral-600 mb-6">Comprehensive analytics and insights</p>
                      <div className="inline-flex items-center space-x-2 bg-primary-100 rounded-full px-4 py-2">
                        <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                        <span className="text-primary-700 font-medium">Coming Soon...</span>
                      </div>
                    </div>
                  </div>
                } />
                
                {/* Fallback Route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
