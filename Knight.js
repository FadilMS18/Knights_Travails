console.clear()

let moves = [
    [1, 2], [1, -2], [-1, 2], [-1, -2],
    [2, 1], [2, -1], [-2, 1], [-2, -1] 
]

class Graph{
    constructor(){
        this.vertices = 0
        this.AdjList = new Map
    }

    addVertex(vertex){
        let verString = vertex.toString()
        if(!this.AdjList.has(verString)){
            this.AdjList.set(vertex, [])
            this.vertices += 1
        }
    }

    addEdge(v1, v2){
        let key1 = v1.toString()
        let key2 = v2.toString()

        if(!this.AdjList.has(key1)) this.addVertex(key1)
        if(!this.AdjList.has(key2)) this.addVertex(key2)
        
        if(!this.AdjList.get(key1).includes(key2)){
            this.AdjList.get(key1).push(key2)
        }
        if(!this.AdjList.get(key2).includes(key1)){
            this.AdjList.get(key2).push(key1)
        }    
    }

    printGraph(){
        let adjEntries = this.AdjList.entries()
        for(let [vertex, andItsList] of adjEntries){
            console.log(`${vertex}, its adj list is ${andItsList.join(' ')}`)
        }
    }

    makeTheBoard(startPoint, possibleMoves, board){
        let boardSize = board - 1
        let visited = new Set()
        let queue = []
        let startToString = startPoint.toString()
        
        visited.add(startToString)
        queue.push(startToString)
        this.addVertex(startToString)

        while(queue.length !== 0){
            let current = queue.shift()

            let [currentX, currentY] = current.split(',').map(key => Number(key))

            for(let move of possibleMoves){
                let newX = currentX + move[0]
                let newY = currentY + move[1]

                if(newX > boardSize || newX < 0 || newY > boardSize || newY < 0) continue;

                let newPosition = [newX, newY]
                let newKey = newPosition.toString()
                this.addVertex(newKey)
                this.addEdge(current, newKey)

                if(!visited.has(newKey)){
                    visited.add(newKey)
                    queue.push(newKey)
                }
            }
        }
    }

    makePathFor(start, end){
        let startKey = start.toString()
        let endKey = end.toString()

        if(!this.AdjList.has(startKey)) throw new Error('Start point is out of board')
        if(!this.AdjList.has(endKey)) throw new Error('end point is out of board')

        let visited = new Set()
        let queue = []
        queue.push(startKey)
        let ancestor = new Map()

        
        while(queue.length !== 0){
            let current = queue.shift()

            if(current == endKey){
                let path = []
                let step = endKey
                while(step !== startKey){
                    path.push(step)
                    step = ancestor.get(step)
                }
                path.push(startKey)
                path.reverse()
                path = path.map(position => position.split(',').map(pos => Number(pos)))
                return {path: path, pathLength : path.length - 1}
            }

            for(let child of this.AdjList.get(current)){
                if(!visited.has(child)){
                    visited.add(child)
                    queue.push(child)
                    ancestor.set(child, current)
                }
            }
        }
    }

    findShortestPath(start, end){
        let path = this.makePathFor(start, end)
        console.log(`Number of step that required from [${start}] to [${end}] is ${path.pathLength} step`)
        console.log('Here is The Path')
        console.log(path.path.join(' => '))
    }
}

let graphs = new Graph()

console.log(graphs)

// Make Board function
graphs.makeTheBoard([0,0], moves, 8)

// Print all the vertex and its adjacency list
// graphs.printGraph()

// Find shortest path of the graph that we make
graphs.findShortestPath([0,0], [5,3])