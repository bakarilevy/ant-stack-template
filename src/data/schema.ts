import {uuid, timestamp, varchar, pgTable, pgEnum} from 'drizzle-orm/pg-core';


// Enums
export const userRoleEnum = pgEnum('user_role', ['user', 'admin']);

// Users
export const users = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    email: varchar('email', {length: 100}).notNull().unique(),
    password: varchar('password', {length: 100}).notNull(),
    role: userRoleEnum('user_role').default('user'),
    createdAt: timestamp('created_at', {withTimezone: true}).defaultNow().notNull(),
});