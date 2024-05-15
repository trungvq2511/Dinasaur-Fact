// Create Dino Constructor
function Dino(species, weight, height, diet, where, when, fact) {
    this.species = species;
    this.weight = weight;
    this.height = height;
    this.diet = diet;
    this.where = where;
    this.when = when;
    this.fact = fact;
}

function Human(name, height, weight, diet) {
    this.species = name;
    this.height = height
    this.weight = weight;
    this.diet = diet;
}

// Create Human Object
const human = new Human();

// Use IIFE to get human data from form
const getHumanData = (function () {
    function getDataFromForm() {
        const feet = parseInt(document.querySelector('#feet').value);
        const inches = parseInt(document.querySelector('#inches').value);
        human.species = document.querySelector('#name').value;
        human.height = (feet ? feet : 0) * 12 + (inches ? inches : 0);
        human.weight = document.querySelector('#weight').value;
        human.diet = document.querySelector('#diet').value;
    }

    return {
        human: getDataFromForm
    }
})();

// Create Dino Compare Method 1
// NOTE: Weight in JSON file is in lbs, height in inches.
Dino.prototype.compareHeight = function (dino) {
    dino.fact = `${dino.species} is ` +
      (dino.height > human.height ? +(dino.height - human.height) + ` inches taller `
        : (human.height - dino.height) + ` inches shorter `)
      + `than human!`;
}

// Create Dino Compare Method 2
// NOTE: Weight in JSON file is in lbs, height in inches.
Dino.prototype.compareWeight = function (dino) {
    dino.fact = `${dino.species} is ` +
      (dino.weight > human.weight ? +(dino.weight - human.weight) + ` lbs heavier `
        : (human.weight - dino.weight) + ` lbs lighter `)
      + `than human!`;
}


// Create Dino Compare Method 3
// NOTE: Weight in JSON file is in lbs, height in inches.
Dino.prototype.compareDiet = function (dino) {
    if (dino.diet === human.diet) {
        dino.fact = `${dino.species} have ${dino.diet} diet like ${human.species}!`
    } else {
        dino.fact = `${dino.species} have ${dino.diet} diet but ${human.species} has ${human.diet} diet!`
    }
}

// Generate Tiles for each Dino in Array
function generateTiles(dataArr) {
    const grid = document.querySelector('#grid');

    // Add Human to dataArr at index 4
    dataArr.splice(4, 0, human);
    dataArr.forEach(data => {

        if (data instanceof Dino) {
            const random = Math.floor(Math.random() * 3);
            switch (random) {
                case 0: {
                    data.compareHeight(data);
                    break;
                }
                case 1: {
                    data.compareWeight(data);
                    break;
                }
                case 2: {
                    data.compareDiet(data);
                    break;
                }
            }
        }
        const h3_node = document.createElement('h3');
        h3_node.innerText = data.species;

        const img_node = document.createElement('img');
        img_node.src = data instanceof Human ? './images/human.png' : `./images/${data.species}.png`;

        const p_node = document.createElement('p');
        p_node.innerText = data instanceof Human ? 'Human' : data.fact;

        const tile_node = document.createElement('div');
        tile_node.className = 'grid-item';
        tile_node.appendChild(h3_node);
        tile_node.appendChild(img_node);
        tile_node.appendChild(p_node);

        grid.appendChild(tile_node);
    })
}

// Shuffle Dinos
function shuffleDinos(dinos) {
    let j, x, i;
    for (i = dinos.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = dinos[i];
        dinos[i] = dinos[j];
        dinos[j] = x;
    }
    return dinos;
}

// Get Dinos from JSON
async function getDinosFromJson() {
    const data = (await fetch('./dino.json'));
    const dinos_json = await data.json();
    let dinos = dinos_json['Dinos'];
    dinos = await dinos.map(dino => {
        const {species, weight, height, diet, where, when, fact} = dino;
        return new Dino(species, weight, height, diet, where, when, fact);
    });
    return await shuffleDinos(dinos);
}

// Add tiles to DOM
async function addTilesToDOM() {
    getHumanData.human();
    generateTiles(await getDinosFromJson());
    removeFormFromScreen();
}

// Remove form from screen
function removeFormFromScreen() {
    document.querySelector('#dino-compare').remove();
}

// On button click, prepare and display infographic
const compareBtn = document.querySelector('#btn');
compareBtn.addEventListener('click', addTilesToDOM);
