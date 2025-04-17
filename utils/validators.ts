export function isValidUsernameOrEmail(input: string) {
    const regex = /^(?:[a-zA-Z0-9._-]{3,20}|\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b)$/;
    // const regex = /^(?:(?!.*[._]{2})[a-zA-Z0-9._]{3,15}|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
    return regex.test(input);
}

export function isValidPassword(input: string) {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(input);
}

export function isValidPhoneNumber(input: string) {
    const regex = /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
    return regex.test(input);
}

export function isValidName(input: string) {
    const regex = /^[a-zA-Z]+ [a-zA-Z]+$/;
    return regex.test(input);
}

export function isValidDate(input: string) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(input);
}

export function isValidEmail(input: string) {
    // const regex = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(input);
}