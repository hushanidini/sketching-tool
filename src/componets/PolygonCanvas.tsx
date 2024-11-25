import React, { useState, useEffect, useRef } from "react";

const buttonStyle = {
    marginBottom: '10px',
    padding: '10px 15px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#007BFF',
    color: 'white',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    width: '100%',
};

function PolygonCanvas() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
    const [scale, setScale] = useState<number>(1);
    const [area, setArea] = useState<number>(0);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [draggedPointIndex, setDraggedPointIndex] = useState<number | null>(null);


    function handleClick(e: React.MouseEvent<HTMLCanvasElement>) {
        if (isDragging) return;
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
            const x = e.clientX - rect?.left;
            const y = e.clientY - rect?.top;
            setPoints([...points, { x, y }]);
        }
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
                drawPolygon(ctx);
            }
        }
    }, [points])
    console.log('points--', points)
    console.log('isDragging--', isDragging)

    function drawPolygon(ctx: CanvasRenderingContext2D) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        ctx.beginPath();
        if (points.length > 0) {
            ctx.moveTo(points[0].x, points[0].y);
            points.forEach(point => {
                ctx.lineTo(point.x, point.y)
                // Draw red point at each vertex
                ctx.fillStyle = 'black';
                ctx.stroke();
                ctx.fillStyle = 'red';
                ctx.beginPath();
                ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
                ctx.fill(); // Fill the circle
                ctx.closePath();
            });
            ctx.closePath();
            ctx.stroke();
            const calculatedArea = calculateArea(points);
            setArea(calculatedArea);
            drawDimensions(ctx, points);
        }
    }
    //uses the Shoelace formula to calculate the area of the polygon
    function calculateArea(points: { x: number; y: number }[]) {
        let area = 0;
        const n = points.length;
        for (let i = 0; i < n; i++) {
            const j = (i + 1) % n;
            area += points[i].x * points[j].y;
            area -= points[j].x * points[i].y;
        }
        return Math.abs(area / 2);
    }

    function drawDimensions(ctx: CanvasRenderingContext2D, points: { x: number; y: number }[]) {
        const n = points.length;
        ctx.fillStyle = 'black';
        for (let i = 0; i < n; i++) {
            const j = (i + 1) % n;
            const midX = (points[i].x + points[j].x) / 2;
            const midY = (points[i].y + points[j].y) / 2;
            const length = Math.sqrt(Math.pow(points[j].x - points[i].x, 2) + Math.pow(points[j].y - points[i].y, 2));
            ctx.fillText(`${(length * scale).toFixed(2)} units`, midX, midY);
        }
    }

    function saveSketch() {
        const data = JSON.stringify(points);
        localStorage.setItem('polygonSketch', data);
        alert('Sketch saved!');
    }

    function loadSketch() {
        const data = localStorage.getItem('polygonSketch');
        if (data) {
            setPoints(JSON.parse(data));
        } else {
            alert('No saved sketch found!');
        }
    }

    function deleteLastPoint() {
        setPoints(points.slice(0, -1));
    }

    function clearCanvas() {
        setPoints([]);
        setArea(0);
    }
    // Double-click to set dragging state
    function handlePointClick(e: React.MouseEvent<HTMLCanvasElement>) {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const tolerance = 5;
            const pointIndex = points.findIndex(point =>
                Math.abs(point.x - x) < tolerance && Math.abs(point.y - y) < tolerance
            );
            if (pointIndex !== -1) {
                setIsDragging(true);
                setDraggedPointIndex(pointIndex);
            } else {
                setIsDragging(false);
                setDraggedPointIndex(null);
            }
        }
    }
    function handleMouseUp() {
        setIsDragging(false);
        setDraggedPointIndex(null);
    }
    function handleMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
        handlePointClick(e);
    }
    function downloadAsJSON() {
        const dataStr = JSON.stringify(points);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'polygon.json';
        a.click();
        URL.revokeObjectURL(url);
    }
    function downloadAsImage() {
        const canvas = canvasRef.current;
        if (canvas) {
            const image = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = image;
            a.download = 'polygon.png';
            a.click();
        }
    }
    //handle dragging of points
    function handleDragMove(e: React.MouseEvent<HTMLCanvasElement>) {
        if (isDragging && draggedPointIndex !== null) {
            const rect = canvasRef.current?.getBoundingClientRect();
            if (rect) {
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const updatedPoints = [...points];
                updatedPoints[draggedPointIndex] = { x, y };
                setPoints(updatedPoints);
            }
        }
    }
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '20px' }}>
            <div style={{ flex: 1, marginRight: '20px' }}>
                <div style={{ marginTop: '10px', fontWeight: 'bold' }}>Area: {area.toFixed(2)} square units</div>
                <canvas
                    ref={canvasRef}
                    width={800}
                    height={600}
                    onClick={handleClick}
                    onDoubleClick={handlePointClick}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleDragMove}
                    style={{ border: '1px solid black', borderRadius: '5px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)' }}
                />

            </div>
            <div style={{ flex: 0.3, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <input
                    type="number"
                    value={scale}
                    onChange={(e) => setScale(Number(e.target.value))}
                    placeholder="Enter scale (e.g., 1:10)"
                    style={{ marginBottom: '10px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
                />
                <button onClick={saveSketch} style={buttonStyle}>Save Sketch</button>
                <button onClick={loadSketch} style={buttonStyle}>Load Sketch</button>
                <button onClick={clearCanvas} style={buttonStyle}>Clear Canvas</button>
                <button onClick={deleteLastPoint} style={buttonStyle}>Delete Last Point</button>
                <button onClick={downloadAsJSON} style={buttonStyle}>Download as JSON</button>
                <button onClick={downloadAsImage} style={buttonStyle}>Download as Image</button>
            </div>
        </div>
    )
}

export default PolygonCanvas;