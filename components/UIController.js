// ================ UI CONTROLLER ================
const UIController = (() => {
	const public = {};

	// DOM classes for element selection
	const DOMStrings = {
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputBtn: '.add__btn',
		incomeContainer: '.income__list',
		expenseContainer: '.expenses__list',
		budgetLabel: '.budget__value',
		incomeLabel: '.budget__income--value',
		expenseLabel: '.budget__expenses--value',
		percentageLabel: '.budget__expenses--percentage',
		container: '.container',
		expensesPercentageLabel: '.item__percentage',
		dateLabel: '.budget__title--month',
		redFocus: 'red-focus',
	};

	const formatNumber = (num, type) => {
		let numSplit, int, dec;
		// + or - before number
		// exactly 2 decimal points
		// comma separating thousands
		// 2310.4567 -> + 2,310.46
		// 2000 -> 2,000.00

		num = Math.abs(num);
		num = num.toFixed(2);
		numSplit = num.split('.');
		int = numSplit[0];
		dec = numSplit[1];
		if (int.length > 3) {
			int = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
		}
		type === 'inc' ? int = '+ ' + int : int = '- ' + int;
		return int + '.' + dec;
	}

	// nodeListForEach(fields, () => {}))
	public.nodeListForEach = (pseudoArr, callback) => {
		for (let i = 0, n = pseudoArr.length; i < n; i += 1) {
			callback(pseudoArr[i], i);
		}
	}

	public.displayMonth = () => {
		let now, months, month, year;
		now = new Date();
		months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		month = now.getMonth();
		year = now.getFullYear();

		document.querySelector(DOMStrings.dateLabel).textContent = months[month] + ', ' + year;
	}

	// Expose DOM strings to public
	public.getDOMStrings = () => {
		return DOMStrings;
	};

	// Retrieve user input
	public.getInput = () => {
		return {
			// check if inc(rement) or exp(ense)
			type: document.querySelector(DOMStrings.inputType).value,
			// description
			description: document.querySelector(DOMStrings.inputDescription).value,
			// value (in string)
			value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
		};
	};

	// Add new item to DOM list
	public.addListItem = (obj, type) => {
		let html, newHtml, element;
		// Create HTML string with placeholder text
		if (type === 'inc') {
			element = DOMStrings.incomeContainer;
			html =
				'<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline" /></button></div></div></div>';
		} else if (type === 'exp') {
			element = DOMStrings.expenseContainer;
			html =
				'<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
		}
		// Replace placeholder text with data from obj
		newHtml = html.replace('%id%', obj.id);
		newHtml = newHtml.replace('%description%', obj.description);
		newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
		// Insert HTML into DOM
		document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
	};

	// Delete list item
	public.deleteListItem = (selectorID) => {
		// Use element.removeChild()
		document.getElementById(selectorID).parentNode.removeChild(document.getElementById(selectorID));
	}

	// clear input field
	public.clearFields = () => {
		let fields;
		// Select all input fields
		fields = Array.prototype.slice.call(
			document.querySelectorAll(`${DOMStrings.inputDescription}, ${DOMStrings.inputValue}`)
		);
		// Loop through array and clear all fields
		for (let field of fields) {
			field.value = '';
		}
		fields[0].focus();
	};

	// Display budget
	public.displayBudget = obj => {
		let type;

		obj.budget >= 0 ? type = 'inc' : type = 'exp';

		document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
		document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
		document.querySelector(DOMStrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');
		obj.percentage > 0 ?
			(document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%') :
			(document.querySelector(DOMStrings.percentageLabel).textContent = '---');
	};

	public.displayPercentages = percentages => {
		const fields = document.querySelectorAll(DOMStrings.expensesPercentageLabel);

		nodeListForEach(fields, (field, index) => {
			field.textContent = percentages[index] > 0 ? percentages[index] + '%' : '---';
		})
	}

	return public;
})();