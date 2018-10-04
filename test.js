#!/usr/bin/nodejs
var request = require('request');

const WIDTH = 15;
const HEIGHT = 15;
const DIFFICULTY = 1;

(function createMaze(width, height, difficulty) {
    request({
        url: 'https://ponychallenge.trustpilot.com/pony-challenge/maze',
        method: 'POST',
        json: true,
        body: {
            'maze-width': width,
            'maze-height': height,
            'maze-player-name': 'applejack',
            'difficulty': difficulty
        }
    }, (error, response, body) => {
        if(!error && body.maze_id) {
            getMaze(body.maze_id);
        }
    });
})(WIDTH, HEIGHT, DIFFICULTY);

function getMaze(maze_id) {
    request({
        url: 'https://ponychallenge.trustpilot.com/pony-challenge/maze/' + maze_id,
        method: 'GET'
    }, (error, response, body) => {
        var test_maze = [['west', 'north'], ['west', 'north'], [        'north'],
                         ['west'],          [        'north'], ['west'         ],
                         ['west'         ], [        'north'], [               ]];

        processMaze(maze_id,
                    6, /* pony */
                    0, /* domokun */
                    1, /* end-point*/
                    test_maze,
                    [3, 3]);

/*
        processMaze(maze_id,
                    JSON.parse(body).pony,
                    JSON.parse(body).domokun,
                    JSON.parse(body)['end-point'],
                    JSON.parse(body).data,
                    JSON.parse(body).size);
*/
    });
}

function move(maze_id, direction) {
    request({
        url: 'https://ponychallenge.trustpilot.com/pony-challenge/maze/' + maze_id,
        method: 'POST',
        json: true,
        body: {
            'direction': direction,
        }
    }, (error, response, body) => {
        if(!error && body.maze_id) {
            getMaze(body.maze_id);
        }
    });
}

function processMaze(maze_id, pony, domokun, end, walls, size) {
    function Node(id, left, right, up, down) {
        this.id = id;
        this.left = left;
        this.right = right;
        this.up = up;
        this.down = down;
    };

    var getNode = (() => {
        var nodes = [];

        return (id) => { return nodes[id] || (nodes[id] = new Node(id)) };
    })();

    for(var i = 0; i < size[0] * size[1]; i++) {
        if(!walls[i].includes('west')) {
            getNode(i).left = getNode(i - 1);
            getNode(i - 1).right = getNode(i);
        }

        if(!walls[i].includes('north')) {
            getNode(i).up = getNode(i - size[0]);
            getNode(i - size[1]).down = getNode(i);
        }
    }


    function DirectedNode(parent, children) {
        this.parent = parent;
        this.children = children;
    }

    var getDirectedNode = (() => {
        var nodes = [];

        return (id) => { return nodes[id] || (nodes[id] = new DirectedNode()) };
    })();

/*
    (function convert(node_id, parent_id) {
        var currentNode = getNode(node_id);
        getDirectedNode(node_id).parent = getDirectedNode(parent_id);

        if(currentNode.left && currentNode.left.id != parent_id) {
            getDirectedNode(node_id).children.push(getDirectedNode(currentNode.left.id));
            convert(currentNode.left.id, node_id);
        }

        if(currentNode.right && currentNode.right.id != parent_id) {
            getDirectedNode(node_id).children.push(getDirectedNode(currentNode.right.id));
            convert(currentNode.right.id, node_id);
        }

        if(currentNode.up && currentNode.up.id != parent_id) {
            getDirectedNode(node_id).children.push(getDirectedNode(currentNode.up.id));
            convert(currentNode.up.id, node_id);
        }

        if(currentNode.down && currentNode.down.id != parent_id) {
            getDirectedNode(node_id).children.push(getDirectedNode(currentNode.down.id));
            convert(currentNode.down.id, node_id);
        }
    })(pony);
*/

//    move(maze_id, 'direction');
}



/******************************************************************************/
/*                             [ ]                                            */
/*                             ||                                             */
/*                             V                                              */
/*                        createMaze()                                        */
/*                             ||                                             */
/*                             V                                              */
/*                          getMaze() <=====\\                                */
/*                             ||           ||                                */
/*         (goal reached)      V            ||                                */
/*    [X] <============== processMaze()     ||                                */
/*                             ||           ||                                */
/*                             V            ||                                */
/*                           move() ========//                                */
/******************************************************************************/


function printMaze(maze_id) {
    request({
        url: 'https://ponychallenge.trustpilot.com/pony-challenge/maze/' + maze_id + '/print',
        method: 'GET'
    }, (error, response, body) => {
        console.log(body);
    });
}
