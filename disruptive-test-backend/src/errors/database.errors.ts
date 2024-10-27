export class UniqueConstraintViolationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'UniqueConstraintViolationError';
    }
}

export class CategoryNotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'CategoryNotFoundError';
    }
}

export class TopicNotFoundException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'TopicNotFoundException';
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