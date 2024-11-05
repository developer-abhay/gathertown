import { useEffect, useRef, useState } from "react"

const Space: React.FunctionComponent = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [player, setPlayer] = useState({
        x: 0,
        y: 0,
        speed: 5,
        size: 50
    })

    // Ref to keep track of player state without causing re-renders
    const playerRef = useRef(player);
    playerRef.current = player;

    // Draw background 
    const drawBackground = () => {
        if (canvasRef.current) {
            canvasRef.current.width = window.innerWidth * 0.9
            canvasRef.current.height = window.innerHeight * 0.9
        }
    }
    // clear canvas 
    const clearCanvas = (canvasCtx: CanvasRenderingContext2D) => {
        if (canvasRef.current) {
            canvasCtx.clearRect(0, 0, canvasRef.current?.width, canvasRef.current.height)
        }
    }

    // Render Player
    const renderPlayer = (canvasCtx: CanvasRenderingContext2D) => {
        canvasCtx.fillStyle = 'red';
        canvasCtx.fillRect(player.x, player.y, player.size, player.size)
    }

    // Move Player on key down event
    const movePlayer = (event: KeyboardEvent) => {
        if (event.code == 'KeyW' || event.code == 'ArrowUp') {
            if (playerRef.current.y > 0) {
                setPlayer((prev) => { return { ...prev, y: prev.y - prev.speed } })
            }
        }
        if (event.code == 'KeyS' || event.code == 'ArrowDown') {
            if ((playerRef.current.y + player.size) < canvasRef.current!.height) {
                setPlayer((prev) => { return { ...prev, y: prev.y + prev.speed } })
            }
        }
        if (event.code == 'KeyA' || event.code == 'ArrowLeft') {
            if (playerRef.current.x > 0) {
                setPlayer((prev) => { return { ...prev, x: prev.x - prev.speed } })
            }
        }
        if (event.code == 'KeyD' || event.code == 'ArrowRight') {
            if ((playerRef.current.x + player.size) < canvasRef.current!.width) {
                setPlayer((prev) => { return { ...prev, x: prev.x + prev.speed } })
            }
        }
    }

    useEffect(() => {
        drawBackground()
        window.addEventListener('keydown', movePlayer)
    }, [])

    useEffect(() => {
        const canvasCtx = canvasRef.current?.getContext('2d')
        if (canvasCtx) {
            clearCanvas(canvasCtx)
            renderPlayer(canvasCtx)
        }
    }, [player])


    return (
        <canvas ref={canvasRef} className="bg-white" style={{ imageRendering: "pixelated" }}></canvas>
    )
}

export default Space
