# npx的学习与使用

| 文档创建人 | 创建日期   | 文档内容          | 更新时间 |
| ---------- | ---------- | ----------------- | -------- |
| adsionli   | 2021-10-28 | npx的学习与使用 | 2021-10-28    |

## 1. 什么是npx
> 官方给出的解释如下：
>
> Executes `<command>` either from a local `node_modules/.bin`, or from a central cache, installing any packages needed in order for `<command>` to run.
>
> By default, `npx` will check whether `<command>` exists in `$PATH`, or in the local project binaries, and execute that. If `<command>` is not found, it will be installed prior to execution.
>
> Unless a `--package` option is specified, `npx` will try to guess the name of the binary to invoke depending on the specifier provided. All package specifiers understood by `npm` may be used with `npx`, including git specifiers, remote tarballs, local directories, or scoped packages.
>
> If a full specifier is included, or if `--package` is used, npx will always use a freshly-installed, temporary version of the package. This can also be forced with the `--ignore-existing` flag.
>
> 翻译过来的意思其实也很简单：
>
> 1. **npx**作为npm在5.2版本之后支持的内容，它可以从`node_modules`文件夹下，找到对应的本地节点_modules/.bin或从中央缓存执行<command>，安装运行<command>所需的任何软件包。
> 2. 在默认情况下，**npx**会优先去查找项目中是否存在对应的command,如果不存在就从远程拉取到本地，然后再进行执行(这些过程是执行在使用之前)。同时npx也会去查找全局变量的$PATH下的可执行路径，来进行本身的操作。
> 3. 除非指定了**package**选项，否则**npx将根据提供的说明符尝试猜测要调用的二进制文件的名称**。npm理解的所有包说明符都可以与npx一起使用，包括git说明符、远程tarball、本地目录或作用域包。
>
> 个人理解，这个东西就是一个写好的脚本工具，可以方便开发者来进行调试

## npx的使用

1. 在没有使用npx之前，加入我们需要直接使用webpack对代码进行打包，那么需进行如下的操作

   ```js
   node_modules/.bin/webpack --version
   ```

   那么在使用了npx之后，这个过程就变得很简单了，只需要直接执行npx去查找webpack，然后就可以执行了，无需自己再去查找节点下的内容了

   ```js
   npx webpack --version
   ```

   

2. 

