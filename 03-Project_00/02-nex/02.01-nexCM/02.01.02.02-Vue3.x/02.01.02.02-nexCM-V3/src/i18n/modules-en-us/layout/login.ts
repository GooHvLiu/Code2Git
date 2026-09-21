/**
 * Layout Module - Login Page Internationalization Fields (English)
 * Login, register, forgot password related text
 * Note: No fallback solution, missing fields directly display the key
 */
export default {
  // [Page] Login title
  title: 'System Login',
  // [Form] Username
  username: 'Username',
  // [Form] Password
  password: 'Password',
  // [Form] Captcha
  captcha: 'Captcha',
  // [Button] Login
  loginBtn: 'Login',
  // [Button] Register
  registerBtn: 'Register',
  // [Link] Forgot password
  forgotPassword: 'Forgot password?',
  // [Link] No account
  noAccount: "Don't have an account?",
  // [Link] Has account
  hasAccount: 'Already have an account?',
  // [Button] Login now
  loginNow: 'Login Now',
  // [Button] Register now
  registerNow: 'Register Now',
  // [Validation] Please input username
  usernameRequired: 'Please input username',
  // [Validation] Please input password
  passwordRequired: 'Please input password',
  // [Validation] Please input captcha
  captchaRequired: 'Please input captcha',
  // [Validation] Please input email
  emailRequired: 'Please input email',
  // [Page] Register title
  registerTitle: 'User Registration',
  // [Form] Email
  email: 'Email',
  // [Form] Confirm password
  confirmPassword: 'Confirm Password',
  // [Validation] Please input confirm password
  confirmPasswordRequired: 'Please input confirm password',
  // [Message] Register success, please login
  registerSuccess: 'Registration successful, please login',
  // [Message] Reset code sent, please check your email
  resetCodeSent: 'Verification code sent, please check your email',
  // [Message] Operation failed
  operationFailed: 'Operation failed',
  // [Validation] Please fill in complete information
  fillCompleteInfo: 'Please fill in complete information',
  // [Validation] Reset password must be at least 8 characters
  resetPasswordMinLength: 'Password must be at least 8 characters',
  // [Placeholder] Captcha loading
  captchaLoading: 'Loading captcha...',
  // [Forgot password] dialog (top-level forgotPassword is the entry link text; the dialog uses forgotPasswordDialog)
  forgotPasswordDialog: {
    // Dialog title
    title: 'Forgot Password',
    // Step 1: verify identity
    stepVerify: 'Verify Identity',
    // Step 2: reset password
    stepReset: 'Reset Password',
    // Step 3: done
    stepDone: 'Done',
    // Username placeholder
    usernamePlaceholder: 'Enter username',
    // Email placeholder
    emailPlaceholder: 'Registered email',
    // Code placeholder
    codePlaceholder: 'Verification code',
    // New password placeholder
    newPasswordPlaceholder: 'New password (min 8 chars)',
    // Confirm password placeholder
    confirmPasswordPlaceholder: 'Re-enter new password',
    // Send code button
    sendCode: 'Send Code',
    // Resend countdown ({seconds} = remaining seconds)
    resendCountdown: 'Resend in {seconds}s',
    // Next step
    nextStep: 'Next',
    // Confirm reset
    confirmReset: 'Confirm Reset',
    // Go to login
    goLogin: 'Go to Login',
    // Cancel button
    cancelBtn: 'Cancel',
    // Reset success title
    resetSuccess: 'Password reset successful!',
    // Reset success tip
    resetSuccessTip: 'Please login with your new password'
  }
}
