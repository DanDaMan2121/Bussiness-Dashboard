import { writeUserData, removeUserData, readUserData, updateUserData } from './firebase.js';
import { Pizza } from './pizzClass.js';


// function createOption
const menuContainer = document.getElementById('menuContainer');
const otherContainer = document.getElementById('otherContainer');
const pizzaContainer = document.getElementById('pizzaContainer');
const ingredientContainer = document.getElementById('ingredientContainer');


function addItemButton(container) {
  let addItemDiv = document.createElement('div');
  addItemDiv.className = 'addContainer';

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'add item';
  

  const addButton = document.createElement('button');
  addButton.textContent = 'add';
  addButton.addEventListener('click', () => {
    const currentInput = input.value;
    input.value = '';
    if (currentInput != null && currentInput != '') {
      addItemDiv.append(createItem('testDir', currentInput));
      writeUserData('testDir',  currentInput); // new item new path
    }
    
  })
  addItemDiv.append(input, addButton);
  container.append(addItemDiv);

}

function createItem(path, item) {
  const currentPath = path + '/' + item;
  let itemContainer = document.createElement('div');
  
  let itemSpan = document.createElement('span');
  itemSpan.textContent = item;

  let removeButton = document.createElement('button');
  removeButton.textContent = 'remove';
  removeButton.addEventListener('click', () => {
    removeUserData(path, item);
    itemContainer.remove();
  })
  

  let itemInput = document.createElement('input');
  itemInput.type = 'text';
  itemInput.placeholder = 'option';

  let addButton = document.createElement('button');
  addButton.textContent = 'add';
  addButton.addEventListener('click', () => {
    const currentInput = itemInput.value;
    itemInput.value = '';
    if (currentInput != null && currentInput != '') {
      itemContainer.append(createOption(currentPath, currentInput));
      writeUserData(currentPath, currentInput);
    }
  });

  itemContainer.append(itemSpan, removeButton, itemInput, addButton);
  return itemContainer;
}

function createOption(path, option) {
  const currentPath = path + '/' + option;
  let optionContainer = document.createElement('div');

  let optionSpan = document.createElement('span');
  optionSpan.textContent = option;

  let removeButton = document.createElement('button');
  removeButton.textContent = 'remove';
  removeButton.addEventListener('click', () => {
    optionContainer.remove();
    console.log(path);
    removeUserData(path, option);
  })

  let optionInput = document.createElement('input');
  optionInput.type = 'text';
  optionInput.placeholder = 'ingredient';

  let addButton = document.createElement('button');
  addButton.textContent = 'add';
  addButton.addEventListener('click', () => {
    const currentInput = optionInput.value;
    optionInput.value = '';
    if (currentInput != null && currentInput != '') {
      optionContainer.append(createIngredient(currentPath, currentInput));
      writeUserData(currentPath, currentInput);
    }
  });

  optionContainer.append(optionSpan, removeButton, optionInput, addButton);

  return optionContainer;
}

function createIngredient(path, ingredient) {
  const currentPath = path + '/' + ingredient;
  let iContainer = document.createElement('div');
  
  let iSpan = document.createElement('span');
  iSpan.textContent = ingredient;

  let removeButton = document.createElement('button');
  removeButton.textContent = 'remove';
  removeButton.addEventListener('click', () => {
    iContainer.remove();
    // removeUserData(path, ingredient);
    updateUserData(path, ingredient, null);
  })

  iContainer.append(iSpan, removeButton);
  return iContainer;
}


async function load(path) {
  const data = await readUserData(path, '');
  for (const item in data) {
    // const currentPath = 
    const curItemDiv = createItem(path, item);
    ingredientContainer.append(curItemDiv);
    let nextPath = path + '/' + item;
    for (const option in data[item]) {
      let optionPath = nextPath + '/' + option;
      const optionDiv = createOption(nextPath, option);
      curItemDiv.append(optionDiv);
      // console.log(option);
      for (const ingredient in data[item][option]) {
        const iDiv = createIngredient(optionPath, ingredient);
        optionDiv.append(iDiv);
        // console.log(ingredient);
      }
    }
  }
  // console.log(data);
}


addItemButton(ingredientContainer);
load('testDir');