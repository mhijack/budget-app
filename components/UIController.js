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
	};

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
				'<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline" /></button></div></div></div>';
		} else if (type === 'exp') {
			element = DOMStrings.expenseContainer;
			html =
				'<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
		}
		// Replace placeholder text with data from obj
		newHtml = html.replace('%id%', obj.id);
		newHtml = newHtml.replace('%description%', obj.description);
		newHtml = newHtml.replace('%value%', obj.value);
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
		document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
		document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
		document.querySelector(DOMStrings.expenseLabel).textContent = obj.totalExp;
		obj.percentage > 0 ?
			(document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%') :
			(document.querySelector(DOMStrings.percentageLabel).textContent = '---');
	};

	return public;
})();