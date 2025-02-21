export function isValidUsernameOrEmail(input: string) {
    const regex = /^(?:[a-zA-Z0-9._-]{3,20}|\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b)$/;
    // const regex = /^(?:(?!.*[._]{2})[a-zA-Z0-9._]{3,15}|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
    return regex.test(input);
}