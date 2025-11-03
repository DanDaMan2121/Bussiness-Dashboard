import { getDatabase, ref, set, remove, onValue, child, get} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";

const addButton = document.getElementById('addButton');
const itemInput = document.getElementById('item');
const menuContainer = document.getElementById('menuContainer');

function writeUserData(headNode, userId, name, email) {
  const db = getDatabase();
  let myList = [];
  myList.push(name);
  myList.push(email);
  set(ref(db, headNode + '/' + userId), {
    ingredients: myList,
  });
}

function removeUserData(userId) {
  const db = getDatabase();
  remove(ref(db, 'users/' + userId));

}

function readUserData(headNode, userId) { // a single snapshot of the data
  const dbRef = ref(getDatabase());
  let myMenuItems = []
  get(child(dbRef, headNode + '/' + userId)).then((snapshot) => {
    if (snapshot.exists()){
      console.log(snapshot.val());
      myMenuItems.push(snapshot.val());
    } else {
      console.log('No data available');
    }
  }).catch((error) => {
    console.error(error);
  });
  return myMenuItems;
}

// function createItem(userId)
addButton.addEventListener('click', () => {
  const inputVal = itemInput.value;
  if (inputVal != '' && inputVal != null){
    let itemDiv = document.createElement('div');
    let itemName = document.createElement('span');
    let removeItem = document.createElement('button');

    itemName.textContent = inputVal;
    removeItem.textContent = 'remove';

    removeItem.addEventListener('click', () => {
      while (itemDiv.firstChild) {
        itemDiv.removeChild(itemDiv.firstChild);
      }
    });

    itemDiv.append(itemName, removeItem);
    menuContainer.append(itemDiv);
    console.log(inputVal);
  }

});



console.log('run');
// writeUserData('sink', 'awesome', 'drink@gmail.com');
// writeUserData('mirror', 'reflection', 'you@gmail.com')
// writeUserData('Pizza', 'toilet', 'burger', 'fries@gmail.com');
// removeUserData('sink');
// removeUserData('mirror');



// Initialize the FirebaseUI Widget using Firebase.


