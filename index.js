document.addEventListener('DOMContentLoaded', function() {
	const modal = document.getElementById('modal');
	const form = document.getElementById('coffee-form');
	const addButton = document.querySelector('.add-button');

	function openModal() {
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
		if (e.key === 'Escape' && modal.classList.contains('active')) {
			closeModal();
		}
	});

	// Функция для навешивания слушателя на textarea в поле "И еще вот что"
	function addTextareaListener(fieldset) {
		const textarea = fieldset.querySelector('.user-notes');
		const output  = fieldset.querySelector('.user-notes-output');
		if (!textarea || textarea.dataset.listener) return;

		textarea.addEventListener('input', () => {
			let text = textarea.value
				.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/(срочно|быстрее|побыстрее|скорее|поскорее|очень нужно)\b/gi,
					'<b>$1</b>');
			output.innerHTML = text;
		});

		textarea.dataset.listener = 'true';
	}

	// Добавляем слушатели к уже существующим fieldset
	document.querySelectorAll('fieldset.beverage').forEach(addTextareaListener);

	// Функция добавления кнопки удаления (оставлена без изменений)
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
			fieldset.querySelectorAll('input[type="radio"]').forEach((radio) => {
				radio.name = `milk_${i+1}`;
			});
			fieldset.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
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

	// При клике на +Добавить напиток клонируем, обновляем и навешиваем слушатель textarea
	addButton.addEventListener('click', function() {
		const fieldsets = document.querySelectorAll('fieldset.beverage');
		const newBeverage = fieldsets[0].cloneNode(true);
		const newNumber = fieldsets.length + 1;

		// Обновляем пронумерацию и сброс полей
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
		renumberBeverages();
		updateDeleteButtons();

		// Навешиваем слушатель на textarea
		addTextareaListener(newBeverage);
	});

	// Инициализируем кнопки удаления и слушатели для первого напитка
	document.querySelectorAll('fieldset.beverage').forEach(fieldset => {
		addDeleteButton(fieldset);
	});
	updateDeleteButtons();
});