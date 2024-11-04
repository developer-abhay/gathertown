import prisma from "../db/prisma"

export const findUserByUsername = async (username: string) => {
    const user = await prisma.user.findUnique({
        where: {
            username
        },
        select: {
            id: true,
            password: true
        }
    })
    return user
}