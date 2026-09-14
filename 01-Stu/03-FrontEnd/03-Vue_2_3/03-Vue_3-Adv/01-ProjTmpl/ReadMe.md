#### 工程化文件

此文件件的压缩包为两个初始化工程，可以直接拿过来使用

> * vue3_template_vite.zip: 此为使用 vite 构造工具初始化的 vue3 工程化文件
>
> * vue3_template_cli.zip: 此为使用 vue-cli 构造工具初始化的 vue3 工程化文件
>
> * 解压后使用 npm i 安装依赖包
>
> * 禁用 Vue2 的插件 Vetur，使用 Vue3 的插件 Volar，消除vue文件中 template 下没有根节点问题；
>
> * jsconfig.json文件修改：
>
>   ```js
>   {
>     "compilerOptions": {
>       "target": "ES2020",
>       "module": "ESNext",
>       "moduleResolution": "bundler",
>       "paths": {
>         "@/*": ["./src/*"]
>       },
>       "lib": ["esnext", "dom", "dom.iterable", "scripthost"]
>     }
>   }
>   ```

