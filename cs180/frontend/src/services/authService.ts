import { findUserByEmail } from "./fakeDatabase";

export const login = async (email: string, password: string) => {

    const user = await findUserByEmail(email);

    if (!user) {
        return null;
    }

    if (user.password !== password) {
        return null;
    }

    return {
        id: user.id,
        email: user.email
    };
};