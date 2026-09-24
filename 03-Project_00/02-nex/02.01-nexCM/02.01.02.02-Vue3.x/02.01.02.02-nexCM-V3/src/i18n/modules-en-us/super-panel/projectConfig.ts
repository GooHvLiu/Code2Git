/**
 * Super Panel Module - Project Configuration Internationalization Fields
 * Big company standard: unified nested object structure, grouped by functional area
 * Note: No fallback solution, missing fields directly display the key
 */
export default {
  page: {
    title: 'Project Configuration',
    desc: 'View and manage all project configuration items',
    loadFailed: 'Failed to load configuration'
  },
  actions: {
    editFile: 'Edit File',
    goToConfig: 'Go to Config'
  },
  empty: {
    noConfig: 'No configuration'
  },
  translation: {
    menu: 'Trans-Config',
    goToConfig: 'Go to Translation Settings',
    tipTitle: 'Translation Settings Tip',
    tipContent: 'Translation must be enabled and configured in parameter settings first'
  },
  menu: {
    environment: 'Env-Conf',
    api: 'Api-Conf',
    storage: 'Storage',
    security: 'Security',
    database: 'Db-Conf',
    license: 'License',
    email: 'E-mail',
    plc: 'Plc-Conf',
    i18n: 'Sup-Lang'
  },
  editType: {
    database: 'Database Config',
    configFile: 'Config File',
    envFile: 'Env Variable',
    code: 'Code Constant',
    databaseTip:
      'Stored in database, can be modified directly in System Settings/Super Panel config page, takes effect immediately',
    configFileTip:
      'Stored in backend config file (e.g. src/config/*.js), need to edit file online and restart backend service',
    envFileTip: 'Stored in environment variable file (e.g. .env), need to edit file online and restart backend service',
    codeTip: 'Hardcoded in source code, need to manually modify source code and rebuild'
  },
  effectType: {
    immediate: 'Immediate',
    restart: 'Restart Required',
    rebuild: 'Rebuild Required',
    immediateTip: 'Takes effect immediately after modification, no need to restart service or rebuild',
    restartTip: 'Need to restart backend service to take effect after modification',
    rebuildTip: 'Need to rebuild frontend project to take effect after modification'
  },
  ownerType: {
    frontend: 'Frontend',
    backend: 'Backend',
    frontendTip: 'This config item belongs to frontend project, need to rebuild frontend after modification',
    backendTip: 'This config item belongs to backend project, need to restart backend service after modification'
  },
  sourceType: {
    file: 'Config File',
    database: 'Database Config',
    runtime: 'System Runtime Info (Auto)',
    code: 'Code Constant (Hardcoded)'
  },
  tips: {
    codeConstant: 'This is a code constant, modify the code and rebuild',
    confirmFailed: 'Confirmation failed, please check the configuration',
    needCodeChange: 'This configuration requires code changes',
    noFilePath: 'No file path configured',
    notInWhitelist: 'This configuration is not in the editable whitelist'
  },
  editor: {
    title: 'Config File Editor',
    backupPath: 'Backup Path',
    backupPathLoading: 'Loading...',
    readFailed: 'Failed to read file',
    save: 'Save',
    saved: 'Saved',
    saveSuccess: 'Saved successfully',
    syntaxCheck: 'Syntax Check',
    syntaxCheckFailed: 'Syntax check failed',
    syntaxInvalid: 'Syntax error',
    syntaxValid: 'Syntax valid',
    unsaved: 'Unsaved changes',
    versionHistory: 'Version History'
  },
  backup: {
    title: 'Backup',
    operator: 'Operator',
    restore: 'Restore',
    delete: 'Delete',
    empty: 'No backups',
    loadFailed: 'Failed to load backup list',
    restoreConfirm: 'Are you sure to restore this backup? Current config will be overwritten',
    restoreSuccess: 'Backup restored successfully',
    restoreFailed: 'Failed to restore backup',
    deleteConfirm: 'Are you sure to delete this backup?',
    deleteSuccess: 'Backup deleted successfully',
    deleteFailed: 'Failed to delete backup'
  },
  saveDialog: {
    title: 'Save Configuration',
    remark: 'Remark',
    remarkPlaceholder: 'Enter save remark (optional)',
    confirm: 'Confirm Save',
    warning: 'Saving will overwrite the current configuration, please confirm'
  },
  backupPathDialog: {
    title: 'Backup Path Settings',
    currentPath: 'Current Path',
    newPath: 'New Path',
    newPathPlaceholder: 'Enter the new backup path',
    pathRequired: 'Backup path cannot be empty',
    changeSuccess: 'Backup path updated successfully',
    warning: 'Note: After changing the backup path, existing backup files will not be migrated automatically'
  },
  items: {
    api: {
      apiPrefix: {
        description: 'API interface unified prefix, frontend and backend must be consistent',
        label: 'API Prefix'
      },
      corsEnabled: {
        description: 'Whether to enable CORS cross-origin support, specific domain is recommended for production',
        label: 'CORS Switch'
      },
      corsOrigin: {
        description:
          'Allowed cross-origin access source address, * means all sources allowed, specific domain is recommended for production',
        label: 'CORS Origin'
      },
      maxBodySize: {
        description: 'Max request body size accepted by backend, to prevent oversized request attacks',
        label: 'Request Body Size Limit'
      },
      maxFileSize: {
        description: 'Max uploaded file size limit',
        label: 'File Size Limit'
      },
      rateLimit: {
        description: 'Max requests per minute per single IP, to prevent malicious API attacks',
        label: 'Rate Limit'
      },
      rateLimitWindow: {
        description: 'Time window (seconds) for rate limit, max rateLimit requests allowed within this window',
        label: 'Rate Limit Window'
      },
      requestTimeout: {
        description: 'Frontend request timeout, request will be automatically cancelled after timeout',
        label: 'Request Timeout'
      }
    },
    database: {
      connectionLimit: {
        description: 'Max connections in database connection pool',
        label: 'Connection Pool Size'
      },
      database: {
        description: 'MySQL database name in use',
        label: 'Database Name'
      },
      host: {
        description: 'MySQL database server address',
        label: 'Database Host'
      },
      password: {
        description: 'MySQL database login password (hidden)',
        label: 'Database Password'
      },
      port: {
        description: 'MySQL database port, default is 3306',
        label: 'Database Port'
      },
      queueLimit: {
        description: 'Max number of waiting connection requests, 0 means no limit',
        label: 'Queue Limit'
      },
      user: {
        description: 'MySQL database login username',
        label: 'Database Username'
      },
      waitForConnections: {
        description:
          'Whether to wait for connection release when pool is full, true means wait, false means immediate error',
        label: 'Wait for Connections'
      }
    },
    email: {
      defaultProvider: {
        description: 'Default email service provider configuration, such as smtp, qq, 163, etc.',
        label: 'Default Provider'
      },
      enabled: {
        description: 'Whether to enable email sending function',
        label: 'Email System Switch'
      },
      fromName: {
        description: 'Sender name displayed in email',
        label: 'Sender Name'
      },
      host: {
        description: 'SMTP email server address',
        label: 'SMTP Host'
      },
      passwordReset: {
        maxActiveTokens: {
          description: 'Max number of valid password reset tokens that can exist simultaneously for a single user',
          label: 'Max Active Tokens'
        },
        tokenExpiresIn: {
          description: 'Password reset link expiration',
          label: 'Reset Token Expiration'
        },
        tokenLength: {
          description: 'Password reset token character length',
          label: 'Reset Token Length'
        }
      },
      port: {
        description: 'SMTP email server port',
        label: 'SMTP Port'
      },
      secure: {
        description: 'Whether to use SSL encryption to connect to email server',
        label: 'SSL Encryption'
      },
      send: {
        logEnabled: {
          description: 'Whether to record detailed logs of email sending',
          label: 'Send Log'
        },
        maxRetries: {
          description: 'Max retries after email sending failure',
          label: 'Max Send Retries'
        },
        retryDelay: {
          description: 'Delay time (ms) before retry after email sending failure',
          label: 'Retry Delay'
        },
        timeout: {
          description: 'Email sending timeout',
          label: 'Send Timeout'
        }
      },
      username: {
        description: 'Email account used for sending emails',
        label: 'Email Account'
      }
    },
    environment: {
      appHost: {
        description: 'Backend service binding host address, 0.0.0.0 means listening on all network interfaces',
        label: 'Service Host'
      },
      appPort: {
        description: 'Backend service listening port',
        label: 'Service Port'
      },
      arch: {
        description: 'Current OS CPU architecture, such as x64, arm64, etc.',
        label: 'System Architecture'
      },
      cwd: {
        description: 'Backend service current working directory, the directory where the service is started',
        label: 'Working Directory'
      },
      hostname: {
        description: 'Current server hostname, used to identify server identity',
        label: 'Hostname'
      },
      localIp: {
        description: 'Current server local IP address, used for LAN access',
        label: 'Local IP Address'
      },
      nodeEnv: {
        description: 'Node.js runtime environment, development for dev mode, production for production mode',
        label: 'Environment'
      },
      nodeVersion: {
        description: 'Current running Node.js version, LTS version is recommended',
        label: 'Node.js Version'
      },
      platform: {
        description: 'Current running OS platform, such as win32, linux, darwin, etc.',
        label: 'Operating System'
      },
      projectRoot: {
        description: 'Backend project root directory path, all relative paths are based on this directory',
        label: 'Project Root Directory'
      },
      systemVersion: {
        description: 'System version number, updated when releasing new version',
        label: 'System Version'
      }
    },
    plc: {
      activeProtocol: {
        description: 'Current PLC communication protocol in use',
        label: 'Communication Protocol'
      },
      connection: {
        host: {
          description: 'PLC device IP address',
          label: 'PLC Device IP'
        },
        port: {
          description: 'PLC device communication port',
          label: 'PLC Port'
        },
        rack: {
          description: 'S7 protocol rack number, usually 0',
          label: 'Rack Number'
        },
        slot: {
          description: 'S7 protocol slot number, usually 1 or 2',
          label: 'Slot Number'
        },
        unitId: {
          description: 'Modbus protocol slave unit ID, usually 1',
          label: 'Unit ID'
        }
      },
      enablePoll: {
        description: 'Whether to enable PLC data auto polling',
        label: 'Auto Poll'
      },
      enableWriteAudit: {
        description: 'Whether to record audit logs for PLC write operations',
        label: 'Write Audit'
      },
      maxWriteRetry: {
        description: 'Max retries after PLC write operation failure',
        label: 'Max Write Retries'
      },
      multiDeviceEnabled: {
        description: 'Whether to enable multi-device mode, support connecting multiple PLC devices simultaneously',
        label: 'Multi-device Mode'
      },
      poll: {
        fastInterval: {
          description: 'Poll interval when device is online',
          label: 'Fast Poll Interval'
        },
        reconnectDelay: {
          description: 'Delay time (ms) before reconnecting after device disconnect',
          label: 'Reconnect Delay'
        },
        slowInterval: {
          description: 'Poll interval when device is offline',
          label: 'Slow Poll Interval'
        }
      },
      supportedProtocols: {
        description: 'List of PLC communication protocols supported by the system',
        label: 'Supported Protocols'
      },
      timeouts: {
        connect: {
          description: 'PLC connection timeout (ms)',
          label: 'Connection Timeout'
        },
        general: {
          description: 'General timeout for other PLC operations (ms)',
          label: 'General Timeout'
        },
        read: {
          description: 'PLC single read timeout (ms)',
          label: 'Read Timeout'
        },
        readBatch: {
          description: 'PLC batch read timeout (ms)',
          label: 'Batch Read Timeout'
        },
        write: {
          description: 'PLC write operation timeout (ms)',
          label: 'Write Timeout'
        }
      }
    },
    security: {
      jwt: {
        algorithm: {
          description: 'JWT signature encryption algorithm, usually HS256',
          label: 'Encryption Algorithm'
        },
        expiresIn: {
          description: 'JWT Token expiration, need to re-login after expiration',
          label: 'Token Expiration'
        }
      },
      layout: {
        login: {
          failedThreshold: {
            description: 'Account will be locked after consecutive login failures',
            label: 'Login Failure Threshold'
          },
          lockDuration: {
            description: 'Account lock duration after login failure',
            label: 'Account Lock Duration'
          }
        }
      },
      password: {
        bcryptSaltRounds: {
          description: 'bcrypt encryption salt rounds, higher value is more secure but slower',
          label: 'Password Encryption Strength'
        },
        minLength: {
          description: 'User password minimum length requirement',
          label: 'Password Min Length'
        },
        requireLowercase: {
          description: 'Whether user password must contain lowercase letters (a-z)',
          label: 'Require Lowercase'
        },
        requireNumber: {
          description: 'Whether user password must contain numbers (0-9)',
          label: 'Require Number'
        },
        requireSymbol: {
          description: 'Whether user password must contain special symbols (such as !@#$%^&*)',
          label: 'Require Symbol'
        },
        requireUppercase: {
          description: 'Whether user password must contain uppercase letters (A-Z)',
          label: 'Require Uppercase'
        }
      },
      session: {
        timeout: {
          description: 'Auto logout after user inactivity for this duration',
          label: 'Session Timeout'
        }
      },
      watermark: {
        enabled: {
          description: 'Whether to display watermark on page, prevent screenshot leakage',
          label: 'Page Watermark'
        }
      }
    },
    storage: {
      backup: {
        configDir: {
          description: 'Config file version history backup storage directory',
          label: 'Config Data Backup Directory'
        },
        dir: {
          description: 'Database backup file storage directory',
          label: 'Database Backup Directory'
        },
        i18nDir: {
          description: 'I18n language file backup storage directory',
          label: 'I18n Backup Directory'
        },
        menuDir: {
          description: 'Menu configuration backup file storage directory',
          label: 'Menu Backup Directory'
        }
      },
      github: {
        branch: {
          description: 'GitHub repository branch, usually main',
          label: 'Branch'
        },
        enabled: {
          description: 'Whether to enable GitHub image host for storing images',
          label: 'GitHub Image Host Switch'
        },
        maxSize: {
          description: 'Max file size limit for GitHub image host upload',
          label: 'Max File Size'
        },
        owner: {
          description: 'GitHub repository owner username',
          label: 'Repository Owner'
        },
        pathPrefix: {
          description: 'Path prefix for storing images in GitHub repository, such as images/',
          label: 'Path Prefix'
        },
        repo: {
          description: 'GitHub image host repository name',
          label: 'Repository Name'
        }
      },
      logs: {
        dir: {
          description: 'System log file storage directory',
          label: 'Log Directory'
        }
      },
      superPanel: {
        license: {
          dir: {
            description: 'License file and key storage directory',
            label: 'License File Directory'
          },
          licensePath: {
            description: 'License file storage path',
            label: 'License File Path'
          },
          publicKeyPath: {
            description: 'Public key file path used to verify license signature',
            label: 'Public Key File Path'
          },
          timeGuardPath: {
            description:
              'Time guard file storage path, used to record last verification time, prevent system time rollback',
            label: 'Time Guard File Path'
          }
        }
      },
      upload: {
        allowedTypes: {
          description: 'List of allowed upload file extensions',
          label: 'Allowed File Types'
        },
        dir: {
          description: 'Local upload file storage directory',
          label: 'Upload Directory'
        },
        maxSize: {
          description: 'Max local upload file size',
          label: 'Max File Size'
        },
        staticPrefix: {
          description: 'Static access URL prefix for local upload files, used to access uploaded files via HTTP',
          label: 'Static Resource Prefix'
        }
      }
    },
    superPanel: {
      license: {
        allowedExtname: {
          description: 'List of allowed license file extensions',
          label: 'Allowed Extensions'
        },
        licensePath: {
          description: 'License file storage path',
          label: 'License File Path'
        },
        licenseServerUrl: {
          description: 'Server address used for time synchronization, prevent local time tampering',
          label: 'Time Sync Server'
        },
        maxFileSize: {
          description: 'Max file size limit for license file upload',
          label: 'Max File Size'
        },
        projectId: {
          description: 'Unique identifier of the project in license system',
          label: 'Project ID'
        },
        publicKeyPath: {
          description: 'Public key file path used to verify license signature',
          label: 'Public Key File Path'
        },
        strictMode: {
          description: 'In strict mode, license verification failure will deny service, non-strict mode only warns',
          label: 'Strict Mode'
        },
        timeGuardPath: {
          description:
            'Time guard file storage path, used to record last verification time, prevent system time rollback',
          label: 'Time Guard File Path'
        }
      }
    }
  }
}
