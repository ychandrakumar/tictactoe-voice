
import { createTicTacToeGrid } from './gameLogic.js';


const ANIMATION_DURATION = 2000; 
const GIF_DISPLAY_DURATION = 3000; 



export function animateGrid(a, b, c, cells,document,isGameOver) {
    const grid = document.querySelector(".grid");
    cells[a].classList.add("winning-cell");
    cells[b].classList.add("winning-cell");
    cells[c].classList.add("winning-cell");

    setTimeout(() => {
        cells.forEach(cell => grid.removeChild(cell));
        isGameOver = false;
        createTicTacToeGrid(grid);
    }, ANIMATION_DURATION);
}




export function showGif(num,document) {

    let adreses=["https://cdn.glitch.global/ffac02f9-918e-4b95-918b-097e09915ea5/1.gif?v=1698943735437","https://cdn.glitch.global/ffac02f9-918e-4b95-918b-097e09915ea5/2.gif?v=1698943841043","https://cdn.glitch.global/ffac02f9-918e-4b95-918b-097e09915ea5/3.gif?v=1698943871919","https://cdn.glitch.global/ffac02f9-918e-4b95-918b-097e09915ea5/4.gif?v=1698943874262"];
     const newImagePath=adreses[num-101];
   
    document.getElementById("gif").setAttribute('src', newImagePath);
    
    const gifContainer = document.getElementById('gif-container');
    gifContainer.style.display = 'block';

    setTimeout(() => {
        gifContainer.style.display = 'none';
    }, GIF_DISPLAY_DURATION);
}




