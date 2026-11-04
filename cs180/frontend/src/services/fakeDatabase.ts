export type User = {
    id: number;
    email: string;
    password: string;
};

const fakeUsers: User[] = [
    {
        id: 1,
        email: "student1@ucr.edu",
        password: "password123"
    },
    {
        id: 2,
        email: "student2@ucr.edu",
        password: "hello456"
    },
    {
        id: 3,
        email: "student3@ucr.edu",
        password: "test789"
    }
];

export const findUserByEmail = async (
    email: string
): Promise<User | null> => {

    const user = fakeUsers.find(
        user => user.email.toLowerCase() === email.trim().toLowerCase()
    );

    return user ?? null;
};