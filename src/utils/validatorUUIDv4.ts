import {ValidationError} from './validationError';

export function validateUUIDv4(uuid: string): string {
    const uuidv4Pattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
    if (!uuidv4Pattern.test(uuid)) {
        throw new ValidationError('Invalid UUIDv4 format');
    }
    return uuid;
}