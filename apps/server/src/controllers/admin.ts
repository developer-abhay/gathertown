import { Request, Response } from "express"
import prisma from "../db/prisma";

export const createElement = async (req: Request, res: Response) => {
    const { imageUrl, width, height, static: staticBool } = req.body;

    try {
        const element = await prisma.element.create({
            data: {
                imageUrl,
                height,
                width,
                static: staticBool
            }, select: {
                id: true
            }
        })

        res.status(200).json({ id: element.id })
    } catch (error) {
        console.log(error)
        res.status(500).json({ "error": "Internal Server Error" })
    }
}

export const updateElementById = async (req: Request, res: Response) => {
    const elementId = req.query.elementId as string;
    const { imageUrl } = req.body;

    try {
        if (!elementId) {
            res.status(404).json({ "error": "Element not found" })
            return;
        }

        await prisma.element.update({
            where: {
                id: elementId
            },
            data: {
                imageUrl
            }
        })

        res.status(200).json({ "message": "Element Created Successfully" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ "error": "Internal Server Error" })
    }

}

export const createAvatar = async (req: Request, res: Response) => {
    const { imageUrl, name } = req.body;
    try {
        const avatar = await prisma.avatar.create({
            data: {
                imageUrl,
                name
            }, select: {
                id: true
            }
        })

        res.status(200).json({ avatarId: avatar.id })
    } catch (error) {
        console.log(error)
        res.status(500).json({ "error": "Internal Server Error" })
    }
}

export const createMap = async (req: Request, res: Response) => {
    const { thumbnail, height, width, name, defaultElements } = req.body;

    try {
        const map = await prisma.map.create({
            data: {
                thumbnail,
                name,
                height,
                width
            },
            select: {
                id: true
            }
        })

        const elementsArray = defaultElements.map((item: {
            elementId: string,
            x: number,
            y: number
        }) => { return { ...item, mapId: map.id } })


        await prisma.mapElements.createMany({
            data: elementsArray,
            skipDuplicates: true
        })


        res.status(200).json({ id: map.id })
    } catch (error) {
        console.log(error)
        res.status(500).json({ "error": "Internal Server Error" })
    }
}
