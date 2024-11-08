'use strict';


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
            <div id="pagination"></div>
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

    test('setupPagination should create pagination buttons', () => {
        const response = {
            has_previous: true,
            previous_page_number: 1,
            has_next: true,
            next_page_number: 3,
            totalItems: 20
        };

        testSubject.setupPagination(response);

        expect($('#pagination').html()).toContain('Previous');
        expect($('#pagination').html()).toContain('Next');
    });

    test('showToast should display a toast message', () => {
        testSubject.showToast('Test message', 'success');

        expect($('.toast-container').children().length).toBe(1);
        expect($('.toast-body').text()).toBe('Test message');
    });
});
