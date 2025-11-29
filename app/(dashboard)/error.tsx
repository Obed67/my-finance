'use client';

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Dashboard error:', error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] p-4">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-destructive/10">
              <AlertTriangle className="h-12 w-12 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-2xl">Erreur de chargement</CardTitle>
          <CardDescription className="text-base">
            Une erreur s&apos;est produite lors du chargement de cette page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error.message && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold">Message:</span> {error.message}
              </p>
            </div>
          )}
          
          {error.digest && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground font-mono">
                Code: {error.digest}
              </p>
            </div>
          )}

          <Button 
            onClick={reset} 
            className="w-full flex items-center justify-center gap-2"
            size="lg"
          >
            <RefreshCw className="h-5 w-5" />
            Réessayer
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
