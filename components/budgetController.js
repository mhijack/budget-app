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

	// Data structure
	const data = {
		allItems: {
			exp: [],
			inc: []
		},
		totals: {
			exp: 0,
			inc: 0
		},
		budget: 0,
		percentage: null
	};

	// calculate total amount depending on 'inc' or 'exp'
	const calculateTotal = type => {
		let sum = 0;
		for (let item of data.allItems[type]) {
			sum += item.value;
		}
		data.totals[type] = sum;
		return sum;
	};

	// Add new Expense or Income into data structure
	const addItem = (typ, desc, val) => {
		let newItem, ID;

		// Create new ID
		ID = data.allItems[typ].length > 0 ? data.allItems[typ][data.allItems[typ].length - 1].id + 1 : 0;

		// Create new item based on 'inc' or 'exp' type
		if (typ === 'exp') {
			newItem = new Expense(ID, desc, val);
		} else if (typ === 'inc') {
			newItem = new Income(ID, desc, val);
		}

		// Push into data structure
		data.allItems[typ].push(newItem);

		// Return new item
		return newItem;
	};

	const calculateBudget = () => {
		// Calculate total income and expenses
		calculateTotal('inc');
		calculateTotal('exp');

		// Calculate the budget: income - expenses
		data.budget = data.totals.inc - data.totals.exp;

		// Calculate percentage: expense / income (only calculate if income not 0)
		data.totals.inc > 0
			? (data.percentage = Math.round(data.totals.exp / data.totals.inc * 100))
			: (data.percentage = -1);
	};

	const getBudget = () => {
		return {
			budget: data.budget,
			totalInc: data.totals.inc,
			totalExp: data.totals.exp,
			percentage: data.percentage
		};
	};

	return {
		addItem,
		calculateBudget,
		getBudget,
		testing: () => {
			console.log(data);
		}
	};
})();
