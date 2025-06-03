import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Wallet, RefreshCw, Send, Download } from "lucide-react";
import LockArtifact from "../../abis/Lock.json";

const lockAddress = import.meta.env.VITE_LOCK_ADDRESS as string;
const lockAbi = (LockArtifact as { abi: any }).abi;
const HARDHAT_CHAIN = "0x7a69";

declare global {
  interface EthereumProvider {
    request(args: { method: string; params?: unknown[] }): Promise<unknown>;
  }
  interface Window {
    ethereum?: EthereumProvider;
  }
}

interface VotingPageProps {
  onNavigateToLanding: () => void;
}

export default function VotingPage({ onNavigateToLanding }: VotingPageProps) {
  const [account, setAccount] = useState<string>();
  const [walletBal, setWalletBal] = useState("…");
  const [lockBal, setLockBal] = useState("…");
  const [provider, setProvider] = useState<ethers.BrowserProvider>();
  const [isLoading, setIsLoading] = useState(false);

  /* helpers */
  const initProvider = async () => {
    if (!window.ethereum) { 
      alert("Veuillez installer MetaMask pour continuer"); 
      return; 
    }
    const prov = new ethers.BrowserProvider(window.ethereum as any);
    setProvider(prov);
    return prov;
  };

  const refreshBalances = async (prov = provider) => {
    if (!prov || !account) return;
    setIsLoading(true);
    try {
      const [wBal, lBal] = await Promise.all([
        prov.getBalance(account),
        prov.getBalance(lockAddress),
      ]);
      setWalletBal(ethers.formatEther(wBal));
      setLockBal(ethers.formatEther(lBal));
    } catch (error) {
      console.error("Erreur lors du rafraîchissement des soldes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  /* actions */
  const connect = async () => {
    setIsLoading(true);
    try {
      const prov = await initProvider();
      if (!prov) return;

      const chainId = await prov.send("eth_chainId", []);
      if (chainId !== HARDHAT_CHAIN) {
        alert("Veuillez sélectionner le réseau Hardhat (31337) dans MetaMask");
        return;
      }

      const [addr] = await prov.send("eth_requestAccounts", []);
      setAccount(addr);
      await refreshBalances(prov);
    } catch (error) {
      console.error("Erreur de connexion:", error);
      alert("Erreur lors de la connexion à MetaMask");
    } finally {
      setIsLoading(false);
    }
  };

  const deposit = async () => {
    if (!provider || !account) return;
    setIsLoading(true);
    try {
      const signer = await provider.getSigner();
      const tx = await signer.sendTransaction({ 
        to: lockAddress, 
        value: ethers.parseEther("0.01") 
      });
      await tx.wait();
      await refreshBalances();
      alert("Dépôt de 0.01 ETH effectué avec succès !");
    } catch (error: any) {
      console.error("Erreur lors du dépôt:", error);
      alert("Erreur lors du dépôt: " + (error?.message || "Transaction échouée"));
    } finally {
      setIsLoading(false);
    }
  };

  const withdraw = async () => {
    if (!provider) return;
    setIsLoading(true);
    try {
      const signer = await provider.getSigner();
      const lock = new ethers.Contract(lockAddress, lockAbi, signer);
      const tx = await lock.withdraw();
      await tx.wait();
      await refreshBalances();
      alert("Retrait effectué avec succès !");
    } catch (e: any) {
      console.error("Erreur lors du retrait:", e);
      alert(e?.reason ?? "Retrait impossible (vous n'êtes pas le propriétaire ou l'unlockTime n'est pas atteint)");
    } finally {
      setIsLoading(false);
    }
  };

  /* auto-refresh à chaque bloc */
  useEffect(() => {
    if (!provider || !account) return;
    const listener = () => { void refreshBalances(); };
    provider.on("block", listener);
    return () => { provider.off("block", listener); };
  }, [provider, account]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={onNavigateToLanding}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Retour à l'accueil</span>
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Système de Vote Parlementaire</h1>
            <div className="w-32"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            🛡️ Coffre de Vote Sécurisé
          </h2>
          <p className="text-xl text-gray-600">
            Gérez vos ETH et participez au système de vote démocratique
          </p>
        </div>

        {!account ? (
          /* Connection Card */
          <div className="flex justify-center">
            <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-blue-100 rounded-full">
                    <Wallet className="h-12 w-12 text-blue-600" />
                  </div>
                </div>
                <CardTitle className="text-2xl">Connexion Requise</CardTitle>
                <CardDescription>
                  Connectez votre wallet MetaMask pour accéder au système de vote
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button 
                  onClick={connect} 
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Connexion...
                    </>
                  ) : (
                    <>
                      <Wallet className="mr-2 h-4 w-4" />
                      Connecter MetaMask
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Connected State */
          <div className="space-y-8">
            {/* Account Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Wallet className="h-5 w-5 text-blue-600" />
                  <span>Informations du Compte</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Adresse du Compte</p>
                    <p className="font-mono text-lg font-semibold">
                      {account.slice(0, 6)}...{account.slice(-4)}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Solde Wallet</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {walletBal} ETH
                    </p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Solde Coffre</p>
                    <p className="text-2xl font-bold text-green-600">
                      {lockBal} ETH
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions Card */}
            <Card>
              <CardHeader>
                <CardTitle>Actions Disponibles</CardTitle>
                <CardDescription>
                  Gérez vos ETH dans le coffre sécurisé de vote
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    onClick={deposit} 
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 h-12"
                    size="lg"
                  >
                    {isLoading ? (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="mr-2 h-4 w-4" />
                    )}
                    Déposer 0,01 ETH
                  </Button>
                  
                  <Button 
                    onClick={withdraw} 
                    disabled={isLoading}
                    variant="outline"
                    className="border-green-600 text-green-600 hover:bg-green-50 h-12"
                    size="lg"
                  >
                    {isLoading ? (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="mr-2 h-4 w-4" />
                    )}
                    Retirer
                  </Button>
                  
                  <Button 
                    onClick={() => refreshBalances()} 
                    disabled={isLoading}
                    variant="outline"
                    className="h-12"
                    size="lg"
                  >
                    {isLoading ? (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="mr-2 h-4 w-4" />
                    )}
                    Rafraîchir
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* How it Works Info */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
              <CardHeader>
                <CardTitle className="text-blue-800">Comment ça fonctionne ?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                    <p><strong>État initial :</strong> Le coffre contient 0,05 ETH déposés par le déployeur.</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                    <p><strong>Après dépôt :</strong> Votre dépôt de 0,01 ETH s'ajoute au coffre, votre wallet diminue du montant correspondant.</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                    <p><strong>Retrait :</strong> Seul le propriétaire peut retirer tout le contenu du coffre après l'unlockTime.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
} 