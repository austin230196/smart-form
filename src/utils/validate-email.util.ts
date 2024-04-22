export default function validateEmail(email: string): boolean {
    let regex = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g);
    return regex.test(email);
}