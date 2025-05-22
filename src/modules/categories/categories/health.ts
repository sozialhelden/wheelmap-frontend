import { t } from "@transifex/native";
import * as icons from "~/modules/categories/icons";

export const health = {
  health: {
    name: () => t("Health"),
    icon: icons.hospital,
    synonyms: [
      "Medical School",
      "health",
      "Healthcare & Support Services",
      "700-7200-0272",
      "Santé",
    ],
  },

  nursing_home: {
    name: () => t("Nursing Home"),
    icon: icons.hospital,
    parents: ["health"],
    synonyms: [
      "nursing_agency",
      "nursing",
      "amenity=nursing_home",
      "healthcare=nursing_home",
      "healthcare=nursing",
    ],
  },

  retirement_home: {
    name: () => t("Retirement Home"),
    icon: icons.hospital,
    parents: ["health"],
    synonyms: ["amenity=retirement_home", "healthcare=retirement_home"],
  },

  audiologist: {
    name: () => t("Audiologist"),
    icon: icons.doctor,
    parents: ["health"],
    synonyms: ["healthcare=audiologist"],
  },

  birthing_centre: {
    name: () => t("Birthing Center"),
    icon: icons.hospital,
    parents: ["health"],
    synonyms: ["healthcare=birthing_centre"],
  },

  blood_bank: {
    name: () => t("Blood Bank"),
    icon: icons.bloodBank,
    parents: ["health"],
    synonyms: ["healthcare=blood_bank"],
  },

  blood_donation: {
    name: () => t("Blood Donation"),
    icon: icons.bloodBank,
    parents: ["health"],
    synonyms: ["healthcare=blood_donation"],
  },

  centre: {
    name: () => t("Health Center"),
    icon: icons.hospital,
    parents: ["health"],
    synonyms: ["healthcare=centre"],
  },

  clinic: {
    name: () => t("Clinic"),
    icon: icons.hospital,
    parents: ["health"],
    synonyms: ["healthcare=clinic"],
  },

  counselling: {
    name: () => t("Counselling"),
    icon: icons.doctor,
    parents: ["health"],
    synonyms: ["healthcare=counselling"],
  },

  dialysis: {
    name: () => t("Dialysis"),
    icon: icons.hospital,
    parents: ["health"],
    synonyms: ["healthcare=dialysis"],
  },

  hospice: {
    name: () => t("Hospice"),
    icon: icons.hospital,
    parents: ["health"],
    synonyms: ["healthcare=hospice"],
  },

  laboratory: {
    name: () => t("Laboratory"),
    icon: icons.commercial,
    parents: ["health"],
    synonyms: ["healthcare=laboratory"],
  },

  midwife: {
    name: () => t("Midwife"),
    icon: icons.doctor,
    parents: ["health"],
    synonyms: ["healthcare=midwife"],
  },

  rehabilitation: {
    name: () => t("Rehabilitation"),
    icon: icons.hospital,
    parents: ["health"],
    synonyms: ["healthcare=rehabilitation"],
  },

  yes: {
    name: () => t("General Healthcare Facility"),
    icon: icons.hospital,
    parents: ["health"],
    synonyms: ["healthcare=yes", "healthcare:specialty=general"],
  },

  ergotherapist: {
    name: () => t("Ergotherapist"),
    icon: icons.hospital,
    parents: ["health"],
    synonyms: ["healthcare=ergotherapist"],
  },

  nutrition_counselling: {
    name: () => t("Nutrition Counselling"),
    icon: icons.hospital,
    parents: ["health"],
    synonyms: ["healthcare=nutrition_counselling"],
  },

  podiatrist: {
    name: () => t("Podiatrist"),
    icon: icons.doctor,
    parents: ["health"],
    synonyms: ["healthcare=podiatrist"],
  },

  sample_collection: {
    name: () => t("Sample Collection"),
    icon: icons.hospital,
    parents: ["health"],
    synonyms: ["healthcare=sample_collection"],
  },

  vaccination_centre: {
    name: () => t("Vaccination Center"),
    icon: icons.doctor,
    parents: ["health"],
    synonyms: ["healthcare=vaccination_centre"],
  },

  therapist: {
    name: () => t("Therapist"),
    icon: icons.doctor,
    parents: ["health"],
    synonyms: ["healthcare=therapist"],
  },

  allergology: {
    name: () => t("Allergology"),
    icon: icons.doctor,
    parents: ["health"],
    synonyms: ["healthcare:specialty=allergology"],
  },

  anaesthetics: {
    name: () => t("Anaesthetics"),
    icon: icons.doctor,
    parents: ["health"],
    synonyms: ["healthcare:specialty=anaesthetics"],
  },

  cardiology: {
    name: () => t("Cardiology"),
    icon: icons.doctor,
    parents: ["health"],
    synonyms: ["healthcare:specialty=cardiology"],
  },

  cardiothoracic_surgery: {
    name: () => t("Cardiothoracic Surgery"),
    icon: icons.doctor,
    parents: ["health"],
    synonyms: ["healthcare:specialty=cardiothoracic_surgery"],
  },

  child_psychiatry: {
    name: () => t("Child Psychiatry"),
    icon: icons.doctor,
    parents: ["health"],
    synonyms: ["healthcare:specialty=child_psychiatry"],
  },

  community: {
    name: () => t("Community Medicine"),
    icon: icons.hospital,
    parents: ["health"],
    synonyms: ["healthcare:specialty=community"],
  },

  dermatology: {
    name: () => t("Dermatology"),
    icon: icons.doctor,
    parents: ["health"],
    synonyms: ["healthcare:specialty=dermatology"],
  },

  dermatovenereology: {
    name: () => t("Dermatovenereology"),
    icon: icons.doctor,
    parents: ["health"],
    synonyms: ["healthcare:specialty=dermatovenereology"],
  },

  diagnostic_radiology: {
    name: () => t("Diagnostic Radiology"),
    icon: icons.doctor,
    parents: ["health"],
    synonyms: ["healthcare:specialty=diagnostic_radiology"],
  },

  emergency: {
    name: () => t("Emergency"),
    icon: icons.hospital,
    parents: ["health"],
    synonyms: ["healthcare:specialty=emergency"],
  },

  endocrinology: {
    name: () => t("Endocrinology"),
    icon: icons.doctor,
    parents: ["health"],
    synonyms: ["healthcare:specialty=endocrinology"],
  },

  gastroenterology: {
    name: () => t("Gastroenterology"),
    icon: icons.doctor,
    parents: ["health"],
    synonyms: ["healthcare:specialty=gastroenterology"],
  },

  geriatrics: {
    name: () => t("Geriatrics"),
    icon: icons.doctor,
    parents: ["health"],
    synonyms: ["healthcare:specialty=geriatrics"],
  },

  gynaecology: {
    name: () => t("Gynaecology"),
    icon: icons.doctor,
    parents: ["health"],
    synonyms: ["healthcare:specialty=gynaecology"],
  },

  haematology: {
    name: () => t("Haematology"),
    icon: icons.doctor,
    parents: ["health"],
    synonyms: ["healthcare:specialty=haematology"],
  },

  hepatology: {
    name: () => t("Hepatology"),
    icon: icons.doctor,
    parents: ["health"],
    synonyms: ["healthcare:specialty=hepatology"],
  },

  infectious_diseases: {
    name: () => t("Infectious Diseases"),
    icon: icons.hospital,
    parents: ["health"],
    synonyms: ["healthcare:specialty=infectious_diseases"],
  },

  intensive: {
    name: () => t("Intensive Care"),
    icon: icons.hospital,
    parents: ["health"],
    synonyms: ["healthcare:specialty=intensive"],
  },

  internal: {
    name: () => t("Internal Medicine"),
    icon: icons.doctor,
    parents: ["health"],
    synonyms: ["healthcare:specialty=internal"],
  },

  dental_oral_maxillo_facial_surgery: {
    name: () => t("Dental Oral Maxillo Facial Surgery"),
    icon: icons.dentist,
    parents: ["health"],
    synonyms: ["healthcare:specialty=dental_oral_maxillo_facial_surgery"],
  },

  neonatology: {
    name: () => t("Neonatology"),
    icon: icons.doctor,
    parents: ["health"],
    synonyms: ["healthcare:specialty=neonatology"],
  },

  nephrology: {
    name: () => t("Nephrology"),
    icon: icons.doctor,
    parents: ["health"],
    synonyms: ["healthcare:specialty=nephrology"],
  },

  neurology: {
    name: () => t("Neurology"),
    icon: icons.doctor,
    parents: ["health"],
    synonyms: ["healthcare:specialty=neurology"],
  },

  neuropsychiatry: {
    name: () => t("Neuropsychiatry"),
    icon: icons.doctor,
    parents: ["health"],
    synonyms: ["healthcare:specialty=neuropsychiatry"],
  },

  neurosurgery: {
    name: () => t("Neurosurgery"),
    icon: icons.doctor,
    parents: ["health"],
    synonyms: ["healthcare:specialty=neurosurgery"],
  },

  nuclear: {
    name: () => t("Nuclear Medicine"),
    icon: icons.doctor,
    parents: ["health"],
    synonyms: ["healthcare:specialty=nuclear"],
  },

  occupational: {
    name: () => t("Occupational Medicine"),
    icon: icons.doctor,
    parents: ["health"],
    synonyms: ["healthcare:specialty=occupational"],
  },

  oncology: {
    name: () => t("Oncology"),
    icon: icons.doctor,
    parents: ["health"],
    synonyms: ["healthcare:specialty=oncology"],
  },

  ophthalmology: {
    name: () => t("Ophthalmology"),
    icon: icons.doctor,
    parents: ["health"],
    synonyms: ["healthcare:specialty=ophthalmology"],
  },

  orthodontics: {
    name: () => t("Orthodontics"),
    icon: icons.doctor,
    parents: ["health"],
    synonyms: ["healthcare:specialty=orthodontics"],
  },

  orthopaedics: {
    name: () => t("Orthopaedics"),
    icon: icons.doctor,
    parents: ["health"],
    synonyms: ["healthcare:specialty=orthopaedics"],
  },

  otolaryngology: {
    name: () => t("Otolaryngology"),
    icon: icons.doctor,
    parents: ["health"],
    synonyms: ["healthcare:specialty=otolaryngology"],
  },

  paediatric_surgery: {
    name: () => t("Paediatric surgery"),
    icon: icons.doctor,
    parents: ["health"],
    synonyms: ["healthcare:specialty=paediatric_surgery"],
  },

  paediatrics: {
    name: () => t("Paediatrics"),
    icon: icons.doctor,
    parents: ["health"],
    synonyms: ["healthcare:specialty=paediatrics"],
  },

  palliative: {
    name: () => t("Palliative health"),
    icon: icons.doctor,
    parents: ["health"],
    synonyms: ["healthcare:specialty=palliative"],
  },

  pathology: {
    name: () => t("Pathology"),
    icon: icons.doctor,
    parents: ["health"],
    synonyms: ["healthcare:specialty=pathology"],
  },

  physiatry: {
    name: () => t("Physiatry"),
    icon: icons.doctor,
    parents: ["health"],
    synonyms: ["healthcare:specialty=physiatry"],
  },

  plastic_surgery: {
    name: () => t("Plastic Surgery"),
    icon: icons.doctor,
    parents: ["health"],
    synonyms: ["healthcare:specialty=plastic_surgery"],
  },

  podiatry: {
    name: () => t("Podiatry"),
    icon: icons.doctor,
    parents: ["health"],
    synonyms: ["healthcare:specialty=podiatry"],
  },

  proctology: {
    name: () => t("Proctology"),
    icon: icons.doctor,
    parents: ["health"],
    synonyms: ["healthcare:specialty=proctology"],
  },

  psychiatry: {
    name: () => t("Psychiatry"),
    icon: icons.doctor,
    parents: ["health"],
    synonyms: ["healthcare:specialty=psychiatry"],
  },

  pulmonology: {
    name: () => t("Pulmonology"),
    icon: icons.doctor,
    parents: ["health"],
    synonyms: ["healthcare:specialty=pulmonology"],
  },

  radiology: {
    name: () => t("Radiology"),
    icon: icons.doctor,
    parents: ["health"],
    synonyms: ["healthcare:specialty=radiology"],
  },

  radiotherapy: {
    name: () => t("Radiotherapy"),
    icon: icons.doctor,
    parents: ["health"],
    synonyms: ["healthcare:specialty=radiotherapy"],
  },

  rheumatology: {
    name: () => t("Rheumatology"),
    icon: icons.doctor,
    parents: ["health"],
    synonyms: ["healthcare:specialty=rheumatology"],
  },

  stomatology: {
    name: () => t("Stomatology"),
    icon: icons.doctor,
    parents: ["health"],
    synonyms: ["healthcare:specialty=stomatology"],
  },

  surgery: {
    name: () => t("Surgery"),
    icon: icons.doctor,
    parents: ["health"],
    synonyms: ["healthcare:specialty=surgery"],
  },

  transplant: {
    name: () => t("Transplants"),
    icon: icons.doctor,
    parents: ["health"],
    synonyms: ["healthcare:specialty=transplant"],
  },

  trauma: {
    name: () => t("Trauma Medicine"),
    icon: icons.doctor,
    parents: ["health"],
    synonyms: ["healthcare:specialty=trauma"],
  },

  tropical: {
    name: () => t("Tropical Medicine"),
    icon: icons.doctor,
    parents: ["health"],
    synonyms: ["healthcare:specialty=tropical"],
  },

  urology: {
    name: () => t("Urology"),
    icon: icons.doctor,
    parents: ["health"],
    synonyms: ["healthcare:specialty=urology"],
  },

  vascular_surgery: {
    name: () => t("Vascular Surgery"),
    icon: icons.doctor,
    parents: ["health"],
    synonyms: ["healthcare:specialty=vascular_surgery"],
  },

  venereology: {
    name: () => t("Venereology"),
    icon: icons.doctor,
    parents: ["health"],
    synonyms: ["healthcare:specialty=venereology"],
  },

  abortion: {
    name: () => t("Abortion"),
    icon: icons.doctor,
    parents: ["health"],
    synonyms: ["healthcare:specialty=abortion"],
  },

  fertility: {
    name: () => t("Fertility"),
    icon: icons.doctor,
    parents: ["health"],
    synonyms: ["healthcare:specialty=fertility"],
  },

  vaccination: {
    name: () => t("Vaccination"),
    icon: icons.doctor,
    parents: ["health"],
    synonyms: ["healthcare:specialty=vaccination"],
  },

  physiotherapist: {
    name: () => t("Physiotherapist"),
    icon: icons.doctor,
    parents: ["health"],
    synonyms: [
      "healthcare=physiotherapist",
      "physiotherapist",
      "physiotherapist",
      "physiotherapy_center",
      "Physical Therapist",
      "Arzt- oder Zahnarztpraxis",
    ],
  },

  hospital: {
    name: () => t("Hospital"),
    icon: icons.hospital,
    parents: ["health"],
    synonyms: [
      "amenity=hospital",
      "healthcare=hospital",
      "hospital",
      "hospital",
      "medical_lab",
      "Medical Center",
      "Emergency Room",
      "Hospital",
      "Ward",
      "Maternity Clinic",
      "Medical Lab",
      "Rehab Center",
      "Urgent Care Center",
      "Ambulance Services",
      "Hospital or Health Care Facility",
      "Care Home",
      "Medical Services or Clinic",
      "Accident & Emergency",
      "Blood Bank",
      "700-7300-0280",
      "800-8000-0000",
      "800-8000-0157",
      "800-8000-0158",
      "800-8000-0325",
      "800-8000-0367",
      "800-8000-0159",
      "Spital oder Heim",
    ],
  },

  dentist: {
    name: () => t("Dentist"),
    icon: icons.dentist,
    parents: ["health"],
    synonyms: [
      "amenity=dentist",
      "healthcare=dentist",
      "dentist",
      "dentist",
      "Dentist's Office",
      "Dental Practice",
      "800-8000-0154",
    ],
  },

  speech_therapist: {
    name: () => t("Speech Therapist"),
    icon: icons.doctor,
    parents: ["health"],
    synonyms: ["healthcare=speech_therapist"],
  },

  pharmacy: {
    name: () => t("Pharmacy"),
    icon: icons.pharmacy,
    parents: ["health"],
    synonyms: [
      "amenity=pharmacy",
      "pharmacy",
      "pharmacy",
      "Pharmacy",
      "Pharmacy/Drugs",
      "Pharmacy",
      "600-6400-0000",
      "600-6400-0070",
      "Apotheke oder Drogerie",
      "healthcare=pharmacy",
    ],
  },

  psychotherapist: {
    name: () => t("Psychotherapist"),
    icon: icons.doctor,
    parents: ["health"],
    synonyms: [
      "Mental Health Office",
      "Psychiatric Institute",
      "Psychotherapy & Counseling",
      "800-8000-0156",
      "800-8000-0340",
      "healthcare=psychotherapist",
      "healthcare=psychotherapy",
    ],
  },

  hearing_aids: {
    name: () => t("Hearing Aids"),
    icon: icons.doctor,
    parents: ["health"],
    synonyms: ["shop=hearing_aids", "healthcare=hearing_aids"],
  },

  alternative_medicine: {
    name: () => t("Alternative Medicine"),
    icon: icons.doctor,
    parents: ["health"],
    synonyms: [
      "healthcare=alternative",
      "healthcare=alternative_medicine",
      "Acupuncturist",
      "Alternative Healer",
      "Chiropractor",
      "Nutritionist",
      "alternative",
      "Chiropractic",
      "800-8000-0341",
    ],
  },

  medical_store: {
    name: () => t("Medical Store"),
    icon: icons.pharmacy,
    parents: ["health"],
    synonyms: [
      "shop=medical_supply",
      "wheelchair_store",
      "orthesist",
      "Medical Supply Store",
      "Mobility Store",
      "medical_supply",
      "healthcare=medical_store",
    ],
  },

  social_facility: {
    name: () => t("Social Facility"),
    icon: icons.hospital,
    parents: ["health"],
    synonyms: [
      "amenity=social_facility",
      "amenity=social_centre",
      "social_services_organization",
      "function_room_facility",
      "Assisted Living",
      "Home Service",
      "Social Services",
      "700-7400-0147",
      "Soziokulturelles Zentrum",
      "healthcare=social_facility",
      "healthcare=social_centre",
    ],
  },

  occupational_therapist: {
    name: () => t("Occupational Therapist"),
    icon: icons.doctor,
    parents: ["health"],
    synonyms: ["healthcare=occupational_therapist"],
  },

  ophthalmologist: {
    name: () => t("Ophthalmologist"),
    icon: icons.grocery,
    parents: ["health"],
    synonyms: [
      "shop=optician",
      "optician",
      "Optical Shop",
      "Opticians",
      "800-8000-0161",
      "healthcare=optometrist",
    ],
  },

  doctor: {
    name: () => t("Doctor's Office"),
    icon: icons.doctor,
    parents: ["health"],
    synonyms: [
      "amenity=doctors",
      "doctor",
      "doctor",
      "Doctor's Office",
      "Eye Doctor",
      "doctors",
      "General Practicioners",
      "800-8000-0155",
      "800-8000-0162",
      "healthcare=doctors",
      "healthcare=doctor",
    ],
  },
} as const;
