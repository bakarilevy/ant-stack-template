import { useState, useEffect, useRef } from "react";
import { initDB, createUser } from "../data/database";


export const useDatabase = () => {
    const [dbReady, setDbReady] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const isInitializing = useRef(false);

    useEffect(() => {
        if(isInitializing.current || dbReady) return;
        isInitializing.current = true;

        const setupDatabase = async () => {
            try {
                await initDB();

                try {
                    const defaultAdmin = await createUser('admin@mail.com', 'admin', 'admin');
                    console.log('Created admin user: ', defaultAdmin);
                } catch(seedError) {
                    console.log('Admin user already exists, seeding skipped: ', seedError);
                }
                
                setDbReady(true);
            } catch(err) {
                console.error('Failed to initalize database: ', err);
                setError(err instanceof Error ? err: new Error('Unknown DB Error'));
            } finally {
                isInitializing.current = false;
            }
        };
        setupDatabase();
    }, [dbReady]);

    return {dbReady, error};
};
