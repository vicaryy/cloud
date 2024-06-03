export class Api {
    static title = 'cloud';
    static token = '7213892988:AAEbGdX8Od8DN868XspWWVf65A63TQ8p0Js';
    static userId = '1935527130';

    static get url() {
        return 'https://api.telegram.org/bot' + this.token;
    }
}
