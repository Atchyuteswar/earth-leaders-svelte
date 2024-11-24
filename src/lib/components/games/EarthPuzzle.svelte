<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let pieces: PuzzlePiece[] = [];
  let selectedPiece: PuzzlePiece | null = null;
  let isDragging = false;
  let isComplete = false;
  let difficulty = 3; // 3x3 grid by default
  let isLoading = true;

  interface PuzzlePiece {
    x: number;
    y: number;
    width: number;
    height: number;
    correctX: number;
    correctY: number;
    imageX: number;
    imageY: number;
    isPlaced: boolean;
  }

  let image: HTMLImageElement;

  // Function to create a simple Earth-like gradient
  function createEarthImage(size: number): string {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = size;
    tempCanvas.height = size;
    const tempCtx = tempCanvas.getContext('2d')!;

    // Create gradient for ocean
    const oceanGradient = tempCtx.createRadialGradient(
      size/2, size/2, 0,
      size/2, size/2, size/2
    );
    oceanGradient.addColorStop(0, '#1e40af'); // Deep blue
    oceanGradient.addColorStop(1, '#3b82f6'); // Lighter blue

    // Draw ocean background
    tempCtx.fillStyle = oceanGradient;
    tempCtx.fillRect(0, 0, size, size);

    // Add some "continents"
    tempCtx.fillStyle = '#22c55e'; // Green for land
    
    // Draw random continent-like shapes
    for (let i = 0; i < 5; i++) {
      tempCtx.beginPath();
      const x = Math.random() * size;
      const y = Math.random() * size;
      tempCtx.moveTo(x, y);
      
      // Create irregular shape
      for (let j = 0; j < 5; j++) {
        const cpx = x + (Math.random() - 0.5) * size * 0.4;
        const cpy = y + (Math.random() - 0.5) * size * 0.4;
        const px = x + (Math.random() - 0.5) * size * 0.4;
        const py = y + (Math.random() - 0.5) * size * 0.4;
        tempCtx.quadraticCurveTo(cpx, cpy, px, py);
      }
      
      tempCtx.closePath();
      tempCtx.fill();
    }

    // Add some "clouds"
    tempCtx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    for (let i = 0; i < 8; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const radius = Math.random() * size * 0.1 + size * 0.05;
      tempCtx.beginPath();
      tempCtx.arc(x, y, radius, 0, Math.PI * 2);
      tempCtx.fill();
    }

    return tempCanvas.toDataURL();
  }
  
  onMount(() => {
    setupGame();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  function setupGame() {
    const size = Math.min(window.innerWidth - 40, 600);
    image = new Image();
    image.src = createEarthImage(size);
    image.onload = () => {
      initializePuzzle();
      isLoading = false;
    };

    // Handle mouse events
    canvas.addEventListener('mousedown', startDragging);
    canvas.addEventListener('mousemove', drag);
    canvas.addEventListener('mouseup', stopDragging);
    canvas.addEventListener('mouseleave', stopDragging);
    
    // Handle touch events
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
  }

  function handleResize() {
    if (!isLoading) {
      setupGame();
    }
  }

  function initializePuzzle() {
    const size = Math.min(window.innerWidth - 40, 600);
    canvas.width = size;
    canvas.height = size;
    ctx = canvas.getContext('2d')!;

    const pieceWidth = canvas.width / difficulty;
    const pieceHeight = canvas.height / difficulty;

    // Create puzzle pieces
    pieces = [];
    for (let i = 0; i < difficulty; i++) {
      for (let j = 0; j < difficulty; j++) {
        pieces.push({
          x: Math.random() * (canvas.width - pieceWidth),
          y: Math.random() * (canvas.height - pieceHeight),
          width: pieceWidth,
          height: pieceHeight,
          correctX: j * pieceWidth,
          correctY: i * pieceHeight,
          imageX: j * (image.width / difficulty),
          imageY: i * (image.height / difficulty),
          isPlaced: false
        });
      }
    }

    drawPuzzle();
  }

  function drawPuzzle() {
    if (!ctx || !canvas) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background grid
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    for (let i = 1; i < difficulty; i++) {
      const pos = (canvas.width / difficulty) * i;
      ctx.beginPath();
      ctx.moveTo(pos, 0);
      ctx.lineTo(pos, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, pos);
      ctx.lineTo(canvas.width, pos);
      ctx.stroke();
    }

    // Draw pieces
    pieces.forEach(piece => {
      ctx.save();
      ctx.beginPath();
      ctx.rect(piece.x, piece.y, piece.width, piece.height);
      ctx.clip();
      
      ctx.drawImage(
        image,
        piece.imageX,
        piece.imageY,
        image.width / difficulty,
        image.height / difficulty,
        piece.x,
        piece.y,
        piece.width,
        piece.height
      );

      // Add a subtle shadow to unplaced pieces
      if (!piece.isPlaced) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 2;
        ctx.strokeRect(piece.x, piece.y, piece.width, piece.height);
        
        // Add inner shadow
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.lineWidth = 1;
        ctx.strokeRect(piece.x + 1, piece.y + 1, piece.width - 2, piece.height - 2);
      }
      
      ctx.restore();
    });

    // Draw selected piece on top
    if (selectedPiece) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(selectedPiece.x, selectedPiece.y, selectedPiece.width, selectedPiece.height);
      ctx.clip();
      
      ctx.drawImage(
        image,
        selectedPiece.imageX,
        selectedPiece.imageY,
        image.width / difficulty,
        image.height / difficulty,
        selectedPiece.x,
        selectedPiece.y,
        selectedPiece.width,
        selectedPiece.height
      );

      // Add highlight effect to selected piece
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.lineWidth = 3;
      ctx.strokeRect(selectedPiece.x, selectedPiece.y, selectedPiece.width, selectedPiece.height);
      
      ctx.restore();
    }
  }

  function startDragging(e: MouseEvent) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Find clicked piece (search in reverse to get top piece first)
    for (let i = pieces.length - 1; i >= 0; i--) {
      const piece = pieces[i];
      if (!piece.isPlaced &&
          x >= piece.x && x <= piece.x + piece.width &&
          y >= piece.y && y <= piece.y + piece.height) {
        selectedPiece = piece;
        isDragging = true;
        // Move selected piece to end of array so it's drawn on top
        pieces = pieces.filter(p => p !== piece).concat(piece);
        break;
      }
    }
  }

  function drag(e: MouseEvent) {
    if (!isDragging || !selectedPiece) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - selectedPiece.width / 2;
    const y = e.clientY - rect.top - selectedPiece.height / 2;

    // Keep piece within canvas bounds
    selectedPiece.x = Math.max(0, Math.min(canvas.width - selectedPiece.width, x));
    selectedPiece.y = Math.max(0, Math.min(canvas.height - selectedPiece.height, y));

    drawPuzzle();
  }

  function stopDragging() {
    if (!selectedPiece) return;

    // Check if piece is close to its correct position
    const snapDistance = 20;
    if (Math.abs(selectedPiece.x - selectedPiece.correctX) < snapDistance &&
        Math.abs(selectedPiece.y - selectedPiece.correctY) < snapDistance) {
      selectedPiece.x = selectedPiece.correctX;
      selectedPiece.y = selectedPiece.correctY;
      selectedPiece.isPlaced = true;

      // Check if puzzle is complete
      isComplete = pieces.every(piece => piece.isPlaced);
    }

    isDragging = false;
    selectedPiece = null;
    drawPuzzle();
  }

  function handleTouchStart(e: TouchEvent) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    startDragging(mouseEvent);
  }

  function handleTouchMove(e: TouchEvent) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    drag(mouseEvent);
  }

  function handleTouchEnd(e: TouchEvent) {
    e.preventDefault();
    stopDragging();
  }

  function changeDifficulty(newDifficulty: number) {
    difficulty = newDifficulty;
    isComplete = false;
    setupGame();
  }
</script>

<div class="max-w-2xl mx-auto p-4" in:fade>
  <div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Earth Jigsaw Puzzle</h2>
      <div class="flex gap-2 mb-4">
        <button
          class="px-4 py-2 rounded-lg transition-colors"
          class:bg-green-500={difficulty === 3}
          class:bg-gray-200={difficulty !== 3}
          class:text-white={difficulty === 3}
          class:text-gray-700={difficulty !== 3}
          class:dark:bg-gray-700={difficulty !== 3}
          class:dark:text-gray-200={difficulty !== 3}
          on:click={() => changeDifficulty(3)}
        >
          Easy (3x3)
        </button>
        <button
          class="px-4 py-2 rounded-lg transition-colors"
          class:bg-green-500={difficulty === 4}
          class:bg-gray-200={difficulty !== 4}
          class:text-white={difficulty === 4}
          class:text-gray-700={difficulty !== 4}
          class:dark:bg-gray-700={difficulty !== 4}
          class:dark:text-gray-200={difficulty !== 4}
          on:click={() => changeDifficulty(4)}
        >
          Medium (4x4)
        </button>
        <button
          class="px-4 py-2 rounded-lg transition-colors"
          class:bg-green-500={difficulty === 5}
          class:bg-gray-200={difficulty !== 5}
          class:text-white={difficulty === 5}
          class:text-gray-700={difficulty !== 5}
          class:dark:bg-gray-700={difficulty !== 5}
          class:dark:text-gray-200={difficulty !== 5}
          on:click={() => changeDifficulty(5)}
        >
          Hard (5x5)
        </button>
      </div>
    </div>

    <div class="relative">
      {#if isLoading}
        <div class="w-full h-[600px] flex items-center justify-center bg-gray-100 dark:bg-gray-900 rounded-lg">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      {:else}
        <canvas
          bind:this={canvas}
          class="mx-auto border-2 border-gray-200 dark:border-gray-700 rounded-lg touch-none"
        ></canvas>

        {#if isComplete}
          <div
            class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg"
            in:fade
          >
            <div class="text-center text-white p-6">
              <h3 class="text-3xl font-bold mb-4">Congratulations!</h3>
              <p class="mb-4">You completed the puzzle!</p>
              <button
                class="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                on:click={() => changeDifficulty(difficulty)}
              >
                Play Again
              </button>
            </div>
          </div>
        {/if}
      {/if}
    </div>
  </div>
</div>
