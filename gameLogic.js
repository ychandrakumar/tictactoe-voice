import { animateGrid } from './animations.js';


export function createTicTacToeGrid(grid) {
   
    let Aray = [true, true, true, true, true, true, true, true, true];
   
  
    grid.style.display = "grid";

    // Create big cells
    for (let i = 0; i < 9; i++) {
        const bigcel = document.createElement("div");
        bigcel.classList.add("bigcell");
        bigcel.id = "";
        bigcel.textContent = "";
        grid.appendChild(bigcel);
    }

    let cels = document.getElementsByClassName("bigcell");
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const smallcel = document.createElement("div");
            smallcel.id = 9 * i + j;
            smallcel.classList.add("smallcell");
            smallcel.textContent = "";
            cels[i].appendChild(smallcel);
        }
    }
}

export function chooseBigCell(sbnum, Aray,document) {
    // console.log("chooseBigCell is running with ", sbnum);
    const sbd = document.querySelectorAll(".bigcell");
    for (let i = 0; i < 9; i++) {
        sbd[i].classList.remove("disable-click");
    }

    if (sbd[sbnum].id !== "") {
        Aray.fill(true); // Resetting Aray
        return;
    } else {
        Aray.fill(false);
        for (let i = 0; i < 9; i++) {
            if (sbd[i].id !== "" || i === sbnum) {
                Aray[i] = true;
            }
        }
    }

    for (let i = 0; i < 9; i++) {
        if (!Aray[i]) {
            sbd[i].classList.add("disable-click");
        }
    }
}

export function checkSmallGameOver(isGameOver,bbnum,Aray, document) {
  
    const sbd = document.querySelectorAll(".bigcell");
    const cels = sbd[bbnum].querySelectorAll(".smallcell");
  
    const winningCombinations = [
      [0, 1, 2],[3, 4, 5],[6, 7, 8], 
      [0, 3, 6],[1, 4, 7],[2, 5, 8], 
      [0, 4, 8],[2, 4, 6], 
    ];
  
    for (const combination of winningCombinations) {
      const [a, b, c] = combination;
  
      if (
        (cels[a].textContent === "X" || cels[a].textContent === "O") &&
        cels[a].textContent === cels[b].textContent &&
        cels[a].textContent === cels[c].textContent
      ) {
        // console.log("smallgameover");
        sbd[bbnum].style.display = "flex";
        Aray[bbnum] = false;
        sbd[bbnum].textContent = cels[a].textContent;
        sbd[bbnum].id = cels[a].textContent;
        isGameOver=checkBigGameOver(isGameOver,document);
  
        return isGameOver;
      }
    }
    for (let i = 0; i < 9; i++) {
      if (cels[i].textContent === "") {
        return isGameOver;
      }
    }
    sbd[bbnum].style.display = "flex";
    Aray[bbnum] = false;
    sbd[bbnum].textContent = " ";
    return isGameOver;

}




export function checkBigGameOver(isGameOver,document) {
    const cels = document.querySelectorAll(".bigcell");
    let matter = document.getElementById("text");
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Columns
    [0, 4, 8],
    [2, 4, 6], // Diagonals
  ];

  for (const combination of winningCombinations) {
    const [a, b, c] = combination;

    if (
      (cels[a].id === "X" || cels[a].id === "O") &&
      cels[a].id === cels[b].id &&
      cels[a].id === cels[c].id
    ) {
      // console.log("biggameover");
      isGameOver = true;
      matter.innerHTML = cels[a].id + " Won";

      isGameOver=animateGrid(a, b, c, cels,document,isGameOver);

      return isGameOver;
    }
  }
  // console.log("this is being started ");
  let xcount = 0;
  let ocount = 0;
  for (let i = 0; i < 9; i++) {
    if (cels[i].id === "") {
      return isGameOver;
    }
    if (cels[i].id === "X") {
      xcount++;
    }
    if (cels[i].id === "O") {
      ocount++;
    }
  }
  if (xcount > ocount) {
    isGameOver = true;
    matter.innerHTML = "X Won";
  }
  if (xcount < ocount) {
    isGameOver = true;
    matter.innerHTML = "O Won";
  } else if (xcount === ocount) {
    isGameOver = true;
    matter.innerHTML = " DRAW  ";
  }
  // drawanimate(cels);
  isGameOver=animateGrid(a, b, c, cels,document,isGameOver);

  return isGameOver;
  


}






 


