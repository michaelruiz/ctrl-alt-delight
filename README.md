# ctrl-alt-delight

## Overview
ctrl-alt-delight is a Next.js web-based application I built that brings retro computing experiences to modern browsers. It's purpose is to serve up my resume in a fun style that showcases my abilites as a software engineer. 

## Demos
- [www.michaelruiz.dev](https://www.michaelruiz.dev) 
- [https://michaelruiz.github.io/ctrl-alt-delight/](https://michaelruiz.github.io/ctrl-alt-delight/)

## Features
- **Terminal Emulator**: A fully functional terminal interface with sound effects.
- **Nibbles Integration**: Play the classic game NIBBLES.
- **Responsive Design**: Built with Next.js for a seamless experience across devices.

## Project Structure
```
next.config.js
package.json
postcss.config.js
README.md
tailwind.config.js
  sounds/
    typing.mp3
src/
  app/
    globals.css
    layout.js
    page.jsx
  components/
    ui/
      Button.jsx
      SnakeGame.jsx
      Terminal.jsx
```

## Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd ctrl-alt-delight-full
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Usage
1. Start the development server:
   ```bash
   npm run dev
   ```
2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## File Details
- **public/sounds/**: Includes sound effects like typing sounds for the terminal.
- **src/components/ui/**: Contains React components for the UI, including the terminal and DOOM player.
- **src/app/**: Application-level files, including global styles and layout.

## Technologies Used
- **Next.js**: Framework for server-side rendering and static site generation.
- **React**: Library for building user interfaces.
- **Tailwind CSS**: Utility-first CSS framework for styling.

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgments
Special thanks to the open-source community for providing the tools and libraries that made this project possible.
