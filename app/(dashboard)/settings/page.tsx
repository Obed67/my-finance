'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { DEFAULT_CATEGORIES } from '@/lib/constants/categories';
import { User, Settings as SettingsIcon, CreditCard } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" /> Profil
          </CardTitle>
          <CardDescription>Vos informations personnelles</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user?.photoURL || ''} />
            <AvatarFallback className="text-lg bg-primary/10 text-primary">
              {user?.displayName ? getInitials(user.displayName) : 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h3 className="text-xl font-semibold">
              {user?.displayName || 'Utilisateur'}
            </h3>
            <p className="text-muted-foreground">{user?.email}</p>
            <div className="pt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                Compte Actif
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" /> Catégories
          </CardTitle>
          <CardDescription>
            Catégories par défaut disponibles pour vos transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-3 text-sm text-muted-foreground uppercase tracking-wider">
                Revenus
              </h4>
              <div className="space-y-2">
                {DEFAULT_CATEGORIES.filter((c) => c.type === 'income').map(
                  (cat) => (
                    <div
                      key={cat.id}
                      className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
                    >
                      <span className="text-xl">{cat.icon}</span>
                      <span className="font-medium">{cat.name}</span>
                    </div>
                  )
                )}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-3 text-sm text-muted-foreground uppercase tracking-wider">
                Dépenses
              </h4>
              <div className="space-y-2">
                {DEFAULT_CATEGORIES.filter((c) => c.type === 'expense').map(
                  (cat) => (
                    <div
                      key={cat.id}
                      className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
                    >
                      <span className="text-xl">{cat.icon}</span>
                      <span className="font-medium">{cat.name}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferences Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" /> Préférences
          </CardTitle>
          <CardDescription>Personnalisez votre expérience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-2">
            <div>
              <p className="font-medium">Devise</p>
              <p className="text-sm text-muted-foreground">
                Devise utilisée pour l&apos;affichage (par défaut: Euro)
              </p>
            </div>
            <div className="font-mono bg-muted px-3 py-1 rounded">EUR (€)</div>
          </div>
          <Separator />
          <div className="flex items-center justify-between p-2">
            <div>
              <p className="font-medium">Langue</p>
              <p className="text-sm text-muted-foreground">
                Langue de l&apos;interface
              </p>
            </div>
            <div className="bg-muted px-3 py-1 rounded">Français</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
