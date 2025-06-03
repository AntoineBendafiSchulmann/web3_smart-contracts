import { useEffect } from 'react';
import { useSafe } from '../hooks/useSafe';
import { useProvider } from '../providers/ProviderContext';
import WalletInfo from '../components/WalletInfo';
import ActionButtons from '../components/ActionButtons';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Wallet, WalletCards } from 'lucide-react';

export default function Safe() {
  const { account, provider } = useProvider();
  const { walletBal, lockBal, deposit, withdraw, refreshBalances } = useSafe();

  useEffect(() => {
    if (!provider || !account) return;

    const listener = () => {
      refreshBalances();
    };

    provider.on('block', listener);
    return () => {
      provider.off('block', listener);
    };
  }, [provider, account, refreshBalances]);

  const handleConnect = async () => {
    const { connect } = useProvider();
    await connect();
  };

  return (
    <div className="fade-in">
      <h1 className="section-title">Gestion de vos fonds</h1>
      <p className="mb-6 text-muted-foreground">
        Gérez vos fonds Ethereum en toute sécurité avec notre coffre-fort décentralisé.
      </p>

      {account ? (
        <div className="grid-container">
          <WalletInfo walletBal={walletBal} lockBal={lockBal} />
          <ActionButtons deposit={deposit} withdraw={withdraw} refreshBalances={refreshBalances} />
        </div>
      ) : (
        <Card className="mx-auto max-w-md border-2 border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <WalletCards className="h-5 w-5 text-primary" />
              Connectez votre wallet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="rounded-full bg-primary/10 p-3">
                <Wallet className="h-10 w-10 text-primary" />
              </div>
              <div>
                <p className="mb-2 text-lg font-medium">Accédez à votre coffre-fort</p>
                <p className="text-sm text-muted-foreground">
                  Connectez votre portefeuille MetaMask pour gérer vos fonds en toute sécurité.
                </p>
              </div>
              <Button onClick={handleConnect} className="mt-4 w-full" size="lg">
                <Wallet className="mr-2 h-4 w-4" />
                Connecter MetaMask
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
