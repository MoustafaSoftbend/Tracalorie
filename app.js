// Storge Controller
const StorgeCtrl = (function(){
    // Public methods
    return {
        storeItem: function(item){
            let items;
            // Check if any items
            if (localStorage.getItem('items') === null){
                items = [];
                // Push the new item
                items.push(item)
                // Set local storage
                localStorage.setItem('items', JSON.stringify(items));
            }else {
                items = JSON.parse(localStorage.getItem('items'));

                // Push the new item
                items.push(item);

                // Re set ls
                localStorage.setItem('items', JSON.stringify(items))
            }
        },
        getItemsFromStorage: function() {
            let items;
            if(localStorage.getItem('items') === null) {
                items = [];
            }else {
                items = JSON.parse(localStorage.getItem('items'))
            }
            return items
        },
        updateItemStorage: function(updatedItem) {
            let items = JSON.parse(localStorage.getItem('items'));
            
            items.forEach((item,index) => {
                if (updatedItem.id === item.id){
                    items.splice(index, 1, updatedItem);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItemFromStorage: function(id) {
            let items = JSON.parse(localStorage.getItem('items'));
            
            items.forEach((item,index) => {
                if (id === item.id){
                    items.splice(index, 1);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        clearItemsFromStorage: function() {
            localStorage.removeItem('items');
        }
    }
})()

// Item Contoller
const itemCtrl = (function () {
    // Item Constructor
    const Item = function(id, name, calories) {
        this.id = id;
        this.name = name,
        this.calories = calories;
    }

    // Data Structure / State
    const data = {
        items: StorgeCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
    }

    // Public function
    return {
        getItems: function(){
            return data.items
        },
        addItem: function(name, calories) {
            let ID
            // Creat ID
            if(data.items.length > 0){
                ID = data.items[data.items.length -1].id+1;
            }else {
                ID= 0
            }

            // Calories to number
            calories = parseInt(calories);

            // Create new item
            newItem = new Item(ID, name, calories);

            // Add to items Array
            data.items.push(newItem);

            return newItem
        },
        getItemById: function(id) {
            let found = null;
            // Loop through items
            data.items.forEach(item => {
                if (item.id === id){
                    found = item
                }
            });

            return found
        },
        updateItem : function(name, calories) {
            // Calories to number
            calories = parseInt(calories);
            let found = null;
            
            data.items.forEach(item => {
                if(item.id === data.currentItem.id) {
                    item.name = name,
                    item.calories =calories;
                    found = item;
                }
            })
            
            return found
        },
        deleteItem: function(id) {
            // Get ids
            ids =  data.items.map(function(item) {
                return item.id;
            })

            // Get the index
            const index = ids.indexOf(id);

            data.items.splice(index, 1);

        },
        clearAllItems: function(){
            data.items = [];
        },
        setCurentItem: function(item) {
            data.currentItem = item;
        },
        getCurrentItem: function() {
            return data.currentItem
        },
        getTotalClories: function() {
            let total =0;

            data.items.forEach(item => {
                total += item.calories;
            })

            // Set total calories
            data.totalCalories = total;

            return data.totalCalories;
        },
        logData: function() {
            return data;
        }
    }
})()


// UI Controller
const UICtrl = (function () {

    const UISelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        deleteBtn: '.delete-btn',
        updateBtn: '.update-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        iteNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'
    }
    
    // Public methods
    return {
        populateItemList: function(items) {
            let html= '';
            items.forEach(item => {
                html += `<li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong> <em>${item.calories}</em>
                <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
            </li>`;
            });

            // Insert list items
            document.querySelector(UISelectors.itemList).innerHTML= html;
        },
        getItemInput: function(){
            return {
                name: document.querySelector(UISelectors.iteNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: function(item) {
            // Show the list
            document.querySelector(UISelectors.itemList).style.display = 'block';
            // Create li element
            const li = document.createElement('li');
            // Add class 
            li.className = 'collection-item';
            // Add ID
            li.id = `item-${item.id}`;
            // Add html
            li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories}</em>
            <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;
            // Insert Item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
        },
        updateListItem: function(item) {
            let listItems = document.querySelectorAll(UISelectors.listItems);

            // turn Node list into array
            listItems = Array.from(listItems);

            listItems.forEach(listItem =>{
                const itemId = listItem.getAttribute('id');

                if(itemId === `item-${item.id}`) {
                    document.querySelector(`#${itemId}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories}</em>
                    <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;
                }
            })
        },
        deleteListItem: function(id){
            const itemId = `#item-${id}`;
            const item = document.querySelector(itemId);
            item.remove();
        },
        clearInput: function() {
            document.querySelector(UISelectors.iteNameInput).value ='';
            document.querySelector(UISelectors.itemCaloriesInput).value ='';
        },
        addItemToForm: function(){
            document.querySelector(UISelectors.iteNameInput).value =itemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value =itemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        removeItems: function() {
            let listItems = document.querySelectorAll(UISelectors.listItems);

            // Turn node list into array
            listItems = Array.from(listItems);

            listItems.forEach(item => {
                item.remove();
            });
        },
        hideList: function(){
            document.querySelector(UISelectors.itemList).style.display ='none';
        },
        showTotalCalories: function(totalCalories) {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories
        },
        clearEditState: function() {
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display ='none';
            document.querySelector(UISelectors.deleteBtn).style.display ='none';
            document.querySelector(UISelectors.backBtn).style.display ='none';
            document.querySelector(UISelectors.addBtn).style.display ='inline';
        },
        showEditState: function() {
            document.querySelector(UISelectors.updateBtn).style.display ='inline';
            document.querySelector(UISelectors.deleteBtn).style.display ='inline';
            document.querySelector(UISelectors.backBtn).style.display ='inline';
            document.querySelector(UISelectors.addBtn).style.display ='none';
        },
        getSelecters: function() {
            return UISelectors
        }
    }
})()

// App Controller
const App = (function (itemCtrl, StorgeCtrl ,UICtrl) {
    // Load event listners
    const loadEventListners = function() {
        // Get UI Selectors
        const UISelectors = UICtrl.getSelecters();

        // Add Item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        // Disable submit on enter
        document.addEventListener('keypress', function(e){
            if(e.keyCode === 13 || e.which === 13) {
                e.preventDefault();
                return false
            }
        })

        // Edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

        // Update item event
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

        // Back button event
        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

        // Dlete item event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', ItemDeleteSubmit);

        // Clear items event
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
    }

    // Additem submit
    const itemAddSubmit = function(e) {
        e.preventDefault();

        // Get form input from UI controller
        const input = UICtrl.getItemInput();

        // Check for name and calorie input
        if(input.name !== '' && input.calories!== '') {
            // Add Item
            const newItem = itemCtrl.addItem(input.name, input.calories);
            // add itel to ui list
            UICtrl.addListItem(newItem);
            // Get total Calories
            const totalCalories = itemCtrl.getTotalClories();

            // Add total clories to the ui
            UICtrl.showTotalCalories(totalCalories);

            // Store in local storage
            StorgeCtrl.storeItem(newItem);

            // Clear fields
            UICtrl.clearInput();
        }

    }

    // Edit item click
    const itemEditClick = function(e) {
        e.preventDefault();
        if (e.target.classList.contains('edit-item')) {
            // Get list item id (item-0, item-1)
            const listId = e.target.parentNode.parentNode.id;
            
            // Break into an array
            const listIdArray = listId.split('-');
            
            // Get the actual id
            const id = parseInt(listIdArray[1]);

            // Get item
            const itemToEdit = itemCtrl.getItemById(id);
            
            // Set current item
            itemCtrl.setCurentItem(itemToEdit);

            // Add item to form
            UICtrl.addItemToForm();
        }
    }

    // Delete item 
    const ItemDeleteSubmit = function(e) {
        // Get current item
        const currentItem = itemCtrl.getCurrentItem();

        // Delte from data structure
        itemCtrl.deleteItem(currentItem.id);

        // Delte from ui
        UICtrl.deleteListItem(currentItem.id);

        // Get total Calories
        const totalCalories = itemCtrl.getTotalClories();

        // Add total clories to the ui
        UICtrl.showTotalCalories(totalCalories);

        // Delete from LS
        StorgeCtrl.deleteItemFromStorage(currentItem.id)

        UICtrl.clearEditState();

        e.preventDefault();
    }

    // Clear Items event
    const clearAllItemsClick = function() {
        // Dlete all items from data structure
        itemCtrl.clearAllItems();

        // Get total Calories
        const totalCalories = itemCtrl.getTotalClories();

        // Add total clories to the ui
        UICtrl.showTotalCalories(totalCalories);

        // Remove from ui
        UICtrl.removeItems();

        // Clear from Local Storage
        StorgeCtrl.clearItemsFromStorage();

        // Hide UL
        UICtrl.hideList();
    }

    // Item update Submit
    const itemUpdateSubmit = function(e) {
        e.preventDefault();

        // Get item input
        const input = UICtrl.getItemInput();
        
        // Update item
        const updatedItem = itemCtrl.updateItem(input.name, input.calories);

        
        // Update UI
        UICtrl.updateListItem(updatedItem)

        // Get total Calories
        const totalCalories = itemCtrl.getTotalClories();

        // Add total clories to the ui
        UICtrl.showTotalCalories(totalCalories);

        // Update local storage
        StorgeCtrl.updateItemStorage(updatedItem);

        UICtrl.clearEditState();
    }

    // Public methods
    return {
        init: function(){
            // Clear edit state / set initial set
            UICtrl.clearEditState();

            console.log('Initializing App...');

            // Fetch items from data structor
            const items = itemCtrl.getItems();

            // Check if any items
            if(items.length === 0) {
                UICtrl.hideList()
            }

            // Get total Calories
            const totalCalories = itemCtrl.getTotalClories();

            // Add total clories to the ui
            UICtrl.showTotalCalories(totalCalories);

            // Populate List with items
            UICtrl.populateItemList(items);

            // Load event listners
            loadEventListners();
        }
    }
})(itemCtrl,StorgeCtrl, UICtrl);

App.init();