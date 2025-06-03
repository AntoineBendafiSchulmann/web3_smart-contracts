import type { ReactNode } from 'react';
import { ShieldHalf, Github } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <main className="w-full">
        <div className="container mx-auto px-4 py-6 md:py-8">{children}</div>
      </main>

      <footer className="w-full border-t bg-muted/30 py-4 mt-auto">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground md:flex-row">
          <div className="flex items-center gap-2">
            <ShieldHalf className="h-5 w-5 text-primary" />
            <span>Web3 Dapp - Sécurisé par Blockchain</span>
          </div>

          <div className="text-center md:text-right">
            <p>© {currentYear} Web3 Dapp - Tous droits réservés</p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <Github className="h-4 w-4" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
