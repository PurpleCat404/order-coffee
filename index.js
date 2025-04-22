document.addEventListener('DOMContentLoaded', function() {
	const modal = document.getElementById('modal');
	const modalContent = document.querySelector('.modal-content');
	const form = document.getElementById('coffee-form');
	const addButton = document.querySelector('.add-button');
  
	function getDrinkWord(count) {
	  const lastDigit = count % 10;
	  const lastTwoDigits = count % 100;
	  
	  if (lastDigit === 1 && lastTwoDigits !== 11) return 'напиток';
	  if (lastDigit >= 2 && lastDigit <= 4 && !(lastTwoDigits >= 12 && lastTwoDigits <= 14)) return 'напитка';
	  return 'напитков';
	}
  
	function getDrinkName(value) {
	  const names = {
		espresso: 'Эспрессо',
		capuccino: 'Капучино',
		cacao: 'Какао'
	  };
	  return names[value] || value;
	}
  
	function getMilkName(value) {
	  const milks = {
		'usual': 'обычное',
		'no-fat': 'обезжиренное',
		'soy': 'соевое',
		'coconut': 'кокосовое'
	  };
	  return milks[value] || value;
	}
  
	function getOptionsText(fieldset) {
	  const options = [];
	  fieldset.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
		const optionTexts = {
		  'whipped cream': 'взбитые сливки',
		  'marshmallow': 'зефирки',
		  'chocolate': 'шоколад',
		  'cinnamon': 'корица'
		};
		options.push(optionTexts[checkbox.value] || checkbox.value);
	  });
	  return options.join(', ');
	}
  
	function createOrderTable() {
	  const fieldsets = document.querySelectorAll('fieldset.beverage');
	  let tableHTML = `
		<table class="order-table">
		  <thead>
			<tr>
			  <th>Напиток</th>
			  <th>Молоко</th>
			  <th>Дополнительно</th>
			</tr>
		  </thead>
		  <tbody>
	  `;
  
	  fieldsets.forEach(fieldset => {
		const drink = getDrinkName(fieldset.querySelector('select').value);
		const milk = getMilkName(fieldset.querySelector('input[type="radio"]:checked').value);
		const options = getOptionsText(fieldset);
  
		tableHTML += `
		  <tr>
			<td>${drink}</td>
			<td>${milk}</td>
			<td>${options}</td>
		  </tr>
		`;
	  });
  
	  tableHTML += `
		  </tbody>
		</table>
	  `;
	  return tableHTML;
	}
  
	function openModal() {
	  const count = document.querySelectorAll('fieldset.beverage').length;
	  const word = getDrinkWord(count);
	  modalContent.innerHTML = `
		<p>Вы заказали ${count} ${word}</p>
		${createOrderTable()}
	  `;
	  modal.classList.add('active');
	}
  
	function closeModal() {
	  modal.classList.remove('active');
	}
  
	form.addEventListener('submit', function(e) {
	  e.preventDefault();
	  openModal();
	});
  
	document.querySelector('.close-modal').addEventListener('click', closeModal);
  
	modal.addEventListener('click', function(e) {
	  if (e.target === modal) closeModal();
	});
  
	document.addEventListener('keydown', function(e) {
	  if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
	});
  
	function addDeleteButton(fieldset) {
	  if (fieldset.querySelector('.delete-button')) return;
  
	  const deleteButton = document.createElement('button');
	  deleteButton.className = 'delete-button';
	  deleteButton.textContent = '×';
	  deleteButton.addEventListener('click', function(e) {
		e.preventDefault();
		if (document.querySelectorAll('fieldset.beverage').length > 1) {
		  fieldset.remove();
		  renumberBeverages();
		  updateDeleteButtons();
		}
	  });
  
	  fieldset.appendChild(deleteButton);
	}
  
	function renumberBeverages() {
	  document.querySelectorAll('fieldset.beverage').forEach((fieldset, i) => {
		fieldset.querySelector('.beverage-count').textContent = `Напиток №${i+1}`;
		fieldset.querySelectorAll('input[type="radio"]').forEach(radio => {
		  radio.name = `milk_${i+1}`;
		});
		fieldset.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
		  checkbox.name = `options_${i+1}`;
		});
	  });
	}
  
	function updateDeleteButtons() {
	  const fieldsets = document.querySelectorAll('fieldset.beverage');
	  document.querySelectorAll('.delete-button').forEach(btn => {
		btn.style.display = fieldsets.length > 1 ? 'block' : 'none';
	  });
	}
  
	addButton.addEventListener('click', function() {
	  const fieldsets = document.querySelectorAll('fieldset.beverage');
	  const newBeverage = fieldsets[0].cloneNode(true);
	  const newNumber = fieldsets.length + 1;
  
	  newBeverage.querySelector('.beverage-count').textContent = `Напиток №${newNumber}`;
	  newBeverage.querySelector('select').selectedIndex = 0;
	  
	  newBeverage.querySelectorAll('input[type="radio"]').forEach((radio, i) => {
		radio.checked = i === 0;
		radio.name = `milk_${newNumber}`;
	  });
  
	  newBeverage.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
		checkbox.checked = false;
		checkbox.name = `options_${newNumber}`;
	  });
  
	  newBeverage.querySelector('.delete-button')?.remove();
	  addButton.parentElement.before(newBeverage);
	  addDeleteButton(newBeverage);
	  updateDeleteButtons();
	});
  
	document.querySelectorAll('fieldset.beverage').forEach(fieldset => {
	  addDeleteButton(fieldset);
	});
	updateDeleteButtons();
  });