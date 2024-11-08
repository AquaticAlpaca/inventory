const API_URL = '/parts';
let currentPage = 1;
const itemsPerPage = 10;
let inventoryParts = [];
let partIdToDelete;

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

function fetchParts(searchTerm = '', page = 1) {
    $('#loadingIndicator').show();
    clearPage();

    $.ajax({
        url: `${API_URL}/fetch?page=${page}&search=${searchTerm}`,
        type: 'GET',
        success: handleFetchSuccess,
        error: handleFetchError
    });
}

function handleFetchSuccess(response) {
    $('#loadingIndicator').hide();
    if (response.items && response.items.length > 0) {
        inventoryParts = response.items;
        displayParts(inventoryParts);
        searchParts();
        setupPagination(response);
    } else {
        $('#partsList').html('<p>No parts found.</p>');
    }
}

function handleFetchError(xhr, status, error) {
    $('#loadingIndicator').hide();
    $('#errorMessage').text('Failed to load parts: ' + error);
}

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

function setupPagination(response) {
    $('#pagination').empty();
    if (response.has_previous) {
        $('#pagination').append(createPaginationButton('Previous', response.previous_page_number));
    }
    for (let i = 1; i <= Math.ceil(response.totalItems / itemsPerPage); i++) {
        $('#pagination').append(createPaginationButton(i, i, i === currentPage));
    }
    if (response.has_next) {
        $('#pagination').append(createPaginationButton('Next', response.next_page_number));
    }
}

function createPaginationButton(label, pageNumber, isActive = false) {
    return `
        <button class="btn btn-secondary ${isActive ? 'active' : ''}" onclick="changePage(${pageNumber})">
            ${label}
        </button>
    `;
}

function searchParts() {
    const searchTerm = $('#searchInput').val().toLowerCase();
    clearPage();
    currentPage = 1; // Reset to first page
    const filteredParts = inventoryParts.filter(part =>
        part.partNumber.toLowerCase().includes(searchTerm) ||
        part.name.toLowerCase().includes(searchTerm)
    );
    displayParts(filteredParts);
    setupPagination({ totalItems: filteredParts.length });
}

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

function handleDeleteSuccess(response) {
    if (response.success) {
        showToast(response.message, 'success');
        fetchParts(); // Refresh the list after deletion
    } else {
        showToast(response.message, 'danger');
    }
}

function handleDeleteError(xhr) {
    let errorMessage = 'Failed to delete item: ' + xhr.responseText;
    if (xhr.status === 404) {
        errorMessage = "The selected part no longer exists. Please reload the page to try again.";
    }
    showToast(errorMessage, 'danger');
}

function clearPage() {
    $('#partsList').empty();
    $('#pagination').empty();
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

function changePage(page) {
    currentPage = page;
    fetchParts($('#searchInput').val(), currentPage); // Fetch parts for the current page
}

module.exports = {
    displayParts: displayParts,
    setupPagination: setupPagination,
    showToast: showToast
};
