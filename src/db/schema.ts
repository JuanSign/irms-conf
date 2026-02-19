import { pgTable, uuid, varchar, text, timestamp, pgEnum, primaryKey } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  affiliation: varchar("affiliation", { length: 255 }),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const topicEnum = pgEnum('topic', [
  'Fundamental Rock Mechanics',
  'Rock Engineering Analysis & Numerical Modeling',
  'Rock Mechanics Applications'
]);

export const abstracts = pgTable("abstracts", {
  id: uuid("id").defaultRandom().primaryKey(),
  writerId: uuid("writer_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  topic: topicEnum("topic").notNull(),
  path: text("path").notNull(),
  status: varchar("status", { length: 50 }).default("Under Review").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const abstractCoauthors = pgTable("abstract_coauthors", {
  abstractId: uuid("abstract_id").references(() => abstracts.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: 'cascade' }).notNull(),
}, (t) => [
  primaryKey({ columns: [t.abstractId, t.userId] })
]);