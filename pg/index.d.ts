// Type definitions for pg 6.1
// Project: https://github.com/brianc/node-postgres
// Definitions by: Phips Peter <http://pspeter3.com>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/// <reference types="node" />

import events = require("events");
import stream = require("stream");
import pgTypes = require("pg-types");

export declare function connect(connection: string, callback: (err: Error, client: Client, done: (err?: any) => void) => void): void;
export declare function connect(config: ClientConfig, callback: (err: Error, client: Client, done: (err?: any) => void) => void): void;
export declare function end(): void;

export interface ConnectionConfig {
    user?: string;
    database?: string;
    password?: string;
    port?: number;
    host?: string;
}

export interface Defaults extends ConnectionConfig {
    poolSize?: number;
    poolIdleTimeout?: number;
    reapIntervalMillis?: number;
    binary?: boolean;
    parseInt8?: boolean;
}

export interface ClientConfig extends ConnectionConfig {
    ssl?: boolean;
}

export interface PoolConfig extends ClientConfig {
      // properties from module 'node-pool'
      max?: number;
      min?: number;
      refreshIdle?: boolean;
      idleTimeoutMillis?: number;
      reapIntervalMillis?: number;
      returnToHead?: boolean;
      application_name?: string;
}

export interface QueryConfig {
    name?: string;
    text: string;
    values?: any[];
}

export interface QueryResult {
    command: string;
    rowCount: number;
    oid: number;
    rows: any[];
}

export interface ResultBuilder extends QueryResult {
    addRow(row: any): void;
}

export declare class Pool extends events.EventEmitter {
    // `new Pool('pg://user@localhost/mydb')` is not allowed.
    // But it passes type check because of issue:
    // https://github.com/Microsoft/TypeScript/issues/7485
    constructor(config?: PoolConfig);

    connect(): Promise<Client>;
    connect(callback: (err: Error, client: Client, done: () => void) => void): void;

    end(): Promise<void>;

    query(queryText: string, values?: any[]): Promise<QueryResult>;

    query(queryText: string, callback: (err: Error, result: QueryResult) => void): void;
    query(queryText: string, values: any[], callback: (err: Error, result: QueryResult) => void): void;

    on(event: "error", listener: (err: Error, client: Client) => void): this;
    on(event: "connect" | "acquire", listener: (client: Client) => void): this;
}

export declare class Client extends events.EventEmitter {
    constructor(connection: string);
    constructor(config: ClientConfig);

    connect(callback?: (err: Error) => void): void;
    end(callback?: (err: Error) => void): void;
    release(): void;

    query(queryTextOrConfig: string | QueryConfig): Promise<QueryResult>;
    query(queryText: string, values: any[]): Promise<QueryResult>;

    query(queryTextOrConfig: string | QueryConfig, callback: (err: Error, result: QueryResult) => void): Query;
    query(queryText: string, values: any[], callback: (err: Error, result: QueryResult) => void): Query;

    copyFrom(queryText: string): stream.Writable;
    copyTo(queryText: string): stream.Readable;

    pauseDrain(): void;
    resumeDrain(): void;

    on(event: "drain", listener: () => void): this;
    on(event: "error", listener: (err: Error) => void): this;
    on(event: "notification" | "notice", listener: (message: any) => void): this;
    on(event: "end", listener: () => void): this;
}

export declare class Query extends events.EventEmitter {
    on(event: "row", listener: (row: any, result?: ResultBuilder) => void): this;
    on(event: "error", listener: (err: Error) => void): this;
    on(event: "end", listener: (result: ResultBuilder) => void): this;
}

export declare class Events extends events.EventEmitter {
    on(event: "error", listener: (err: Error, client: Client) => void): this;
}

export const types: typeof pgTypes;

export const defaults: Defaults & ClientConfig;