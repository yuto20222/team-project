// モーダルウィンドウとボタン、閉じるボタンの要素を取得
var modal = document.getElementById("modal"); // ここを修正
var btn = document.querySelector(".instruction");
var span = document.querySelector(".close");

// ボタンをクリックしたときの動作
btn.onclick = function() {
    modal.style.display = "block";
}

// 閉じるボタンをクリックしたときの動作
span.onclick = function() {
    modal.style.display = "none";
}

// モーダルウィンドウの外側をクリックしたときの動作
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d");
const blockPatterns = {
  "0": [
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
  ],

  "1":[
    [0, 0, 0, 0],
    [0, 1, 0, 0],
    [1, 1, 1, 0],
    [0, 0, 0, 0],
  ],

  "2":[
    [0, 0, 0, 0],
    [1, 1, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
  ],

  "3":[
    [0, 0, 0, 0],
    [0, 0, 1, 1],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
  ],

  "4":[
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],

  "5":[
    [0, 0, 0, 0],
    [0, 0, 1, 0],
    [1, 1, 1, 0],
    [0, 0, 0, 0],
  ],

  "6":[
    [0, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 1, 1, 0],
    [0, 0, 0, 0],
  ],
}

const blockColor = {
  "0":"red",
  "1":"blue",
  "2":"yellow",
  "3":"green",
  "4":"aqua",
  "5":"purple",
  "6":"orange",
}
class Asset {
  constructor(x=0,y=0){
    this.type=Math.floor(Math.random() * 7);
    this.x=x
    this.y=y
    //ブロックの移動を判定するときに空のブロックを作る
    if (this.type>=0) {
      this.setType(this.type)
    }
  }

  setType(BlockType){
    this.BlockType=BlockType
    this.BlockColor=Asset.blockColor[BlockType]
  }

}

class Block {
    constructor(x, y, blockType) { //コンストラクタで初期位置は0に//
        this.x = 0;
        this.y = 0;
        this.type=Math.floor(Math.random() * 7);
        this.blockType = blockType; ///ブロックのタイプを識別　blockTypeをblockオブジェクトのプロパティとして保存//
        this.pattern = blockPatterns[blockType]; //ブロックの形状を決定//

        //ブロックの移動を判定するときに空のブロックを作る
        if (this.type>=0) {
          this.setType(this.type)
        }
    }

    setType(BlockType){
      this.BlockType=BlockType
      this.BlockColor=blockColor[BlockType]
    }

//ブロックの移動メソッド//
    move(dx, dy){ //移動量//
        this.x += dx;
        this.y += dy;
    }

//ブロックの回転メソッド//
    rotate() {
        const rotatedPattern = [];
        for (let x = 0; x < this.pattern[0].length; x++) {
         rotatedPattern[x] = [];
         for (let y = 0; y < this.pattern.length; y++) {
           rotatedPattern[x][y] = this.pattern[y][this.pattern.length - 1 - x];
         }
        }
        this.pattern = rotatedPattern;
    }


  isValidMove(dx, dy, rotatedPattern) {  //移動が本当にできるかを確認する//
    const testX = this.x + dx;
    const testY = this.y + dy;
    for (let y = 0; y < rotatedPattern.length; y++) {
      for (let x = 0; x < rotatedPattern[y].length; x++) {
        // 境界外や他のブロックとの衝突をチェック
        if (rotatedPattern[y][x] && (
            // 画面外
            testY + y >= canvas.height ||
            testX + x >= canvas.width ||
            testX + x < 0 ||
            // 他のブロックとの衝突 ここのgameBoardは仮置き
            gameBoard[testY + y][testX + x]
          )) {
          return false;
        }
      }
    }
    return true;
  }

  //ブロックの形に応じて画像をキャンバスに描画する//
  drawBlockPattern(ctx, blockType){
    const pattern = blockPatterns[blockType];
    const cellSize = 24;
    const blockColor=Asset.blockColor[blockType];
    for (let y = 0; y < pattern.length; y++) {
      for (let x = 0; x < pattern[y].length; x++) {
        if (pattern[y][x] === 1) {
          const posX = this.x + x * cellSize;
          const posY = this.y + y * cellSize;
          ctx.fillStyle = blockColor;
          ctx.fillRect(posX, posY, cellSize, cellSize);
          ctx.strokeStyle = 'black';
          ctx.strokeRect(posX, posY, cellSize, cellSize);
        }
      }
    }
  }
}

//ブロックの操作//
document.addEventListener('keydown', function(event){
    switch(event.keyCode){
        case 37: //左矢印//
            if (currentBlock.isValidMove(-1, 0, currentBlock.pattern)) {
                currentBlock.move(-1, 0);
            }
            break;
        case 39: //右矢印//
            if (currentBlock.isValidMove(1, 0, currentBlock.pattern)) {
                currentBlock.move(1, 0);
            }
            break;
        case 40: //下矢印//
            if (currentBlock.isValidMove(0, 1, currentBlock.pattern)) {
                currentBlock.move(0, 1);
            }
            break;
        case 38: //上矢印//
            // 既存の回転ロジックの呼び出しや回転後のパターンの取得方法などを適切に調整する必要
            currentBlock.rotate();
            break;
    }
});



// ブロックが上枠を超えたかどうかをチェックする関数
function isBlockOutOfBound() {
  // ... 上枠を超えたブロックをチェックするロジック
}

// ゲームループ
function gameLoop() {
  if (isPaused || isGameOver) return;  // ゲームが一時停止またはゲームオーバーの場合、早期に戻ります

  if (isBlockOutOfBound()) {
    isGameOver = true;  // ゲームを終了させます
    showModalWithScore();  // スコアを表示するモーダルを表示します
    return;
  }

  // ... ゲームループの残りのロジック
}

let isGameOver = false;

// スコアを表示するモーダルを表示する関数
function showModalWithScore() {
  // スコアを計算します
  let score = calculateScore();
  // モーダルのコンテンツを更新します
  document.querySelector('.modal-content').innerHTML = `
    <h2>Game Over</h2>
    <p>Your Score: ${score}</p>
    <button onclick="retry()">Retry</button>
  `;
  // モーダルを表示します
  modal.style.display = "block";
}

// スコアを計算する関数 (仮定)
function calculateScore() {
  // ... スコア計算ロジック
}

// リトライするための関数
function retry() {
  // ゲームの状態をリセットします
  resetGame();
  // モーダルを非表示にします
  modal.style.display = "none";
  // ゲームを再開します
  isGameOver = false;
  isPaused = false;
}

// ゲームをリセットする関数 (仮定)
function resetGame() {
  // ... ゲームリセットロジック
}
}

=======
    // ... 上枠を超えたブロックをチェックするロジック
  }

  // ゲームループ
  function gameLoop() {
    if (isPaused || isGameOver) return;  // ゲームが一時停止またはゲームオーバーの場合、早期に戻ります

    if (isBlockOutOfBound()) {
      isGameOver = true;  // ゲームを終了させます
      showModalWithScore();  // スコアを表示するモーダルを表示します
      return;
    }

    // ... ゲームループの残りのロジック
  }

  let isGameOver = false;

  // スコアを表示するモーダルを表示する関数
  function showModalWithScore() {
    // スコアを計算します
    let score = calculateScore();
    // モーダルのコンテンツを更新します
    document.querySelector('.modal-content').innerHTML = `
      <h2>Game Over</h2>
      <p>Your Score: ${score}</p>
      <button onclick="retry()">Retry</button>
    `;
    // モーダルを表示します
    modal.style.display = "block";
  }

  // スコアを計算する関数 (仮定)
  function calculateScore() {
    // ... スコア計算ロジック
  }

  // リトライするための関数
  function retry() {
    // ゲームの状態をリセットします
    resetGame();
    // モーダルを非表示にします
    modal.style.display = "none";
    // ゲームを再開します
    isGameOver = false;
    isPaused = false;
  }

  // ゲームをリセットする関数 (仮定)
  function resetGame() {
    // ... ゲームリセットロジック
  }
