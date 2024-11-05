import { WebSocket } from "ws"
export interface SPACE_TYPE {
    [spaceId: string]: Map<string, WebSocket>
}

export type UserType = Map<WebSocket, { userId: string, spaceId: string, x: number, y: number }>

