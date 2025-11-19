import { writeUserData, removeUserData, readUserData, updateUserData } from './firebase.js';
import { Pizza } from './pizzClass.js';


// function createOption
const menuContainer = document.getElementById('menuContainer');
const otherContainer = document.getElementById('otherContainer');
const pizzaContainer = document.getElementById('pizzaContainer');
const ingredientContainer = document.getElementById('ingredientContainer');

// functions for creating a menu template

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
      addItemDiv.append(createItem("Pizza's", currentInput));
      writeUserData("Pizza's",  currentInput); // new item new path
    }
    
  })
  addItemDiv.append(input, addButton);
  container.append(addItemDiv);

}

function addMenuItemButton(container) {
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
      let itemDiv = createItem('testDir', currentInput);
      addItemDiv.append(itemDiv);
      writeUserData('testDir',  currentInput); // new item new path

      itemDiv.addEventListener('click', () => {
        console.log('item:', currentInput);
      })

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

  let createObjectInput = document.createElement('input');
  createObjectInput.placeholder = item + ' name';
  createObjectInput.type = 'text';


  let createItemButton = document.createElement('button');
  createItemButton.textContent = 'create Item';
  createItemButton.addEventListener('click', () => {
    const objectInput = createObjectInput.value;
    createObjectInput.value = '';
    if (objectInput != null && objectInput != '') {
      loadItem(currentPath, objectInput);
      console.log(`created object: ${objectInput}`)

    }
  });
  

  let itemInput = document.createElement('input');
  itemInput.type = 'text';
  itemInput.placeholder = 'option';

  let addOptionButton = document.createElement('button');
  addOptionButton.textContent = 'add';
  addOptionButton.addEventListener('click', () => {
    const currentInput = itemInput.value;
    itemInput.value = '';
    if (currentInput != null && currentInput != '') {
      itemContainer.append(createOption(currentPath, currentInput));
      writeUserData(currentPath, currentInput);
    }
  });

  itemContainer.append(itemSpan, createObjectInput, createItemButton, removeButton, itemInput, addOptionButton);
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
      let optionDiv = null;
      if (option != null && option != '') {
        optionDiv = createOption(nextPath, option);
        curItemDiv.append(optionDiv);
      }
      for (const ingredient in data[item][option]) {
        if (ingredient != null && ingredient != '') {
          const iDiv = createIngredient(optionPath, ingredient);
          optionDiv.append(iDiv);
        // console.log(ingredient);
        }
      }
    }
  }
  // console.log(data);
}


// functions for creating an item


function createItemDiv(item) {
  const itemDiv = document.createElement('div');
  itemDiv.id = item;
  const nameInput = document.createElement('input');
  let itemName = document.createElement('span');
  itemName.textContent = item;
  nameInput.placeholder = 'New name';
  nameInput.type = 'text';
  const changeButton = document.createElement('button');
  changeButton.textContent = 'change name';

  changeButton.addEventListener('click', () => {
    const input = nameInput.value;
    nameInput.value = '';
    if (input != null && input != '') {
      itemName.textContent = input;
      itemDiv.id = input;
      let childElements = itemDiv.children;
      const length = childElements.length - 3;

      // update child ids
      for (let i = 0; i < length; i++) {
        const currentId = childElements[i + 3].id;
        const idIndex = currentId.lastIndexOf(" ") + 1;
        const newId = currentId.slice(0, idIndex) + input;
        childElements[i + 3].id = newId;
      }
    
    }
  });
  itemDiv.append(itemName, nameInput, changeButton);
  return itemDiv
} 

function createOptionDiv(option, id) {
  const optionDiv = document.createElement('div');
  optionDiv.id = option + ' ' + id;
  const optionSpan = document.createElement('span');
  optionSpan.textContent = option;

  optionDiv.append(optionSpan);
  return optionDiv;
}


// functions for editing an item

async function editMenu(data) {
  const editContainer = document.createElement('div');
  for (const option in data) {
    const editOption = editOptionDiv(option);
    editContainer.append(editOption);
    for(const ingredient in data[option]) {
      const editIngredient = editIngredientDiv(ingredient);
      editOption.append(editIngredient);
    }
  }
  editContainer.style.display = 'none';
  return editContainer;
}

function editOptionDiv(option) {
  const optionDiv = document.createElement('div');
  const optionSpan = document.createElement('span');
  optionSpan.textContent = option;
  optionDiv.append(optionSpan);
  return optionDiv;
}

function editIngredientDiv(ingredient) {
  const iDiv = document.createElement('div');
  const iSpan = document.createElement('span');
  iSpan.textContent = ingredient;

  const modButton = document.createElement('button');
  modButton.textContent = 'add';

  modButton.addEventListener('click', () => {  // needs to update the item that is being modified
    const optionContainer = iDiv.parentElement;
    const optionId = optionContainer.children[0].textContent;
    const editContainer = optionContainer.parentElement;
    const ref = optionId + ' ' + editContainer.getAttribute('ref');
    // console.log(ref);
    const myDiv = document.getElementById(ref);

    if (modButton.textContent == 'add') {
      const newSpan = document.createElement('span');
      newSpan.textContent = ingredient;
      newSpan.id = ref + ingredient;
      myDiv.append(newSpan);
      modButton.textContent = 'remove';
    } else if (modButton.textContent == 'remove') {
      let foundSpan = document.getElementById(ref + ingredient);
      foundSpan.remove();
      modButton.textContent = 'add';
    }
  });

  iDiv.append(iSpan, modButton);
  return iDiv;
}

async function loadItem(path, itemName) {
  const data = await readUserData(path, '');
  
  const editContainer = await editMenu(data);
  menuContainer.append(editContainer);

  const itemIndex = path.lastIndexOf('/');
  const startPath = path.slice(0, itemIndex)
  const currentObjectPath = path.slice(itemIndex + 1);
  console.log(`startPath: ${startPath}, itemName: ${currentObjectPath}`);
  let itemDiv = createItemDiv(itemName);
  let select = true;
  itemDiv.addEventListener('click', () => {

    if (select) {
      console.log(`selected div with name ${itemDiv.children[0].textContent}`);
      editContainer.setAttribute('ref', itemDiv.id);
      ingredientContainer.style.display = 'none';
      editContainer.style.display = 'flex';
      editContainer.style.flexDirection = 'column';
      // select = false;
    } else {
      ingredientContainer.style.display = 'flex';
      ingredientContainer.style.flexDirection = 'column';
      editContainer.style.display = 'none';
      select = true;
    }
    
  })
  for (const option in data) {
    const optionDiv = createOptionDiv(option, itemDiv.id);
    itemDiv.append(optionDiv);
  }
  pizzaContainer.append(itemDiv); // current div its appending ot
}

addItemButton(ingredientContainer);
// addMenuItemButton(pizzaContainer);
const MenuItem = document.createElement('span');
MenuItem.textContent = 'MENU';
pizzaContainer.append(MenuItem);
load("Pizza's");