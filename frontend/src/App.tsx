import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Safe from './pages/Safe';
import Voting from './pages/Voting';
import Results from './pages/Results';
import { Layout } from './components/Layout';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col overflow-hidden">
        <Navbar />
        <div className="flex-1 flex flex-col">
          <Layout>
            <Routes>
              <Route path="/" element={<Safe />} />
              <Route path="/voting" element={<Voting />} />
              <Route path="/results" element={<Results />} />
            </Routes>
          </Layout>
        </div>
      </div>
    </Router>
  );
}
