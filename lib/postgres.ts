import { Client, Pool } from 'pg';

// Using the Client connection
export const createPostgresClient = () => {
    const client = new Client({
        connectionString: process.env.DATABASE_URL || "",
    });

    return client;
};
export const createPostgresClientRfid = () => {
    const client = new Client({
        connectionString: process.env.RFID_DATABASE_URL || "",
    });

    return client;
};

// Using the Pool connection
export const poolForPortal = new Pool({
    connectionString: process.env.DATABASE_URL || "",
    max: 20,
    idleTimeoutMillis:30000,
});
export const poolForRFID = new Pool({
    connectionString: process.env.RFID_DATABASE_URL || "",
    max: 20,
    idleTimeoutMillis:30000,
});
