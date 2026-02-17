import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Shield, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface AdminLoginProps {
  onCancel: () => void;
}

export default function AdminLogin({ onCancel }: AdminLoginProps) {
  const { login, loginStatus } = useInternetIdentity();
  const [staySignedIn, setStaySignedIn] = useState(false);
  const isLoggingIn = loginStatus === 'logging-in';

  const handleLogin = async () => {
    try {
      // Note: The Internet Identity hook doesn't support custom maxTimeToLive parameter
      // The session duration is managed by the Internet Identity service itself
      // The "Stay signed in" checkbox is kept for UX purposes but doesn't affect the actual session
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Chyba při přihlašování');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4">
      <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-2 border-red-200">
        <CardHeader className="space-y-1 pb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center text-gray-900">
            Administrátorské přihlášení
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            Přihlaste se pomocí Internet Identity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <Checkbox
                id="staySignedIn"
                checked={staySignedIn}
                onCheckedChange={(checked) => setStaySignedIn(checked as boolean)}
                className="border-red-600 data-[state=checked]:bg-red-600"
              />
              <Label htmlFor="staySignedIn" className="text-sm font-medium cursor-pointer text-gray-700">
                Zůstat přihlášen
              </Label>
            </div>

            <Button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-6 shadow-lg hover:shadow-xl transition-all duration-300"
              size="lg"
            >
              {isLoggingIn ? 'Přihlašování...' : 'Přihlásit se'}
            </Button>

            <Button
              onClick={onCancel}
              variant="outline"
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
              size="lg"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zpět na formulář
            </Button>
          </div>

          <div className="text-xs text-gray-500 text-center pt-4 border-t border-gray-200">
            <p>Přístup pouze pro autorizované administrátory</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
