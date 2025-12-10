"use client";

import React, { useEffect, useRef } from "react";

const GRID_BLOCK_SIZE = 50; 
const GRID_HIGHLIGHT_DURATION = 400;
const NEON_COLOR = "#0055ff"; 

export default function InteractiveGridBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const gridBlocksRef = useRef<any[]>([]);
  const rafIdRef = useRef<number | null>(null);
  const mouseRef = useRef<{ x: number | undefined; y: number | undefined }>({
    x: undefined,
    y: undefined,
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const initGrid = () => {
      container.innerHTML = ""; 
      gridBlocksRef.current = []; 

      const width = container.clientWidth;
      const height = container.clientHeight;

      const cols = Math.ceil(width / GRID_BLOCK_SIZE);
      const rows = Math.ceil(height / GRID_BLOCK_SIZE);

      const offsetX = (width - cols * GRID_BLOCK_SIZE) / 2;
      const offsetY = (height - rows * GRID_BLOCK_SIZE) / 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const posX = c * GRID_BLOCK_SIZE + offsetX;
          const posY = r * GRID_BLOCK_SIZE + offsetY;
          
          createBlock(posX, posY, c, r);
        }
      }
    };

    const createBlock = (x: number, y: number, col: number, row: number) => {
      const block = document.createElement("div");
      
      block.style.position = "absolute";
      block.style.width = `${GRID_BLOCK_SIZE}px`;
      block.style.height = `${GRID_BLOCK_SIZE}px`;
      block.style.left = `${x}px`;
      block.style.top = `${y}px`;
      block.style.border = "1px solid rgba(255, 255, 255, 0.03)"; 
      block.style.transition = "background-color 0.2s, border-color 0.2s, box-shadow 0.2s"; 
      block.style.boxSizing = "border-box";
      
      container.appendChild(block);

      gridBlocksRef.current.push({
        element: block,
        x: x + GRID_BLOCK_SIZE / 2,
        y: y + GRID_BLOCK_SIZE / 2,
        gridX: col,
        gridY: row,
        highlightEndTime: 0, 
      });
    };

    const addHighlights = () => {
        const mouseX = mouseRef.current.x;
        const mouseY = mouseRef.current.y;

        if (mouseX === undefined || mouseY === undefined) return;

        let closestBlock = null;
        let minDist = Infinity;

        const radius = GRID_BLOCK_SIZE * 3; 

        for (const block of gridBlocksRef.current) {
            const dx = mouseX - block.x;
            const dy = mouseY - block.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < minDist) {
                minDist = dist;
                closestBlock = block;
            }
        }

        if (!closestBlock || minDist > radius) return;

        const now = Date.now();

        highlightBlock(closestBlock, now + GRID_HIGHLIGHT_DURATION);

        const clusterSize = Math.floor(Math.random() * 1) + 1; 
        let currentBlock = closestBlock;
        let processed = [closestBlock];

        for (let i = 0; i < clusterSize; i++) {
            const neighbors = gridBlocksRef.current.filter(b => {
                if (processed.includes(b)) return false;
                const dx = Math.abs(b.gridX - currentBlock.gridX);
                const dy = Math.abs(b.gridY - currentBlock.gridY);
                return dx <= 1 && dy <= 1;
            });

            if (neighbors.length === 0) break;

            const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
            
            highlightBlock(randomNeighbor, now + GRID_HIGHLIGHT_DURATION + (i * 50));
            
            processed.push(randomNeighbor);
            currentBlock = randomNeighbor;
        }
    };

    const highlightBlock = (block: any, endTime: number) => {
        block.highlightEndTime = endTime;
        block.element.style.borderColor = `${NEON_COLOR}`; 
        block.element.style.backgroundColor = `${NEON_COLOR}1A`; 
        block.element.style.boxShadow = `0 0 15px ${NEON_COLOR}66`; 
        block.element.style.zIndex = "10"; 
    };

    const updateLoop = () => {
        const now = Date.now();

        gridBlocksRef.current.forEach(block => {
            if (block.highlightEndTime > 0 && now > block.highlightEndTime) {
                block.highlightEndTime = 0;
                block.element.style.borderColor = "rgba(255, 255, 255, 0.03)";
                block.element.style.backgroundColor = "transparent";
                block.element.style.boxShadow = "none";
                block.element.style.zIndex = "0";
            }
        });

        rafIdRef.current = requestAnimationFrame(updateLoop);
    };


    const handleMouseMove = (e: MouseEvent) => {
        if (!container) return;
        const rect = container.getBoundingClientRect();
        
        mouseRef.current.x = e.clientX - rect.left;
        mouseRef.current.y = e.clientY - rect.top;

        addHighlights();
    };

    const handleMouseLeave = () => {
        mouseRef.current.x = undefined;
        mouseRef.current.y = undefined;
    };

    const handleResize = () => {
        initGrid();
    };

    initGrid();
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove); 
    
    rafIdRef.current = requestAnimationFrame(updateLoop);

    return () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("mousemove", handleMouseMove);
        if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 -z-10 h-full w-full overflow-hidden bg-black"
    />
  );
}