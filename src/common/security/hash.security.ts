import bcrypt from "bcrypt";
import argon2 from "argon2";


interface HashOptions {
    plaintext: string;
    rounds?: number;
    minor?: "a" | "b" | undefined;
    approach?: "bcrypt" | "argon2";
}

export const hash = async ({
    plaintext,
    rounds = 12,
    minor = "b",
    approach = "bcrypt"
}: HashOptions): Promise<string> => {
    let cipherText = "";

    switch (approach) {
        case "bcrypt": {
            const salt = await bcrypt.genSalt(rounds, minor);
            cipherText = await bcrypt.hash(plaintext, salt);
            break;
        }
        case "argon2": {
            cipherText = await argon2.hash(plaintext);
            break;
        }
        default: {
            break;
        }
    }

    return cipherText;
}

export const compare = async (
    plaintext: string, 
    cipherText: string, 
    approach: "bcrypt" | "argon2" = "bcrypt"
): Promise<boolean> => {
    let match = false;

    switch (approach) {
        case "bcrypt": {
            match = await bcrypt.compare(plaintext, cipherText);
            break;
        }
        case "argon2": {
            match = await argon2.verify(cipherText, plaintext);
            break;
        }
        default: {
            break;
        }
    }

    return match;
}