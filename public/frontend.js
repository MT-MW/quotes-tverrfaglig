const editButtons = document.querySelectorAll('.editBtn');

const textarea = document.getElementById('newQuoteTextarea');
const originInput = document.getElementById('quoteOriginInput');
const quoteIdInput = document.getElementById('quoteId');
const publishButton = document.getElementById('publishButton');

editButtons.forEach(button => {
    button.addEventListener('click', () => {
        textarea.value = button.dataset.quoteText;
        originInput.value = button.dataset.quoteOrigin;
        quoteIdInput.value = button.dataset.quoteId;

        formActionInput.value = 'update';
        publishButton.textContent = 'UPDATE';

        document.querySelector('.createQuote')
            .scrollIntoView({ behavior: 'smooth' });
    });
});
