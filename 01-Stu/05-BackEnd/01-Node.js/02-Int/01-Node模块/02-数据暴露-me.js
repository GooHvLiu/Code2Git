// ========================================
// =项目名称：01-数据暴露/02-数据暴露-me.js
// =项目类型：标准模块
// ========================================
//声明一个模块化函数：tiemo()
function tiemo(){
    console.log('I am tie mo ing...');
    
}

//测试exports方法使用
let varing='123';

//声明一个模块化函数：xiushouji()
function xiushouji(){
    console.log('I am xiushouji ing...');
    
}

/* **
** ** 暴露函数方式1：module.exports=value
** ** module.exports可以暴露任何value数据
** ** 1） module.exports='I do it.',
** ** 2)  module.exports=131689
** ** 3)  module.exports={
            tiemo:tiemo,
            xiushouji:xiushouji 
        }
 */
/* module.exports={
    tiemo:tiemo,
    xiushouji:xiushouji 
} */

/* **
** ** 暴露函数方式2：exports.name=value
** ** exports暴露的value不可以直接是数据,只能是函数或者变量
 */
exports.tiemo=tiemo;
exports.xiushouji =xiushouji;
exports.varing=varing;