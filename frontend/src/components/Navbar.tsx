import { Link } from "react-router-dom";

type Props = {
    account?: string;
};

export default function Navbar({ account }: Props) {
    return (
        <header className="navbar">
            <div className="navbar-left">
                <h1 className="navbar-logo">🛡️ Coffre</h1>
                <nav className="navbar-links">
                    <Link to="/" className="navbar-link">Safe</Link>
                </nav>
            </div>
            {account && (
                <div className="navbar-account">
                    {account.slice(0, 6)}…{account.slice(-4)}
                </div>
            )}
        </header>
    );
}
