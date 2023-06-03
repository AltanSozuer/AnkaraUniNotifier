import jsonwebtoken from "jsonwebtoken";
import bcrypt from 'bcrypt';
import { uid } from "rand-token";
const { JWT_TOKEN_SECRET, JWT_ACCESS_TOKEN_EXP } = process.env;

function generateAccessToken(email: string): string {
    return jsonwebtoken.sign( email, JWT_TOKEN_SECRET as string, { expiresIn: JWT_ACCESS_TOKEN_EXP } )
}


async function hashPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, (error, salt) => {
          if(error) reject(error)
          bcrypt.hash(password, salt, (err, hash) => {
            if(err) reject(err)
            resolve(hash)
          })
        })
    })
}

async function isPasswordEqualToItsHashedVersion(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}



export {
    generateAccessToken,
    hashPassword,
    isPasswordEqualToItsHashedVersion
}