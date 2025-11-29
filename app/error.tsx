'use client';

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-destructive/10">
              <AlertCircle className="h-16 w-16 text-destructive" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-foreground">
            Une erreur est survenue
          </h1>
          
          <p className="text-muted-foreground text-lg">
            Quelque chose s&apos;est mal passé. Veuillez réessayer ou retourner à l&apos;accueil.
          </p>

          {error.digest && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground font-mono">
                Code d&apos;erreur: {error.digest}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={reset} variant="default" size="lg" className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Réessayer
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Retour au Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
