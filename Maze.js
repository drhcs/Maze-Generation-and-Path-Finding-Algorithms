// ** Possible Additions **
// - Add control of animation time, size of maze, and size of maze cells
// - Add more maze generation and path finding algorithns
// - Add interactive features such as user created walls, and real time path finding
// - Add cleaner UI elements
//
// ** TODO **
// - Build real priority queue to replace sorting algorithm

grid = [];
visited = [];
endPos = 0;
animations = [];

const WALL = 1;
const CORRIDOR = 0;

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

const SQUARE_W = 20;
const SQUARE_H = 20;

const ROWS = Math.floor(HEIGHT / SQUARE_H) - 1;
const COLS = Math.floor(WIDTH / SQUARE_W) - 1;

const TIME_INTERVAL = 5;
const BFS_INTERVAL = 2;
time = 0;

mazeProportions = "background-color:white; width:" + (COLS * SQUARE_W) + "px;";
document.getElementById("maze").setAttribute("style", mazeProportions);

function createGrid() {

    for (let i = 0; i < ROWS; i++)
    {
      for (let j = 0; j < COLS; j++)
      {
        const cell = document.createElement("div");
        const cellID = (i * COLS) + j;

        cell.setAttribute("id", cellID);
        cell.setAttribute("style", "background-color:black; height:20px; width:20px; float:left");

        const mazeGrid = document.getElementById("maze");
        mazeGrid.appendChild(cell);
      }
  }

  generateEmpty();
}

function setEndPos() {
  for (let i = COLS - 2; i >= 1; i--)
  {
    if (grid[ROWS - 2][i] == CORRIDOR)
    {
      endPos = i;
      break;
    }
  }
}

function colorGray(id) {
  const cell = document.getElementById(id);
  cell.setAttribute("style", "background-color:gray; height:20px; width:20px; float:left");
}

function colorCyan(id) {
  const cell = document.getElementById(id);
  cell.setAttribute("style", "background-color:cyan; height:20px; width:20px; float:left");
}

function colorBlue(id) {
  const cell = document.getElementById(id);
  cell.setAttribute("style", "background-color:blue; height:20px; width:20px; float:left");
}

function clearAnimations() {
  for (i in animations)
  {
    clearTimeout(animations[i]);
  }
  animations = [];
}

function inBounds(row, col) {
  return col >= 1 && col < COLS - 1 && row >= 1 && row < ROWS - 1;
}

function queueWall(row, col, walls, visited) {
  if (inBounds(row, col) && !visited[row][col] && grid[row][col] == WALL)
  {
    walls.push([row, col]);
    visited[row][col] = true;
  }
}

function neighborIsVisited(row, col) {
  return inBounds(row, col) && grid[row][col] == CORRIDOR && visited[row][col] == true;
}

function makeCorridor(row, col) {
  let visitedCount = 0;

  if (neighborIsVisited(row, col + 1)) visitedCount++;
  if (neighborIsVisited(row, col - 1)) visitedCount++;
  if (neighborIsVisited(row + 1, col)) visitedCount++;
  if (neighborIsVisited(row - 1, col)) visitedCount++;

  return visitedCount < 2;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function initializeArraysPrims(grid, visited) {

  for (let i = 0; i < ROWS; i++)
  {
    visitedRow = []
    gridRow = []

    for (let j = 0; j < COLS; j++)
    {
      visitedRow.push(false);
      gridRow.push(WALL);
    }

    visited.push(visitedRow);
    grid.push(gridRow);
  }

}

function generatePrims() {

  clearAnimations();

  grid = [];
  visited = [];

  initializeArraysPrims(grid, visited);

  let walls = [];
  grid[1][1] = CORRIDOR;
  visited[1][1] = true;

  queueWall(1, 2, walls, visited);
  queueWall(1, 0, walls, visited);
  queueWall(0, 1, walls, visited);
  queueWall(2, 1, walls, visited);

  while (walls.length != 0)
  {
    let candidate = getRandomInt(walls.length);
    let row = walls[candidate][0];
    let col = walls[candidate][1];

    if (inBounds(row, col) && makeCorridor(row, col))
    {
      grid[row][col] = CORRIDOR

      queueWall(row, col + 1, walls, visited);
      queueWall(row, col - 1, walls, visited);
      queueWall(row + 1, col, walls, visited);
      queueWall(row - 1, col, walls, visited);

    }
    walls.splice(candidate, 1);
  }

  setEndPos();
  drawGrid();
}

function generateEmpty() {

  clearAnimations();

  grid = [];

  let gridRow = []
  for (let i = 0; i < COLS; i++)
  {
    gridRow.push(WALL);
  }
  grid.push(gridRow)

  for (let i = 1; i < ROWS - 1; i++)
  {
    gridRow = [WALL]
    for (let j = 1; j < COLS - 1; j++)
    {
      gridRow.push(CORRIDOR);
    }
    gridRow.push(WALL);

    grid.push(gridRow);
  }

  gridRow = []
  for (let i = 0; i < COLS; i++)
  {
    gridRow.push(WALL);
  }
  grid.push(gridRow)

  setEndPos();
  drawGrid();
}

function drawGrid() {
  for (let i = 0; i < ROWS; i++)
  {
    for (let j = 0; j < COLS; j++)
    {
      const cellID = (i * COLS) + j;
      const cell = document.getElementById(cellID);

      const start = (i == 0 && j == 1);
      const end = (i == ROWS - 1 && j == endPos);

      if (start)
      {
        cell.setAttribute("style", "background-color:green; height:20px; width:20px; float:left");
      }
      else if (end)
      {
        cell.setAttribute("style", "background-color:red; height:20px; width:20px; float:left");
      }
      else if (grid[i][j] == WALL)
      {
        cell.setAttribute("style", "background-color:black; height:20px; width:20px; float:left");
      }
      else
      {
        cell.setAttribute("style", "background-color:white; height:20px; width:20px; float:left");
      }
    }
  }
}

function animateCell(row, col, colorFunction) {
  const cellID = (row * COLS) + col;
  animations.push(window.setTimeout(function(){ colorFunction(cellID) }, time));
}

function dfsHelper(row, col) {

    let isEnd = (row == ROWS - 1 && col == endPos);

    if (isEnd)
    {
      solved = true;
    }

    if (grid[row][col] == WALL || solved || visited[row][col])
    {
      return;
    }

    visited[row][col] = true;
    animateCell(row, col, colorCyan);
    time += TIME_INTERVAL;

    dfsHelper(row, col + 1);
    dfsHelper(row, col - 1);
    dfsHelper(row + 1, col);
    dfsHelper(row - 1, col);

    if (!solved)
    {
      animateCell(row, col, colorGray);
      time += TIME_INTERVAL;
    }
}

function initializeArrayDFS(visited) {

  for (let i = 0; i < ROWS; i++)
  {
    visitedRow = []
    for (let j = 0; j < COLS; j++)
    {
      visitedRow.push(false);
    }
    visited.push(visitedRow);
  }

}

function dfs() {

  clearAnimations();
  drawGrid();

  time = 0;
  solved = false;
  visited = [];

  initializeArrayDFS(visited);

  dfsHelper(1, 1);
}

function heuristic(row, col) {

  let aSquared = Math.pow(((ROWS - 2) - row), 2);
  let bSquared = Math.pow((endPos - col), 2);
  let cSquared = aSquared + bSquared;

  weight = Math.sqrt(cSquared);

  return weight;
}

function fakePriorityQueue(q) {
  q.sort(function(a, b)
  {
    let aDistance = a[2];
    let bDistance = b[2];
    return aDistance - bDistance;
  });
}

function updateNeighborShortestPath(row, col, prevNode, prev, q, isAStar) {

  let prevRow = prevNode[0];
  let prevCol = prevNode[1];
  let prevDistance = prevNode[2];

  if (inBounds(row, col) && grid[row][col] != WALL)
  {
      edgeWeight = 1;

      if (isAStar)
      {
        edgeWeight += heuristic(row, col);
      }

      let newDistance = prevDistance + edgeWeight;

      if (newDistance < distances[row][col])
      {
        prev[row][col] = [prevRow, prevCol];
        distances[row][col] = newDistance;

        q.push([row, col, newDistance]);
        fakePriorityQueue(q);

        animateCell(row, col, colorBlue);
      }
  }
}

function updateNeighborBFS(row, col, path, q) {
  if (inBounds(row, col) && !visited[row][col] && grid[row][col] != WALL)
  {
    visited[row][col] = true;

    path.push([row, col]);
    q.push(path);

    animateCell(row, col, colorBlue);
  }
}

function drawPath(path) {
  for (let i in path)
  {
    let row = path[i][0];
    let col = path[i][1];

    animateCell(row, col, colorCyan);
    time += TIME_INTERVAL;
  }
}

function initializeArrayBFS(visited) {

  for (let i = 0; i < ROWS; i++)
  {
    visitedRow = []
    for (let j = 0; j < COLS; j++)
    {
      visitedRow.push(false);
    }
    visited.push(visitedRow);
  }

}

function initializeArraysShortestPath(distances, prev) {

  for (let i = 0; i < ROWS; i++)
  {
    prevRow = []
    distancesRow = []

    for (let j = 0; j < COLS; j++)
    {
      prevRow.push([-1, -1]);
      distancesRow.push(Infinity);
    }

    prev.push(prevRow);
    distances.push(distancesRow);
  }

  distances[1][1] = 0;
}

function tracePath(prev) {
  let path = [];
  let i = ROWS - 2;
  let j = endPos;

  path.unshift([i, j]);
  while (i != 1 || j != 1)
  {
    prevRow = prev[i][j][0];
    prevCol = prev[i][j][1];
    path.unshift([prevRow, prevCol]);

    i = prevRow;
    j = prevCol;
  }

  return path;
}

function shortestPath(isAStar) {

  clearAnimations();
  drawGrid();

  time = 0;
  distances = [];
  prev = [];

  initializeArraysShortestPath(distances, prev);

  q = [];
  q.push([1, 1, 0]);

  while (q.length != 0)
  {
    node = q.shift();

    let row = node[0];
    let col = node[1];

    animateCell(row, col, colorGray);

    let isEnd = (row == ROWS - 2 && col == endPos);
    if (isEnd)
    {
      break;
    }

    updateNeighborShortestPath(row, col + 1, node, prev, q, isAStar);
    updateNeighborShortestPath(row, col - 1, node, prev, q, isAStar);
    updateNeighborShortestPath(row + 1, col, node, prev, q, isAStar);
    updateNeighborShortestPath(row - 1, col, node, prev, q, isAStar);

    time += BFS_INTERVAL;
  }

  let path = tracePath(prev);
  drawPath(path);
}

function bfs() {

  clearAnimations();
  drawGrid();

  time = 0;
  visited = [];

  initializeArrayBFS(visited);

  q = [];
  q.push([[1, 1]]);
  visited[1][1] = true;

  while (q.length != 0)
  {
    path = q.shift();

    let lastNode = path.length - 1;
    let row = path[lastNode][0];
    let col = path[lastNode][1];

    animateCell(row, col, colorGray);

    let isEnd = (row == ROWS - 2 && col == endPos);
    if (isEnd)
    {
      break;
    }

    updateNeighborBFS(row, col + 1, path.slice(0), q);
    updateNeighborBFS(row, col - 1, path.slice(0), q);
    updateNeighborBFS(row + 1, col, path.slice(0), q);
    updateNeighborBFS(row - 1, col, path.slice(0), q);

    time += BFS_INTERVAL;
  }

  drawPath(path);
}

function dijkstras() {
  shortestPath(false);
}

function aStar() {
  shortestPath(true);
}
