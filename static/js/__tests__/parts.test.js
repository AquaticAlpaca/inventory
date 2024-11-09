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

const testSubject = require('../parts');

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

        testSubject.displayParts(parts);

        expect($('#partsList').html()).toContain('Part 1 (Part Number: PN001)');
        expect($('#partsList').html()).toContain('Part 2 (Part Number: PN002)');
    });

    test('showToast should display a toast message', () => {
        testSubject.showToast('Test message', 'success');

        expect($('.toast-container').children().length).toBe(1);
        expect($('.toast-body').text()).toBe('Test message');
    });
});


describe('clearPage function', () => {
    it('should clear the parts list', () => {
        $('#partsList').append('<div>Part 1</div>');
        testSubject.clearPage();
        expect($('#partsList').children().length).toBe(0);
    });

    it('should clear the error message', () => {
        $('#errorMessage').text('An error occurred');
        testSubject.clearPage();
        expect($('#errorMessage').text()).toBe('');
    });

    it('should not affect other elements', () => {
        $('body').append('<div id="otherElement"><div>Other Content</div></div>');

        testSubject.clearPage();
        expect($('#otherElement').children().length).toBe(1); // Should still have 1 child

        $('#otherElement').remove();
    });


    it('should handle multiple calls gracefully', () => {
        $('#partsList').append('<div>Part 1</div>');
        $('#errorMessage').text('An error occurred');

        testSubject.clearPage(); // First call
        expect($('#partsList').children().length).toBe(0);
        expect($('#errorMessage').text()).toBe('');

        testSubject.clearPage(); // Second call
        expect($('#partsList').children().length).toBe(0);
        expect($('#errorMessage').text()).toBe('');
    });

    it('should not throw an error when called on empty elements', () => {
        $('#partsList').empty();
        $('#errorMessage').text('');

        expect(() => testSubject.clearPage()).not.toThrow();
    });
});
