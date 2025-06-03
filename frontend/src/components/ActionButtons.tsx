import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ArrowDownToLine, ArrowUpFromLine, RefreshCw, ArrowRightLeft } from 'lucide-react';

type Props = {
  deposit: () => void;
  withdraw: () => void;
  refreshBalances: () => void;
};

export default function ActionButtons({ deposit, withdraw, refreshBalances }: Props) {
  return (
    <Card className="border-2 border-primary/10 transition-all hover:border-primary/20">
      <CardHeader className="bg-muted/50 pb-4">
        <CardTitle className="flex items-center gap-2">
          <ArrowRightLeft className="h-5 w-5 text-primary" />
          Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-5 space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium">Déposer des fonds</p>
          <Button
            onClick={deposit}
            variant="default"
            className="w-full flex items-center justify-center gap-2 h-10"
          >
            <ArrowUpFromLine className="h-4 w-4" />
            Déposer 0,01 ETH
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Cette action déposera 0,01 ETH dans votre coffre-fort
          </p>
        </div>

        <div className="my-2 h-px bg-border" />

        <div className="space-y-2">
          <p className="text-sm font-medium">Retirer des fonds</p>
          <Button
            onClick={withdraw}
            variant="outline"
            className="w-full flex items-center justify-center gap-2 h-10"
          >
            <ArrowDownToLine className="h-4 w-4" />
            Retirer tous les fonds
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Cette action retirera tous vos fonds du coffre-fort
          </p>
        </div>

        <div className="mt-4 pt-4 border-t flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Mettez à jour votre solde</p>
          <Button
            onClick={refreshBalances}
            variant="ghost"
            size="sm"
            className="flex items-center justify-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Rafraîchir
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
