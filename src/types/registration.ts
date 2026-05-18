import {
  EventRegistration as SchemaEventRegistration,
  NewEventRegistration as SchemaNewEventRegistration
} from "@/db/schema";

export type EventRegistration = SchemaEventRegistration;
export type NewEventRegistration = SchemaNewEventRegistration;

export type RegistrationCategory = 'Industry/Practitioner' | 'Academic' | 'Student';
export type PaymentStatus = 'Pending Payment' | 'Verification Pending' | 'Verified' | 'Rejected';