
    document.addEventListener('DOMContentLoaded', () => {
        const masterCheckbox = document.getElementById('collapse2');
        const childCheckboxes = document.querySelectorAll(".index input[type='checkbox']");

        masterCheckbox.addEventListener('change', () => {
            if (masterCheckbox.checked) { // If the master checkbox is unchecked
                childCheckboxes.forEach(checkbox => {
                    checkbox.checked = false; // Uncheck each child checkbox
                });
            }
        });
    });
