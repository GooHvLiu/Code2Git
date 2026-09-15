/**
 * Layout Module - Menu Data Translation Internationalization Fields (English)
 * Sidebar menu, breadcrumb navigation, tab title related translations
 * Note: No fallback solution, missing fields directly display the key
 */
export default {
  // [Menu] Home
  home: {
    // [Menu] Default title
    default: 'HomeView',
    // [Menu] Overview
    overview: {
      // [Menu] Default title
      default: 'OverView'
    },
    // [Menu] Dashboard
    dashboard: {
      // [Menu] Default title
      default: 'DashBoard'
    },
    // [Menu] Data view
    dataview: {
      // [Menu] Default title
      default: 'DataView',
      // [Action] Search
      search: 'Search',
      // [Action] Reset
      reset: 'Reset',
      // [Action] Export
      export: 'Export',
      // [Action] Refresh
      refresh: 'Refresh',
      // [Action] Detail
      detail: 'Detail',
      // [Action] Export single
      exportSingle: 'Export Single',
      // [Submenu] Output data
      output: {
        // [Menu] Title
        title: 'Output Data'
      },
      // [Submenu] OEE data
      oee: {
        // [Menu] Title
        title: 'OEE Data'
      },
      // [Submenu] Production data
      production: {
        // [Menu] Title
        title: 'Production Data'
      },
      // [Submenu] Alarm data
      alarm: {
        // [Menu] Title
        title: 'Alarm Data'
      }
    }
  },
  // [Menu] Device management
  device: {
    // [Menu] Default title
    default: 'DeviceMg',
    // [Menu] Device state
    state: {
      // [Menu] Default title
      default: 'DevState',
      // [Menu] Device control
      control: 'Device Control'
    },
    // [Menu] Alarm statistics
    alarm: {
      // [Menu] Default title
      default: 'AlarmLog',
      // [Submenu] Statistics dashboard
      dashboard: {
        // [Menu] Title
        title: 'Statistics Dashboard'
      },
      // [Submenu] Detailed records
      list: {
        // [Menu] Title
        title: 'Detailed Records'
      },
      // [Action] Search
      search: 'Search',
      // [Action] Reset
      reset: 'Reset',
      // [Action] Export
      export: 'Export',
      // [Action] Refresh
      refresh: 'Refresh',
      // [Action] Detail
      detail: 'Detail',
      // [Action] Handle
      handle: 'Handle'
    },
    // [Menu] Part life
    part: {
      // [Menu] Default title
      default: 'PartLife',
      // [Action] Search
      search: 'Search',
      // [Action] Add
      add: 'Add',
      // [Action] Refresh
      refresh: 'Refresh',
      // [Action] Edit
      edit: 'Edit',
      // [Action] Replace
      operate: 'Replace',
      // [Action] Delete
      delete: 'Delete',
      // [Tab] Life details
      tab: {
        life: 'Life Details',
        template: 'Template Management'
      },
      // [Submodule] Part page
      page: {
        // [Submodule] Base part template names (referenced dynamically via DB device_part_template.name_key)
        template: {
          // [Part] Fill needle assembly
          fillNeedle: 'Fill Needle Assembly',
          // [Part] Fill tube assembly
          fillTube: 'Fill Tube Assembly',
          // [Part] Stopper rod part
          stopperRod: 'Stopper Rod Part',
          // [Part] Vacuum assembly
          vacuumUnit: 'Vacuum Assembly'
        }
      },
      // [Submodule] Template management button menus (used by DB nex_menu)
      template: {
        // [Action] Add template
        add: 'Add Template',
        // [Action] Edit
        edit: 'Edit',
        // [Action] Delete
        delete: 'Delete',
        // [Action] Search template
        search: 'Search Template',
        // [Action] Refresh
        refresh: 'Refresh'
      }
    }
  },
  // [Menu] Production management
  production: {
    // [Menu] Default title
    default: 'ProdMgmt',
    // [Menu] Recipe management
    recipe: {
      // [Menu] Default title
      default: 'RecipeDB',
      // [Action] Download
      download: 'Download'
    },
    // [Menu] Order management
    order: {
      // [Menu] Default title
      default: 'OrderLog',
      // [Tab] Completed
      completed: {
        // [Menu] Title
        title: 'Completed'
      },
      // [Action] Download
      download: 'Download',
      // [Tab] Planned
      planned: {
        // [Menu] Title
        title: 'Planned'
      },
      // [Action] Add
      add: 'Add',
      // [Action] Delete
      delete: 'Delete',
      // [Action] Edit
      edit: 'Edit',
      // [Tab] Running
      running: {
        // [Menu] Title
        title: 'Running'
      }
    }
  },
  // [Menu] System settings
  system: {
    // [Menu] Default title
    default: 'SysSetup',
    // [Menu] User management
    user: {
      // [Menu] Default title
      default: 'UserMgmt'
    },
    // [Menu] Audit log
    audit: {
      // [Menu] Default title
      default: 'Audit Log'
    },
    // [Menu] Parameter configuration
    config: {
      // [Menu] Default title
      default: 'ParaMgmt',
      // [Submenu] Children menu
      childrenMenu: {
        // [Submenu] Email log
        emailLog: {
          // [Menu] Title
          title: 'EmailLogs',
          // [Action] Export button
          exportBtn: 'Export',
          // [Action] Delete button
          deleteBtn: 'Delete',
          // [Action] View detail
          viewDetail: 'View Detail'
        },
        // [Action] Reset
        reset: 'Reset',
        // [Action] Save
        save: 'Save',
        // [Submenu] Device configuration
        device: {
          // [Menu] Title
          title: 'DevSetting',
          // [Param] Device name
          deviceName: 'Device Name',
          // [Param] Device code
          deviceCode: 'Device Code',
          // [Param] Device region
          deviceRegion: 'Device Region',
          // [Param] Device install date
          deviceInstallDate: 'Device Install Date',
          // [Param] Part life reminder enabled
          partLifeReminderEnabled: 'Part Life Reminder Enabled',
          // [Param] Part life threshold
          partLifeThreshold: 'Part Life Threshold',
          // [Param] Part life remind interval
          partLifeRemindInterval: 'Part Life Remind Interval',
          // [Param] Snooze interval
          snoozeInterval: 'Snooze Interval'
        },
        // [Submenu] Export configuration
        export: {
          // [Menu] Title
          title: 'ExpSetting',
          // [Param] PDF watermark enabled
          pdfWatermarkEnabled: 'PDF Watermark Enabled',
          // [Param] PDF watermark text
          pdfWatermarkText: 'PDF Watermark Text'
        },
        // [Submenu] License configuration
        license: {
          // [Menu] Manage title
          manageTitle: 'LicenseMgt',
          // [Action] Refresh
          refresh: 'Refresh',
          // [Action] Import license
          importLicense: 'Import License',
          // [Action] Download
          download: 'Download'
        },
        // [Submenu] License setting
        licenseSetting: {
          // [Menu] Title
          title: 'LicSetting',
          // [Param] Expiring days
          expiringDays: 'Expiring Days',
          // [Param] Grace period
          gracePeriod: 'Grace Period',
          // [Param] Check interval
          checkInterval: 'Check Interval'
        },
        // [Submenu] Notification configuration
        notification: {
          // [Menu] Title
          title: 'NotifSetting',
          // [Param] Auto read days
          autoReadDays: 'Auto Read Days',
          // [Param] Sound enabled
          soundEnabled: 'Sound Enabled'
        },
        // [Submenu] Order configuration
        order: {
          // [Menu] Title
          title: 'OrdSetting',
          // [Param] Allow no order production
          allowNoOrderProduction: 'Allow No Order Production',
          // [Param] No order production highlight
          noOrderProductionHighlight: 'No Order Production Highlight',
          // [Param] Order switch confirm
          orderSwitchConfirm: 'Order Switch Confirm',
          // [Param] Auto archive completed
          autoArchiveCompleted: 'Auto Archive Completed',
          // [Param] Show operator name
          showOperatorName: 'Show Operator Name',
          // [Param] Show alarm count
          showAlarmCount: 'Show Alarm Count',
          // [Param] Show runtime
          showRuntime: 'Show Runtime',
          // [Param] Report include alarm detail
          reportIncludeAlarmDetail: 'Report Include Alarm Detail',
          // [Param] Report include operator detail
          reportIncludeOperatorDetail: 'Report Include Operator Detail',
          // [Param] Report include download count
          reportIncludeDownloadCount: 'Report Include Download Count',
          // [Param] Allow running order download
          allowRunningOrderDownload: 'Allow Running Order Download'
        },
        // [Submenu] Security configuration
        security: {
          // [Menu] Title
          title: 'SecSetting',
          // [Param] Login failed threshold
          loginFailedThreshold: 'Login Failed Threshold',
          // [Param] Lock duration minutes
          lockDurationMinutes: 'Lock Duration (Minutes)'
        },
        // [Submenu] System configuration
        system: {
          // [Menu] Title
          title: 'SysSetting',
          // [Param] Date format
          dateFormat: 'Date Format'
        }
      },
      // [Param] Param
      param: {
        // [Param] Session timeout
        sessionTimeout: {
          // [Action] View
          view: 'View',
          // [Action] Edit
          edit: 'Edit'
        },
        // [Param] Default page size
        defaultPageSize: {
          // [Action] View
          view: 'View',
          // [Action] Edit
          edit: 'Edit'
        },
        // [Param] Default language
        defaultLanguage: {
          // [Action] View
          view: 'View',
          // [Action] Edit
          edit: 'Edit'
        },
        // [Param] Watermark enabled
        watermarkEnabled: {
          // [Action] View
          view: 'View',
          // [Action] Edit
          edit: 'Edit'
        },
        // [Param] Watermark text
        watermarkText: {
          // [Action] View
          view: 'View',
          // [Action] Edit
          edit: 'Edit'
        }
      }
    },
    // [Menu] Permission management
    permission: {
      // [Menu] Default title
      default: 'PermMgmt'
    },
    // [Menu] Device management
    device: {
      // [Menu] Default title
      default: 'OnlineMgmt',
      // [Action] Kick
      kick: 'Kick Offline',
      // [Action] Delete
      delete: 'Delete'
    }
  },
  // [Menu] Super panel
  superPanel: {
    // [Menu] Default title
    default: 'SuperPnls',
    // [Menu] Dictionary management
    dict: {
      // [Menu] Default title
      default: 'Dic Mgmt'
    },
    // [Menu] Department management
    dept: {
      // [Menu] Default title
      default: 'DeptMgmt'
    },
    // [Menu] Role management
    role: {
      // [Menu] Default title
      default: 'RoleMgmt'
    },
    // [Menu] Parameter configuration
    config: {
      // [Menu] Default title
      default: 'ParaMgmt'
    },
    // [Menu] Permission management
    permission: {
      // [Menu] Default title
      default: 'PermMgmt',
      // [Submodule] Page
      page: {
        // [Page] Page title
        title: 'Permission Configuration',
        // [Page] Page description
        desc: 'Role permission configuration management',
        // [Message] Save success
        saveSuccess: 'Permission saved successfully'
      }
    },
    // [Menu] Feature configuration
    feature: {
      // [Menu] Default title
      default: 'FeatMgmt'
    },
    // [Menu] Database management
    database: {
      // [Menu] Default title
      default: 'DataMgmt'
    },
    // [Menu] Project configuration
    projectConfig: {
      // [Menu] Default title
      default: 'ProjMgmt'
    },
    // [Menu] Menu configuration
    menuConfig: {
      // [Menu] Default title
      default: 'MenuMgmt'
    },
    // [Menu] Language configuration
    i18n: {
      // [Menu] Default title
      default: 'LangMgmt'
    }
  }
}
