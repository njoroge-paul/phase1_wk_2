const itemList = document.getElementById('list');
const addItemBtn = document.getElementById('btn');
const itemInput = document.getElementById('item');

let shoppingList = [];

addItemBtn.addEventListener('click', () => {
    const item = itemInput.value.trim();
    if (item) {
        shoppingList.push(item);
        itemInput.value = '';
        createList();
    }
});


function createList() {
    itemList.innerHTML = '';
    shoppingList.forEach((item, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = item;
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => {
            shoppingList.splice(index, 1);
            createList();
        });
        listItem.appendChild(deleteBtn);
        listItem.addEventListener('click', () => {
            shoppingList.splice(index, 1);
            createList();
        });
        itemList.appendChild(listItem);
    });
}

createList();