function colorInput(inputId) {
    const input = document.getElementById(inputId);

    // Add the shadow class immediately
    input.classList.add('input-focused');

    // Function to handle clicks outside the input
    function onClickOutside(event) {
    if (!input.contains(event.target)) {
        input.classList.remove('input-focused');
        document.removeEventListener('mousedown', onClickOutside); // Remove listener
    }
    }

    // Add the event listener immediately
    document.addEventListener('mousedown', onClickOutside);
}

  // Attach event listeners to email and password inputs
['email', 'password'].forEach((inputId) => {
    const input = document.getElementById(inputId);

    // Add focus event for better accessibility
    input.addEventListener('focus', () => colorInput(inputId));

    // Add click event for direct activation
    input.addEventListener('click', () => colorInput(inputId));
});
