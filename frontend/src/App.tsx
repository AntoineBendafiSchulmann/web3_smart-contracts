import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Navbar from "./components/Navbar";
import Safe from "./pages/Safe";
import {useEthereum} from "./hooks/useEthereum";
import "./App.css";

export default function App() {
    const {account} = useEthereum();

    return (
        <Router>
            <Navbar account={account}/>
            <Routes>
                <Route path="/" element={<Safe/>}/>
            </Routes>
        </Router>
    );
}
