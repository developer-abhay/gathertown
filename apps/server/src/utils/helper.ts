import prisma from "../db/prisma"

export const findUserByUsername = async (username: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                username
            },
            select: {
                id: true,
                password: true,
                role: true
            }
        })
        return user
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message)
        } else {
            throw new Error("Something went wrong while finding user by username")
        }
    }
}