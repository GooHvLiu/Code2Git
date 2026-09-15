/**
 * Common module - form validation i18n fields
 * Namespace: common.validate.field
 * Called by Element form validators in src/utils/data/validate.js
 * No fallback: a missing key renders the key itself
 */
export default {
  // [Validation] Username length
  usernameLength: 'Username must be 3-16 characters',
  // [Validation] Password length
  passwordLength: 'Password must be 6-20 characters',
  // [Validation] Password mismatch
  passwordMismatch: 'The two passwords do not match',
  // [Validation] Email format
  emailFormat: 'Please enter a valid email address'
}
