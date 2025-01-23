const commands = {
    help: {
      description: "Show all available commands",
      execute: () => {
        return Object.entries(commands)
          .map(([cmd, info]) => `${cmd}: "${info.description}"`)
          .join("\n");
      },
    },
    "about-me": {
      description: "Who am I and what do I do",
      execute: () => {
        return "Hi, I'm Sibora Berisha ;)\ncode wizard by day, bug exterminator by night. My superpowers include wielding the MERN stack (MongoDB, Express, React(js and native), Node) and summoning Django + PostgreSQL to create apps that don’t just work—they wow. My goal? To build digital experiences so smooth they make butter jealous :). When I’m not busy convincing my code to cooperate, you’ll find me geeking out over new tech or earning extra nerd points at gatherings or hackathons. ";
      },
    },
    ls: {
      description: "List all sections",
      execute: () => {
        return "Available sections:\n\n- about-me\n\n- projects\n\n- skills\n\n- contact\n\n - cv";
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
        return "My Projects:\n\n1. Rock, paper, scissors game - https://rock-paper-scissors-game-alpha-green.vercel.app/\n2. Investment calculator- https://investment-calculator-eight.vercel.app/\n3. FlappyMali-Mobile game - https://github.com/siboraberishaa/FlappyMali\n4. Bulls and Cows-Number game - https://lojaenumrave.netlify.app/\n5. Markdown NotesApp - https://markdownnotesapp.netlify.app/";
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
      description: "Download my CV",
      execute: () => {
        return "https://cvlink.com";
      },
    },
  };
  
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
      'Welcome',
      'Starting the server...',
      'You can run several commands:',
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