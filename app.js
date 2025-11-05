import { getDatabase, ref, set, remove, onValue, child, get} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";

const addButton = document.getElementById('addButton');
const itemInput = document.getElementById('item');
const menuContainer = document.getElementById('menuContainer');

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

function createItemDiv(name, parentContainer) {
  let itemContainer = document.createElement('div');
  itemContainer.className = 'itemContainer';
  let itemDiv = document.createElement('div');
  let itemName = document.createElement('span');
  let removeItem = document.createElement('button');

  // add ingredient
  let addIngredientContainer = document.createElement('div');
  let inputIngedient = document.createElement('input');
  inputIngedient.type = 'text';
  inputIngedient.placeholder = 'add ingredient';
  let addIngredient = document.createElement('button'); // WPI
  addIngredient.textContent = 'add';

  itemName.textContent = name;
  itemDiv.id = name;
  removeItem.textContent = 'remove';

  removeItem.addEventListener('click', () => {
    removeUserData('', itemDiv.id);
    while (itemContainer.firstChild) {
      itemContainer.removeChild(itemContainer.firstChild);
    }
  });

  addIngredient.addEventListener('click', () => {
    const inputVal = inputIngedient.value;
    if (inputVal != '' && inputVal != null){
      writeUserData(itemDiv.id, inputVal);
      createIngredientDiv(inputVal, itemDiv);
    }
  });

  itemDiv.append(itemName, removeItem);
  addIngredientContainer.append(inputIngedient, addIngredient);
  itemContainer.append(itemDiv, addIngredientContainer);
  parentContainer.append(itemContainer);
  console.log(name);
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

// function createItem(userId)
addButton.addEventListener('click', () => {
  const inputVal = itemInput.value;
  if (inputVal != '' && inputVal != null){
    const result = writeUserData('', inputVal);
    if (result) {
      createItemDiv(inputVal, menuContainer);
    }
  }

});

async function showCurrentMenu() {
  let myData = await readUserData('', '');
  console.log(myData);
  for (const key in myData) {
    createItemDiv(key, menuContainer);
    let keyDiv = document.getElementById(key);
    for (const ingredient in myData[key]) {
      createIngredientDiv(ingredient, keyDiv);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  showCurrentMenu();
});


