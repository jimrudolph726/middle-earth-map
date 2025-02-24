
document.getElementById("allItemCheckbox").addEventListener("change", function () {
    let itemCheckboxes = document.querySelectorAll("#itemsSection input.itemCheckbox");

    itemCheckboxes.forEach(checkbox => {
        checkbox.checked = this.checked;
        checkbox.dispatchEvent(new Event("change"));  // Ensures MarkerListeners function runs
    });
});