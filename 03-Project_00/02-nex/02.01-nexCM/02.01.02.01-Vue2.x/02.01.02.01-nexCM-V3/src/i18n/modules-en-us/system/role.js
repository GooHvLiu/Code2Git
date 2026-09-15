/**
 * System Settings Module - Role Management Internationalization Fields (English)
 * Note: No fallback solution, missing fields directly display the key
 */
export default {
  // [Submodule] Built-in roles (key corresponds to role_code, dynamic lookup)
  builtin: {
    // [Built-in role] Super administrator
    Super_Admin: {
      // [Name]
      name: 'Super Administrator',
      // [Description]
      desc: 'Full system access, for system setup and parameter modification'
    },
    // [Built-in role] System administrator
    Administrator: {
      name: 'System Administrator',
      desc: 'Full user system access, for usage-level modifications'
    },
    // [Built-in role] Engineer
    Engineer: {
      name: 'Engineer',
      desc: 'Device engineer, can manage device parameters'
    },
    // [Built-in role] Operator
    Operator: {
      name: 'Operator',
      desc: 'Normal operator, view and operate only'
    }
  }
}
