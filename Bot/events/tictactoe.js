const { Events } = require("discord.js");

// Store active games
const activeGames = new Map();

class TicTacToeGame {
  constructor(player) {
    this.board = [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ];
    this.player = player; // Player is X
    this.bot = "O"; // Bot is O
    this.currentTurn = "X"; // X goes first
  }

  // Make a move
  makeMove(row, col, symbol) {
    if (row < 0 || row > 2 || col < 0 || col > 2) return false;
    if (this.board[row][col] !== null) return false;
    this.board[row][col] = symbol;
    this.currentTurn = this.currentTurn === "X" ? "O" : "X";
    return true;
  }

  // Check for winner
  checkWinner() {
    // Check rows
    for (let i = 0; i < 3; i++) {
      if (
        this.board[i][0] === this.board[i][1] &&
        this.board[i][1] === this.board[i][2] &&
        this.board[i][0] !== null
      ) {
        return this.board[i][0];
      }
    }

    // Check columns
    for (let i = 0; i < 3; i++) {
      if (
        this.board[0][i] === this.board[1][i] &&
        this.board[1][i] === this.board[2][i] &&
        this.board[0][i] !== null
      ) {
        return this.board[0][i];
      }
    }

    // Check diagonals
    if (
      this.board[0][0] === this.board[1][1] &&
      this.board[1][1] === this.board[2][2] &&
      this.board[0][0] !== null
    ) {
      return this.board[0][0];
    }
    if (
      this.board[0][2] === this.board[1][1] &&
      this.board[1][1] === this.board[2][0] &&
      this.board[0][2] !== null
    ) {
      return this.board[0][2];
    }

    // Check for tie
    if (this.board.every((row) => row.every((cell) => cell !== null))) {
      return "tie";
    }

    return null;
  }

  // Bot makes a move
  botMove() {
    // Try to win
    const winMove = this.findBestMove("O");
    if (winMove) return winMove;

    // Try to block player
    const blockMove = this.findBestMove("X");
    if (blockMove) return blockMove;

    // Take center if available
    if (this.board[1][1] === null) return { row: 1, col: 1 };

    // Take random available corner
    const corners = [
      [0, 0],
      [0, 2],
      [2, 0],
      [2, 2],
    ];
    const availableCorners = corners.filter(
      ([r, c]) => this.board[r][c] === null,
    );
    if (availableCorners.length > 0) {
      const [row, col] =
        availableCorners[Math.floor(Math.random() * availableCorners.length)];
      return { row, col };
    }

    // Take random available side
    const sides = [
      [0, 1],
      [1, 0],
      [1, 2],
      [2, 1],
    ];
    const availableSides = sides.filter(([r, c]) => this.board[r][c] === null);
    if (availableSides.length > 0) {
      const [row, col] =
        availableSides[Math.floor(Math.random() * availableSides.length)];
      return { row, col };
    }

    return null;
  }

  // Find winning move
  findBestMove(symbol) {
    // Check rows and columns
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.board[i][j] === null) {
          this.board[i][j] = symbol;
          if (this.checkWinner() === symbol) {
            this.board[i][j] = null;
            return { row: i, col: j };
          }
          this.board[i][j] = null;
        }
      }
    }
    return null;
  }

  // Get board display
  getBoardDisplay() {
    return this.board
      .map((row) => row.map((cell) => cell || "⬜").join(""))
      .join("\n")
      .replace(/X/g, "❌")
      .replace(/O/g, "⭕");
  }
}

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.bot) return;

    if (message.content === "!tictactoe") {
      if (activeGames.has(message.author.id)) {
        message.reply("You already have an active game!");
        return;
      }

      const game = new TicTacToeGame(message.author.id);
      activeGames.set(message.author.id, game);

      const embed = {
        color: 0x0099ff,
        title: "🎮 Tic Tac Toe",
        description:
          "Use numbers 1-9 to make your move!\n" + "1️⃣2️⃣3️⃣\n4️⃣5️⃣6️⃣\n7️⃣8️⃣9️⃣",
        fields: [
          {
            name: "Current Board",
            value: game.getBoardDisplay(),
          },
        ],
      };

      message.channel.send({ embeds: [embed] });
      return;
    }

    // Handle moves
    if (activeGames.has(message.author.id)) {
      const game = activeGames.get(message.author.id);

      if (game.currentTurn !== "X") {
        message.reply("It's not your turn!");
        return;
      }

      const move = parseInt(message.content);
      if (isNaN(move) || move < 1 || move > 9) return;

      // Convert move to row/col
      const row = Math.floor((move - 1) / 3);
      const col = (move - 1) % 3;

      // Make player move
      if (!game.makeMove(row, col, "X")) {
        message.reply("Invalid move! That spot is already taken.");
        return;
      }

      // Check for winner after player move
      let winner = game.checkWinner();
      if (winner) {
        const endEmbed = {
          color: 0x0099ff,
          title: "🎮 Game Over!",
          description:
            winner === "tie"
              ? "It's a tie!"
              : winner === "X"
                ? "You win! 🎉"
                : "Bot wins! 🤖",
          fields: [
            {
              name: "Final Board",
              value: game.getBoardDisplay(),
            },
          ],
        };
        message.channel.send({ embeds: [endEmbed] });
        activeGames.delete(message.author.id);
        return;
      }

      // Bot move
      const botMove = game.botMove();
      if (botMove) {
        game.makeMove(botMove.row, botMove.col, "O");
      }

      // Check for winner after bot move
      winner = game.checkWinner();
      const embed = {
        color: 0x0099ff,
        title: winner ? "🎮 Game Over!" : "🎮 Tic Tac Toe",
        description: winner
          ? winner === "tie"
            ? "It's a tie!"
            : winner === "X"
              ? "You win! 🎉"
              : "Bot wins! 🤖"
          : "Your turn! Use numbers 1-9 to make your move.",
        fields: [
          {
            name: "Current Board",
            value: game.getBoardDisplay(),
          },
        ],
      };

      message.channel.send({ embeds: [embed] });

      if (winner) {
        activeGames.delete(message.author.id);
      }
    }
  },
};
