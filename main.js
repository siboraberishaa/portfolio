const commands = {
    help: {
        description: "Show all available commands",
        execute: () => {
            return Object.entries(commands)
                .map(([cmd, info]) => `${cmd}: "${info.description}"`)
                .concat("\nTry 'snake' for a secret game!")
                .join("\n");
        },
    },
    "about-me": {
        description: "Who am I and what do I do",
        execute: () => {
            const asciiArt = `
███████╗██╗██████╗  ██████╗ ██████╗  █████╗ 
██╔════╝██║██╔══██╗██╔═══██╗██╔══██╗██╔══██╗
███████╗██║██████╔╝██║   ██║██████╔╝███████║
╚════██║██║██╔══██╗██║   ██║██╔══██╗██╔══██║
███████║██║██████╔╝╚██████╔╝██║  ██║██║  ██║
╚══════╝╚═╝╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝
            `;

            const description = `Hi, I'm Sibora Berisha ;)
Code wizard by day, bug exterminator by night. My superpowers include wielding the MERN stack (MongoDB, Express, React(js and native), Node) and summoning Django + PostgreSQL to create apps that don’t just work—they wow. My goal? To build digital experiences so smooth they make butter jealous :).
When I’m not busy convincing my code to cooperate, you’ll find me geeking out over new tech or earning extra nerd points at gatherings or hackathons.`;

            return `<pre>${asciiArt}</pre>\n${description}`;
        },
    },
    ls: {
      description: "List all sections",
      execute: () => {
        return "Available sections:\n\n- about-me\n- projects\n- skills\n- contact\n - cv";
      },
    },
    clear: {
      description: "Clear the terminal",
      execute: () => {
        document.getElementById("output").innerHTML = "";
        return "";
      },
    },
    projects: {
      description: "List of my projects",
      execute: () => {
        return "My Projects:\n\n1. Rock, paper, scissors game - https://rock-paper-scissors-game-alpha-green.vercel.app/\n2. Investment calculator- https://investment-calculator-eight.vercel.app/\n3. FlappyMali-Mobile game - https://github.com/siboraberishaa/FlappyMali\n4. Bulls and Cows-Number game - https://lojaenumrave.netlify.app/\n5. Markdown NotesApp - https://markdownnotesapp.netlify.app/\n6. Website for the client: SWISS-Pastrim Kimik & Lavanderi- https://swisspastrimkimik.com/\n7. Website for the client: Granex Sh.P.K- https://www.granex.shop/\n8. Website for the hackathon MerrBio, Tiranë 2025- https://github.com/siboraberishaa/merrbio-frontend";
      },
    },
    skills: {
      description: "View my technical skills",
      execute: () => {
        return "Technical Skills:\n\n- Programming Languages: JavaScript (ES6+), Python, Java.\n- Frameworks: ReactJS, React Native, NodeJS, ExpressJs Django.\n- Databases: MongoDB, PostgreSQL, SQLite.\n- Tools: UI(Ant Design, Bootstrap, Tailwind, MUI), Payment integration(Stripe), Git/GitHub, RESTful APIs.";
      },
    },
    contact: {
      description: "Get my contact information",
      execute: () => {
        return "Contact Information:\n\nEmail: siboraberisha@gmail.com\nGitHub: https://github.com/siboraberishaa\nLinkedIn: https://linkedin.com/in/siboraberisha";
      },
    },
    cv: {
      description: "View my CV",
      execute: () => {
        return "View my CV here: \nhttps://rb.gy/i753z4";
      },
    },
    snake: {
        description: "Start classic Snake game (Easter egg)",
        execute: () => {
          const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

            startSnakeGame();

            if (isMobile) {
                return "Starting Snake game... Swipe to move the snake!";
            } else {
                return "Starting Snake game... Use arrow keys to control!";
            }
        },
    }
  };


// ====================
// STABLE SNAKE GAME IMPLEMENTATION
// ====================
// ====================
// SNAKE GAME IMPLEMENTATION
// ====================
class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = 15; // Size of each grid square
        this.tileCountX = Math.floor(this.canvas.width / this.gridSize); // Tiles in x-direction
        this.tileCountY = Math.floor(this.canvas.height / this.gridSize); // Tiles in y-direction
        this.snake = [{ x: 10, y: 10 }];
        this.dx = 1;
        this.dy = 0;
        this.score = 0;
        this.gameLoop = null;
        this.ended = false;
        this.food = null;

        // Mobile touch controls
        this.touchStartX = 0;
        this.touchStartY = 0;

        // Initial setup
        this.spawnFood();
        this.adjustForMobile();
    }

    adjustForMobile() {
        // Mobile-responsive canvas
        if (window.innerWidth <= 600) {
            this.canvas.width = 300;
            this.canvas.height = 300;
            this.gridSize = 10;
        } else {
            this.canvas.width = 400;
            this.canvas.height = 300;
            this.gridSize = 15;
        }

        // Recalculate tile count after adjustment
        this.tileCountX = Math.floor(this.canvas.width / this.gridSize);
        this.tileCountY = Math.floor(this.canvas.height / this.gridSize);
    }

    drawGame() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw snake
        this.ctx.fillStyle = '#65b587';
        this.snake.forEach(segment => {
            this.ctx.fillRect(
                segment.x * this.gridSize,
                segment.y * this.gridSize,
                this.gridSize - 1,
                this.gridSize - 1
            );
        });

        // console.log("Canvas dimensions:", this.canvas.width, this.canvas.height);

        // Draw food
        if (this.food) {
            this.ctx.fillStyle = '#ff4757';
            this.ctx.fillRect(
                this.food.x * this.gridSize,
                this.food.y * this.gridSize,
                this.gridSize - 1,
                this.gridSize - 1
            );
        }
    }

    moveSnake() {
        if (this.ended) return;

        const head = {
            x: this.snake[0].x + this.dx,
            y: this.snake[0].y + this.dy,
        };

        // Wall collision check
        if (head.x < 0 || head.x >= this.tileCountX || head.y < 0 || head.y >= this.tileCountY) {
            this.gameOver();
            return;
        }

        // Self collision check
        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.gameOver();
            return;
        }

        this.snake.unshift(head);

        // Food collision
        if (this.food && head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.spawnFood();
        } else {
            this.snake.pop();
        }

        this.drawGame();
    }

    spawnFood() {
        const emptyTiles = [];

        // Find all empty tiles
        for (let x = 0; x < this.tileCountX; x++) {
            for (let y = 0; y < this.tileCountY; y++) {
                if (!this.snake.some(segment => segment.x === x && segment.y === y)) {
                    emptyTiles.push({ x, y });
                }
            }
        }

        // If no empty tiles are available, the player wins
        if (emptyTiles.length === 0) {
            this.gameOver(true);
            return;
        }

        // Randomly select an empty tile for the food
        const randomIndex = Math.floor(Math.random() * emptyTiles.length);
        this.food = emptyTiles[randomIndex];

        // console.log("Food position:", this.food);
    }

    // gameOver(isWin = false) {
    //     if (this.ended) return;
    //     this.ended = true;

    //     clearInterval(this.gameLoop);
    //     document.getElementById('snake-game').style.display = 'none';

    //     // Restore terminal input
    //     document.querySelector('.command-line').classList.remove('hidden');
    //     document.getElementById('user-input').focus();

    //     const message = isWin
    //         ? `You Win! Perfect Score: ${this.score}`
    //         : `Game Over! Final Score: ${this.score}`;

    //     const outputDiv = document.createElement('div');
    //     outputDiv.className = 'output';
    //     outputDiv.textContent = message;
    //     output.appendChild(outputDiv);

    //     document.removeEventListener('keydown', gameKeyHandler);
    //     snakeGame = null;
    // }


    handleTouchStart(e) {
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
    }

    handleTouchEnd(e) {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        
        const dx = touchEndX - this.touchStartX;
        const dy = touchEndY - this.touchStartY;
        
        if(Math.abs(dx) > Math.abs(dy)) {
            // Horizontal swipe
            if(dx > 0 && this.dx === 0) {
                this.dx = 1;
                this.dy = 0;
            } else if(dx < 0 && this.dx === 0) {
                this.dx = -1;
                this.dy = 0;
            }
        } else {
            // Vertical swipe
            if(dy > 0 && this.dy === 0) {
                this.dx = 0;
                this.dy = 1;
            } else if(dy < 0 && this.dy === 0) {
                this.dx = 0;
                this.dy = -1;
            }
        }
    }
}

let snakeGame = null;

function startSnakeGame() {
  if (snakeGame) snakeGame.gameOver();

  const gameContainer = document.getElementById('snake-game');
  const terminal = document.getElementById('terminal');
  const body = document.body;

  // Disable interactions for the rest of the page
  terminal.style.pointerEvents = 'none'; // Disable pointer events
  body.style.overflow = 'hidden'; // Disable scrolling

  // Show the Snake game container
  gameContainer.style.display = 'block';

  // Hide terminal input
  document.querySelector('.command-line').classList.add('hidden');
  document.getElementById('user-input').blur();

  snakeGame = new SnakeGame();

  // Mobile event listeners
  gameContainer.addEventListener('touchstart', (e) => {
      e.stopPropagation(); // Prevent event propagation
      snakeGame.handleTouchStart(e);
  }, { passive: true });

  gameContainer.addEventListener('touchend', (e) => {
      e.stopPropagation(); // Prevent event propagation
      snakeGame.handleTouchEnd(e);
  });

  snakeGame.gameLoop = setInterval(() => {
      snakeGame.moveSnake();
  }, 150);

  snakeGame.drawGame();
  document.addEventListener('keydown', gameKeyHandler);
}

SnakeGame.prototype.gameOver = function (isWin = false) {
  if (this.ended) return;
  this.ended = true;

  clearInterval(this.gameLoop);

  const gameContainer = document.getElementById('snake-game');
  const terminal = document.getElementById('terminal');
  const body = document.body;

  // Re-enable interactions for the rest of the page
  terminal.style.pointerEvents = 'auto'; // Enable pointer events
  body.style.overflow = ''; // Re-enable scrolling

  // Hide the Snake game container
  gameContainer.style.display = 'none';

  // Restore terminal input
  document.querySelector('.command-line').classList.remove('hidden');
  document.getElementById('user-input').focus();

  const message = isWin
      ? `You Win! Perfect Score: ${this.score}`
      : `Game Over! Final Score: ${this.score}`;

  const outputDiv = document.createElement('div');
  outputDiv.className = 'output';
  outputDiv.textContent = message;
  output.appendChild(outputDiv);

  document.removeEventListener('keydown', gameKeyHandler);
  snakeGame = null;
};



function gameKeyHandler(e) {
    if (!snakeGame) return;

    switch(e.key) {
        case 'ArrowUp':
            if (snakeGame.dy === 0) {
                snakeGame.dx = 0;
                snakeGame.dy = -1;
            }
            break;
        case 'ArrowDown':
            if (snakeGame.dy === 0) {
                snakeGame.dx = 0;
                snakeGame.dy = 1;
            }
            break;
        case 'ArrowLeft':
            if (snakeGame.dx === 0) {
                snakeGame.dx = -1;
                snakeGame.dy = 0;
            }
            break;
        case 'ArrowRight':
            if (snakeGame.dx === 0) {
                snakeGame.dx = 1;
                snakeGame.dy = 0;
            }
            break;
        case 'Escape':
            snakeGame.gameOver();
            break;
    }
    e.preventDefault();
}



  
  let commandHistory = [];
  let historyIndex = -1;
  const terminal = document.getElementById('terminal');
  const output = document.getElementById('output');
  const input = document.getElementById('user-input');
  
  function processOutputText(text) {
    return text
      .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/(\S+@\S+\.\S+)/g, '<a href="mailto:$1">$1</a>')
      .replace(/\n/g, '<br>');
  }
  
  function displayWelcomeMessages() {
    const welcomeMessages = [
      'Starting the server',
      'You can run several commands',
      'Type \'help\' to see all available commands.'
    ];
  
    let index = 0;
    const intervalId = setInterval(() => {
      const welcomeDiv = document.createElement('div');
      welcomeDiv.className = 'output';
      welcomeDiv.innerHTML = processOutputText(welcomeMessages[index]);
      output.appendChild(welcomeDiv);
      index++;
  
      if (index >= welcomeMessages.length) {
        clearInterval(intervalId);
        document.querySelector('.command-line').classList.remove('hidden');
        input.focus();
      }
      terminal.scrollTop = terminal.scrollHeight;
    }, 1000);
  }
  
  function updateAutocompletePosition() {
    const suggestion = document.getElementById('autocomplete-suggestion');
    const mirror = document.createElement('span');
    
    mirror.style.visibility = 'hidden';
    mirror.style.whiteSpace = 'pre';
    mirror.style.fontFamily = 'monospace';
    mirror.style.fontSize = '16px';
    mirror.textContent = input.value;
    
    document.body.appendChild(mirror);
    suggestion.style.left = `${mirror.offsetWidth}px`;
    document.body.removeChild(mirror);
  }
  
  function autoComplete() {
    const currentInput = input.value.trim().toLowerCase();
    const matches = Object.keys(commands).filter(cmd => cmd.startsWith(currentInput));
    const suggestionEl = document.getElementById('autocomplete-suggestion');
    
    suggestionEl.textContent = '';
    
    if (matches.length > 0 && currentInput.length > 0) {
      const firstMatch = matches[0];
      const remainingChars = firstMatch.slice(currentInput.length);
      suggestionEl.textContent = remainingChars;
      updateAutocompletePosition();
    }
  }
  
  function updateHistory(command) {
    if (command && command !== commandHistory[commandHistory.length - 1]) {
      commandHistory.push(command);
    }
    historyIndex = commandHistory.length;
  }
  
  // Event Listeners
  input.addEventListener('input', () => {
    autoComplete();
    input.selectionStart = input.value.length;
  });
  
  input.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      e.preventDefault();
      const currentInput = input.value.trim().toLowerCase();
      const matches = Object.keys(commands).filter(cmd => cmd.startsWith(currentInput));
      
      if (matches.length > 0) {
        input.value = matches[0];
        document.getElementById('autocomplete-suggestion').textContent = '';
      }
    }
  
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
  
      if (e.key === 'ArrowUp' && historyIndex > 0) historyIndex--;
      if (e.key === 'ArrowDown' && historyIndex < commandHistory.length - 1) historyIndex++;
  
      input.value = commandHistory[historyIndex] || '';
      autoComplete();
    }
  });
  
  input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      const command = input.value.trim().toLowerCase();
      input.value = '';
      historyIndex = commandHistory.length;
  
      if (command) {
        updateHistory(command);
        const outputDiv = document.createElement('div');
        outputDiv.className = 'output';
        outputDiv.textContent = `$ ${command}`;
        output.appendChild(outputDiv);
  
        if (commands[command]) {
          const result = commands[command].execute();
          if (result) {
            const resultDiv = document.createElement('div');
            resultDiv.className = 'output';
            resultDiv.innerHTML = processOutputText(result);
            output.appendChild(resultDiv);
          }
        } else {
          const errorDiv = document.createElement('div');
          errorDiv.className = 'output';
          errorDiv.textContent = `Command not found: ${command}. Type 'help' for available commands.`;
          output.appendChild(errorDiv);
        }
        terminal.scrollTop = terminal.scrollHeight;
      }
    }
  });
  
  document.addEventListener('click', () => input.focus());
  window.onload = displayWelcomeMessages;