document.addEventListener('DOMContentLoaded', function() {
    const addButton = document.querySelector('.add-button');

    addButton.addEventListener('click', function() {
        const beverageFieldsets = document.querySelectorAll('fieldset.beverage');
        const nextBeverageNumber = beverageFieldsets.length + 1;

        const firstBeverage = document.querySelector('fieldset.beverage');
        const newBeverage = firstBeverage.cloneNode(true);

        const heading = newBeverage.querySelector('.beverage-count');
        heading.textContent = `Напиток №${nextBeverageNumber}`;

        const select = newBeverage.querySelector('select');
        select.selectedIndex = 0;

        const radioButtons = newBeverage.querySelectorAll('input[type="radio"]');
        radioButtons.forEach((radio, index) => {
            radio.checked = index === 0;
            radio.name = `milk_${nextBeverageNumber}`;
        });

        const checkboxes = newBeverage.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
            checkbox.name = `options_${nextBeverageNumber}`;
        });

        addButton.parentElement.before(newBeverage);
    });
});