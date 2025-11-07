// Re-export everything from data.js (ESM-compatible). Keeps older CJS imports working
// while allowing modern imports too.
export * from './data';
export { default } from './data';
