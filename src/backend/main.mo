import Map "mo:core/Map";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "authorization/access-control";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";

actor {
  let storage = Storage.new();
  include MixinStorage(storage);

  type Person = {
    name : Text;
    address : Text;
    phone : Text;
    email : Text;
    ico : Text;
    rodneCislo : Text;
    isCompany : Bool;
    isVatPayer : Bool;
    executiveName : Text;
    executiveRodneCislo : Text;
    companyFieldsOnlyMode : Bool;
    companyFirstName : Text;
    companyLastName : Text;
  };

  type VehicleType = {
    #osobni;
    #motocykl;
    #nakladni;
    #obytny;
  };

  type UsageType = {
    #beznyProvoz;
    #sPravemPrednostniJizdy;
    #taxi;
    #autopujcovna;
    #autoskoly;
    #historickaVozidlaSeZvlastnimSPZ;
  };

  type Vehicle = {
    vehicleType : [VehicleType];
    spz : Text;
    vin : Text;
    usageType : UsageType;
    importedFromAbroad : Bool;
    brand : Text;
    model : Text;
    fuelType : ?Text;
    engineCapacity : ?Nat;
    maxPower : ?Nat;
    weight : ?Nat;
    approximateValue : ?Nat;
    hasTechnicalCertificate : Bool;
  };

  type InsuranceOptions = {
    povinneRuceni : Bool;
    havarijniPojisteni : Bool;
    pojisteniSkel : Bool;
    pojisteniAsistence : Bool;
    pojisteniPrirodnichRizik : Bool;
    pojisteniGAP : Bool;
    pojisteniNahradnihoVozidla : Bool;
    urazovePripojisteni : Bool;
  };

  type PaymentFrequency = {
    #rocni;
    #pololetni;
    #ctvrtletni;
  };

  type InsuranceForm = {
    id : Text;
    provozovatel : Person;
    pojistnik : Person;
    vlastnik : ?Person;
    vozidlo : Vehicle;
    insuranceOptions : InsuranceOptions;
    paymentFrequency : PaymentFrequency;
    sameOperator : Bool;
    createdAt : Time.Time;
    updatedAt : Time.Time;
    status : {
      #draft;
      #completed;
    };
    viewedByAdmin : Bool;
    submitterName : Text;
    submitterEmail : Text;
    isPhysicalPerson : Bool;
    isSameAsPojistnik : Bool;
    isSameAsProvozovatel : Bool;
    hasTechnicalCertificate : Bool;
    hasImportedVehicle : Bool;
    mileage : ?Text;
    notes : Text;
  };

  type UserProfile = {
    name : Text;
  };

  var forms = Map.empty<Text, InsuranceForm>();
  var userProfiles = Map.empty<Principal, UserProfile>();
  var isAccessControlInitialized : Bool = false;

  let accessControlState = AccessControl.initState();

  func trim(text : Text) : Text {
    text.trim(#char ' ');
  };

  func validatePerson(person : Person, isVisible : Bool) : Bool {
    if (not isVisible) { return true };

    if (person.isCompany) {
      return trim(person.ico) != "";
    };

    if (trim(person.rodneCislo) == "") {
      return false;
    };

    if (trim(person.name) == "") {
      return false;
    };

    if (trim(person.address) == "") {
      return false;
    };

    true;
  };

  func validateVehicle(vozidlo : Vehicle, hasImportedVehicle : Bool) : Bool {
    if (hasImportedVehicle) {
      if (trim(vozidlo.brand) == "") {
        return false;
      };
      if (trim(vozidlo.model) == "") {
        return false;
      };
    };

    if (not hasImportedVehicle and trim(vozidlo.spz) == "") {
      return false;
    };

    true;
  };

  func validateInsuranceOptions(options : InsuranceOptions) : Bool {
    options.povinneRuceni or options.havarijniPojisteni;
  };

  func validateForm(form : InsuranceForm) : Bool {
    if (not validatePerson(form.provozovatel, true)) { return false };

    let pojistnikVisible = not form.isSameAsProvozovatel;
    if (not validatePerson(form.pojistnik, pojistnikVisible)) { return false };

    if (not validateVehicle(form.vozidlo, form.hasImportedVehicle)) { return false };

    if (not validateInsuranceOptions(form.insuranceOptions)) { return false };

    true;
  };

  // PUBLIC ENDPOINT: Allows anonymous (guest) form submission
  public shared ({ caller }) func createForm(form : InsuranceForm) : async () {
    switch (forms.get(form.id)) {
      case (?_) {
        Runtime.trap("Form with ID " # form.id # " already exists");
      };
      case (null) {
        if (not validateForm(form)) {
          Runtime.trap("Validation failed: Please check all required fields");
        };
        forms.add(form.id, form);
      };
    };
  };

  // ADMIN-ONLY: Get number of new (unviewed) forms
  public query ({ caller }) func getNewFormsCount() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view new forms count");
    };

    let allForms = forms.values().toArray();
    let newForms = allForms.filter(func(form) { not form.viewedByAdmin });
    newForms.size();
  };

  // ADMIN-ONLY: Mark all forms as viewed
  public shared ({ caller }) func markAllFormsAsViewed() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can mark forms as viewed");
    };

    let allForms = forms.values().toArray();
    for (form in allForms.values()) {
      forms.add(form.id, { form with viewedByAdmin = true });
    };
  };

  // USER-ONLY: Get own profile
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access their profiles");
    };

    userProfiles.get(caller);
  };

  // USER-ONLY: Save own profile
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save their profiles");
    };

    userProfiles.add(caller, profile);
  };

  // USER or ADMIN: Get user profile (own or others if admin)
  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };

    userProfiles.get(user);
  };

  // AUTHENTICATED-ONLY: Initialize access control (first caller becomes admin)
  public shared ({ caller }) func initializeAccessControl() : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Anonymous principals cannot initialize access control");
    };

    if (isAccessControlInitialized) {
      Runtime.trap("Access control already initialized");
    };

    AccessControl.initialize(accessControlState, caller);
    isAccessControlInitialized := true;
  };

  // PUBLIC: Get caller's role (returns guest for anonymous)
  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    if (caller.isAnonymous()) {
      return #guest;
    };

    AccessControl.getUserRole(accessControlState, caller);
  };

  // ADMIN-ONLY: Assign role to user (admin check inside AccessControl.assignRole)
  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  // PUBLIC: Check if caller is admin (returns false for anonymous)
  public query ({ caller }) func isCallerAdmin() : async Bool {
    if (caller.isAnonymous()) {
      return false;
    };

    AccessControl.isAdmin(accessControlState, caller);
  };

  // ADMIN-ONLY: View individual form
  public query ({ caller }) func getForm(id : Text) : async ?InsuranceForm {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view forms");
    };

    forms.get(id);
  };

  // ADMIN-ONLY: Update form
  public shared ({ caller }) func updateForm(form : InsuranceForm) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update forms");
    };

    switch (forms.get(form.id)) {
      case (null) { Runtime.trap("Form not found") };
      case (?_) {
        if (not validateForm(form)) {
          Runtime.trap("Validation failed: Please check all required fields");
        };
        forms.add(form.id, form);
      };
    };
  };

  // ADMIN-ONLY: Delete form
  public shared ({ caller }) func deleteForm(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete forms");
    };

    forms.remove(id);
  };

  // ADMIN-ONLY: Get all forms sorted by creation date (newest first)
  public query ({ caller }) func getAllFormsSorted() : async [InsuranceForm] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all forms");
    };

    let formsArray = forms.values().toArray();
    formsArray.sort(
      func(a, b) {
        if (a.createdAt > b.createdAt) { #greater } else if (a.createdAt < b.createdAt) {
          #less;
        } else { #equal };
      }
    );
  };

  // ADMIN-ONLY: Get forms by status
  public query ({ caller }) func getFormsByStatus(status : { #draft; #completed }) : async [InsuranceForm] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view forms by status");
    };

    let allForms = forms.values().toArray();
    allForms.filter(func(form) { form.status == status });
  };
};
