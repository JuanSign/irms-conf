import { pgTable, uuid, varchar, text, timestamp, pgEnum, primaryKey, integer, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const topicEnum = pgEnum('topic', [
  'Fundamental Rock Mechanics',
  'Rock Engineering Analysis & Numerical Modeling',
  'Rock Mechanics Applications'
]);

export const statusEnum = pgEnum('status', [
  'Submitted',
  'Under Review',
  'Revision Required',
  'Accepted',
  'Rejected'
]);

export const adminRoleEnum = pgEnum('admin_role', [
  'Super Admin',
  'Reviewer'
]);

export const registrationCategoryEnum = pgEnum('registration_category', [
  'Industry/Practitioner',
  'Academic',
  'Student'
]);

export const paymentStatusEnum = pgEnum('payment_status', [
  'Pending Payment',
  'Verification Pending',
  'Verified',
  'Rejected'
]);

export const iopPaymentStatusEnum = pgEnum('iop_payment_status', [
  'Pending Payment',
  'Verification Pending',
  'Verified',
  'Rejected'
]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  affiliation: varchar("affiliation", { length: 255 }),
  passwordHash: text("password_hash").notNull(),
  emailVerifiedAt: timestamp("email_verified_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const emailVerificationTokens = pgTable("email_verification_tokens", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const abstracts = pgTable("abstracts", {
  id: uuid("id").defaultRandom().primaryKey(),
  writerId: uuid("writer_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  topic: topicEnum("topic").notNull(),
  path: text("path").notNull(),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  status: statusEnum("status").default("Submitted").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
});

export const iopPublications = pgTable("iop_publications", {
  id: uuid("id").defaultRandom().primaryKey(),
  abstractId: uuid("abstract_id").references(() => abstracts.id, { onDelete: 'cascade' }).notNull().unique(),
  paymentProofUrl: text("payment_proof_url"),
  status: iopPaymentStatusEnum("status").default("Pending Payment").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
});

export const abstractCoauthors = pgTable("abstract_coauthors", {
  abstractId: uuid("abstract_id").references(() => abstracts.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
}, (t) => [
  primaryKey({ columns: [t.abstractId, t.userId] })
]);

export const admins = pgTable("admins", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: adminRoleEnum("role").default('Reviewer').notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const abstractAssignments = pgTable("abstract_assignments", {
  abstractId: uuid("abstract_id").references(() => abstracts.id, { onDelete: 'cascade' }).notNull(),
  adminId: uuid("admin_id").references(() => admins.id, { onDelete: 'cascade' }).notNull(),
  assignedAt: timestamp("assigned_at").defaultNow().notNull(),

  scoreClarity: integer("score_clarity"),
  scoreQuality: integer("score_quality"),
  scoreCompleteness: integer("score_completeness"),
  scoreInteresting: integer("score_interesting"),

  isReviewed: boolean("is_reviewed").default(false).notNull(),
}, (t) => [
  primaryKey({ columns: [t.abstractId, t.adminId] })
]);

export const abstractComments = pgTable("abstract_comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  abstractId: uuid("abstract_id").references(() => abstracts.id, { onDelete: 'cascade' }).notNull(),
  adminId: uuid("admin_id").references(() => admins.id).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const abstractReviews = pgTable("abstract_reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  abstractId: uuid("abstract_id").references(() => abstracts.id, { onDelete: 'cascade' }).notNull(),
  adminId: uuid("admin_id").references(() => admins.id).notNull(),
  filePath: text("file_path").notNull(),
  fileName: varchar("file_name", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const eventRegistrations = pgTable("event_registrations", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull().unique(),
  category: registrationCategoryEnum("category").notNull(),
  amount: integer("amount").notNull(),
  paymentProofUrl: text("payment_proof_url"),
  status: paymentStatusEnum("status").default("Pending Payment").notNull(),
  invitationUrl: text("invitation_url"),
  rejectionReason: text("rejection_reason"),
  isIrmsMember: boolean("is_irms_member").default(false).notNull(),
  irmsMemberId: varchar("irms_member_id", { length: 255 }),
  attendingWorkshop: boolean("attending_workshop").default(false).notNull(),
  attendingRockersNight: boolean("attending_rockers_night").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  abstracts: many(abstracts),
  coauthoredAbstracts: many(abstractCoauthors),
  verificationTokens: many(emailVerificationTokens),
  registration: one(eventRegistrations),
}));

export const emailVerificationTokensRelations = relations(emailVerificationTokens, ({ one }) => ({
  user: one(users, {
    fields: [emailVerificationTokens.userId],
    references: [users.id],
  }),
}));

export const abstractsRelations = relations(abstracts, ({ one, many }) => ({
  author: one(users, {
    fields: [abstracts.writerId],
    references: [users.id],
  }),
  coauthors: many(abstractCoauthors),
  comments: many(abstractComments),
  reviews: many(abstractReviews),
  assignments: many(abstractAssignments),
  iopPublication: one(iopPublications, { fields: [abstracts.id], references: [iopPublications.abstractId] })
}));

export const abstractCoauthorsRelations = relations(abstractCoauthors, ({ one }) => ({
  abstract: one(abstracts, {
    fields: [abstractCoauthors.abstractId],
    references: [abstracts.id],
  }),
  user: one(users, {
    fields: [abstractCoauthors.userId],
    references: [users.id],
  }),
}));

export const adminsRelations = relations(admins, ({ many }) => ({
  comments: many(abstractComments),
  reviews: many(abstractReviews),
  assignments: many(abstractAssignments),
}));

export const abstractAssignmentsRelations = relations(abstractAssignments, ({ one }) => ({
  abstract: one(abstracts, {
    fields: [abstractAssignments.abstractId],
    references: [abstracts.id],
  }),
  admin: one(admins, {
    fields: [abstractAssignments.adminId],
    references: [admins.id],
  }),
}));

export const abstractCommentsRelations = relations(abstractComments, ({ one }) => ({
  abstract: one(abstracts, {
    fields: [abstractComments.abstractId],
    references: [abstracts.id],
  }),
  admin: one(admins, {
    fields: [abstractComments.adminId],
    references: [admins.id],
  }),
}));

export const abstractReviewsRelations = relations(abstractReviews, ({ one }) => ({
  abstract: one(abstracts, {
    fields: [abstractReviews.abstractId],
    references: [abstracts.id],
  }),
  admin: one(admins, {
    fields: [abstractReviews.adminId],
    references: [admins.id],
  }),
}));

export const eventRegistrationsRelations = relations(eventRegistrations, ({ one }) => ({
  user: one(users, {
    fields: [eventRegistrations.userId],
    references: [users.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Abstract = typeof abstracts.$inferSelect;
export type NewAbstract = typeof abstracts.$inferInsert;
export type Admin = typeof admins.$inferSelect;
export type NewAdmin = typeof admins.$inferInsert;
export type AbstractAssignment = typeof abstractAssignments.$inferSelect;
export type NewAbstractAssignment = typeof abstractAssignments.$inferInsert;
export type AbstractComment = typeof abstractComments.$inferSelect;
export type NewAbstractComment = typeof abstractComments.$inferInsert;
export type AbstractReview = typeof abstractReviews.$inferSelect;
export type NewAbstractReview = typeof abstractReviews.$inferInsert;
export type EventRegistration = typeof eventRegistrations.$inferSelect;
export type NewEventRegistration = typeof eventRegistrations.$inferInsert;
export type IopPublication = typeof iopPublications.$inferSelect;