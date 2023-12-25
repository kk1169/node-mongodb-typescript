import crypto from 'crypto'
import bcrypt from 'bcryptjs';

export const WDAUTH_SESSION_API = 'WDAUTH-SESSION-API';
export const random = () => bcrypt.genSaltSync(10);
export const authentication = (salt: string, password: string) => {
    return bcrypt.hashSync(password, salt)
}


// export const random = () => crypto.randomBytes(128).toString('base64');
// export const authentication = (salt: string, password: string) => {
//     return crypto.createHmac('sha256', [salt, password].join('/')).update(SECRET).digest();
// }


