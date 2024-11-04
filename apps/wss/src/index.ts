import jwt from 'jsonwebtoken'
import { WebSocketServer } from 'ws'
import dotenv from 'dotenv'
import { spaces, users } from './config/globals'
dotenv.config()

const port = Number(process.env.PORT) || 8080
const wss = new WebSocketServer({ port })

wss.on('connection', (ws) => {
    console.log('Client Connected')

    ws.on('message', (data) => {
        const message = JSON.parse(data.toString())

        // Client sent a join space event
        if (message.type == 'join') {
            const { spaceId, token } = message.payload

            // Verify that client with userId exists
            const { id: userId, role } = jwt.verify(token, process.env.JWT_SECRET!) as { id: string, role: 'Admin' | 'User' }

            if (userId) {
                // Calculate random position
                const userX = 2
                const userY = 3

                // Storing ws/user data
                users.set(ws, { userId, spaceId, x: userX, y: userY })

                // Join space
                if (spaces[spaceId]) {
                    spaces[spaceId].set(userId, ws)
                } else {
                    spaces[spaceId] = new Map()
                    spaces[spaceId].set(userId, ws)
                }

                const allUsersId = Array.from(spaces[spaceId].keys())
                const allUsersWs = Array.from(spaces[spaceId].values())

                // Send successfull space-joined event back to client
                const clientPayload = {
                    "type": "space-joined",
                    "payload": {
                        "spawn": {
                            "x": userX,
                            "y": userY
                        },
                        "users": allUsersId
                    }
                }

                ws.send(JSON.stringify(clientPayload))

                // Broadcast new joinee's position to everyone
                const broadcastPayload = {
                    "type": "user-join",
                    "payload": {
                        userId,
                        "x": userX,
                        "y": userY
                    }
                }

                // Add logic for not broadcasting to self, or is it necessary, can be done on frontend also ???
                allUsersWs.forEach((client) => {
                    client.send(JSON.stringify(broadcastPayload))
                })
            }
        }

        // Client is sending to move event
        if (message.type == 'move') {
            const { x, y } = message.payload;

            const userData = users.get(ws)

            if (userData) {
                const { userId, spaceId, x: oldX, y: oldY } = userData

                // Calculating if the new position is posible or not
                // Add colliding logic
                // Add Boundry Logic
                if ((x == oldX - 1 || oldX + 1 == x || oldX == x) && (y == oldY - 1 || oldY + 1 == y || oldY == y)) {
                    const movementPayload = {
                        "type": "movement",
                        "payload": {
                            x,
                            y,
                            userId
                        }
                    }
                    const allUsersWs = Array.from(spaces[spaceId].values())

                    allUsersWs.forEach((client) => {
                        client.send(JSON.stringify(movementPayload))
                    })
                } else {
                    const movementRejectedPayload = {
                        "type": "movement-rejected",
                        "payload": {
                            x: oldX,
                            y: oldY
                        }
                    }
                    ws.send(JSON.stringify(movementRejectedPayload))
                }
            }



        }
    })

    ws.on('close', () => {
        const userData = users.get(ws)

        if (userData) {
            const { userId, spaceId } = userData

            users.delete(ws)                 //Remove user from users data
            spaces[spaceId].delete(userId)   //Remove user from the space

            const leavePayload = {
                "type": "user-left",
                "payload": {
                    "userId": userId
                }
            }

            // Sending user left event to all the other users in the space
            const allUsersWs = Array.from(spaces[spaceId].values())

            allUsersWs.forEach((client) => {
                client.send(JSON.stringify(leavePayload))
            })
        }
    })

    ws.on('error', () => {
        console.log('Something went wrong')
    })
})