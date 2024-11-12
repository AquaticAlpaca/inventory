const API_URL = '/parts';
let inventoryParts = [];
let partIdToDelete;

/* v8 ignore start */
$(document).ready(function() {
    fetchParts();

    $('body').on('click', '.delete-button', function() {
        partIdToDelete = $(this).parent().data('part-id');
        $('#deleteConfirmationModal').modal('show');
    });

    $('body').on('click', '#confirmDeleteButton', function() {
        $('#deleteConfirmationModal').modal('hide');
        deletePart(partIdToDelete);
    });
});
/* v8 ignore stop */

/* v8 ignore start */
function fetchParts() {
    $('#loadingIndicator').show();
    clearPage();

    $.ajax({
        url: `${API_URL}/fetch`,
        type: 'GET',
        success: handleFetchSuccess,
        error: handleFetchError
    });
}
/* v8 ignore stop */

/* v8 ignore start */
function handleFetchSuccess(response) {
    $('#loadingIndicator').hide();
    if (response.items && response.items.length > 0) {
        inventoryParts = response.items;
        displayParts(inventoryParts);
        searchParts();
    } else {
        $('#partsList').html('<p>No parts found.</p>');
    }
}
/* v8 ignore stop */

/* v8 ignore start */
function handleFetchError(xhr, status, error) {
    $('#loadingIndicator').hide();
    $('#errorMessage').text('Failed to load parts: ' + error);
}
/* v8 ignore stop */

function displayParts(parts) {
    const partsHtml = parts.map(part => `
        <div class="card mb-3">
            <div class="card-body" data-part-id="${part.id}">
                <h5 class="card-title">${part.name} (Part Number: ${part.partNumber})</h5>
                <p class="card-text">Status: ${part.status}</p>
                <p class="card-text">Quantity: ${part.quantity}</p>
                <p class="card-text">Location: ${part.location}</p>
                <button class="btn btn-outline-secondary" onclick="editPart('${part.id}')">Edit</button>
                <button class="btn btn-outline-danger delete-button">Delete</button>
            </div>
        </div>
    `).join('');
    $('#partsList').append(partsHtml);
}

/* v8 ignore start */
function searchParts() {
    const searchTerm = $('#searchInput').val().toLowerCase();
    clearPage();
    const filteredParts = inventoryParts.filter(part =>
        part.partNumber.toLowerCase().includes(searchTerm) ||
        part.name.toLowerCase().includes(searchTerm)
    );
    displayParts(filteredParts);
}
/* v8 ignore stop */

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

/* v8 ignore start */
function deletePart(partId) {
    $.ajax({
        url: `${API_URL}/delete`,
        type: 'POST',
        contentType: 'application/json',
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        },
        data: JSON.stringify({ id: partId }),
        success: handleDeleteSuccess,
        error: handleDeleteError
    });
}
/* v8 ignore stop */

/* v8 ignore start */
function handleDeleteSuccess(response) {
    if (response.success) {
        showToast(response.message, 'success');
        fetchParts(); // Refresh the list after deletion
    } else {
        showToast(response.message, 'danger');
    }
}
/* v8 ignore stop */

/* v8 ignore start */
function handleDeleteError(xhr) {
    let errorMessage = 'Failed to delete item: ' + xhr.responseText;
    if (xhr.status === 404) {
        errorMessage = "The selected part no longer exists. Please reload the page to try again.";
    }
    showToast(errorMessage, 'danger');
}
/* v8 ignore stop */

function clearPage() {
    $('#partsList').empty();
    $('#errorMessage').text('');
}

function showToast(message, type) {
    const toastHTML = `
        <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header">
                <strong class="me-auto">${type === 'success' ? 'Success' : 'Error'}</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">${message}</div>
        </div>
    `;

    const toastContainer = document.querySelector('.toast-container');
    toastContainer.insertAdjacentHTML('beforeend', toastHTML);

    const toastElement = toastContainer.lastElementChild;
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
}

module.exports = {
    displayParts,
    clearPage,
    getCookie,
    showToast
};
