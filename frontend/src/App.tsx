import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Safe from "./pages/Safe";
import Voting from "./pages/Voting";
import Results from "./pages/Results";
import { useSafe } from "./hooks/useSafe";
import "./App.css";

export default function App() {
    const { account } = useSafe();

    return (
        <Router>
        <Navbar account={account}/>
        <Routes>
            <Route path="/"       element={<Safe />} />
            <Route path="/voting"  element={<Voting />} />
            <Route path="/results" element={<Results />} />
        </Routes>
        </Router>
    );
}