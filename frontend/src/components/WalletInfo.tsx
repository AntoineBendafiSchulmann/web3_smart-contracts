import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Wallet, Lock } from 'lucide-react';

type Props = {
  walletBal: string;
  lockBal: string;
};

export default function WalletInfo({ walletBal, lockBal }: Props) {
  // Convertir les chaînes en nombres
  const walletBalance = parseFloat(walletBal || '0');
  const lockBalance = parseFloat(lockBal || '0');
  const totalBalance = walletBalance + lockBalance;

  // Calculer les pourcentages pour la barre de progression
  const walletPercentage = totalBalance > 0 ? (walletBalance / totalBalance) * 100 : 0;
  const lockPercentage = totalBalance > 0 ? (lockBalance / totalBalance) * 100 : 0;

  return (
    <Card className="border-2 border-primary/10 transition-all hover:border-primary/20">
      <CardHeader className="bg-muted/50 pb-4">
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" />
          Vos soldes
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-5 space-y-6">
        <div className="rounded-lg bg-muted/30 p-4 text-center">
          <span className="text-sm text-muted-foreground">Total</span>
          <div className="text-3xl font-bold">{totalBalance.toFixed(4)} ETH</div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 rounded-full p-1.5">
                  <Wallet className="h-4 w-4 text-primary" />
                </div>
                <span className="font-medium">Wallet</span>
              </div>
              <Badge variant="outline" className="bg-card">
                {walletBalance.toFixed(4)} ETH
              </Badge>
            </div>
            <Progress value={walletPercentage} className="h-2" />
          </div>

          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-accent-foreground/10 rounded-full p-1.5">
                  <Lock className="h-4 w-4 text-accent-foreground" />
                </div>
                <span className="font-medium">Coffre-fort</span>
              </div>
              <Badge variant="outline" className="bg-card">
                {lockBalance.toFixed(4)} ETH
              </Badge>
            </div>
            <Progress value={lockPercentage} className="h-2" />
          </div>
        </div>

        <div className="mt-4 text-xs text-muted-foreground text-center">
          <p>Dernière mise à jour: {new Date().toLocaleTimeString()}</p>
        </div>
      </CardContent>
    </Card>
  );
}
