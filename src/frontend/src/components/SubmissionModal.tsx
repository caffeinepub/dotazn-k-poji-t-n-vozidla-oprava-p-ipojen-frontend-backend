import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Mail, User } from 'lucide-react';

interface SubmissionModalProps {
  open: boolean;
  onSubmit: (name: string, email: string) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export default function SubmissionModal({ open, onSubmit, onCancel, isSubmitting }: SubmissionModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    if (!name.trim() || !email.trim()) {
      return;
    }
    onSubmit(name, email);
  };

  const isValid = name.trim() !== '' && email.trim() !== '' && email.includes('@');

  return (
    <Dialog open={open} onOpenChange={(open) => !open && !isSubmitting && onCancel()}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Dokončení odeslání
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Pro dokončení odeslání formuláře prosím vyplňte vaše kontaktní údaje.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="submitter-name" className="text-sm font-semibold text-gray-700">
              Jméno a příjmení *
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="submitter-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Zadejte vaše jméno"
                className="pl-10 border-gray-300 focus:border-red-500 focus:ring-red-500"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="submitter-email" className="text-sm font-semibold text-gray-700">
              E-mail *
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="submitter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vas@email.cz"
                className="pl-10 border-gray-300 focus:border-red-500 focus:ring-red-500"
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Zrušit
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
          >
            {isSubmitting ? 'Odesílání...' : 'Odeslat formulář'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
