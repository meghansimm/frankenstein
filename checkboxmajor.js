
    document.addEventListener('DOMContentLoaded', () => {
        const masterCheckbox = document.getElementById('hamburger');
        const childCheckboxes = document.querySelectorAll('input[type="checkbox"]');

        masterCheckbox.addEventListener('change', () => {
            if (!masterCheckbox.checked) { // If the master checkbox is unchecked
                childCheckboxes.forEach(checkbox => {
                    checkbox.checked = false; // Uncheck each child checkbox
                });
            }
        });
    });
