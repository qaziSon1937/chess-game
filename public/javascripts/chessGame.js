const socket = io();
const chess=new Chess();

const boardElement=document.querySelector('.chessboard');
let draggedPiece=null;
let sourceSquare=null;
let playerRole=null;

const renderBoard=()=>{
    const board=chess.board();
    boardElement.innerHTML="";
    board.forEach((row,rowIdx) => {
        row.forEach((square,squareIdx) => {
const squareElem=document.createElement("div");
squareElem.classList.add("square",(rowIdx+squareIdx)%2===0?"light":"dark");
 squareElem.dataset.row=rowIdx;
        squareElem.dataset.col=squareIdx;

         if (square) {
            const pieceElem=document.createElement("div");
            pieceElem.classList.add("piece",square.color==='w'?'white':'black');
            pieceElem.innerText=getPieceUnicode(square);
            pieceElem.draggable=playerRole===square.color;
            pieceElem.addEventListener('dragstart', ()=>{
                if (pieceElem.draggable) {
                    draggedPiece=pieceElem;
                    sourceSquare={row:rowIdx,col:squareIdx};

                }
            })

            squareElem.appendChild(pieceElem);
        }

        squareElem.addEventListener('dragover', function(e){
            e.preventDefault();
        });

        squareElem.addEventListener('drop', function(e){
            e.preventDefault();
            if (draggedPiece) {
                const targetSource={
                    row:parseInt(squareElem.dataset.row),
                    col:parseInt(squareElem.dataset.col)
                };
                handleMove(sourceSquare,targetSource);
            }
        });

        boardElement.appendChild(squareElem);
        });
    });
};

const handleMove=(source,target)=>{
    const move={
        from:`${String.fromCharCode(97+source.col)}${8-source.row}`,
        to:`${String.fromCharCode(97+target.col)}${8-target.row}`,
        promotion:'q'
    };
    socket.emit("move",move);
};

const getPieceUnicode=(piece)=>{
    const unicodePieces={
        K: "♔",
         Q: "♕",
          R: "♖",
           B: "♗",
           N: "♘",
            P: "♙",
        k: "♚", 
        q: "♛",
         r: "♜",
          b: "♝", 
          n: "♞", 
          p: "♟"};
          return unicodePieces[piece.type] ||"";
    };

socket.on("playerRole", function(role){
    playerRole=role;
    renderBoard();
})

socket.on("spectatorRole",function(){
    playerRole=null;
    renderBoard();
});

socket.on("boardState", function(fen){
    chess.load(fen);
    renderBoard();
});

socket.on("move", function(move){
    chess.move(move);
    renderBoard();
});

renderBoard();