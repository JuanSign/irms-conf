import { pgTable, uuid, varchar, text, timestamp, pgEnum, primaryKey, integer, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// -----------------------------------------------------------------------------
// ENUMS
// -----------------------------------------------------------------------------
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

// -----------------------------------------------------------------------------
// TABLES
// -----------------------------------------------------------------------------
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
  status: statusEnum("status").default("Under Review").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
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
  type: integer("type").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

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


// -----------------------------------------------------------------------------
// RELATIONS
// -----------------------------------------------------------------------------
export const usersRelations = relations(users, ({ many }) => ({
  abstracts: many(abstracts),
  coauthoredAbstracts: many(abstractCoauthors),
  verificationTokens: many(emailVerificationTokens),
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

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Abstract = typeof abstracts.$inferSelect;
export type NewAbstract = typeof abstracts.$inferInsert;
export type Admin = typeof admins.$inferSelect;
export type NewAdmin = typeof admins.$inferInsert;
export type AbstractComment = typeof abstractComments.$inferSelect;
export type NewAbstractComment = typeof abstractComments.$inferInsert;
export type AbstractReview = typeof abstractReviews.$inferSelect;
export type NewAbstractReview = typeof abstractReviews.$inferInsert;