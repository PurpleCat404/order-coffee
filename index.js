document.addEventListener('DOMContentLoaded', function() {
    // Get the add button
    const addButton = document.querySelector('.add-button');

    // Add delete buttons to existing beverage fieldsets
    addDeleteButtons();

    // Add click event listener to the add button
    addButton.addEventListener('click', function() {
        // Get all existing beverage fieldsets to determine the next number
        const beverageFieldsets = document.querySelectorAll('fieldset.beverage');
        const nextBeverageNumber = beverageFieldsets.length + 1;

        // Clone the first beverage fieldset
        const firstBeverage = document.querySelector('fieldset.beverage');
        const newBeverage = firstBeverage.cloneNode(true);

        // Update the heading to show the correct beverage number
        const heading = newBeverage.querySelector('.beverage-count');
        heading.textContent = `Напиток №${nextBeverageNumber}`;

        // Reset form selections in the new fieldset
        // Reset select to default option
        const select = newBeverage.querySelector('select');
        select.selectedIndex = 0;

        // Reset radio buttons (set first one as checked)
        const radioButtons = newBeverage.querySelectorAll('input[type="radio"]');
        radioButtons.forEach((radio, index) => {
            radio.checked = index === 0;

            // Update the name attribute to avoid conflicts with the original form
            radio.name = `milk_${nextBeverageNumber}`;
        });

        // Uncheck all checkboxes
        const checkboxes = newBeverage.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;

            // Update the name attribute to avoid conflicts
            checkbox.name = `options_${nextBeverageNumber}`;
        });

        // Remove any existing delete button from the cloned fieldset
        const existingDeleteBtn = newBeverage.querySelector('.delete-button');
        if (existingDeleteBtn) {
            existingDeleteBtn.remove();
        }

        // Insert the new beverage fieldset before the add button container
        addButton.parentElement.before(newBeverage);

        // Add delete button to the new fieldset
        addDeleteButton(newBeverage);

        // Update delete buttons visibility
        updateDeleteButtonsVisibility();
    });

    // Function to add delete buttons to all existing beverage fieldsets
    function addDeleteButtons() {
        const beverageFieldsets = document.querySelectorAll('fieldset.beverage');
        beverageFieldsets.forEach(fieldset => {
            addDeleteButton(fieldset);
        });

        // Initial update of delete buttons visibility
        updateDeleteButtonsVisibility();
    }

    // Function to add a delete button to a specific fieldset
    function addDeleteButton(fieldset) {
        // Check if the fieldset already has a delete button
        if (fieldset.querySelector('.delete-button')) {
            return;
        }

        // Create delete button
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

        // Make sure the fieldset has position relative for absolute positioning of the delete button
        fieldset.style.position = 'relative';

        // Add click event listener to the delete button
        deleteButton.addEventListener('click', function(e) {
            // Prevent event bubbling
            e.preventDefault();
            e.stopPropagation();

            // Check if there's more than one beverage fieldset
            const beverageFieldsets = document.querySelectorAll('fieldset.beverage');
            if (beverageFieldsets.length > 1) {
                // Remove this fieldset
                fieldset.parentNode.removeChild(fieldset);

                // Renumber the remaining beverage fieldsets
                renumberBeverages();

                // Update delete buttons visibility
                updateDeleteButtonsVisibility();
            }
        });

        // Add the delete button to the fieldset
        fieldset.appendChild(deleteButton);
    }

    // Function to renumber the beverage fieldsets after deletion
    function renumberBeverages() {
        const beverageFieldsets = document.querySelectorAll('fieldset.beverage');
        beverageFieldsets.forEach((fieldset, index) => {
            const heading = fieldset.querySelector('.beverage-count');
            heading.textContent = `Напиток №${index + 1}`;

            // Update name attributes for radio buttons and checkboxes
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

    // Function to update the visibility of delete buttons
    function updateDeleteButtonsVisibility() {
        const beverageFieldsets = document.querySelectorAll('fieldset.beverage');
        const deleteButtons = document.querySelectorAll('.delete-button');

        // If there's only one beverage fieldset, hide/disable all delete buttons
        if (beverageFieldsets.length === 1) {
            deleteButtons.forEach(button => {
                button.style.display = 'none';
            });
        } else {
            // Otherwise, show all delete buttons
            deleteButtons.forEach(button => {
                button.style.display = 'block';
            });
        }
    }
});