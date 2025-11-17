import { getDatabase, ref, set, remove, onValue, child, get} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";
import {} from './firebase.js';
import { Pizza } from './pizzClass.js';

const addButton = document.getElementById('addButton');
const itemInput = document.getElementById('item');
const menuContainer = document.getElementById('Other');

const addPizzaButton = document.getElementById('addPizza');
const pizzaInput = document.getElementById('itemPizza');
const pizzaContainer = document.getElementById('pizzaContainer');

const addPizzMenuButton = document.getElementById('addPizzaMenu');
const pizazMenuInput = document.getElementById('itemPizzaMenu');
const pizzaMenuContainer = document.getElementById('pizzaMenu');

async function writeUserData(parentId, childId) {
  console.log('write ran');
  console.log(`parentId: ${parentId}, childId: ${childId}`);
  const db = getDatabase();
  await set(ref(db, parentId + '/' + childId), '')
  .then(() => {
    console.log('data set successfully');
    return true;
  })
  .catch ((error) => {
    console.error(`Error setting node: ${error}`);
    return false;
  });
}

async function wirtePizzaData(parentId, childId,  myPizza) {
  // console.log('pizzaWrite');
  // const db = getDatabase();
  // await set(ref(db, parentId + '/' + childId), '')
  // .then(() => {
  //   console.log('data set successfully');
  //   return true;
  // })
  // .catch ((error) => {
  //   console.error(`Error setting node: ${error}`);
  //   return false;
  // });
  const startPath = parentId + '/' + childId;
  console.log(myPizza);
  readPizza(startPath, pizzaMenuContainer, myPizza);

  

}

function readPizza(startPath, container, myData) {
for (const key in myData) {
  if (key != 'PID' && key != 'quantity') {
    createPizzaDiv(startPath, container, key);
      const keyPath = startPath + '/' + key;
      let keyDiv = document.getElementById(keyPath); // here is the problem // path name must be given
      for (const item in myData[key]) {  
          createItemDiv(item, keyDiv);
          const itemPath = keyPath + '/' + item;
          let itemDiv = document.getElementById(itemPath);
          itemDiv.className = 'itemDiv';
          // console.log(itemDiv)
        for (const ingredient in myData[key][item]) {
          createIngredientDiv(ingredient, itemDiv);
        }
      }
    }
  }
}

function removeUserData(parentId, userId) {
  console.log('remove ran');
  console.log(`parentId: ${parentId}, userId: ${userId}`);
  const db = getDatabase();
  remove(ref(db, parentId + '/' + userId));

}

async function readUserData(parentId, childId) { // a single snapshot of the data
  const dbRef = ref(getDatabase());
  let data = '';
  await get(child(dbRef, parentId + '/' + childId)).then((snapshot) => {
    if (snapshot.exists()){
      data = snapshot.val();
    } else {
      console.log('No data available');
    }
  }).catch((error) => {
    console.error(error);
    // return false;
  });
  // console.log(myMenuItems);
  return data;
}

function createPizzaDiv(myKey, parentContainer, name) {
  let pizzaContainer = document.createElement('div');
  let modContainer = document.createElement('div');
  let optionContainer = document.createElement('div');
  // console.log(myKey);
  optionContainer.id = myKey + '/' + name;
  pizzaContainer.append(modContainer, optionContainer);
  parentContainer.append(pizzaContainer);

  let pizzaTitle = document.createElement('span');
  pizzaTitle.textContent = name;
  let removeButton = document.createElement('button');
  removeButton.textContent = 'remove';
  removeButton.addEventListener('click', () => {
      removeUserData(myKey, name);
      while (pizzaContainer.firstChild) {
        pizzaContainer.removeChild(pizzaContainer.firstChild);
      }
  });
  modContainer.append(pizzaTitle, removeButton);

  let optionInput = document.createElement('input');
  optionInput.type = 'text';
  optionInput.placeholder = 'add option';
  let addButton = document.createElement('button');
  addButton.textContent = 'add';
  addButton.addEventListener('click', () => {
    const inputVal = optionInput.value;
    optionInput.value = '';
    if (inputVal != '' && inputVal != null){
      const parentId = optionContainer.id
      const result = writeUserData(parentId, inputVal);
      if (result) {
        createItemDiv(inputVal, optionContainer);
      }
    }
  });
  modContainer.append(optionInput, addButton);
}

function createItemDiv(name, parentContainer) {
  let itemContainer = document.createElement('div');
  itemContainer.className = 'itemContainer';
  let itemDiv = document.createElement('div');
  let modContainer = document.createElement('div');
  modContainer.className = 'modContainer';
  let itemName = document.createElement('span');
  let removeItem = document.createElement('button');

  // add ingredient
  let inputIngedient = document.createElement('input');
  inputIngedient.type = 'text';
  inputIngedient.placeholder = 'add ingredient';
  let addIngredient = document.createElement('button'); // WPI
  addIngredient.textContent = 'add';

  itemName.textContent = name;
  itemDiv.id = parentContainer.id + '/' + name; // parent path must be ID
  removeItem.textContent = 'remove';

  removeItem.addEventListener('click', () => {
    removeUserData('Other', itemDiv.id);
    while (itemContainer.firstChild) {
      itemContainer.removeChild(itemContainer.firstChild);
    }
  });

  addIngredient.addEventListener('click', () => {
    const inputVal = inputIngedient.value;
    inputIngedient.value = '';
    if (inputVal != '' && inputVal != null){
      const parentNode = itemDiv.id; // path name must be given
      console.log(parentNode);
      const result = writeUserData(parentNode, inputVal);
      if (result) {
        createIngredientDiv(inputVal, itemDiv);
      }
    }
  });

  modContainer.append(itemName, removeItem);
  itemDiv.append(modContainer);
  itemDiv.append(inputIngedient, addIngredient);
  itemContainer.append(itemDiv);
  parentContainer.append(itemContainer);
}

function createIngredientDiv(name, parentContainer){
  let ingredientDiv = document.createElement('div');
  ingredientDiv.className = 'ingredientDiv';
  let ingredientName = document.createElement('span');
  let removeIngredient = document.createElement('button');

  ingredientName.textContent = name;
  ingredientDiv.id = name;
  removeIngredient.textContent = 'remove';

  removeIngredient.addEventListener('click', () => { // slight bug where the parent nodes gets deleted after all the nodes are removed.
    const parentId = parentContainer.id;
    // console.log(ingredientDiv.id);
    removeUserData(parentId, ingredientDiv.id);
    while(ingredientDiv.firstChild) {
      ingredientDiv.removeChild(ingredientDiv.firstChild);
    }
  });

  ingredientDiv.append(ingredientName, removeIngredient);
  parentContainer.append(ingredientDiv);

}

addButton.addEventListener('click', () => {
  const inputVal = itemInput.value;
  if (inputVal != '' && inputVal != null){
    const result = writeUserData('Other', inputVal);
    if (result) {
      createItemDiv(inputVal, menuContainer);
    }
  }

});

addPizzaButton.addEventListener('click', () => {
  const inputPizza = pizzaInput.value;
  const key = "Pizza's";
  if (inputPizza != '' && inputPizza != null){
    const result = writeUserData(key, inputPizza);
    if (result) {
      createPizzaDiv(key, pizzaContainer, inputPizza);
    }
  }
});


addPizzMenuButton.addEventListener('click', () => {
  const inputPizza = pizazMenuInput.value;
  pizzaInput.value = '';
  const key = 'PizzaMenu';
  let newPizza = new Pizza();
  if (inputPizza != '' && inputPizza != null) {
    const result = wirtePizzaData(key, pizazMenuInput, newPizza);
    if (result) {
      // createPizzaDiv(key, pizzaMenuContainer, inputPizza);
    }
  }
});



async function showPizzaMenu(startPath, container) {
  let myData = await readUserData(startPath, '');
  console.log(myData);
  for (const key in myData) {
    // console.log(`Key: ${key}`);
    createPizzaDiv(startPath, container, key);
    const keyPath = startPath + '/' + key;
    let keyDiv = document.getElementById(keyPath); // here is the problem // path name must be given
    for (const item in myData[key]) {  
        createItemDiv(item, keyDiv);
        const itemPath = keyPath + '/' + item;
        let itemDiv = document.getElementById(itemPath);
        itemDiv.className = 'itemDiv';
        // console.log(itemDiv)
      for (const ingredient in myData[key][item]) {
        createIngredientDiv(ingredient, itemDiv);
      }
    }
  }
}

async function showCurrentMenu() {
  let myData = await readUserData('Other', '');
  console.log(myData);
  for (const key in myData) {
    const keyPath = "Other/" + key
    createItemDiv(key, menuContainer);
    let keyDiv = document.getElementById(keyPath);
    for (const ingredient in myData[key]) {
      // console.log(ingredient);
      createIngredientDiv(ingredient, keyDiv);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  showPizzaMenu("Pizza's", pizzaContainer);
  showPizzaMenu('PizzaMenu', pizzaMenuContainer);
  showCurrentMenu();
});


