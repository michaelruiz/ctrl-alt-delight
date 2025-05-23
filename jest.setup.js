import '@testing-library/jest-dom';

// Mock the useSound hook
jest.mock('use-sound', () => ({
  __esModule: true,
  default: () => [
    jest.fn(),
    { stop: jest.fn() }
  ],
})); 