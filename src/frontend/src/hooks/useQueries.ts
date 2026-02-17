import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { InsuranceForm, UserProfile, UserRole } from '../backend';
import { toast } from 'sonner';

// ============================================================================
// Form Queries
// ============================================================================

export function useCreateForm() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (form: InsuranceForm) => {
      if (!actor) {
        throw new Error('Backend není dostupný. Zkontrolujte připojení k síti.');
      }

      try {
        console.log('📤 Odesílání formuláře na backend...', form.id);
        await actor.createForm(form);
        console.log('✅ Formulář úspěšně odeslán na backend');
      } catch (error: any) {
        console.error('❌ Chyba při odesílání formuláře:', error);
        throw new Error(`Chyba při odesílání: ${error.message || 'Neznámá chyba'}`);
      }
    },
    onSuccess: () => {
      console.log('✅ Formulář úspěšně uložen, invaliduji cache');
      queryClient.invalidateQueries({ queryKey: ['forms'] });
      queryClient.invalidateQueries({ queryKey: ['newFormsCount'] });
      toast.success('Formulář byl úspěšně odeslán!');
    },
    onError: (error: Error) => {
      console.error('❌ Chyba při ukládání formuláře:', error);
      toast.error(`Chyba: ${error.message}`);
    },
  });
}

export function useGetAllForms() {
  const { actor, isFetching } = useActor();

  return useQuery<InsuranceForm[]>({
    queryKey: ['forms'],
    queryFn: async () => {
      if (!actor) {
        console.log('❌ Actor není dostupný pro načtení formulářů');
        return [];
      }

      try {
        console.log('📋 Načítání formulářů z backendu...');
        const forms = await actor.getAllFormsSorted();
        console.log('✅ Načteno formulářů:', forms.length);
        return forms;
      } catch (error: any) {
        console.error('❌ Chyba při načítání formulářů:', error);
        toast.error('Chyba při načítání formulářů');
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useDeleteForm() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) {
        throw new Error('Backend není dostupný.');
      }

      try {
        console.log('🗑️ Mazání formuláře:', id);
        await actor.deleteForm(id);
        console.log('✅ Formulář smazán');
      } catch (error: any) {
        console.error('❌ Chyba při mazání formuláře:', error);
        throw new Error(`Chyba při mazání: ${error.message || 'Neznámá chyba'}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] });
      queryClient.invalidateQueries({ queryKey: ['newFormsCount'] });
      toast.success('Formulář byl smazán');
    },
  });
}

export function useGetNewFormsCount() {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['newFormsCount'],
    queryFn: async () => {
      if (!actor) {
        console.log('❌ Actor není dostupný pro načtení počtu nových formulářů');
        return BigInt(0);
      }

      try {
        const count = await actor.getNewFormsCount();
        console.log('📊 Počet nových formulářů:', count.toString());
        return count;
      } catch (error: any) {
        console.error('❌ Chyba při načítání počtu nových formulářů:', error);
        return BigInt(0);
      }
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}

export function useMarkAllFormsAsViewed() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) {
        throw new Error('Backend není dostupný.');
      }

      try {
        console.log('👁️ Označování formulářů jako zobrazené...');
        await actor.markAllFormsAsViewed();
        console.log('✅ Formuláře označeny jako zobrazené');
      } catch (error: any) {
        console.error('❌ Chyba při označování formulářů:', error);
        throw new Error(`Chyba: ${error.message || 'Neznámá chyba'}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forms'] });
      queryClient.invalidateQueries({ queryKey: ['newFormsCount'] });
      toast.success('Formuláře označeny jako přečtené');
    },
  });
}

// ============================================================================
// User Profile Queries
// ============================================================================

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) {
        console.log('❌ Actor není dostupný pro načtení profilu uživatele');
        return null;
      }
      try {
        const profile = await actor.getCallerUserProfile();
        console.log('👤 Profil uživatele:', profile ? 'Nalezen' : 'Nenalezen');
        return profile;
      } catch (error: any) {
        console.error('❌ Chyba při načítání profilu uživatele:', error);
        return null;
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) {
        throw new Error('Backend není dostupný pro uložení profilu.');
      }
      try {
        console.log('💾 Ukládání profilu uživatele...');
        await actor.saveCallerUserProfile(profile);
        console.log('✅ Profil uživatele uložen');
      } catch (error: any) {
        console.error('❌ Chyba při ukládání profilu uživatele:', error);
        throw new Error(`Chyba při ukládání profilu: ${error.message || 'Neznámá chyba'}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// ============================================================================
// Access Control Queries
// ============================================================================

export function useGetCallerUserRole() {
  const { actor, isFetching } = useActor();

  return useQuery<UserRole>({
    queryKey: ['userRole'],
    queryFn: async () => {
      if (!actor) {
        console.log('❌ Actor není dostupný pro načtení role uživatele');
        return 'guest' as UserRole;
      }
      try {
        const role = await actor.getCallerUserRole();
        console.log('🔐 Role uživatele:', role);
        return role;
      } catch (error: any) {
        console.error('❌ Chyba při načítání role uživatele:', error);
        return 'guest' as UserRole;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) {
        console.log('❌ Actor není dostupný pro kontrolu admin oprávnění');
        return false;
      }
      try {
        const isAdmin = await actor.isCallerAdmin();
        console.log('👑 Je admin:', isAdmin);
        return isAdmin;
      } catch (error: any) {
        console.error('❌ Chyba při kontrole admin oprávnění:', error);
        return false;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

// ============================================================================
// CSV/JSON Export Helpers
// ============================================================================

export const convertFormToCSVRow = (form: InsuranceForm): string => {
  const escapeCSV = (value: any): string => {
    if (value === null || value === undefined) return '';
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const vehicleTypes = form.vozidlo.vehicleType.join(';');
  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('cs-CZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return [
    escapeCSV(form.id),
    escapeCSV(form.submitterName),
    escapeCSV(form.submitterEmail),
    escapeCSV(formatDate(form.createdAt)),
    escapeCSV(form.provozovatel.name),
    escapeCSV(form.provozovatel.address),
    escapeCSV(form.provozovatel.phone),
    escapeCSV(form.provozovatel.email),
    escapeCSV(form.provozovatel.ico),
    escapeCSV(form.provozovatel.rodneCislo),
    escapeCSV(form.provozovatel.isCompany ? 'Ano' : 'Ne'),
    escapeCSV(form.pojistnik.name),
    escapeCSV(form.pojistnik.address),
    escapeCSV(form.pojistnik.phone),
    escapeCSV(form.pojistnik.email),
    escapeCSV(form.pojistnik.ico),
    escapeCSV(form.pojistnik.rodneCislo),
    escapeCSV(form.pojistnik.isCompany ? 'Ano' : 'Ne'),
    escapeCSV(form.vlastnik?.name || ''),
    escapeCSV(form.vlastnik?.address || ''),
    escapeCSV(form.vlastnik?.phone || ''),
    escapeCSV(form.vlastnik?.email || ''),
    escapeCSV(vehicleTypes),
    escapeCSV(form.vozidlo.spz),
    escapeCSV(form.vozidlo.vin),
    escapeCSV(form.vozidlo.brand),
    escapeCSV(form.vozidlo.model),
    escapeCSV(form.vozidlo.usageType),
    escapeCSV(form.insuranceOptions.povinneRuceni ? 'Ano' : 'Ne'),
    escapeCSV(form.insuranceOptions.havarijniPojisteni ? 'Ano' : 'Ne'),
    escapeCSV(form.insuranceOptions.pojisteniSkel ? 'Ano' : 'Ne'),
    escapeCSV(form.insuranceOptions.pojisteniAsistence ? 'Ano' : 'Ne'),
    escapeCSV(form.paymentFrequency),
    escapeCSV(form.mileage || ''),
    escapeCSV(form.notes),
    escapeCSV(form.status === 'completed' ? 'Dokončený' : 'Rozpracovaný'),
  ].join(',');
};
