type Props = {
    account?: string;
};

export default function Navbar({ account }: Props) {
    return (
        <nav className="w-full bg-gray-900 text-white px-6 py-4 shadow-md flex justify-between items-center">
            <h1 className="text-xl font-bold">🛡️ Coffre</h1>
            {account && (
                <span className="text-sm">{account.slice(0, 6)}…{account.slice(-4)}</span>
            )}
        </nav>
    );
}
