import { useEffect, useRef, useState } from "react"
import { l_Collisions, l_Houses, l_Terrain } from "../data/collisions";

const layersData: { [key: string]: number[][] } = {
    l_Terrain: l_Terrain,
    l_Houses: l_Houses,
    l_Collisions: l_Collisions,
};

const tilesets: any = {
    l_Terrain: { imageUrl: './src/assets/terrain.png', tileSize: 16 },
    l_Houses: { imageUrl: './src/assets/decorations.png', tileSize: 16 },
    l_Collisions: { imageUrl: './src/assets/characters.png', tileSize: 16 },
};

const Space: React.FunctionComponent = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const staticCanvasRef = useRef<HTMLCanvasElement>(null)

    const [player, setPlayer] = useState({
        x: 0,
        y: 0,
        width: 16,
        height: 16,
        speed: 16,
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
        canvasCtx.fillRect(player.x, player.y, player.width, player.height)
    }

    // Move Player on key down event
    const movePlayer = (event: KeyboardEvent) => {
        if (event.code == 'KeyW' || event.code == 'ArrowUp') {
            if (playerRef.current.y > 0) {
                setPlayer((prev) => { return { ...prev, y: prev.y - prev.speed } })
            }
        }
        if (event.code == 'KeyS' || event.code == 'ArrowDown') {
            if ((playerRef.current.y + player.height) < canvasRef.current!.height) {
                setPlayer((prev) => { return { ...prev, y: prev.y + prev.speed } })
            }
        }
        if (event.code == 'KeyA' || event.code == 'ArrowLeft') {
            if (playerRef.current.x > 0) {
                setPlayer((prev) => { return { ...prev, x: prev.x - prev.speed } })
            }
        }
        if (event.code == 'KeyD' || event.code == 'ArrowRight') {
            if ((playerRef.current.x + player.width) < canvasRef.current!.width) {
                setPlayer((prev) => { return { ...prev, x: prev.x + prev.speed } })
            }
        }
    }

    // Load Image from url
    const loadImage = (url: string) => {
        const img = new Image();
        img.src = url;
        return img
    }

    // Render Static Canvas
    const renderStaticCanvas = async () => {
        if (staticCanvasRef.current && canvasRef.current) {
            staticCanvasRef.current.width = canvasRef.current.width;
            staticCanvasRef.current.height = canvasRef.current.height;
            const staticCanvasContext = staticCanvasRef.current.getContext('2d');


            for (const [layerName, tilesData] of Object.entries(layersData)) {
                const tileSetInfo = tilesets[layerName];

                if (tileSetInfo) {
                    const tilesetImage = loadImage(tileSetInfo.imageUrl);
                    console.log(tilesetImage)
                    if (staticCanvasContext) {
                        renderLayer(tilesData, tilesetImage, tileSetInfo.tileSize, staticCanvasContext);
                    } else {
                        console.error("Offscreen context is null");
                    }
                }
            }
        }
    }

    // Render Layer 
    const renderLayer = async (tilesData: number[][], tilesetImage: HTMLImageElement, tileSize: number, context: CanvasRenderingContext2D) => {
        tilesData.forEach((row, y) => {
            row.forEach((item, x) => {
                if (item !== 0) {
                    // context.drawImage(tilesetImage, y * tileSize, x * tileSize)
                    const srcX = ((item - 1) % (tilesetImage.width / tileSize)) * tileSize;
                    const srcY = Math.floor((item - 1) / (tilesetImage.width / tileSize)) * tileSize;
                    context.drawImage(
                        tilesetImage,
                        srcX,
                        srcY,
                        tileSize,
                        tileSize,
                        x * 16,
                        y * 16,
                        16,
                        16,
                    );
                }
            })

        })
    }

    useEffect(() => {
        drawBackground()
        renderStaticCanvas()
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
        <>
            <canvas ref={canvasRef} className="bg-white z-[1] bg-opacity-0" style={{ imageRendering: "pixelated" }}></canvas>
            <canvas ref={staticCanvasRef} className="bg-red-500 absolute z-[0]" style={{ imageRendering: "pixelated" }}></canvas>
        </>
    )
}

export default Space
