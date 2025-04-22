document.addEventListener('DOMContentLoaded', function() {
    // Получаем кнопку добавления
    const addButton = document.querySelector('.add-button');
    // Получаем кнопку отправки формы
    const submitButton = document.querySelector('.submit-button');

    // Добавляем кнопки удаления к существующим полям напитков
    addDeleteButtons();

    // Создаем модальное окно
    createModal();

    // Добавляем обработчик события клика для кнопки отправки
    submitButton.addEventListener('click', function(e) {
        e.preventDefault();
        showOrderModal();
    });

    // Добавляем обработчик события клика для кнопки добавления
    addButton.addEventListener('click', function() {
        // Получаем все существующие поля напитков, чтобы определить следующий номер
        const beverageFieldsets = document.querySelectorAll('fieldset.beverage');
        const nextBeverageNumber = beverageFieldsets.length + 1;

        // Клонируем первое поле напитка
        const firstBeverage = document.querySelector('fieldset.beverage');
        const newBeverage = firstBeverage.cloneNode(true);

        // Обновляем заголовок, чтобы показать правильный номер напитка
        const heading = newBeverage.querySelector('.beverage-count');
        heading.textContent = `Напиток №${nextBeverageNumber}`;

        // Сбрасываем выбранные значения в новой форме
        // Сбрасываем выпадающий список до значения по умолчанию
        const select = newBeverage.querySelector('select');
        select.selectedIndex = 0;

        // Сбрасываем радиокнопки (устанавливаем первую как выбранную)
        const radioButtons = newBeverage.querySelectorAll('input[type="radio"]');
        radioButtons.forEach((radio, index) => {
            radio.checked = index === 0;

            // Обновляем атрибут name, чтобы избежать конфликтов с оригинальной формой
            radio.name = `milk_${nextBeverageNumber}`;
        });

        // Снимаем выбор со всех чекбоксов
        const checkboxes = newBeverage.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;

            // Обновляем атрибут name, чтобы избежать конфликтов
            checkbox.name = `options_${nextBeverageNumber}`;
        });

        // Удаляем существующую кнопку удаления из клонированного поля
        const existingDeleteBtn = newBeverage.querySelector('.delete-button');
        if (existingDeleteBtn) {
            existingDeleteBtn.remove();
        }

        // Вставляем новое поле напитка перед контейнером кнопки добавления
        addButton.parentElement.before(newBeverage);

        // Добавляем кнопку удаления к новому полю
        addDeleteButton(newBeverage);

        // Обновляем видимость кнопок удаления
        updateDeleteButtonsVisibility();
    });

    // Функция для добавления кнопок удаления ко всем существующим полям напитков
    function addDeleteButtons() {
        const beverageFieldsets = document.querySelectorAll('fieldset.beverage');
        beverageFieldsets.forEach(fieldset => {
            addDeleteButton(fieldset);
        });

        // Начальное обновление видимости кнопок удаления
        updateDeleteButtonsVisibility();
    }

    // Функция для добавления кнопки удаления к конкретному полю
    function addDeleteButton(fieldset) {
        // Проверяем, есть ли уже кнопка удаления в поле
        if (fieldset.querySelector('.delete-button')) {
            return;
        }

        // Создаем кнопку удаления
        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.className = 'delete-button';
        deleteButton.textContent = '×';
        deleteButton.style.position = 'absolute';
        deleteButton.style.top = '10px';
        deleteButton.style.right = '10px';
        deleteButton.style.background = 'none';
        deleteButton.style.border = 'none';
        deleteButton.style.fontSize = '20px';
        deleteButton.style.cursor = 'pointer';
        deleteButton.style.color = '#ff0000';
        deleteButton.style.fontWeight = 'bold';
        deleteButton.style.padding = '0 5px';

        // Убеждаемся, что у поля есть position relative для абсолютного позиционирования кнопки удаления
        fieldset.style.position = 'relative';

        // Добавляем обработчик события клика для кнопки удаления
        deleteButton.addEventListener('click', function(e) {
            // Предотвращаем всплытие события
            e.preventDefault();
            e.stopPropagation();

            // Проверяем, есть ли больше одного поля напитка
            const beverageFieldsets = document.querySelectorAll('fieldset.beverage');
            if (beverageFieldsets.length > 1) {
                // Удаляем это поле
                fieldset.parentNode.removeChild(fieldset);

                // Перенумеровываем оставшиеся поля напитков
                renumberBeverages();

                // Обновляем видимость кнопок удаления
                updateDeleteButtonsVisibility();
            }
        });

        // Добавляем кнопку удаления к полю
        fieldset.appendChild(deleteButton);
    }

    // Функция для перенумерации полей напитков после удаления
    function renumberBeverages() {
        const beverageFieldsets = document.querySelectorAll('fieldset.beverage');
        beverageFieldsets.forEach((fieldset, index) => {
            const heading = fieldset.querySelector('.beverage-count');
            heading.textContent = `Напиток №${index + 1}`;

            // Обновляем атрибуты name для радиокнопок и чекбоксов
            const radioButtons = fieldset.querySelectorAll('input[type="radio"]');
            radioButtons.forEach(radio => {
                radio.name = `milk_${index + 1}`;
            });

            const checkboxes = fieldset.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                checkbox.name = `options_${index + 1}`;
            });
        });
    }

    // Функция для обновления видимости кнопок удаления
    function updateDeleteButtonsVisibility() {
        const beverageFieldsets = document.querySelectorAll('fieldset.beverage');
        const deleteButtons = document.querySelectorAll('.delete-button');

        // Если есть только одно поле напитка, скрываем/отключаем все кнопки удаления
        if (beverageFieldsets.length === 1) {
            deleteButtons.forEach(button => {
                button.style.display = 'none';
            });
        } else {
            // Иначе показываем все кнопки удаления
            deleteButtons.forEach(button => {
                button.style.display = 'block';
            });
        }
    }

    // Функция для создания модального окна
    function createModal() {
        // Создаем элементы модального окна
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'none';
        modal.style.position = 'fixed';
        modal.style.zIndex = '1000';
        modal.style.left = '0';
        modal.style.top = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        modal.style.overflow = 'auto';

        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        modalContent.style.backgroundColor = '#fefefe';
        modalContent.style.margin = '15% auto';
        modalContent.style.padding = '20px';
        modalContent.style.border = '1px solid #888';
        modalContent.style.width = '80%';
        modalContent.style.maxWidth = '500px';
        modalContent.style.borderRadius = '5px';
        modalContent.style.textAlign = 'center';

        const closeButton = document.createElement('span');
        closeButton.className = 'close-button';
        closeButton.textContent = '×';
        closeButton.style.color = '#aaa';
        closeButton.style.float = 'right';
        closeButton.style.fontSize = '28px';
        closeButton.style.fontWeight = 'bold';
        closeButton.style.cursor = 'pointer';

        const modalText = document.createElement('p');
        modalText.className = 'modal-text';
        modalText.style.fontSize = '18px';
        modalText.style.marginTop = '20px';

        const okButton = document.createElement('button');
        okButton.textContent = 'OK';
        okButton.style.marginTop = '20px';
        okButton.style.padding = '10px 20px';
        okButton.style.backgroundColor = '#4CAF50';
        okButton.style.color = 'white';
        okButton.style.border = 'none';
        okButton.style.borderRadius = '4px';
        okButton.style.cursor = 'pointer';

        // Добавляем обработчики событий для закрытия модального окна
        closeButton.addEventListener('click', function() {
            modal.style.display = 'none';
        });

        okButton.addEventListener('click', function() {
            modal.style.display = 'none';
        });

        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });

        // Собираем модальное окно
        modalContent.appendChild(closeButton);
        modalContent.appendChild(modalText);
        modalContent.appendChild(okButton);
        modal.appendChild(modalContent);

        // Добавляем модальное окно в DOM
        document.body.appendChild(modal);
    }

    // Функция для отображения модального окна с информацией о заказе
    function showOrderModal() {
        const beverageCount = document.querySelectorAll('fieldset.beverage').length;
        const beverageText = getDeclension(beverageCount);

        const modal = document.querySelector('.modal');
        const modalText = modal.querySelector('.modal-text');

        modalText.textContent = `Вы заказали ${beverageCount} ${beverageText}`;
        modal.style.display = 'block';
    }

    // Функция для склонения слова "напиток" в зависимости от числа
    function getDeclension(number) {
        // Получаем последнюю цифру и две последние цифры числа
        const lastDigit = number % 10;
        const lastTwoDigits = number % 100;

        // Правила склонения:
        // 1, 21, 31, ... (кроме 11, 111, ...): "напиток"
        // 2-4, 22-24, ... (кроме 12-14, 112-114, ...): "напитка"
        // 0, 5-9, 11-19, 111-119, ...: "напитков"

        if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
            return 'напитков';
        } else if (lastDigit === 1) {
            return 'напиток';
        } else if (lastDigit >= 2 && lastDigit <= 4) {
            return 'напитка';
        } else {
            return 'напитков';
        }
    }
});