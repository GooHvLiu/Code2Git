/**
 * System Module - Audit Log Internationalization Fields (English)
 * Note: No fallback solution, missing fields directly display the key
 */

export default {
  // [Submodule] Page
  page: {
    // [Label] Action
    action: 'Action',
    // [Label] Created at
    createdAt: 'Created At',
    // [Title] Detail title
    detailTitle: 'Audit Details',
    // [Label] End time
    endTime: 'End Time',
    // [Label] IP address
    ip: 'IP Address',
    // [Title] My title
    myTitle: 'My Audit Logs',
    // [Label] New value
    newValue: 'New Value',
    // [Label] Old value
    oldValue: 'Old Value',
    // [Page] Page description
    pageDesc: 'View system operation audit logs',
    // [Label] Result
    result: 'Result',
    // [Label] Start time
    startTime: 'Start Time',
    // [Label] Target
    target: 'Target',
    // [Label] Time range
    timeRange: 'Time Range',
    // [Page] Title
    title: 'Audit Logs',
    // [Label] User name
    userName: 'User Name'
  },

  // [Submodule] Audit action types and module names (backend auditRules titleKey/moduleKey, dynamic)
  action: {
    audit: {
      export: {
        title: 'Audit Log Export',
      },
      verify: {
        title: 'Audit Hash Chain Verify',
      },
      view: {
        title: 'Audit Log View',
      },
    },
    config: {
      connection: {
        change: {
          title: 'Connection Configuration Change',
        },
      },
      device: {
        change: {
          title: 'Device Configuration Change',
        },
      },
      export: {
        change: {
          title: 'Export Configuration Change',
        },
      },
      order: {
        change: {
          title: 'Order Configuration Change',
        },
      },
      plc: {
        change: {
          title: 'PLC Connection Configuration Change',
        },
      },
      security: {
        change: {
          title: 'Security Configuration Change',
        },
      },
      system: {
        change: {
          title: 'System Parameter Change',
        },
      },
    },
    data: {
      export: {
        title: 'Data Export',
      },
      viewDetail: {
        title: 'Data View Detail',
      },
    },
    device: {
      alarm: {
        handle: {
          title: 'Alarm Handle',
        },
      },
      paramChange: {
        title: 'Device Parameter Change',
      },
      part: {
        create: {
          title: 'Create Part',
        },
        delete: {
          title: 'Delete Part',
        },
        replace: {
          title: 'Replace Part',
        },
        update: {
          title: 'Update Part',
        },
      },
      statusChange: {
        title: 'Device Status Change',
      },
    },
    email: {
      configChange: {
        title: 'Email Configuration Change',
      },
      logDelete: {
        title: 'Email Log Delete',
      },
    },
    license: {
      expire: {
        title: 'License Expire',
      },
      import: {
        title: 'License Import',
      },
    },
    permission: {
      cacheClear: {
        title: 'Permission Cache Clear',
      },
      change: {
        title: 'Permission Configuration Change',
      },
    },
    plc: {
      connect: {
        title: 'PLC Connect',
      },
      disconnect: {
        title: 'PLC Disconnect',
      },
      read: {
        title: 'PLC Parameter Read',
      },
      reconnect: {
        title: 'PLC Reconnect',
      },
      write: {
        title: 'PLC Parameter Write',
      },
    },
    production: {
      order: {
        create: {
          title: 'Create Production Order',
        },
        delete: {
          title: 'Delete Production Order',
        },
        download: {
          title: 'Download Production Order',
        },
        update: {
          title: 'Update Production Order',
        },
      },
      recipe: {
        download: {
          title: 'Recipe Download',
        },
      },
    },
    role: {
      create: {
        title: 'Create Role',
      },
      delete: {
        title: 'Delete Role',
      },
      update: {
        title: 'Update Role',
      },
    },
    user: {
      batchDelete: {
        title: 'Batch Delete User',
      },
      changePassword: {
        title: 'Change Password',
      },
      create: {
        title: 'Create User',
      },
      delete: {
        title: 'Delete User',
      },
      login: {
        title: 'User Login',
      },
      loginFailed: {
        title: 'User Login Failed',
      },
      logout: {
        title: 'User Logout',
      },
      register: {
        title: 'User Register',
      },
      resetPassword: {
        title: 'Reset Password',
      },
      roleChange: {
        title: 'User Role Change',
      },
      statusChange: {
        title: 'Change User Status',
      },
      update: {
        title: 'Update User',
      },
    },
  },
  module: {
    audit: 'Audit Self',
    config: 'System Configuration',
    data: 'Data Management',
    device: 'Device Management',
    email: 'Email Configuration',
    license: 'License Management',
    permission: 'Permission Management',
    plc: 'PLC Operation',
    production: 'Production Management',
    user: 'User Management',
  },
}
