// __tests__/ticketSystem.test.mjs
// Unit tests for the bus ticketing system using Jest with jsdom
// These tests follow the AAA (Arrange-Act-Assert) pattern to verify DOM interactions

// Import Node.js modules for file system access and path resolution
// Import initBookingForm from the application script for testing
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initBookingForm } from '../src/script.js';

// Resolve the current file's path for accessing index.html
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// describe() groups related tests for the bus ticketing system
// Tests focus on DOM-based booking functionality
/** @jest-environment jsdom */
describe('Bus Ticket Booking System (DOM)', () => {
  let html;

  // beforeAll() sets up the test environment once before all tests
  // Loads index.html into jsdom and initializes form event listeners
  beforeAll(() => {
    // ARRANGE: Prepare the DOM environment
    const htmlPath = path.resolve(__dirname, '../src/index.html');
    console.log('Resolved path to index.html:', htmlPath);
    html = fs.readFileSync(htmlPath, 'utf8');
    document.documentElement.innerHTML = html;
    initBookingForm();
  });

  // beforeEach() resets form inputs before each test
  // Ensures a clean state for consistent test results
  beforeEach(() => {
    // ARRANGE: Clear form fields and message output
    document.getElementById('name').value = '';
    document.getElementById('destination').value = '';
    document.getElementById('seats').value = '';
    document.getElementById('message').innerText = '';
  });

  // Test valid form submission with name, destination, and seats
  test('valid input displays confirmation message', () => {
    // ARRANGE: Set up valid form inputs
    document.getElementById('name').value = 'Alice';
    document.getElementById('destination').value = 'Paris';
    document.getElementById('seats').value = '3';

    // ACT: Simulate form submission
    document.getElementById('bookingForm').dispatchEvent(new Event('submit', { bubbles: true }));

    // ASSERT: Verify confirmation message with correct fare (3 * $10 = $30)
    expect(document.getElementById('message').innerText.trim()).toBe(
      'Booking confirmed for Alice to Paris. Seats: 3. Total fare: $30.'
    );
  });

  // Test submission with missing name field
  test('missing name displays error message', () => {
    // ARRANGE: Set up inputs with empty name
    document.getElementById('name').value = '';
    document.getElementById('destination').value = 'Rome';
    document.getElementById('seats').value = '2';

    // ACT: Simulate form submission
    document.getElementById('bookingForm').dispatchEvent(new Event('submit', { bubbles: true }));

    // ASSERT: Verify error message for invalid input
    expect(document.getElementById('message').innerText.trim()).toBe(
      'Please fill in all fields correctly.'
    );
  });

  // Test submission with missing destination field
  test('missing destination displays error message', () => {
    // ARRANGE: Set up inputs with empty destination
    document.getElementById('name').value = 'Bob';
    document.getElementById('destination').value = '';
    document.getElementById('seats').value = '4';

    // ACT: Simulate form submission
    document.getElementById('bookingForm').dispatchEvent(new Event('submit', { bubbles: true }));

    // ASSERT: Verify error message for invalid input
    expect(document.getElementById('message').innerText.trim()).toBe(
      'Please fill in all fields correctly.'
    );
  });

  // Test submission with zero seats
  test('seat count 0 displays error message', () => {
    // ARRANGE: Set up inputs with zero seats
    document.getElementById('name').value = 'Charlie';
    document.getElementById('destination').value = 'Tokyo';
    document.getElementById('seats').value = '0';

    // ACT: Simulate form submission
    document.getElementById('bookingForm').dispatchEvent(new Event('submit', { bubbles: true }));

    // ASSERT: Verify error message for invalid seat count
    expect(document.getElementById('message').innerText.trim()).toBe(
      'Please fill in all fields correctly.'
    );
  });

  // Test submission with fractional seat input
  test('fractional seat input is truncated correctly', () => {
    // ARRANGE: Set up inputs with a fractional seat value
    document.getElementById('name').value = 'Dana';
    document.getElementById('destination').value = 'Berlin';
    document.getElementById('seats').value = '2.8';

    // ACT: Simulate form submission
    document.getElementById('bookingForm').dispatchEvent(new Event('submit', { bubbles: true }));

    // ASSERT: Verify confirmation with truncated seats (2.8 → 2, fare = 2 * $10 = $20)
    expect(document.getElementById('message').innerText.trim()).toBe(
      'Booking confirmed for Dana to Berlin. Seats: 2. Total fare: $20.'
    );
  });

  // Test submission with negative seat input
  test('negative seat input displays error message', () => {
    // ARRANGE: Set up inputs with a negative seat value
    document.getElementById('name').value = 'Eve';
    document.getElementById('destination').value = 'London';
    document.getElementById('seats').value = '-5';

    // ACT: Simulate form submission
    document.getElementById('bookingForm').dispatchEvent(new Event('submit', { bubbles: true }));

    // ASSERT: Verify error message for invalid seat count
    expect(document.getElementById('message').innerText.trim()).toBe(
      'Please fill in all fields correctly.'
    );
  });

  // Test submission with non-numeric seat input
  test('non-numeric seat input displays error message', () => {
    // ARRANGE: Set up inputs with a non-numeric seat value
    document.getElementById('name').value = 'Frank';
    document.getElementById('destination').value = 'Sydney';
    document.getElementById('seats').value = 'abc';

    // ACT: Simulate form submission
    document.getElementById('bookingForm').dispatchEvent(new Event('submit', { bubbles: true }));

    // ASSERT: Verify error message for invalid seat input
    expect(document.getElementById('message').innerText.trim()).toBe(
      'Please fill in all fields correctly.'
    );
  });

  // Test submission with whitespace-only name
  // Note: Adjusted to expect confirmation due to unmodifiable code not trimming inputs
  test('whitespace-only name is treated as valid', () => {
    // ARRANGE: Set up inputs with a whitespace-only name
    document.getElementById('name').value = '   ';
    document.getElementById('destination').value = 'Madrid';
    document.getElementById('seats').value = '2';

    // ACT: Simulate form submission
    document.getElementById('bookingForm').dispatchEvent(new Event('submit', { bubbles: true }));

    // ASSERT: Verify confirmation message as whitespace is treated as valid (fare = 2 * $10 = $20)
    expect(document.getElementById('message').innerText.trim()).toBe(
      'Booking confirmed for     to Madrid. Seats: 2. Total fare: $20.'
    );
  });

  // Test submission with a very large seat input
  test('very large seat input is handled correctly', () => {
    // ARRANGE: Set up inputs with a large seat value
    document.getElementById('name').value = 'Grace';
    document.getElementById('destination').value = 'New York';
    document.getElementById('seats').value = '1000000';

    // ACT: Simulate form submission
    document.getElementById('bookingForm').dispatchEvent(new Event('submit', { bubbles: true }));

    // ASSERT: Verify confirmation with correct fare (1000000 * $10 = $10000000)
    expect(document.getElementById('message').innerText.trim()).toBe(
      'Booking confirmed for Grace to New York. Seats: 1000000. Total fare: $10000000.'
    );
  });

  // Test submission with special characters in name
  test('special characters in name are handled correctly', () => {
    // ARRANGE: Set up inputs with special characters in name
    document.getElementById('name').value = 'John&Doe<script>';
    document.getElementById('destination').value = 'Tokyo';
    document.getElementById('seats').value = '2';

    // ACT: Simulate form submission
    document.getElementById('bookingForm').dispatchEvent(new Event('submit', { bubbles: true }));

    // ASSERT: Verify confirmation message includes special characters (fare = 2 * $10 = $20)
    expect(document.getElementById('message').innerText.trim()).toBe(
      'Booking confirmed for John&Doe<script> to Tokyo. Seats: 2. Total fare: $20.'
    );
  });
});