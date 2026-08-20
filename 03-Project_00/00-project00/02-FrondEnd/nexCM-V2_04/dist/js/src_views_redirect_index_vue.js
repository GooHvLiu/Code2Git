"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(self["webpackChunknexcm_v2"] = self["webpackChunknexcm_v2"] || []).push([["src_views_redirect_index_vue"],{

/***/ "./src/views/redirect/index.vue":
/*!**************************************!*\
  !*** ./src/views/redirect/index.vue ***!
  \**************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _index_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.vue?vue&type=script&lang=js */ \"./src/views/redirect/index.vue?vue&type=script&lang=js\");\n/* harmony import */ var _node_modules_vue_vue_loader_v15_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../../node_modules/@vue/vue-loader-v15/lib/runtime/componentNormalizer.js */ \"./node_modules/@vue/vue-loader-v15/lib/runtime/componentNormalizer.js\");\nvar render, staticRenderFns\n;\n\n\n\n/* normalize component */\n;\nvar component = (0,_node_modules_vue_vue_loader_v15_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"])(\n  _index_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"],\n  render,\n  staticRenderFns,\n  false,\n  null,\n  null,\n  null\n  \n)\n\n/* hot reload */\nif (false) // removed by dead control flow\n{ var api; }\ncomponent.options.__file = \"src/views/redirect/index.vue\"\n/* harmony default export */ __webpack_exports__[\"default\"] = (component.exports);\n\n//# sourceURL=webpack://nexcm-v2/./src/views/redirect/index.vue?\n}");

/***/ }),

/***/ "./src/views/redirect/index.vue?vue&type=script&lang=js":
/*!**************************************************************!*\
  !*** ./src/views/redirect/index.vue?vue&type=script&lang=js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_babel_loader_lib_index_js_clonedRuleSet_40_use_0_node_modules_vue_vue_loader_v15_lib_index_js_vue_loader_options_index_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[0]!../../../node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./index.vue?vue&type=script&lang=js */ \"./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[0]!./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./src/views/redirect/index.vue?vue&type=script&lang=js\");\n /* harmony default export */ __webpack_exports__[\"default\"] = (_node_modules_babel_loader_lib_index_js_clonedRuleSet_40_use_0_node_modules_vue_vue_loader_v15_lib_index_js_vue_loader_options_index_vue_vue_type_script_lang_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]); \n\n//# sourceURL=webpack://nexcm-v2/./src/views/redirect/index.vue?\n}");

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[0]!./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./src/views/redirect/index.vue?vue&type=script&lang=js":
/*!****************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[0]!./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./src/views/redirect/index.vue?vue&type=script&lang=js ***!
  \****************************************************************************************************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* eslint-disable vue/multi-word-component-names */\n/**\r\n * ==========================================\r\n * 路由重定向页（无刷新重载）\r\n * ==========================================\r\n * 用于标签页\"刷新\"功能：\r\n *   1. 从当前页跳转到 /redirect?path=xxx\r\n *   2. 本页面立即跳回 xxx\r\n *   3. 由于路由变化，目标组件会被销毁重建，实现无白屏刷新\r\n * 比 location.reload() 体验更好，不会整页白屏\r\n */\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  name: 'Redirect',\n  beforeRouteEnter(to, from, next) {\n    next(vm => {\n      const path = to.query.path || '/';\n      vm.$router.replace(path);\n    });\n  },\n  render(h) {\n    return h();\n  }\n});\n\n//# sourceURL=webpack://nexcm-v2/./src/views/redirect/index.vue?./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use%5B0%5D!./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options\n}");

/***/ })

}]);