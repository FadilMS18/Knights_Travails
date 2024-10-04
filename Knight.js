console.clear();

// All the possible moves of a knight in chess
let moves = [
  [1, 2],
  [1, -2],
  [-1, 2],
  [-1, -2],
  [2, 1],
  [2, -1],
  [-2, 1],
  [-2, -1],
];

class Graph {
  constructor() {
    this.vertices = 0; // total vertices that the graphs have
    this.AdjList = new Map(); // make adjacency List as a map
  }

  addVertex(vertex) {
    // Change vertex that originally is an array to string to make it easier to process the algorithm later on
    let verString = vertex.toString();

    // If given vertex is not in adjacency list then add it to it
    if (!this.AdjList.has(verString)) {
      this.AdjList.set(verString, []);
      this.vertices += 1; // add total vertices by one for every vertex that added to adjList
    }
  }

  addEdge(v1, v2) {
    // Again change the vertex that is array to string
    let key1 = v1.toString();
    let key2 = v2.toString();

    // If vertex1 or vertex2 is not in adjacency list then add them to it
    if (!this.AdjList.has(key1)) this.addVertex(key1);
    if (!this.AdjList.has(key2)) this.addVertex(key2);

    // If vertex2 is not in vertex1 adjacency list then add it
    if (!this.AdjList.get(key1).includes(key2)) {
      this.AdjList.get(key1).push(key2);
    }
    // Same goes to vertex1
    if (!this.AdjList.get(key2).includes(key1)) {
      this.AdjList.get(key2).push(key1);
    }
  }

  // PrintGraph that  will show vertex and all of its adjacency list
  printGraph() {
    let adjEntries = this.AdjList.entries();
    for (let [vertex, andItsList] of adjEntries) {
      console.log(`${vertex}, its adj list is ${andItsList.join(" ")}`);
    }
  }

  // Make Board function
  makeTheBoard(startPoint, possibleMoves, board) {
    // Board size is one point less than board length
    let boardSize = board - 1;
    let visited = new Set();
    let queue = [];
    let startToString = startPoint.toString();

    // Add startPoint to visited and queue array then add the vertex to graphs
    visited.add(startToString);
    queue.push(startToString);
    this.addVertex(startToString);

    while (queue.length !== 0) {
      // dequeue the first index of the queue array
      let current = queue.shift();

      /*
       * current.split(',') will take the string and make an array with 2 element of the current
       * .map(key => Number(key)) will change the current 2 element string to 2 element number, example ['1', '2'] change to [1, 2]
       * [currentX, currentY] will destructure the 2 element number array
       * currentX will be first index and currentY will be the second index
       */
      let [currentX, currentY] = current.split(",").map((key) => Number(key));

      // For every move make new Position
      for (let move of possibleMoves) {
        let newX = currentX + move[0];
        let newY = currentY + move[1];

        // If the new position is out of board then continue the iteration
        if (newX > boardSize || newX < 0 || newY > boardSize || newY < 0)
          continue;

        // If not then proceed
        let newPosition = [newX, newY];
        let newKey = newPosition.toString();
        this.addVertex(newKey);
        this.addEdge(current, newKey);

        // if visited Array is not had the newPosition then add it to visited and queue array
        if (!visited.has(newKey)) {
          visited.add(newKey);
          queue.push(newKey);
        }
      }
    }
  }

  makePathFor(start, end) {
    // convert startLocation that is array to string to make it easy to us to process the vertex and its adjList
    let startKey = start.toString();
    let endKey = end.toString();

    // If the given start/end is not in the graphs, it means that its out of the board
    if (!this.AdjList.has(startKey))
      throw new Error("Start point is out of board");
    if (!this.AdjList.has(endKey)) throw new Error("end point is out of board");

    // As usual BFS method we use visited & queue array method
    let visited = new Set();
    let queue = [];
    queue.push(startKey);
    // add new map for make it easier for us to track back the path if the endLocation is founded
    let ancestor = new Map();

    while (queue.length !== 0) {
      let current = queue.shift();

      // Base case if current is equal to endLocation then break the loops even if the queue array is still have another element
      if (current == endKey) {
        // declare new array that will be the path from the endLocation to start location
        let path = [];
        let step = endKey;
        while (step !== startKey) {
          path.push(step);
          step = ancestor.get(step);
        }
        // if the loops is ending then add startLocation to path
        path.push(startKey);
        
        // reverse the path array so the order will be startLocation --> endLocation
        path.reverse();
        
        // change path array format that originally was a string to number
        path = path.map((position) =>
          position.split(",").map((pos) => Number(pos))
        );
       
        // return object that have 2 properties
        return { path: path, pathLength: path.length - 1 };
      }

      for (let child of this.AdjList.get(current)) {
        if (!visited.has(child)) {
          visited.add(child);
          queue.push(child);
          // for every child set current location to be its tail and the child will be the head
          ancestor.set(child, current); 
        }
      }
    }
  }

  findShortestPath(start, end) {
    let path = this.makePathFor(start, end);
    console.log(
      `Number of step that required from [${start}] to [${end}] is ${path.pathLength} step`
    );
    console.log("Here is The Path");
    console.log(path.path.join(" => "));
  }
}

let graphs = new Graph();

// Make Board function
graphs.makeTheBoard([0, 0], moves, 8);

console.log(graphs);

// Print all the vertex and its adjacency list
// graphs.printGraph()

// Find shortest path of the graph that we make
graphs.findShortestPath([0, 0], [5, 3]);
