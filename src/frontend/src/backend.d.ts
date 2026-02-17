import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Person {
    ico: string;
    companyFieldsOnlyMode: boolean;
    name: string;
    isVatPayer: boolean;
    companyLastName: string;
    email: string;
    executiveName: string;
    isCompany: boolean;
    rodneCislo: string;
    address: string;
    phone: string;
    companyFirstName: string;
    executiveRodneCislo: string;
}
export type Time = bigint;
export interface InsuranceForm {
    id: string;
    status: Variant_completed_draft;
    vozidlo: Vehicle;
    submitterName: string;
    paymentFrequency: PaymentFrequency;
    mileage?: string;
    vlastnik?: Person;
    createdAt: Time;
    hasTechnicalCertificate: boolean;
    isSameAsPojistnik: boolean;
    updatedAt: Time;
    hasImportedVehicle: boolean;
    sameOperator: boolean;
    insuranceOptions: InsuranceOptions;
    notes: string;
    viewedByAdmin: boolean;
    submitterEmail: string;
    pojistnik: Person;
    isPhysicalPerson: boolean;
    isSameAsProvozovatel: boolean;
    provozovatel: Person;
}
export interface InsuranceOptions {
    pojisteniNahradnihoVozidla: boolean;
    pojisteniGAP: boolean;
    povinneRuceni: boolean;
    pojisteniPrirodnichRizik: boolean;
    urazovePripojisteni: boolean;
    havarijniPojisteni: boolean;
    pojisteniSkel: boolean;
    pojisteniAsistence: boolean;
}
export interface Vehicle {
    spz: string;
    vin: string;
    weight?: bigint;
    model: string;
    vehicleType: Array<VehicleType>;
    approximateValue?: bigint;
    hasTechnicalCertificate: boolean;
    importedFromAbroad: boolean;
    usageType: UsageType;
    maxPower?: bigint;
    engineCapacity?: bigint;
    fuelType?: string;
    brand: string;
}
export interface UserProfile {
    name: string;
}
export enum PaymentFrequency {
    pololetni = "pololetni",
    ctvrtletni = "ctvrtletni",
    rocni = "rocni"
}
export enum UsageType {
    autopujcovna = "autopujcovna",
    sPravemPrednostniJizdy = "sPravemPrednostniJizdy",
    taxi = "taxi",
    autoskoly = "autoskoly",
    historickaVozidlaSeZvlastnimSPZ = "historickaVozidlaSeZvlastnimSPZ",
    beznyProvoz = "beznyProvoz"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_completed_draft {
    completed = "completed",
    draft = "draft"
}
export enum VehicleType {
    obytny = "obytny",
    nakladni = "nakladni",
    osobni = "osobni",
    motocykl = "motocykl"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createForm(form: InsuranceForm): Promise<void>;
    deleteForm(id: string): Promise<void>;
    getAllFormsSorted(): Promise<Array<InsuranceForm>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getForm(id: string): Promise<InsuranceForm | null>;
    getFormsByStatus(status: Variant_completed_draft): Promise<Array<InsuranceForm>>;
    getNewFormsCount(): Promise<bigint>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initializeAccessControl(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    markAllFormsAsViewed(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateForm(form: InsuranceForm): Promise<void>;
}
