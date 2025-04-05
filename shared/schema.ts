import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  fullName: text("full_name"),
  createdAt: timestamp("created_at").defaultNow(),
  role: text("role").default("user").notNull(),
  balance: doublePrecision("balance").default(0).notNull()
});

export const packages = pgTable("packages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  tier: text("tier").notNull(), // Economy, Premium, Luxury, Supercar
  weeklyReturn: doublePrecision("weekly_return").notNull(),
  minInvestment: integer("min_investment").notNull(),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true),
});

export const investments = pgTable("investments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  packageId: integer("package_id").notNull().references(() => packages.id),
  amount: doublePrecision("amount").notNull(),
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  durationMonths: integer("duration_months").notNull(),
  isActive: boolean("is_active").default(true),
  totalEarned: doublePrecision("total_earned").default(0),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  investmentId: integer("investment_id").references(() => investments.id),
  type: text("type").notNull(), // "deposit", "withdrawal", "return"
  amount: doublePrecision("amount").notNull(),
  date: timestamp("date").defaultNow(),
  status: text("status").default("completed"),
  description: text("description"),
});

// User Insert Schema
export const insertUserSchema = createInsertSchema(users)
  .omit({ id: true, createdAt: true, role: true, balance: true });

// Package Insert Schema
export const insertPackageSchema = createInsertSchema(packages)
  .omit({ id: true, isActive: true });

// Investment Insert Schema
export const insertInvestmentSchema = createInsertSchema(investments)
  .omit({ id: true, startDate: true, isActive: true, totalEarned: true });

// Transaction Insert Schema
export const insertTransactionSchema = createInsertSchema(transactions)
  .omit({ id: true, date: true });

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertPackage = z.infer<typeof insertPackageSchema>;
export type Package = typeof packages.$inferSelect;
export type InsertInvestment = z.infer<typeof insertInvestmentSchema>;
export type Investment = typeof investments.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;
