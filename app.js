// ================ BUDGET CONTROLLER ================
const budgetController = (() => {
	class Expense {
		constructor(id, description, value) {
			this.id = id;
			this.description = description;
			this.value = value;
		}
	}

	class Income {
		constructor(id, description, value) {
			this.id = id;
			this.description = description;
			this.value = value;
		}
	}

	const data = {
		allItems: {
			exp: [],
			inc: []
		},
		totals: {
			exp: 0,
			inc: 0
		}
  };

  const addItem = (typ, desc, val) => {
    let newItem, ID;

    // Create new ID
    ID = data.allItems[typ].length > 0 ? data.allItems[typ][data.allItems[typ].length - 1].id + 1 : 0;

    // Create new item based on 'inc' or 'exp' type
    if (typ === 'exp') {
      newItem = new Expense(ID, desc, val)
    } else if (typ === 'inc') {
      newItem = new Income(ID, desc, val);
    }

    // Push into data structure
    data.allItems[typ].push(newItem);

    // Return new item
    return newItem;
  }

  return {
    addItem,
    testing: () => {
      console.log(data);
    }
  }

})();

// ================ UI CONTROLLER ================
const UIController = (() => {
	const DOMStrings = {
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputBtn: '.add__btn'
	};

	const getInput = () => {
		return {
			// check if inc(rement) or exp(ense)
			type: document.querySelector(DOMStrings.inputType).value,
			// description
			description: document.querySelector(DOMStrings.inputDescription).value,
			// value (in string)
			value: document.querySelector(DOMStrings.inputValue).value
		};
	};

	const getDOMStrings = () => {
		return DOMStrings;
	};

	return { getDOMStrings, getInput };
})();

// ================ GLOBAL CONTROLLER ================
const controller = ((budgetCtrl, UICtrl) => {
	// initialization function
	const init = () => {
		setupEventListeners();
	};

	// setup EventListeners
	const setupEventListeners = () => {
		document.querySelector(DOMStrings.inputBtn).addEventListener('click', ctrlAddItem);
		document.addEventListener('keypress', event => {
			// If enter pressed
			if (event.keyCode === 13 || event.which === 13) {
				ctrlAddItem();
			}
		});
	};

	// stores DOMStrings
	const DOMStrings = UICtrl.getDOMStrings();

	const ctrlAddItem = () => {
    let input, newItem;

		// 1. Get filled input data
    input = UICtrl.getInput();

		// 2. Add item to budget controller
    newItem = budgetCtrl.addItem(input.type, input.description, input.value);
		// 3. Add item to the UI
    console.log(newItem)
		// 4. Calculate the budget

		// 5. Display the budget on UI
	};

	return {
    init,
    ctrlAddItem
	};
})(budgetController, UIController);

controller.init();
