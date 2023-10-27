export function findOrThrow<T>(value: T | undefined, message: string = 'Not found'): T {
  if (value === undefined) {
    throw new Error(message);
  }
  return value;
}
