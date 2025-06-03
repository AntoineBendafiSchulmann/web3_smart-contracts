import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from './ui/navigation-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Shield, Vote, BarChart3, Wallet, ExternalLink, Copy, Check, Menu } from 'lucide-react';
import { useState } from 'react';
import { useProvider } from '../providers/ProviderContext';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const { account, connect } = useProvider();
  const [copied, setCopied] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const copyAddress = () => {
    if (!account) return;
    navigator.clipboard.writeText(account);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const viewOnEtherscan = () => {
    if (!account) return;
    window.open(`https://sepolia.etherscan.io/address/${account}`, '_blank');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="rounded-full bg-primary/10 p-1">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <span className="font-bold text-lg">Web3 Dapp</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <NavigationMenu>
            <NavigationMenuList className="flex gap-1">
              <NavigationMenuItem>
                <Link to="/">
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      isActive('/') && 'bg-primary/10 text-primary',
                    )}
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    🛡️ Safe
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/voting">
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      isActive('/voting') && 'bg-primary/10 text-primary',
                    )}
                  >
                    <Vote className="mr-2 h-4 w-4" />
                    🗳️ Voting
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/results">
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      isActive('/results') && 'bg-primary/10 text-primary',
                    )}
                  >
                    <BarChart3 className="mr-2 h-4 w-4" />
                    📊 Results
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Mobile Button */}
        <div className="flex items-center md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Connect Wallet Button or Wallet Info */}
        <div className="flex items-center">
          {account ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-10 border-2 border-primary/20 px-4">
                  <Wallet className="mr-2 h-4 w-4 text-primary" />
                  <span className="hidden sm:inline-block mr-1">Wallet:</span>
                  <span>
                    {account.slice(0, 6)}…{account.slice(-4)}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" forceMount className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Wallet</p>
                    <p className="text-xs leading-none text-muted-foreground">{account}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={copyAddress} className="cursor-pointer">
                  {copied ? (
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="mr-2 h-4 w-4" />
                  )}
                  <span>{copied ? 'Copié !' : "Copier l'adresse"}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={viewOnEtherscan} className="cursor-pointer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  <span>Voir sur Etherscan</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="default" className="flex items-center gap-2" onClick={connect}>
              <Wallet className="h-4 w-4" />
              <span>Connecter MetaMask</span>
            </Button>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="absolute left-0 z-50 w-full bg-background border-b shadow-md md:hidden">
          <div className="p-4 space-y-3">
            <Link
              to="/"
              className={cn(
                'flex items-center rounded-md p-2 hover:bg-muted',
                isActive('/') && 'bg-primary/10 text-primary',
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Shield className="mr-2 h-4 w-4" />
              <span>Safe</span>
            </Link>
            <Link
              to="/voting"
              className={cn(
                'flex items-center rounded-md p-2 hover:bg-muted',
                isActive('/voting') && 'bg-primary/10 text-primary',
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Vote className="mr-2 h-4 w-4" />
              <span>Voting</span>
            </Link>
            <Link
              to="/results"
              className={cn(
                'flex items-center rounded-md p-2 hover:bg-muted',
                isActive('/results') && 'bg-primary/10 text-primary',
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              <span>Results</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
