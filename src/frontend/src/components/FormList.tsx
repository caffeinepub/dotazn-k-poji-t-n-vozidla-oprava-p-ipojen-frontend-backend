import { useState } from 'react';
import { useGetAllForms, useGetNewFormsCount, useMarkAllFormsAsViewed, useDeleteForm, convertFormToCSVRow } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Trash2, FileText, Eye, Download } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import type { InsuranceForm } from '../backend';
import { toast } from 'sonner';
import type { ReactElement } from 'react';

export default function FormList() {
  const { data: forms = [], isLoading } = useGetAllForms();
  const { data: newFormsCount = BigInt(0) } = useGetNewFormsCount();
  const markAsViewedMutation = useMarkAllFormsAsViewed();
  const deleteFormMutation = useDeleteForm();
  const [expandedFormId, setExpandedFormId] = useState<string | null>(null);

  const handleMarkAsViewed = async () => {
    await markAsViewedMutation.mutateAsync();
  };

  const handleDeleteForm = async (id: string) => {
    await deleteFormMutation.mutateAsync(id);
  };

  const toggleFormDetails = (id: string) => {
    setExpandedFormId(expandedFormId === id ? null : id);
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('cs-CZ', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  const formatTime = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleTimeString('cs-CZ', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusLabel = (status: InsuranceForm['status']) => {
    return status === 'completed' ? 'Dokončený' : 'Rozpracovaný';
  };

  const getStatusVariant = (status: InsuranceForm['status']): 'default' | 'secondary' => {
    return status === 'completed' ? 'default' : 'secondary';
  };

  // Helper to check if a value is filled (not empty, null, or undefined)
  const isFilled = (value: any): boolean => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim() !== '';
    if (typeof value === 'number' || typeof value === 'bigint') return true;
    return false;
  };

  // Helper to render a field only if it's filled
  const renderField = (label: string, value: any): ReactElement | null => {
    if (!isFilled(value)) return null;
    return (
      <p className="text-sm text-gray-700">
        <span className="font-medium text-gray-900">{label}:</span> {String(value)}
      </p>
    );
  };

  // Helper to render boolean field only if true (Ano)
  const renderBooleanField = (label: string, value: boolean): ReactElement | null => {
    if (!value) return null;
    return (
      <p className="text-sm text-gray-700">
        <span className="font-medium text-gray-900">{label}:</span> Ano
      </p>
    );
  };

  // Convert bigint to number for display and comparison
  const newFormsCountNumber = Number(newFormsCount);

  // Download all forms as CSV
  const handleDownloadCSV = () => {
    if (forms.length === 0) {
      toast.error('Žádné formuláře k exportu');
      return;
    }

    const headers = [
      'ID',
      'Jméno odesílatele',
      'Email odesílatele',
      'Datum vytvoření',
      'Provozovatel - Jméno',
      'Provozovatel - Adresa',
      'Provozovatel - Telefon',
      'Provozovatel - Email',
      'Provozovatel - IČO',
      'Provozovatel - Rodné číslo',
      'Provozovatel - Je firma',
      'Pojistník - Jméno',
      'Pojistník - Adresa',
      'Pojistník - Telefon',
      'Pojistník - Email',
      'Pojistník - IČO',
      'Pojistník - Rodné číslo',
      'Pojistník - Je firma',
      'Vlastník - Jméno',
      'Vlastník - Adresa',
      'Vlastník - Telefon',
      'Vlastník - Email',
      'Typ vozidla',
      'SPZ',
      'VIN',
      'Značka',
      'Model',
      'Způsob užívání',
      'Povinné ručení',
      'Havarijní pojištění',
      'Pojištění skel',
      'Pojištění asistence',
      'Frekvence plateb',
      'Stav tachometru',
      'Poznámky',
      'Stav',
    ].join(',');

    const rows = forms.map(convertFormToCSVRow);
    const csv = [headers, ...rows].join('\n');

    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `formulare_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`Exportováno ${forms.length} formulářů do CSV`);
  };

  // Download all forms as JSON
  const handleDownloadJSON = () => {
    if (forms.length === 0) {
      toast.error('Žádné formuláře k exportu');
      return;
    }

    // Convert BigInt values to strings for JSON serialization
    const formsForExport = forms.map(form => ({
      ...form,
      createdAt: form.createdAt.toString(),
      updatedAt: form.updatedAt.toString(),
      vozidlo: {
        ...form.vozidlo,
        engineCapacity: form.vozidlo.engineCapacity?.toString(),
        maxPower: form.vozidlo.maxPower?.toString(),
        weight: form.vozidlo.weight?.toString(),
        approximateValue: form.vozidlo.approximateValue?.toString(),
      }
    }));

    const json = JSON.stringify(formsForExport, null, 2);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `formulare_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`Exportováno ${forms.length} formulářů do JSON`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="bg-white/95 backdrop-blur-sm shadow-3d border-red-200">
          <CardContent className="p-8 text-center">
            <p className="text-gray-600">Načítání formulářů...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="bg-white/95 backdrop-blur-sm shadow-3d border-red-200">
        <CardHeader className="border-b border-red-100 bg-gradient-to-r from-red-50 to-white">
          <div className="flex flex-col gap-4">
            {/* Title and Badge Row */}
            <div className="flex items-center gap-3 flex-wrap">
              <FileText className="w-8 h-8 text-red-600 flex-shrink-0" />
              <CardTitle className="text-2xl font-bold text-gray-900">
                Přehled formulářů
              </CardTitle>
              {newFormsCountNumber > 0 && (
                <Badge 
                  variant="destructive" 
                  className="animate-fade-in bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-sm font-semibold shadow-lg"
                >
                  {newFormsCountNumber} {newFormsCountNumber === 1 ? 'nový' : newFormsCountNumber < 5 ? 'nové' : 'nových'}
                </Badge>
              )}
            </div>
            
            {/* Action Buttons Row - Fully Responsive */}
            <div className="flex flex-wrap items-center gap-2">
              {forms.length > 0 && (
                <>
                  <Button
                    onClick={handleDownloadCSV}
                    variant="outline"
                    size="sm"
                    className="border-green-300 text-green-700 hover:bg-green-50 flex-shrink-0"
                  >
                    <Download className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Stáhnout CSV</span>
                  </Button>
                  <Button
                    onClick={handleDownloadJSON}
                    variant="outline"
                    size="sm"
                    className="border-blue-300 text-blue-700 hover:bg-blue-50 flex-shrink-0"
                  >
                    <Download className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Stáhnout JSON</span>
                  </Button>
                </>
              )}
              {newFormsCountNumber > 0 && (
                <Button
                  onClick={handleMarkAsViewed}
                  disabled={markAsViewedMutation.isPending}
                  variant="outline"
                  size="sm"
                  className="border-red-300 text-red-700 hover:bg-red-50 flex-shrink-0"
                >
                  <Eye className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Označit jako přečtené</span>
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {forms.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Zatím nebyly odeslány žádné formuláře</p>
              <p className="text-gray-400 text-sm mt-2">
                Formuláře odeslané klienty se zobrazí zde
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {forms.map((form) => (
                <FormCard 
                  key={form.id} 
                  form={form}
                  isExpanded={expandedFormId === form.id}
                  onToggle={() => toggleFormDetails(form.id)}
                  onDelete={handleDeleteForm}
                  formatDate={formatDate}
                  formatTime={formatTime}
                  getStatusLabel={getStatusLabel}
                  getStatusVariant={getStatusVariant}
                  renderField={renderField}
                  renderBooleanField={renderBooleanField}
                  isFilled={isFilled}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Separate component for individual form card
function FormCard({
  form,
  isExpanded,
  onToggle,
  onDelete,
  formatDate,
  formatTime,
  getStatusLabel,
  getStatusVariant,
  renderField,
  renderBooleanField,
  isFilled,
}: {
  form: InsuranceForm;
  isExpanded: boolean;
  onToggle: () => void;
  onDelete: (id: string) => void;
  formatDate: (timestamp: bigint) => string;
  formatTime: (timestamp: bigint) => string;
  getStatusLabel: (status: InsuranceForm['status']) => string;
  getStatusVariant: (status: InsuranceForm['status']) => 'default' | 'secondary';
  renderField: (label: string, value: any) => ReactElement | null;
  renderBooleanField: (label: string, value: boolean) => ReactElement | null;
  isFilled: (value: any) => boolean;
}) {
  return (
    <Card 
      className={`border-2 transition-all duration-300 hover:shadow-lg ${
        !form.viewedByAdmin 
          ? 'border-red-300 bg-red-50/50 animate-fade-in' 
          : 'border-gray-200 bg-white'
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-lg text-gray-900">
                {form.submitterName}
              </h3>
              <Badge variant={getStatusVariant(form.status)}>
                {getStatusLabel(form.status)}
              </Badge>
              {!form.viewedByAdmin && (
                <Badge variant="destructive" className="bg-red-600 text-white animate-fade-in">
                  Nový
                </Badge>
              )}
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Email:</strong> {form.submitterEmail}</p>
              <p><strong>Datum:</strong> {formatDate(form.createdAt)} <strong>Čas:</strong> {formatTime(form.createdAt)}</p>
            </div>
            
            {isExpanded && (
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-4 animate-fade-in">
                {/* Provozovatel Section */}
                <div className="rounded-lg p-5 border border-gray-200 shadow-sm" style={{ backgroundColor: '#f5f6fa' }}>
                  <h4 className="font-semibold text-gray-900 mb-3 text-base border-b border-gray-300 pb-2">
                    Provozovatel
                  </h4>
                  <div className="space-y-2">
                    {renderField('Jméno', form.provozovatel.name)}
                    {renderField('Adresa', form.provozovatel.address)}
                    {renderField('Email', form.provozovatel.email)}
                    {renderField('Telefon', form.provozovatel.phone)}
                    {renderField('IČO', form.provozovatel.ico)}
                    {renderField('Rodné číslo', form.provozovatel.rodneCislo)}
                    {renderBooleanField('Je firma', form.provozovatel.isCompany)}
                    {form.provozovatel.isVatPayer && renderBooleanField('Plátce DPH', form.provozovatel.isVatPayer)}
                  </div>
                </div>
                
                {/* Pojistník Section */}
                {!form.isSameAsProvozovatel && (
                  <div className="rounded-lg p-5 border border-gray-200 shadow-sm" style={{ backgroundColor: '#f5f6fa' }}>
                    <h4 className="font-semibold text-gray-900 mb-3 text-base border-b border-gray-300 pb-2">
                      Pojistník
                    </h4>
                    <div className="space-y-2">
                      {renderField('Jméno', form.pojistnik.name)}
                      {renderField('Adresa', form.pojistnik.address)}
                      {renderField('Email', form.pojistnik.email)}
                      {renderField('Telefon', form.pojistnik.phone)}
                      {renderField('IČO', form.pojistnik.ico)}
                      {renderField('Rodné číslo', form.pojistnik.rodneCislo)}
                      {renderBooleanField('Je firma', form.pojistnik.isCompany)}
                      {form.pojistnik.isVatPayer && renderBooleanField('Plátce DPH', form.pojistnik.isVatPayer)}
                    </div>
                  </div>
                )}
                
                {/* Vlastník Section */}
                {form.vlastnik && !form.isSameAsProvozovatel && (
                  <div className="rounded-lg p-5 border border-gray-200 shadow-sm" style={{ backgroundColor: '#f5f6fa' }}>
                    <h4 className="font-semibold text-gray-900 mb-3 text-base border-b border-gray-300 pb-2">
                      Vlastník
                    </h4>
                    <div className="space-y-2">
                      {renderField('Jméno', form.vlastnik.name)}
                      {renderField('Adresa', form.vlastnik.address)}
                      {renderField('Email', form.vlastnik.email)}
                      {renderField('Telefon', form.vlastnik.phone)}
                      {renderField('IČO', form.vlastnik.ico)}
                      {renderField('Rodné číslo', form.vlastnik.rodneCislo)}
                      {renderBooleanField('Je firma', form.vlastnik.isCompany)}
                      {form.vlastnik.isVatPayer && renderBooleanField('Plátce DPH', form.vlastnik.isVatPayer)}
                    </div>
                  </div>
                )}
                
                {/* Vozidlo Section */}
                <div className="rounded-lg p-5 border border-gray-200 shadow-sm" style={{ backgroundColor: '#f5f6fa' }}>
                  <h4 className="font-semibold text-gray-900 mb-3 text-base border-b border-gray-300 pb-2">
                    Vozidlo
                  </h4>
                  <div className="space-y-2">
                    {renderField('SPZ', form.vozidlo.spz)}
                    {renderField('VIN', form.vozidlo.vin)}
                    {renderField('Značka', form.vozidlo.brand)}
                    {renderField('Model', form.vozidlo.model)}
                    {form.vozidlo.vehicleType.length > 0 && (
                      <p className="text-sm text-gray-700">
                        <span className="font-medium text-gray-900">Typ vozidla:</span> {form.vozidlo.vehicleType.join(', ')}
                      </p>
                    )}
                    {renderField('Způsob užití', form.vozidlo.usageType)}
                    {renderField('Palivo', form.vozidlo.fuelType)}
                    {form.vozidlo.engineCapacity && renderField('Zdvihový objem', `${form.vozidlo.engineCapacity} ccm`)}
                    {form.vozidlo.maxPower && renderField('Výkon', `${form.vozidlo.maxPower} kW`)}
                    {form.vozidlo.weight && renderField('Hmotnost', `${form.vozidlo.weight} kg`)}
                    {form.vozidlo.approximateValue && renderField('Přibližná hodnota', `${form.vozidlo.approximateValue} Kč`)}
                    {renderBooleanField('Dovoz ze zahraničí', form.vozidlo.importedFromAbroad)}
                    {renderBooleanField('Má technický průkaz', form.vozidlo.hasTechnicalCertificate)}
                  </div>
                </div>
                
                {/* Pojištění Section */}
                <div className="rounded-lg p-5 border border-gray-200 shadow-sm" style={{ backgroundColor: '#f5f6fa' }}>
                  <h4 className="font-semibold text-gray-900 mb-3 text-base border-b border-gray-300 pb-2">
                    Pojištění
                  </h4>
                  <div className="space-y-2">
                    {renderBooleanField('Povinné ručení', form.insuranceOptions.povinneRuceni)}
                    {renderBooleanField('Havarijní pojištění', form.insuranceOptions.havarijniPojisteni)}
                    {renderBooleanField('Pojištění skel', form.insuranceOptions.pojisteniSkel)}
                    {renderBooleanField('Pojištění asistence', form.insuranceOptions.pojisteniAsistence)}
                    {renderBooleanField('Pojištění přírodních rizik', form.insuranceOptions.pojisteniPrirodnichRizik)}
                    {renderBooleanField('Pojištění GAP', form.insuranceOptions.pojisteniGAP)}
                    {renderBooleanField('Pojištění náhradního vozidla', form.insuranceOptions.pojisteniNahradnihoVozidla)}
                    {renderBooleanField('Úrazové připojištění', form.insuranceOptions.urazovePripojisteni)}
                    {renderField('Frekvence plateb', form.paymentFrequency)}
                    {renderField('Stav tachometru', form.mileage)}
                  </div>
                </div>
                
                {/* Poznámky Section */}
                {isFilled(form.notes) && (
                  <div className="rounded-lg p-5 border border-gray-200 shadow-sm" style={{ backgroundColor: '#f5f6fa' }}>
                    <h4 className="font-semibold text-gray-900 mb-3 text-base border-b border-gray-300 pb-2">
                      Poznámky
                    </h4>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{form.notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="flex gap-2 ml-4">
            <Button
              onClick={onToggle}
              variant="outline"
              size="sm"
              className="border-gray-300 hover:bg-gray-50"
            >
              {isExpanded ? 'Skrýt' : 'Detail'}
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white">
                <AlertDialogHeader>
                  <AlertDialogTitle>Smazat formulář?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tato akce je nevratná. Formulář od {form.submitterName} bude trvale odstraněn.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Zrušit</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(form.id)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Smazat
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
