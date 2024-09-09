export class Storage {
    private constructor() { }

    static get jwt() {
        return sessionStorage.getItem('Authorization');
    }

    static removeJwt() {
        sessionStorage.removeItem('Authorization');
    }

    static get verifyEmail() {
        return localStorage.getItem('verificationEmail')
    }

    static removeVerifyEmail() {
        localStorage.removeItem('verificationEmail');
    }
}
