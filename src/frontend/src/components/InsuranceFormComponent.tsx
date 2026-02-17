import { useState, useEffect, useRef } from 'react';
import { useCreateForm } from '../hooks/useQueries';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { InsuranceForm, Variant_completed_draft, VehicleType, UsageType, PaymentFrequency } from '../backend';
import { toast } from 'sonner';
import SubmissionModal from './SubmissionModal';
import AddressAutocomplete from './AddressAutocomplete';
import VehicleAutocomplete from './VehicleAutocomplete';

interface ValidationError {
  field: string;
  message: string;
  section: string;
}

export default function InsuranceFormComponent() {
  const createForm = useCreateForm();
  const notesTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Validation state
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  // Provozovatel (Bod 1)
  const [provozovatelJmeno, setProvozovatelJmeno] = useState('');
  const [provozovatelAdresa, setProvozovatelAdresa] = useState('');
  const [provozovatelTelefon, setProvozovatelTelefon] = useState('');
  const [provozovatelEmail, setProvozovatelEmail] = useState('');
  const [provozovatelIco, setProvozovatelIco] = useState('');
  const [provozovatelRodneCislo, setProvozovatelRodneCislo] = useState('');
  const [provozovatelIsCompany, setProvozovatelIsCompany] = useState(false);
  const [provozovatelIsVatPayer, setProvozovatelIsVatPayer] = useState(false);
  const [provozovatelExecutiveName, setProvozovatelExecutiveName] = useState('');
  const [provozovatelExecutivePhone, setProvozovatelExecutivePhone] = useState('');
  const [provozovatelExecutiveEmail, setProvozovatelExecutiveEmail] = useState('');
  const [provozovatelExecutiveRodneCislo, setProvozovatelExecutiveRodneCislo] = useState('');
  const [provozovatelCompanyFirstName, setProvozovatelCompanyFirstName] = useState('');
  const [provozovatelCompanyLastName, setProvozovatelCompanyLastName] = useState('');

  // Pojistník (Bod 2)
  const [pojistnikJmeno, setPojistnikJmeno] = useState('');
  const [pojistnikAdresa, setPojistnikAdresa] = useState('');
  const [pojistnikTelefon, setPojistnikTelefon] = useState('');
  const [pojistnikEmail, setPojistnikEmail] = useState('');
  const [pojistnikIco, setPojistnikIco] = useState('');
  const [pojistnikRodneCislo, setPojistnikRodneCislo] = useState('');
  const [pojistnikIsCompany, setPojistnikIsCompany] = useState(false);
  const [pojistnikIsVatPayer, setPojistnikIsVatPayer] = useState(false);
  const [pojistnikExecutiveName, setPojistnikExecutiveName] = useState('');
  const [pojistnikExecutivePhone, setPojistnikExecutivePhone] = useState('');
  const [pojistnikExecutiveEmail, setPojistnikExecutiveEmail] = useState('');
  const [pojistnikExecutiveRodneCislo, setPojistnikExecutiveRodneCislo] = useState('');
  const [pojistnikCompanyFirstName, setPojistnikCompanyFirstName] = useState('');
  const [pojistnikCompanyLastName, setPojistnikCompanyLastName] = useState('');

  // Vlastník (Bod 3)
  const [vlastnikJmeno, setVlastnikJmeno] = useState('');
  const [vlastnikAdresa, setVlastnikAdresa] = useState('');
  const [vlastnikTelefon, setVlastnikTelefon] = useState('');
  const [vlastnikEmail, setVlastnikEmail] = useState('');
  const [vlastnikIco, setVlastnikIco] = useState('');
  const [vlastnikRodneCislo, setVlastnikRodneCislo] = useState('');
  const [vlastnikIsCompany, setVlastnikIsCompany] = useState(false);
  const [vlastnikIsVatPayer, setVlastnikIsVatPayer] = useState(false);
  const [vlastnikExecutiveName, setVlastnikExecutiveName] = useState('');
  const [vlastnikExecutivePhone, setVlastnikExecutivePhone] = useState('');
  const [vlastnikExecutiveEmail, setVlastnikExecutiveEmail] = useState('');
  const [vlastnikExecutiveRodneCislo, setVlastnikExecutiveRodneCislo] = useState('');
  const [vlastnikCompanyFirstName, setVlastnikCompanyFirstName] = useState('');
  const [vlastnikCompanyLastName, setVlastnikCompanyLastName] = useState('');

  // Section control checkboxes
  const [sameOperator, setSameOperator] = useState(false);
  
  // New independent checkbox for Pojistník
  const [isSameAsProvozovatelPojistnik, setIsSameAsProvozovatelPojistnik] = useState(false);

  // Auto-populate logic for sameOperator (fills both Pojistník and Vlastník)
  useEffect(() => {
    if (sameOperator) {
      setPojistnikJmeno(provozovatelJmeno);
      setPojistnikAdresa(provozovatelAdresa);
      setPojistnikTelefon(provozovatelTelefon);
      setPojistnikEmail(provozovatelEmail);
      setPojistnikIco(provozovatelIco);
      setPojistnikRodneCislo(provozovatelRodneCislo);
      setPojistnikIsCompany(provozovatelIsCompany);
      setPojistnikIsVatPayer(provozovatelIsVatPayer);
      setPojistnikExecutiveName(provozovatelExecutiveName);
      setPojistnikExecutivePhone(provozovatelExecutivePhone);
      setPojistnikExecutiveEmail(provozovatelExecutiveEmail);
      setPojistnikExecutiveRodneCislo(provozovatelExecutiveRodneCislo);
      setPojistnikCompanyFirstName(provozovatelCompanyFirstName);
      setPojistnikCompanyLastName(provozovatelCompanyLastName);
      
      setVlastnikJmeno(provozovatelJmeno);
      setVlastnikAdresa(provozovatelAdresa);
      setVlastnikTelefon(provozovatelTelefon);
      setVlastnikEmail(provozovatelEmail);
      setVlastnikIco(provozovatelIco);
      setVlastnikRodneCislo(provozovatelRodneCislo);
      setVlastnikIsCompany(provozovatelIsCompany);
      setVlastnikIsVatPayer(provozovatelIsVatPayer);
      setVlastnikExecutiveName(provozovatelExecutiveName);
      setVlastnikExecutivePhone(provozovatelExecutivePhone);
      setVlastnikExecutiveEmail(provozovatelExecutiveEmail);
      setVlastnikExecutiveRodneCislo(provozovatelExecutiveRodneCislo);
      setVlastnikCompanyFirstName(provozovatelCompanyFirstName);
      setVlastnikCompanyLastName(provozovatelCompanyLastName);
    }
  }, [sameOperator, provozovatelJmeno, provozovatelAdresa, provozovatelTelefon, provozovatelEmail, provozovatelIco, provozovatelRodneCislo, provozovatelIsCompany, provozovatelIsVatPayer, provozovatelExecutiveName, provozovatelExecutivePhone, provozovatelExecutiveEmail, provozovatelExecutiveRodneCislo, provozovatelCompanyFirstName, provozovatelCompanyLastName]);

  // New auto-populate logic for independent checkbox
  useEffect(() => {
    if (isSameAsProvozovatelPojistnik) {
      setPojistnikJmeno(provozovatelJmeno);
      setPojistnikAdresa(provozovatelAdresa);
      setPojistnikTelefon(provozovatelTelefon);
      setPojistnikEmail(provozovatelEmail);
      setPojistnikIco(provozovatelIco);
      setPojistnikRodneCislo(provozovatelRodneCislo);
      setPojistnikIsCompany(provozovatelIsCompany);
      setPojistnikIsVatPayer(provozovatelIsVatPayer);
      setPojistnikExecutiveName(provozovatelExecutiveName);
      setPojistnikExecutivePhone(provozovatelExecutivePhone);
      setPojistnikExecutiveEmail(provozovatelExecutiveEmail);
      setPojistnikExecutiveRodneCislo(provozovatelExecutiveRodneCislo);
      setPojistnikCompanyFirstName(provozovatelCompanyFirstName);
      setPojistnikCompanyLastName(provozovatelCompanyLastName);
    }
  }, [isSameAsProvozovatelPojistnik, provozovatelJmeno, provozovatelAdresa, provozovatelTelefon, provozovatelEmail, provozovatelIco, provozovatelRodneCislo, provozovatelIsCompany, provozovatelIsVatPayer, provozovatelExecutiveName, provozovatelExecutivePhone, provozovatelExecutiveEmail, provozovatelExecutiveRodneCislo, provozovatelCompanyFirstName, provozovatelCompanyLastName]);

  // Pojištění
  const [povinneRuceni, setPovinneRuceni] = useState(false);
  const [havarijniPojisteni, setHavarijniPojisteni] = useState(false);
  const [mileage, setMileage] = useState('');

  // Vozidlo - New fields
  const [hasTechnicalCertificate, setHasTechnicalCertificate] = useState(false);
  const [importedFromAbroad, setImportedFromAbroad] = useState(false);
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [engineCapacity, setEngineCapacity] = useState('');
  const [maxPower, setMaxPower] = useState('');
  const [weight, setWeight] = useState('');
  const [approximateValue, setApproximateValue] = useState('');

  // Vozidlo - Vehicle type as dropdown
  const [vehicleTypeSelected, setVehicleTypeSelected] = useState<string>('');
  const [spz, setSpz] = useState('');
  const [vin, setVin] = useState('');
  const [usageType, setUsageType] = useState<UsageType>(UsageType.beznyProvoz);

  // Připojištění
  const [pojisteniSkel, setPojisteniSkel] = useState(false);
  const [pojisteniAsistence, setPojisteniAsistence] = useState(false);
  const [pojisteniPrirodnichRizik, setPojisteniPrirodnichRizik] = useState(false);
  const [pojisteniGAP, setPojisteniGAP] = useState(false);
  const [pojisteniNahradnihoVozidla, setPojisteniNahradnihoVozidla] = useState(false);
  const [urazovePripojisteni, setUrazovePripojisteni] = useState(false);

  // Payment frequency - now required with no default
  const [paymentFrequency, setPaymentFrequency] = useState<PaymentFrequency | ''>('');

  // Poznámky (Bod 9)
  const [notes, setNotes] = useState('');

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);

  // Clear model when brand changes
  useEffect(() => {
    setModel('');
  }, [brand]);

  // Auto-expand textarea for notes
  useEffect(() => {
    if (notesTextareaRef.current) {
      notesTextareaRef.current.style.height = 'auto';
      notesTextareaRef.current.style.height = `${Math.max(120, notesTextareaRef.current.scrollHeight)}px`;
    }
  }, [notes]);

  // Validation function
  const validateForm = (): ValidationError[] => {
    const errors: ValidationError[] = [];

    // Validate Provozovatel (always required)
    if (provozovatelIsCompany) {
      // For companies, only IČO is required
      if (!provozovatelIco.trim()) {
        errors.push({ field: 'provozovatelIco', message: 'IČO je povinné', section: 'Provozovatel' });
      }
    } else {
      // For physical persons
      if (!provozovatelRodneCislo.trim()) {
        errors.push({ field: 'provozovatelRodneCislo', message: 'Rodné číslo je povinné', section: 'Provozovatel' });
      }
      if (!provozovatelJmeno.trim()) {
        errors.push({ field: 'provozovatelJmeno', message: 'Jméno a příjmení je povinné', section: 'Provozovatel' });
      }
      if (!provozovatelAdresa.trim()) {
        errors.push({ field: 'provozovatelAdresa', message: 'Trvalá adresa je povinná', section: 'Provozovatel' });
      }
    }

    // Validate Pojistník (only if section is visible)
    const isPojistnikVisible = !sameOperator && !isSameAsProvozovatelPojistnik;
    if (isPojistnikVisible) {
      if (pojistnikIsCompany) {
        // For companies, only IČO is required
        if (!pojistnikIco.trim()) {
          errors.push({ field: 'pojistnikIco', message: 'IČO je povinné', section: 'Pojistník' });
        }
      } else {
        // For physical persons
        if (!pojistnikRodneCislo.trim()) {
          errors.push({ field: 'pojistnikRodneCislo', message: 'Rodné číslo je povinné', section: 'Pojistník' });
        }
        if (!pojistnikJmeno.trim()) {
          errors.push({ field: 'pojistnikJmeno', message: 'Jméno a příjmení je povinné', section: 'Pojistník' });
        }
        if (!pojistnikAdresa.trim()) {
          errors.push({ field: 'pojistnikAdresa', message: 'Trvalá adresa je povinná', section: 'Pojistník' });
        }
      }
    }

    // Validate Vlastník (only if section is visible - when sameOperator is false)
    const isVlastnikVisible = !sameOperator;
    if (isVlastnikVisible) {
      if (vlastnikIsCompany) {
        // For companies, only IČO is required
        if (!vlastnikIco.trim()) {
          errors.push({ field: 'vlastnikIco', message: 'IČO je povinné', section: 'Vlastník' });
        }
      } else {
        // For physical persons
        if (!vlastnikRodneCislo.trim()) {
          errors.push({ field: 'vlastnikRodneCislo', message: 'Rodné číslo je povinné', section: 'Vlastník' });
        }
        if (!vlastnikJmeno.trim()) {
          errors.push({ field: 'vlastnikJmeno', message: 'Jméno a příjmení je povinné', section: 'Vlastník' });
        }
        if (!vlastnikAdresa.trim()) {
          errors.push({ field: 'vlastnikAdresa', message: 'Trvalá adresa je povinná', section: 'Vlastník' });
        }
      }
    }

    // Validate that at least one insurance option is selected in Section 4
    if (!povinneRuceni && !havarijniPojisteni) {
      errors.push({ field: 'insuranceOptions', message: 'Vyberte alespoň jednu možnost', section: 'Požadované pojištění' });
    }

    // Validate Havarijní pojištění and mileage
    if (havarijniPojisteni && !mileage.trim()) {
      errors.push({ field: 'mileage', message: 'Stav tachometru je povinný při havarijním pojištění', section: 'Požadované pojištění' });
    }

    // Validate Vehicle data
    if (importedFromAbroad) {
      if (!vehicleTypeSelected) {
        errors.push({ field: 'vehicleTypeSelected', message: 'Druh vozidla je povinný', section: 'Údaje o vozidle' });
      }
      if (!vin.trim()) {
        errors.push({ field: 'vin', message: 'VIN je povinný', section: 'Údaje o vozidle' });
      }
      // Brand and model are REQUIRED for imported vehicles
      if (!brand.trim()) {
        errors.push({ field: 'brand', message: 'Tovární značka je povinná', section: 'Údaje o vozidle' });
      }
      if (!model.trim()) {
        errors.push({ field: 'model', message: 'Modelová řada je povinná', section: 'Údaje o vozidle' });
      }
      if (!engineCapacity.trim()) {
        errors.push({ field: 'engineCapacity', message: 'Zdvihový objem je povinný', section: 'Údaje o vozidle' });
      }
      if (!maxPower.trim()) {
        errors.push({ field: 'maxPower', message: 'Výkon je povinný', section: 'Údaje o vozidle' });
      }
      if (!weight.trim()) {
        errors.push({ field: 'weight', message: 'Hmotnost je povinná', section: 'Údaje o vozidle' });
      }
      if (!approximateValue.trim()) {
        errors.push({ field: 'approximateValue', message: 'Přibližná hodnota vozidla je povinná', section: 'Údaje o vozidle' });
      }
      if (!fuelType) {
        errors.push({ field: 'fuelType', message: 'Palivo je povinné', section: 'Údaje o vozidle' });
      }
    } else {
      if (!spz.trim()) {
        errors.push({ field: 'spz', message: 'SPZ je povinná', section: 'Údaje o vozidle' });
      }
    }

    // Validate payment frequency (now required)
    if (!paymentFrequency) {
      errors.push({ field: 'paymentFrequency', message: 'Vyberte frekvenci plateb', section: 'Sekvence plateb' });
    }

    return errors;
  };

  const handleInitialSubmit = () => {
    const errors = validateForm();
    
    if (errors.length > 0) {
      setValidationErrors(errors);
      setShowValidationErrors(true);
      
      // Show toast with error summary
      toast.error(`Formulář obsahuje ${errors.length} chyb. Prosím opravte označená pole.`, {
        duration: 5000,
      });
      
      // Scroll to first error
      const firstErrorField = document.querySelector(`[data-error="true"]`);
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
      return;
    }

    // Clear validation errors and show submission modal
    setValidationErrors([]);
    setShowValidationErrors(false);
    setShowSubmissionModal(true);
  };

  const handleFinalSubmit = async (submitterName: string, submitterEmail: string) => {
    const vehicleTypes: VehicleType[] = [];
    if (vehicleTypeSelected) {
      switch (vehicleTypeSelected) {
        case 'osobni':
          vehicleTypes.push(VehicleType.osobni);
          break;
        case 'motocykl':
          vehicleTypes.push(VehicleType.motocykl);
          break;
        case 'nakladni':
          vehicleTypes.push(VehicleType.nakladni);
          break;
        case 'obytny':
          vehicleTypes.push(VehicleType.obytny);
          break;
      }
    }

    const form: InsuranceForm = {
      id: `form-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      provozovatel: {
        name: provozovatelJmeno,
        address: provozovatelAdresa,
        phone: provozovatelIsCompany ? provozovatelExecutivePhone : provozovatelTelefon,
        email: provozovatelIsCompany ? provozovatelExecutiveEmail : provozovatelEmail,
        ico: provozovatelIco,
        rodneCislo: provozovatelRodneCislo,
        isCompany: provozovatelIsCompany,
        isVatPayer: provozovatelIsVatPayer,
        executiveName: provozovatelExecutiveName,
        executiveRodneCislo: provozovatelExecutiveRodneCislo,
        companyFieldsOnlyMode: provozovatelIsCompany,
        companyFirstName: provozovatelCompanyFirstName,
        companyLastName: provozovatelCompanyLastName,
      },
      pojistnik: {
        name: pojistnikJmeno,
        address: pojistnikAdresa,
        phone: pojistnikIsCompany ? pojistnikExecutivePhone : pojistnikTelefon,
        email: pojistnikIsCompany ? pojistnikExecutiveEmail : pojistnikEmail,
        ico: pojistnikIco,
        rodneCislo: pojistnikRodneCislo,
        isCompany: pojistnikIsCompany,
        isVatPayer: pojistnikIsVatPayer,
        executiveName: pojistnikExecutiveName,
        executiveRodneCislo: pojistnikExecutiveRodneCislo,
        companyFieldsOnlyMode: pojistnikIsCompany,
        companyFirstName: pojistnikCompanyFirstName,
        companyLastName: pojistnikCompanyLastName,
      },
      vlastnik: {
        name: vlastnikJmeno,
        address: vlastnikAdresa,
        phone: vlastnikIsCompany ? vlastnikExecutivePhone : vlastnikTelefon,
        email: vlastnikIsCompany ? vlastnikExecutiveEmail : vlastnikEmail,
        ico: vlastnikIco,
        rodneCislo: vlastnikRodneCislo,
        isCompany: vlastnikIsCompany,
        isVatPayer: vlastnikIsVatPayer,
        executiveName: vlastnikExecutiveName,
        executiveRodneCislo: vlastnikExecutiveRodneCislo,
        companyFieldsOnlyMode: vlastnikIsCompany,
        companyFirstName: vlastnikCompanyFirstName,
        companyLastName: vlastnikCompanyLastName,
      },
      vozidlo: {
        vehicleType: vehicleTypes,
        spz,
        vin,
        usageType,
        importedFromAbroad,
        brand: brand || '',
        model: model || '',
        fuelType: fuelType || undefined,
        engineCapacity: engineCapacity ? BigInt(engineCapacity) : undefined,
        maxPower: maxPower ? BigInt(maxPower) : undefined,
        weight: weight ? BigInt(weight) : undefined,
        approximateValue: approximateValue ? BigInt(approximateValue) : undefined,
        hasTechnicalCertificate,
      },
      insuranceOptions: {
        povinneRuceni,
        havarijniPojisteni,
        pojisteniSkel,
        pojisteniAsistence,
        pojisteniPrirodnichRizik,
        pojisteniGAP,
        pojisteniNahradnihoVozidla,
        urazovePripojisteni,
      },
      paymentFrequency: paymentFrequency as PaymentFrequency,
      sameOperator,
      createdAt: BigInt(Date.now() * 1000000),
      updatedAt: BigInt(Date.now() * 1000000),
      status: Variant_completed_draft.completed,
      viewedByAdmin: false,
      submitterName,
      submitterEmail,
      isPhysicalPerson: !provozovatelIsCompany,
      isSameAsPojistnik: false,
      isSameAsProvozovatel: false,
      hasTechnicalCertificate,
      hasImportedVehicle: importedFromAbroad,
      mileage: havarijniPojisteni && mileage ? mileage : undefined,
      notes,
    };

    try {
      await createForm.mutateAsync(form);
      setShowSubmissionModal(false);
      setIsSubmitted(true);
      toast.success('Formulář byl úspěšně odeslán!', {
        duration: 5000,
      });
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Chyba při odesílání formuláře. Zkontrolujte připojení k backendu.', {
        duration: 5000,
      });
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    window.location.reload();
  };

  // Helper function to check if field has error
  const hasError = (fieldName: string) => {
    return showValidationErrors && validationErrors.some(err => err.field === fieldName);
  };

  // Helper function to get error message
  const getErrorMessage = (fieldName: string) => {
    const error = validationErrors.find(err => err.field === fieldName);
    return error ? error.message : '';
  };

  // Check if insurance options section has error
  const hasInsuranceOptionsError = () => {
    return showValidationErrors && validationErrors.some(err => err.field === 'insuranceOptions');
  };

  // Unified compact toggle component with reduced size
  const UnifiedToggle = ({ 
    checked, 
    onChange, 
    label 
  }: { 
    checked: boolean; 
    onChange: (checked: boolean) => void; 
    label: string;
  }) => (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 bg-gradient-to-br from-gray-50 to-white p-2.5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
      <Label className="text-xs font-semibold text-gray-700 flex-1 min-w-0 leading-relaxed">{label}</Label>
      <div className="flex items-center justify-end sm:justify-start space-x-2 flex-shrink-0 ml-auto">
        <span className={`text-xs font-medium transition-all duration-300 whitespace-nowrap ${!checked ? 'text-gray-900 scale-105' : 'text-gray-400'}`}>Ne</span>
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          onClick={() => onChange(!checked)}
          className={`
            relative inline-flex items-center rounded-full
            transition-all duration-500 ease-out
            focus:outline-none focus:ring-2 focus:ring-red-300
            ${checked 
              ? 'bg-gradient-to-r from-red-600 to-red-700 shadow-md shadow-red-500/40' 
              : 'bg-gradient-to-r from-gray-300 to-gray-400 shadow-sm'
            }
            hover:scale-105 active:scale-95
            transform-gpu
          `}
          style={{
            height: '20px',
            width: '36px',
            minHeight: '20px',
            minWidth: '36px',
            padding: '2px',
            boxShadow: checked 
              ? '0 1px 4px 0 rgba(220, 38, 38, 0.35), inset 0 0.5px 1px 0 rgba(0, 0, 0, 0.15)' 
              : '0 0.5px 2px 0 rgba(0, 0, 0, 0.12), inset 0 0.5px 1px 0 rgba(0, 0, 0, 0.08)'
          }}
        >
          <span
            className={`
              inline-block transform rounded-full
              bg-white shadow-md
              transition-all duration-500 ease-out
            `}
            style={{
              height: '16px',
              width: '16px',
              transform: checked ? 'translateX(16px)' : 'translateX(0)',
              boxShadow: checked
                ? '0 0.5px 2px 0 rgba(220, 38, 38, 0.5), 0 0 4px 0.5px rgba(220, 38, 38, 0.25)'
                : '0 0.5px 1.5px 0 rgba(0, 0, 0, 0.15)'
            }}
          >
            {checked && (
              <span className="absolute inset-0 rounded-full animate-ping bg-red-400 opacity-75" style={{ animationDuration: '1.5s' }} />
            )}
          </span>
        </button>
        <span className={`text-xs font-medium transition-all duration-300 whitespace-nowrap ${checked ? 'text-red-700 scale-105 font-bold' : 'text-gray-400'}`}>Ano</span>
      </div>
    </div>
  );

  // Section header component with full-width black-to-lighter-black gradient touching top edge
  const SectionHeader = ({ number, title }: { number: number; title: string }) => (
    <div className="bg-gradient-to-r from-black via-gray-800 to-gray-700 rounded-t-2xl px-6 py-5 -mx-8 -mt-8 mb-6 shadow-md">
      <h2 className="text-base font-bold text-white uppercase tracking-wide flex items-center gap-3">
        <span className="text-gray-300">{number}.</span>
        <span>{title}</span>
      </h2>
    </div>
  );

  if (isSubmitted) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl p-12 border border-gray-200 transform hover:scale-105 transition-transform duration-300">
          <div className="w-24 h-24 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Formulář byl úspěšně odeslán
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Děkujeme za vyplnění dotazníku pojištění vozidla. Váš formulář byl úspěšně doručen a brzy se vám ozveme.
          </p>
          <Button 
            onClick={resetForm} 
            size="lg" 
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Vyplnit nový formulář
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Prominent Header with Gradient - Reduced text sizes */}
      <div className="mb-8 bg-gradient-to-r from-red-800 via-red-700 to-black rounded-2xl shadow-2xl p-6 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">
          DOTAZNÍK POJIŠTĚNÍ VOZIDLA
        </h1>
        <p className="text-sm md:text-base text-white/90 font-medium">
          Vyplňte prosím požadované údaje
        </p>
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Validation Error Summary */}
        {showValidationErrors && validationErrors.length > 0 && (
          <div className="mb-6 bg-red-50 border-2 border-red-500 rounded-xl p-6 shadow-lg animate-in fade-in slide-in-from-top-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-red-900 mb-2">
                  Formulář obsahuje chyby
                </h3>
                <p className="text-sm text-red-800 mb-3">
                  Prosím opravte následující pole před odesláním:
                </p>
                <div className="space-y-2">
                  {validationErrors.map((error, index) => (
                    <div key={index} className="text-sm text-red-700 flex items-start gap-2">
                      <span className="font-semibold">{error.section}:</span>
                      <span>{error.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200">
          <div className="px-8 py-8 space-y-8">
            
            {/* Checkbox for same operator */}
            <div className="bg-gradient-to-r from-red-800 via-red-700 to-black p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="sameOperator"
                  checked={sameOperator}
                  onCheckedChange={(checked) => setSameOperator(checked as boolean)}
                  className="border-white data-[state=checked]:bg-white data-[state=checked]:text-red-800 h-5 w-5"
                />
                <Label htmlFor="sameOperator" className="text-sm font-bold cursor-pointer text-white uppercase leading-tight">
                  Provozovatel je Pojistník i Vlastník
                </Label>
              </div>
              <p className="text-xs text-white/80 ml-8 mt-1">
                Zaškrtnutím automaticky vyplníte údaje pojistníka a vlastníka
              </p>
            </div>

            {/* BOD 1: PROVOZOVATEL */}
            <div className={`bg-white rounded-2xl shadow-lg border-2 p-8 transition-all duration-300 ${hasError('provozovatelJmeno') || hasError('provozovatelAdresa') || hasError('provozovatelIco') || hasError('provozovatelRodneCislo') ? 'border-red-500 animate-errorBlink' : 'border-gray-200'}`} data-error={hasError('provozovatelJmeno') || hasError('provozovatelAdresa') || hasError('provozovatelIco') || hasError('provozovatelRodneCislo')}>
              <SectionHeader number={1} title="PROVOZOVATEL" />
              
              <div className="space-y-4">
                <UnifiedToggle
                  checked={provozovatelIsCompany}
                  onChange={setProvozovatelIsCompany}
                  label="Firma / fyzická osoba IČO"
                />

                {provozovatelIsCompany ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="provozovatelIco" className="text-sm font-medium text-gray-700">
                        IČO <span className="text-red-600">*</span>
                      </Label>
                      <Input
                        id="provozovatelIco"
                        value={provozovatelIco}
                        onChange={(e) => setProvozovatelIco(e.target.value)}
                        placeholder="Zadejte IČO"
                        className={hasError('provozovatelIco') ? 'border-red-500' : ''}
                      />
                      {hasError('provozovatelIco') && (
                        <p className="text-xs text-red-600">{getErrorMessage('provozovatelIco')}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="provozovatelJmeno" className="text-sm font-medium text-gray-700">
                        Název firmy
                      </Label>
                      <Input
                        id="provozovatelJmeno"
                        value={provozovatelJmeno}
                        onChange={(e) => setProvozovatelJmeno(e.target.value)}
                        placeholder="Zadejte název firmy"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="provozovatelCompanyFirstName" className="text-sm font-medium text-gray-700">
                          Jméno
                        </Label>
                        <Input
                          id="provozovatelCompanyFirstName"
                          value={provozovatelCompanyFirstName}
                          onChange={(e) => setProvozovatelCompanyFirstName(e.target.value)}
                          placeholder="Zadejte jméno"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="provozovatelCompanyLastName" className="text-sm font-medium text-gray-700">
                          Příjmení
                        </Label>
                        <Input
                          id="provozovatelCompanyLastName"
                          value={provozovatelCompanyLastName}
                          onChange={(e) => setProvozovatelCompanyLastName(e.target.value)}
                          placeholder="Zadejte příjmení"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="provozovatelAdresa" className="text-sm font-medium text-gray-700">
                        Adresa sídla
                      </Label>
                      <AddressAutocomplete
                        value={provozovatelAdresa}
                        onChange={setProvozovatelAdresa}
                        placeholder="Zadejte adresu sídla"
                        hasError={hasError('provozovatelAdresa')}
                      />
                      {hasError('provozovatelAdresa') && (
                        <p className="text-xs text-red-600">{getErrorMessage('provozovatelAdresa')}</p>
                      )}
                    </div>

                    <UnifiedToggle
                      checked={provozovatelIsVatPayer}
                      onChange={setProvozovatelIsVatPayer}
                      label="Plátce DPH"
                    />

                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-900 mb-4">Kontaktní osoba / Jednatel</h3>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="provozovatelExecutiveName" className="text-sm font-medium text-gray-700">
                            Jméno a příjmení
                          </Label>
                          <Input
                            id="provozovatelExecutiveName"
                            value={provozovatelExecutiveName}
                            onChange={(e) => setProvozovatelExecutiveName(e.target.value)}
                            placeholder="Zadejte jméno a příjmení"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="provozovatelExecutiveRodneCislo" className="text-sm font-medium text-gray-700">
                            Rodné číslo
                          </Label>
                          <Input
                            id="provozovatelExecutiveRodneCislo"
                            value={provozovatelExecutiveRodneCislo}
                            onChange={(e) => setProvozovatelExecutiveRodneCislo(e.target.value)}
                            placeholder="Zadejte rodné číslo"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="provozovatelExecutivePhone" className="text-sm font-medium text-gray-700">
                            Telefon
                          </Label>
                          <Input
                            id="provozovatelExecutivePhone"
                            value={provozovatelExecutivePhone}
                            onChange={(e) => setProvozovatelExecutivePhone(e.target.value)}
                            placeholder="Zadejte telefonní číslo"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="provozovatelExecutiveEmail" className="text-sm font-medium text-gray-700">
                            E-mail
                          </Label>
                          <Input
                            id="provozovatelExecutiveEmail"
                            type="email"
                            value={provozovatelExecutiveEmail}
                            onChange={(e) => setProvozovatelExecutiveEmail(e.target.value)}
                            placeholder="Zadejte e-mailovou adresu"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="provozovatelJmeno" className="text-sm font-medium text-gray-700">
                        Jméno a příjmení <span className="text-red-600">*</span>
                      </Label>
                      <Input
                        id="provozovatelJmeno"
                        value={provozovatelJmeno}
                        onChange={(e) => setProvozovatelJmeno(e.target.value)}
                        placeholder="Zadejte jméno a příjmení"
                        className={hasError('provozovatelJmeno') ? 'border-red-500' : ''}
                      />
                      {hasError('provozovatelJmeno') && (
                        <p className="text-xs text-red-600">{getErrorMessage('provozovatelJmeno')}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="provozovatelAdresa" className="text-sm font-medium text-gray-700">
                        Trvalá adresa <span className="text-red-600">*</span>
                      </Label>
                      <AddressAutocomplete
                        value={provozovatelAdresa}
                        onChange={setProvozovatelAdresa}
                        placeholder="Zadejte trvalou adresu"
                        hasError={hasError('provozovatelAdresa')}
                      />
                      {hasError('provozovatelAdresa') && (
                        <p className="text-xs text-red-600">{getErrorMessage('provozovatelAdresa')}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="provozovatelRodneCislo" className="text-sm font-medium text-gray-700">
                        Rodné číslo <span className="text-red-600">*</span>
                      </Label>
                      <Input
                        id="provozovatelRodneCislo"
                        value={provozovatelRodneCislo}
                        onChange={(e) => setProvozovatelRodneCislo(e.target.value)}
                        placeholder="Zadejte rodné číslo"
                        className={hasError('provozovatelRodneCislo') ? 'border-red-500' : ''}
                      />
                      {hasError('provozovatelRodneCislo') && (
                        <p className="text-xs text-red-600">{getErrorMessage('provozovatelRodneCislo')}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="provozovatelTelefon" className="text-sm font-medium text-gray-700">
                        Telefon
                      </Label>
                      <Input
                        id="provozovatelTelefon"
                        value={provozovatelTelefon}
                        onChange={(e) => setProvozovatelTelefon(e.target.value)}
                        placeholder="Zadejte telefonní číslo"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="provozovatelEmail" className="text-sm font-medium text-gray-700">
                        E-mail
                      </Label>
                      <Input
                        id="provozovatelEmail"
                        type="email"
                        value={provozovatelEmail}
                        onChange={(e) => setProvozovatelEmail(e.target.value)}
                        placeholder="Zadejte e-mailovou adresu"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* BOD 2: POJISTNÍK */}
            {!sameOperator && (
              <div className={`bg-white rounded-2xl shadow-lg border-2 p-8 transition-all duration-300 ${hasError('pojistnikJmeno') || hasError('pojistnikAdresa') || hasError('pojistnikIco') || hasError('pojistnikRodneCislo') ? 'border-red-500 animate-errorBlink' : 'border-gray-200'}`} data-error={hasError('pojistnikJmeno') || hasError('pojistnikAdresa') || hasError('pojistnikIco') || hasError('pojistnikRodneCislo')}>
                <SectionHeader number={2} title="POJISTNÍK" />
                
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-red-800 via-red-700 to-black p-4 rounded-xl shadow-md">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="isSameAsProvozovatelPojistnik"
                        checked={isSameAsProvozovatelPojistnik}
                        onCheckedChange={(checked) => setIsSameAsProvozovatelPojistnik(checked as boolean)}
                        className="border-white data-[state=checked]:bg-white data-[state=checked]:text-red-800 h-5 w-5"
                      />
                      <Label htmlFor="isSameAsProvozovatelPojistnik" className="text-sm font-bold cursor-pointer text-white uppercase leading-tight">
                        Pojistník je stejný jako Provozovatel
                      </Label>
                    </div>
                  </div>

                  {!isSameAsProvozovatelPojistnik && (
                    <>
                      <UnifiedToggle
                        checked={pojistnikIsCompany}
                        onChange={setPojistnikIsCompany}
                        label="Firma / fyzická osoba IČO"
                      />

                      {pojistnikIsCompany ? (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="pojistnikIco" className="text-sm font-medium text-gray-700">
                              IČO <span className="text-red-600">*</span>
                            </Label>
                            <Input
                              id="pojistnikIco"
                              value={pojistnikIco}
                              onChange={(e) => setPojistnikIco(e.target.value)}
                              placeholder="Zadejte IČO"
                              className={hasError('pojistnikIco') ? 'border-red-500' : ''}
                            />
                            {hasError('pojistnikIco') && (
                              <p className="text-xs text-red-600">{getErrorMessage('pojistnikIco')}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="pojistnikJmeno" className="text-sm font-medium text-gray-700">
                              Název firmy
                            </Label>
                            <Input
                              id="pojistnikJmeno"
                              value={pojistnikJmeno}
                              onChange={(e) => setPojistnikJmeno(e.target.value)}
                              placeholder="Zadejte název firmy"
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="pojistnikCompanyFirstName" className="text-sm font-medium text-gray-700">
                                Jméno
                              </Label>
                              <Input
                                id="pojistnikCompanyFirstName"
                                value={pojistnikCompanyFirstName}
                                onChange={(e) => setPojistnikCompanyFirstName(e.target.value)}
                                placeholder="Zadejte jméno"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="pojistnikCompanyLastName" className="text-sm font-medium text-gray-700">
                                Příjmení
                              </Label>
                              <Input
                                id="pojistnikCompanyLastName"
                                value={pojistnikCompanyLastName}
                                onChange={(e) => setPojistnikCompanyLastName(e.target.value)}
                                placeholder="Zadejte příjmení"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="pojistnikAdresa" className="text-sm font-medium text-gray-700">
                              Adresa sídla
                            </Label>
                            <AddressAutocomplete
                              value={pojistnikAdresa}
                              onChange={setPojistnikAdresa}
                              placeholder="Zadejte adresu sídla"
                              hasError={hasError('pojistnikAdresa')}
                            />
                            {hasError('pojistnikAdresa') && (
                              <p className="text-xs text-red-600">{getErrorMessage('pojistnikAdresa')}</p>
                            )}
                          </div>

                          <UnifiedToggle
                            checked={pojistnikIsVatPayer}
                            onChange={setPojistnikIsVatPayer}
                            label="Plátce DPH"
                          />

                          <div className="mt-6 pt-6 border-t border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-900 mb-4">Kontaktní osoba / Jednatel</h3>
                            
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="pojistnikExecutiveName" className="text-sm font-medium text-gray-700">
                                  Jméno a příjmení
                                </Label>
                                <Input
                                  id="pojistnikExecutiveName"
                                  value={pojistnikExecutiveName}
                                  onChange={(e) => setPojistnikExecutiveName(e.target.value)}
                                  placeholder="Zadejte jméno a příjmení"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="pojistnikExecutiveRodneCislo" className="text-sm font-medium text-gray-700">
                                  Rodné číslo
                                </Label>
                                <Input
                                  id="pojistnikExecutiveRodneCislo"
                                  value={pojistnikExecutiveRodneCislo}
                                  onChange={(e) => setPojistnikExecutiveRodneCislo(e.target.value)}
                                  placeholder="Zadejte rodné číslo"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="pojistnikExecutivePhone" className="text-sm font-medium text-gray-700">
                                  Telefon
                                </Label>
                                <Input
                                  id="pojistnikExecutivePhone"
                                  value={pojistnikExecutivePhone}
                                  onChange={(e) => setPojistnikExecutivePhone(e.target.value)}
                                  placeholder="Zadejte telefonní číslo"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="pojistnikExecutiveEmail" className="text-sm font-medium text-gray-700">
                                  E-mail
                                </Label>
                                <Input
                                  id="pojistnikExecutiveEmail"
                                  type="email"
                                  value={pojistnikExecutiveEmail}
                                  onChange={(e) => setPojistnikExecutiveEmail(e.target.value)}
                                  placeholder="Zadejte e-mailovou adresu"
                                />
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="pojistnikJmeno" className="text-sm font-medium text-gray-700">
                              Jméno a příjmení <span className="text-red-600">*</span>
                            </Label>
                            <Input
                              id="pojistnikJmeno"
                              value={pojistnikJmeno}
                              onChange={(e) => setPojistnikJmeno(e.target.value)}
                              placeholder="Zadejte jméno a příjmení"
                              className={hasError('pojistnikJmeno') ? 'border-red-500' : ''}
                            />
                            {hasError('pojistnikJmeno') && (
                              <p className="text-xs text-red-600">{getErrorMessage('pojistnikJmeno')}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="pojistnikAdresa" className="text-sm font-medium text-gray-700">
                              Trvalá adresa <span className="text-red-600">*</span>
                            </Label>
                            <AddressAutocomplete
                              value={pojistnikAdresa}
                              onChange={setPojistnikAdresa}
                              placeholder="Zadejte trvalou adresu"
                              hasError={hasError('pojistnikAdresa')}
                            />
                            {hasError('pojistnikAdresa') && (
                              <p className="text-xs text-red-600">{getErrorMessage('pojistnikAdresa')}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="pojistnikRodneCislo" className="text-sm font-medium text-gray-700">
                              Rodné číslo <span className="text-red-600">*</span>
                            </Label>
                            <Input
                              id="pojistnikRodneCislo"
                              value={pojistnikRodneCislo}
                              onChange={(e) => setPojistnikRodneCislo(e.target.value)}
                              placeholder="Zadejte rodné číslo"
                              className={hasError('pojistnikRodneCislo') ? 'border-red-500' : ''}
                            />
                            {hasError('pojistnikRodneCislo') && (
                              <p className="text-xs text-red-600">{getErrorMessage('pojistnikRodneCislo')}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="pojistnikTelefon" className="text-sm font-medium text-gray-700">
                              Telefon
                            </Label>
                            <Input
                              id="pojistnikTelefon"
                              value={pojistnikTelefon}
                              onChange={(e) => setPojistnikTelefon(e.target.value)}
                              placeholder="Zadejte telefonní číslo"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="pojistnikEmail" className="text-sm font-medium text-gray-700">
                              E-mail
                            </Label>
                            <Input
                              id="pojistnikEmail"
                              type="email"
                              value={pojistnikEmail}
                              onChange={(e) => setPojistnikEmail(e.target.value)}
                              placeholder="Zadejte e-mailovou adresu"
                            />
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* BOD 3: VLASTNÍK - Now always visible when sameOperator is false, no "same as provozovatel" checkbox */}
            {!sameOperator && (
              <div className={`bg-white rounded-2xl shadow-lg border-2 p-8 transition-all duration-300 ${hasError('vlastnikJmeno') || hasError('vlastnikAdresa') || hasError('vlastnikIco') || hasError('vlastnikRodneCislo') ? 'border-red-500 animate-errorBlink' : 'border-gray-200'}`} data-error={hasError('vlastnikJmeno') || hasError('vlastnikAdresa') || hasError('vlastnikIco') || hasError('vlastnikRodneCislo')}>
                <SectionHeader number={3} title="VLASTNÍK" />
                
                <div className="space-y-4">
                  <UnifiedToggle
                    checked={vlastnikIsCompany}
                    onChange={setVlastnikIsCompany}
                    label="Firma / fyzická osoba IČO"
                  />

                  {vlastnikIsCompany ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="vlastnikIco" className="text-sm font-medium text-gray-700">
                          IČO <span className="text-red-600">*</span>
                        </Label>
                        <Input
                          id="vlastnikIco"
                          value={vlastnikIco}
                          onChange={(e) => setVlastnikIco(e.target.value)}
                          placeholder="Zadejte IČO"
                          className={hasError('vlastnikIco') ? 'border-red-500' : ''}
                        />
                        {hasError('vlastnikIco') && (
                          <p className="text-xs text-red-600">{getErrorMessage('vlastnikIco')}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="vlastnikJmeno" className="text-sm font-medium text-gray-700">
                          Název firmy
                        </Label>
                        <Input
                          id="vlastnikJmeno"
                          value={vlastnikJmeno}
                          onChange={(e) => setVlastnikJmeno(e.target.value)}
                          placeholder="Zadejte název firmy"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="vlastnikCompanyFirstName" className="text-sm font-medium text-gray-700">
                            Jméno
                          </Label>
                          <Input
                            id="vlastnikCompanyFirstName"
                            value={vlastnikCompanyFirstName}
                            onChange={(e) => setVlastnikCompanyFirstName(e.target.value)}
                            placeholder="Zadejte jméno"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="vlastnikCompanyLastName" className="text-sm font-medium text-gray-700">
                            Příjmení
                          </Label>
                          <Input
                            id="vlastnikCompanyLastName"
                            value={vlastnikCompanyLastName}
                            onChange={(e) => setVlastnikCompanyLastName(e.target.value)}
                            placeholder="Zadejte příjmení"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="vlastnikAdresa" className="text-sm font-medium text-gray-700">
                          Adresa sídla
                        </Label>
                        <AddressAutocomplete
                          value={vlastnikAdresa}
                          onChange={setVlastnikAdresa}
                          placeholder="Zadejte adresu sídla"
                          hasError={hasError('vlastnikAdresa')}
                        />
                        {hasError('vlastnikAdresa') && (
                          <p className="text-xs text-red-600">{getErrorMessage('vlastnikAdresa')}</p>
                        )}
                      </div>

                      <UnifiedToggle
                        checked={vlastnikIsVatPayer}
                        onChange={setVlastnikIsVatPayer}
                        label="Plátce DPH"
                      />

                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-900 mb-4">Kontaktní osoba / Jednatel</h3>
                        
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="vlastnikExecutiveName" className="text-sm font-medium text-gray-700">
                              Jméno a příjmení
                            </Label>
                            <Input
                              id="vlastnikExecutiveName"
                              value={vlastnikExecutiveName}
                              onChange={(e) => setVlastnikExecutiveName(e.target.value)}
                              placeholder="Zadejte jméno a příjmení"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="vlastnikExecutiveRodneCislo" className="text-sm font-medium text-gray-700">
                              Rodné číslo
                            </Label>
                            <Input
                              id="vlastnikExecutiveRodneCislo"
                              value={vlastnikExecutiveRodneCislo}
                              onChange={(e) => setVlastnikExecutiveRodneCislo(e.target.value)}
                              placeholder="Zadejte rodné číslo"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="vlastnikExecutivePhone" className="text-sm font-medium text-gray-700">
                              Telefon
                            </Label>
                            <Input
                              id="vlastnikExecutivePhone"
                              value={vlastnikExecutivePhone}
                              onChange={(e) => setVlastnikExecutivePhone(e.target.value)}
                              placeholder="Zadejte telefonní číslo"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="vlastnikExecutiveEmail" className="text-sm font-medium text-gray-700">
                              E-mail
                            </Label>
                            <Input
                              id="vlastnikExecutiveEmail"
                              type="email"
                              value={vlastnikExecutiveEmail}
                              onChange={(e) => setVlastnikExecutiveEmail(e.target.value)}
                              placeholder="Zadejte e-mailovou adresu"
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="vlastnikJmeno" className="text-sm font-medium text-gray-700">
                          Jméno a příjmení <span className="text-red-600">*</span>
                        </Label>
                        <Input
                          id="vlastnikJmeno"
                          value={vlastnikJmeno}
                          onChange={(e) => setVlastnikJmeno(e.target.value)}
                          placeholder="Zadejte jméno a příjmení"
                          className={hasError('vlastnikJmeno') ? 'border-red-500' : ''}
                        />
                        {hasError('vlastnikJmeno') && (
                          <p className="text-xs text-red-600">{getErrorMessage('vlastnikJmeno')}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="vlastnikAdresa" className="text-sm font-medium text-gray-700">
                          Trvalá adresa <span className="text-red-600">*</span>
                        </Label>
                        <AddressAutocomplete
                          value={vlastnikAdresa}
                          onChange={setVlastnikAdresa}
                          placeholder="Zadejte trvalou adresu"
                          hasError={hasError('vlastnikAdresa')}
                        />
                        {hasError('vlastnikAdresa') && (
                          <p className="text-xs text-red-600">{getErrorMessage('vlastnikAdresa')}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="vlastnikRodneCislo" className="text-sm font-medium text-gray-700">
                          Rodné číslo <span className="text-red-600">*</span>
                        </Label>
                        <Input
                          id="vlastnikRodneCislo"
                          value={vlastnikRodneCislo}
                          onChange={(e) => setVlastnikRodneCislo(e.target.value)}
                          placeholder="Zadejte rodné číslo"
                          className={hasError('vlastnikRodneCislo') ? 'border-red-500' : ''}
                        />
                        {hasError('vlastnikRodneCislo') && (
                          <p className="text-xs text-red-600">{getErrorMessage('vlastnikRodneCislo')}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="vlastnikTelefon" className="text-sm font-medium text-gray-700">
                          Telefon
                        </Label>
                        <Input
                          id="vlastnikTelefon"
                          value={vlastnikTelefon}
                          onChange={(e) => setVlastnikTelefon(e.target.value)}
                          placeholder="Zadejte telefonní číslo"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="vlastnikEmail" className="text-sm font-medium text-gray-700">
                          E-mail
                        </Label>
                        <Input
                          id="vlastnikEmail"
                          type="email"
                          value={vlastnikEmail}
                          onChange={(e) => setVlastnikEmail(e.target.value)}
                          placeholder="Zadejte e-mailovou adresu"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* BOD 4: POŽADOVANÉ POJIŠTĚNÍ */}
            <div className={`bg-white rounded-2xl shadow-lg border-2 p-8 transition-all duration-300 ${hasInsuranceOptionsError() || hasError('mileage') ? 'border-red-500 animate-errorBlink' : 'border-gray-200'}`} data-error={hasInsuranceOptionsError() || hasError('mileage')}>
              <SectionHeader number={4} title="POŽADOVANÉ POJIŠTĚNÍ" />
              
              <div className="space-y-4">
                {hasInsuranceOptionsError() && (
                  <div className="bg-red-50 border border-red-300 rounded-lg p-3">
                    <p className="text-sm text-red-700 font-medium">{getErrorMessage('insuranceOptions')}</p>
                  </div>
                )}

                <UnifiedToggle
                  checked={povinneRuceni}
                  onChange={setPovinneRuceni}
                  label="Povinné ručení"
                />

                <UnifiedToggle
                  checked={havarijniPojisteni}
                  onChange={setHavarijniPojisteni}
                  label="Havarijní pojištění"
                />

                {havarijniPojisteni && (
                  <div className="ml-4 pl-4 border-l-4 border-red-300 space-y-2">
                    <Label htmlFor="mileage" className="text-sm font-medium text-gray-700">
                      Stav tachometru (km) <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id="mileage"
                      value={mileage}
                      onChange={(e) => setMileage(e.target.value)}
                      placeholder="Zadejte stav tachometru"
                      className={hasError('mileage') ? 'border-red-500' : ''}
                    />
                    {hasError('mileage') && (
                      <p className="text-xs text-red-600">{getErrorMessage('mileage')}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* BOD 5: ÚDAJE O VOZIDLE */}
            <div className={`bg-white rounded-2xl shadow-lg border-2 p-8 transition-all duration-300 ${hasError('spz') || hasError('vin') || hasError('vehicleTypeSelected') || hasError('brand') || hasError('model') || hasError('engineCapacity') || hasError('maxPower') || hasError('weight') || hasError('approximateValue') || hasError('fuelType') ? 'border-red-500 animate-errorBlink' : 'border-gray-200'}`} data-error={hasError('spz') || hasError('vin') || hasError('vehicleTypeSelected') || hasError('brand') || hasError('model')}>
              <SectionHeader number={5} title="ÚDAJE O VOZIDLE" />
              
              <div className="space-y-4">
                <UnifiedToggle
                  checked={importedFromAbroad}
                  onChange={setImportedFromAbroad}
                  label="Vozidlo dovezeno ze zahraničí"
                />

                {!importedFromAbroad ? (
                  <div className="space-y-2">
                    <Label htmlFor="spz" className="text-sm font-medium text-gray-700">
                      SPZ <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id="spz"
                      value={spz}
                      onChange={(e) => setSpz(e.target.value.toUpperCase())}
                      placeholder="Zadejte SPZ"
                      className={hasError('spz') ? 'border-red-500' : ''}
                    />
                    {hasError('spz') && (
                      <p className="text-xs text-red-600">{getErrorMessage('spz')}</p>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="vehicleTypeSelected" className="text-sm font-medium text-gray-700">
                        Druh vozidla <span className="text-red-600">*</span>
                      </Label>
                      <Select value={vehicleTypeSelected} onValueChange={setVehicleTypeSelected}>
                        <SelectTrigger className={`bg-white ${hasError('vehicleTypeSelected') ? 'border-red-500' : ''}`}>
                          <SelectValue placeholder="Vyberte druh vozidla" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="osobni">Osobní</SelectItem>
                          <SelectItem value="motocykl">Motocykl</SelectItem>
                          <SelectItem value="nakladni">Nákladní</SelectItem>
                          <SelectItem value="obytny">Obytný</SelectItem>
                        </SelectContent>
                      </Select>
                      {hasError('vehicleTypeSelected') && (
                        <p className="text-xs text-red-600">{getErrorMessage('vehicleTypeSelected')}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="vin" className="text-sm font-medium text-gray-700">
                        VIN <span className="text-red-600">*</span>
                      </Label>
                      <Input
                        id="vin"
                        value={vin}
                        onChange={(e) => setVin(e.target.value.toUpperCase())}
                        placeholder="Zadejte VIN"
                        className={hasError('vin') ? 'border-red-500' : ''}
                      />
                      {hasError('vin') && (
                        <p className="text-xs text-red-600">{getErrorMessage('vin')}</p>
                      )}
                    </div>

                    <VehicleAutocomplete
                      type="brand"
                      value={brand}
                      onChange={setBrand}
                      label="Tovární značka"
                      placeholder="Zadejte značku vozidla"
                      hasError={hasError('brand')}
                    />
                    {hasError('brand') && (
                      <p className="text-xs text-red-600">{getErrorMessage('brand')}</p>
                    )}

                    <VehicleAutocomplete
                      type="model"
                      selectedBrand={brand}
                      value={model}
                      onChange={setModel}
                      label="Modelová řada"
                      placeholder="Zadejte model vozidla"
                      hasError={hasError('model')}
                    />
                    {hasError('model') && (
                      <p className="text-xs text-red-600">{getErrorMessage('model')}</p>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="fuelType" className="text-sm font-medium text-gray-700">
                        Palivo <span className="text-red-600">*</span>
                      </Label>
                      <Select value={fuelType} onValueChange={setFuelType}>
                        <SelectTrigger className={`bg-white ${hasError('fuelType') ? 'border-red-500' : ''}`}>
                          <SelectValue placeholder="Vyberte typ paliva" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="benzin">Benzín</SelectItem>
                          <SelectItem value="nafta">Nafta</SelectItem>
                          <SelectItem value="lpg">LPG</SelectItem>
                          <SelectItem value="cng">CNG</SelectItem>
                          <SelectItem value="elektrina">Elektřina</SelectItem>
                          <SelectItem value="hybrid">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                      {hasError('fuelType') && (
                        <p className="text-xs text-red-600">{getErrorMessage('fuelType')}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="engineCapacity" className="text-sm font-medium text-gray-700">
                        Zdvihový objem (ccm) <span className="text-red-600">*</span>
                      </Label>
                      <Input
                        id="engineCapacity"
                        type="number"
                        value={engineCapacity}
                        onChange={(e) => setEngineCapacity(e.target.value)}
                        placeholder="Zadejte zdvihový objem"
                        className={hasError('engineCapacity') ? 'border-red-500' : ''}
                      />
                      {hasError('engineCapacity') && (
                        <p className="text-xs text-red-600">{getErrorMessage('engineCapacity')}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maxPower" className="text-sm font-medium text-gray-700">
                        Výkon (kW) <span className="text-red-600">*</span>
                      </Label>
                      <Input
                        id="maxPower"
                        type="number"
                        value={maxPower}
                        onChange={(e) => setMaxPower(e.target.value)}
                        placeholder="Zadejte výkon"
                        className={hasError('maxPower') ? 'border-red-500' : ''}
                      />
                      {hasError('maxPower') && (
                        <p className="text-xs text-red-600">{getErrorMessage('maxPower')}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="weight" className="text-sm font-medium text-gray-700">
                        Hmotnost (kg) <span className="text-red-600">*</span>
                      </Label>
                      <Input
                        id="weight"
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder="Zadejte hmotnost"
                        className={hasError('weight') ? 'border-red-500' : ''}
                      />
                      {hasError('weight') && (
                        <p className="text-xs text-red-600">{getErrorMessage('weight')}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="approximateValue" className="text-sm font-medium text-gray-700">
                        Přibližná hodnota vozidla (Kč) <span className="text-red-600">*</span>
                      </Label>
                      <Input
                        id="approximateValue"
                        type="number"
                        value={approximateValue}
                        onChange={(e) => setApproximateValue(e.target.value)}
                        placeholder="Zadejte přibližnou hodnotu"
                        className={hasError('approximateValue') ? 'border-red-500' : ''}
                      />
                      {hasError('approximateValue') && (
                        <p className="text-xs text-red-600">{getErrorMessage('approximateValue')}</p>
                      )}
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="usageType" className="text-sm font-medium text-gray-700">
                    Způsob užití vozidla
                  </Label>
                  <Select value={usageType} onValueChange={(value) => setUsageType(value as UsageType)}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Vyberte způsob užití" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value={UsageType.beznyProvoz}>Běžný provoz</SelectItem>
                      <SelectItem value={UsageType.sPravemPrednostniJizdy}>S právem přednostní jízdy</SelectItem>
                      <SelectItem value={UsageType.taxi}>Taxi</SelectItem>
                      <SelectItem value={UsageType.autopujcovna}>Autopůjčovna</SelectItem>
                      <SelectItem value={UsageType.autoskoly}>Autoškoly</SelectItem>
                      <SelectItem value={UsageType.historickaVozidlaSeZvlastnimSPZ}>Historická vozidla se zvláštním SPZ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* BOD 6: PŘIPOJIŠTĚNÍ */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-8">
              <SectionHeader number={6} title="PŘIPOJIŠTĚNÍ" />
              
              <div className="space-y-4">
                <UnifiedToggle
                  checked={pojisteniSkel}
                  onChange={setPojisteniSkel}
                  label="Pojištění skel"
                />

                <UnifiedToggle
                  checked={pojisteniAsistence}
                  onChange={setPojisteniAsistence}
                  label="Pojištění asistence"
                />

                <UnifiedToggle
                  checked={pojisteniPrirodnichRizik}
                  onChange={setPojisteniPrirodnichRizik}
                  label="Pojištění přírodních rizik"
                />

                <UnifiedToggle
                  checked={pojisteniGAP}
                  onChange={setPojisteniGAP}
                  label="Pojištění GAP"
                />

                <UnifiedToggle
                  checked={pojisteniNahradnihoVozidla}
                  onChange={setPojisteniNahradnihoVozidla}
                  label="Pojištění náhradního vozidla"
                />

                <UnifiedToggle
                  checked={urazovePripojisteni}
                  onChange={setUrazovePripojisteni}
                  label="Úrazové připojištění"
                />
              </div>
            </div>

            {/* BOD 7: SEKVENCE PLATEB */}
            <div className={`bg-white rounded-2xl shadow-lg border-2 p-8 transition-all duration-300 ${hasError('paymentFrequency') ? 'border-red-500 animate-errorBlink' : 'border-gray-200'}`} data-error={hasError('paymentFrequency')}>
              <SectionHeader number={7} title="SEKVENCE PLATEB" />
              
              <div className="space-y-3">
                {hasError('paymentFrequency') && (
                  <div className="bg-red-50 border border-red-300 rounded-lg p-3 mb-4">
                    <p className="text-sm text-red-700 font-medium">{getErrorMessage('paymentFrequency')}</p>
                  </div>
                )}

                <Label className="text-sm font-medium text-gray-700 block mb-2">
                  Jak často chcete platit pojistné? <span className="text-red-600">*</span>
                </Label>

                {/* Radio button options styled in red design */}
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setPaymentFrequency(PaymentFrequency.ctvrtletni)}
                    className={`
                      w-full px-5 py-3 rounded-xl font-semibold text-sm uppercase tracking-wide
                      transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
                      ${paymentFrequency === PaymentFrequency.ctvrtletni
                        ? 'bg-gradient-to-r from-red-800 via-red-700 to-black text-white shadow-lg'
                        : 'bg-white text-gray-700 border-2 border-red-300 hover:border-red-500'
                      }
                    `}
                  >
                    Čtvrtletně
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentFrequency(PaymentFrequency.pololetni)}
                    className={`
                      w-full px-5 py-3 rounded-xl font-semibold text-sm uppercase tracking-wide
                      transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
                      ${paymentFrequency === PaymentFrequency.pololetni
                        ? 'bg-gradient-to-r from-red-800 via-red-700 to-black text-white shadow-lg'
                        : 'bg-white text-gray-700 border-2 border-red-300 hover:border-red-500'
                      }
                    `}
                  >
                    Pololetně
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentFrequency(PaymentFrequency.rocni)}
                    className={`
                      w-full px-5 py-3 rounded-xl font-semibold text-sm uppercase tracking-wide
                      transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
                      ${paymentFrequency === PaymentFrequency.rocni
                        ? 'bg-gradient-to-r from-red-800 via-red-700 to-black text-white shadow-lg'
                        : 'bg-white text-gray-700 border-2 border-red-300 hover:border-red-500'
                      }
                    `}
                  >
                    Ročně
                  </button>
                </div>
              </div>
            </div>

            {/* BOD 8: POZNÁMKY */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-8">
              <SectionHeader number={8} title="POZNÁMKY" />
              
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
                  Další informace nebo poznámky
                </Label>
                <Textarea
                  ref={notesTextareaRef}
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Zde můžete uvést jakékoliv další informace..."
                  className="min-h-[120px] resize-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 pb-2">
              <Button
                onClick={handleInitialSubmit}
                size="lg"
                disabled={createForm.isPending}
                className="w-full bg-gradient-to-r from-red-600 via-red-700 to-black hover:from-red-700 hover:via-red-800 hover:to-gray-900 text-white font-bold text-lg py-7 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createForm.isPending ? 'ODESÍLÁNÍ...' : 'ODESLAT DOTAZNÍK'}
              </Button>
            </div>

            {/* Footer Note */}
            <div className="text-xs text-gray-600 bg-gray-50 rounded-lg p-4 border border-gray-200 shadow-sm">
              <p className="font-bold mb-2 text-gray-800">Prohlášení:</p>
              <p className="leading-relaxed">
                Prohlašuji, že všechny údaje uvedené v tomto dotazníku jsou pravdivé a úplné. 
                Jsem si vědom/a, že uvedení nepravdivých nebo neúplných údajů může mít za následek 
                odmítnutí pojistného plnění nebo ukončení pojistné smlouvy.
              </p>
            </div>
          </div>
        </div>
      </div>

      <SubmissionModal
        open={showSubmissionModal}
        onSubmit={handleFinalSubmit}
        onCancel={() => setShowSubmissionModal(false)}
        isSubmitting={createForm.isPending}
      />
    </>
  );
}
