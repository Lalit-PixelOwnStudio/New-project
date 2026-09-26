import "server-only";
import { db } from "../db";

/** A transaction in progress. */
export type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

/**
 * What a repository runs its query on: the database, or a transaction that a
 * service has open so several writes succeed or fail together.
 */
export type Executor = typeof db | Tx;

/** Runs `work` in one transaction; repositories called with `tx` join it. */
export const withTransaction = <T>(work: (tx: Tx) => Promise<T>): Promise<T> => db.transaction(work);
