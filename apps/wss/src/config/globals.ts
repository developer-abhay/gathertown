import { WebSocket } from "ws"

interface SPACE_TYPE {
    [spaceId: string]: Map<string, WebSocket>
}
export const spaces: SPACE_TYPE = {}




export const users: Map<WebSocket, { userId: string, spaceId: string, x: number, y: number }> = new Map()