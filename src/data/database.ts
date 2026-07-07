import * as schema from './schema';
import {PGlite} from '@electric-sql/pglite';
import {drizzle} from 'drizzle-orm/pglite';
import {eq} from 'drizzle-orm';


const client = new PGlite();

export const db = drizzle({ client });

export const initDB = async () => {
    await client.exec(`
        CREATE TYPE user_role AS ENUM ('user', 'admin');

        CREATE TABLE IF NOT EXISTS users (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            email VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(100) NOT NULL,
            user_role user_role default 'user' NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
        );
    `)
    console.log('[PGLite] In-memory database schema generated suceessfully.');
}

export const createUser = async (email: string, password: string, role: 'user' | 'admin' = 'user') => {
    const [user] = await db.insert(schema.users).values({email, password, role}).returning();
    return user;
}

export const getUserByEmail = async (email: string) => {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.email, email));
    return user;
}