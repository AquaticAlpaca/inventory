const $ = require('jquery');
const bootstrap = require('bootstrap');
jest.mock('bootstrap', () => {
    return {
        Toast: jest.fn().mockImplementation(() => {
            return {
                show: jest.fn(),
                hide: jest.fn(),
            };
        }),
    };
});

global.bootstrap = bootstrap;
global.$ = $;

const {
    displayParts,
    clearPage,
    getCookie,
    showToast
} = require('../parts');

describe('Inventory JavaScript Functions', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <div id="partsList"></div>
            <div class="toast-container"></div>
        `;
    });

    test('displayParts should render parts correctly', () => {
        const parts = [
            { id: 1, name: 'Part 1', partNumber: 'PN001', status: 'Available', quantity: 10, location: 'Warehouse A' },
            { id: 2, name: 'Part 2', partNumber: 'PN002', status: 'Unavailable', quantity: 0, location: 'Warehouse B' }
        ];

        displayParts(parts);

        expect($('#partsList').html()).toContain('Part 1 (Part Number: PN001)');
        expect($('#partsList').html()).toContain('Part 2 (Part Number: PN002)');
    });

    test('showToast should display a toast message', () => {
        showToast('Test message', 'success');

        expect($('.toast-container').children().length).toBe(1);
        expect($('.toast-body').text()).toBe('Test message');
    });
});


describe('clearPage function', () => {
    it('should clear the parts list', () => {
        $('#partsList').append('<div>Part 1</div>');
        clearPage();
        expect($('#partsList').children().length).toBe(0);
    });

    it('should clear the error message', () => {
        $('#errorMessage').text('An error occurred');
        clearPage();
        expect($('#errorMessage').text()).toBe('');
    });

    it('should not affect other elements', () => {
        $('body').append('<div id="otherElement"><div>Other Content</div></div>');

        clearPage();
        expect($('#otherElement').children().length).toBe(1); // Should still have 1 child

        $('#otherElement').remove();
    });


    it('should handle multiple calls gracefully', () => {
        $('#partsList').append('<div>Part 1</div>');
        $('#errorMessage').text('An error occurred');

        clearPage(); // First call
        expect($('#partsList').children().length).toBe(0);
        expect($('#errorMessage').text()).toBe('');

        clearPage(); // Second call
        expect($('#partsList').children().length).toBe(0);
        expect($('#errorMessage').text()).toBe('');
    });

    it('should not throw an error when called on empty elements', () => {
        $('#partsList').empty();
        $('#errorMessage').text('');

        expect(() => clearPage()).not.toThrow();
    });
});

describe('getCookie', () => {
    beforeEach(() => {
        // Reset document.cookie before each test
        Object.defineProperty(document, 'cookie', {
            writable: true,
            value: '',
        });
    });

    test('should return the value of an existing cookie', () => {
        // Set a cookie
        document.cookie = 'testCookie=value123';

        // Call getCookie and check the result
        const result = getCookie('testCookie');
        expect(result).toBe('value123');
    });

    test('should return null for a non-existing cookie', () => {
        // Set a cookie
        document.cookie = 'anotherCookie=value456';

        // Call getCookie for a cookie that does not exist
        const result = getCookie('nonExistingCookie');
        expect(result).toBeNull();
    });

    test('should return null when cookies are empty', () => {
        // No cookies set
        const result = getCookie('testCookie');
        expect(result).toBeNull();
    });


    test('should decode cookie values', () => {
        // Set a cookie with encoded value
        document.cookie = 'encodedCookie=%E2%9C%93'; // This is the check mark character (✓)

        // Call getCookie and check the result
        const result = getCookie('encodedCookie');
        expect(result).toBe('✓');
    });
});

// Jest completely fails to mock the functions called by my target.
// Improve test coverage when Jest is better.
