export class UniqueConstraintViolationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'UniqueConstraintViolationError';
    }
}

export class UserNotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'UserNotFoundError';
    }
}

export class DatabaseError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'DatabaseError';
    }
}