[
  {
    "path": "/customer",
    "name": "Customer",
    "component": "Layout",
    "redirect": "noRedirect",
    "hidden": false,
    "alwaysShow": true,
    "meta": {
      "title": "客户管理",
      "icon": "peoples",
      "noCache": false
    },
    "children": [
      {
        "path": "customer",
        "name": "Customer",
        "component": "customer",
        "redirect": "noRedirect",
        "hidden": false,
        "alwaysShow": false,
        "meta": {
          "title": "客户档案",
          "icon": "",
          "noCache": false
        },
        "children": []
      },
      {
        "path": "visit",
        "name": "Visit",
        "component": "customer/visit",
        "redirect": "noRedirect",
        "hidden": false,
        "alwaysShow": false,
        "meta": {
          "title": "拜访记录",
          "icon": "",
          "noCache": false
        },
        "children": []
      }
    ]
  },
  {
    "path": "/business",
    "name": "Business",
    "component": "Layout",
    "redirect": "noRedirect",
    "hidden": false,
    "alwaysShow": false,
    "meta": {
      "title": "修养预约",
      "icon": "",
      "noCache": false
    },
    "children": []
  },
  {
    "path": "/flow",
    "name": "Flow",
    "component": "Layout",
    "redirect": "noRedirect",
    "hidden": false,
    "alwaysShow": false,
    "meta": {
      "title": "流程管理",
      "icon": "",
      "noCache": false
    },
    "children": []
  }
]