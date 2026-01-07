# Turn Glass ⏳

A medieval fantasy-themed turn timer for the Nimble TTRPG system.


## 🎲 Features

- **x-second action timer** with animated hourglass (easily adjustable)
- **4 action types**: Attack, Spell, Move, Assess
- **3 assessment options**: Ask a Question, Create an Opening, Anticipate Danger
- **Action tracking**: Visual slots show your selected actions in order
- **Turn summary**: Review your complete turn 
- **Timeout handling**: Automatic "Anticipate Danger" if no actions selected
- **Mobile-friendly**: Fully responsive touch interface
- **Medieval D&D aesthetic**: Heavy borders, ornate styling, fantasy typography

## 🚀 Live Demo

[Play Turn Glass](https://jonnyH2O.github.io/turn-glass)

## 💻 Local Development
```bash
# Clone the repository
git clone https://github.com/jonnyH2O/turn-glass.git
cd turn-glass

# Install dependencies
npm install

# Start development server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## 🎨 Customization

To change the timer duration, edit the `TIMER_DURATION` constant at the top of `src/App.js`:
```javascript
const TIMER_DURATION = 20; // Change to any number of seconds
```

## 🛠️ Built With

- React
- Lucide React (icons)
- CSS3 (medieval fantasy styling)

## 📦 Deployment

Deploy to GitHub Pages:
```bash
npm run deploy
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🎮 About Nimble TTRPG

Turn Glass is designed for use with the Nimble tabletop RPG system. Learn more about Nimble at [https://nimblerpg.com/](https://nimblerpg.com/).

