export default function validatePassword(pattern: RegExp, password: string){
    // /^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/gm
    return pattern.test(password);
}