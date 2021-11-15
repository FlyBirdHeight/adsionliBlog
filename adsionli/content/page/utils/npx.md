# npx的学习与使用

| 文档创建人 | 创建日期   | 文档内容          | 更新时间 |
| ---------- | ---------- | ----------------- | -------- |
| adsionli   | 2021-10-28 | npx的学习与使用 | 2021-10-28    |

## 1. 什么是npx
> 官方给出的解释如下：
>
> Executes `command` either from a local `node_modules/.bin`, or from a central cache, installing any packages needed in order for `command` to run.
>
> By default, `npx` will check whether `command` exists in `$PATH`, or in the local project binaries, and execute that. If `command` is not found, it will be installed prior to execution.
>
> Unless a `--package` option is specified, `npx` will try to guess the name of the binary to invoke depending on the specifier provided. All package specifiers understood by `npm` may be used with `npx`, including git specifiers, remote tarballs, local directories, or scoped packages.
>
> If a full specifier is included, or if `--package` is used, npx will always use a freshly-installed, temporary version of the package. This can also be forced with the `--ignore-existing` flag.
>
> 翻译过来的意思其实也很简单：
>
> 1. **npx**作为npm在5.2版本之后支持的内容，它可以从`node_modules`文件夹下，找到对应的本地节点_modules/.bin或从中央缓存执行command，安装运行command所需的任何软件包。
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

> 注意：Bash 内置的命令不在$PATH里面，所以不能用。比如，cd是 Bash 命令，因此就不能用npx cd。

2. npx能够避免全局安装的模块，它只会在当前项目下进行执行，而不会去查找全局，如果说npx未找到指定的模块，那么npx会将模块从远程仓库拉取，放在临时目录下，在使用完成后会进行删除，同时在下一次的时候依然会执行当前操作。

> npx 还可以指定其模块的版本，用来获取远程的模块版本：
>
> ```shell
> npx uglify-js@3.1.0 main.js -o ./dist/main.js
> ```
>
> 注意，只要 npx 后面的模块无法在本地发现，就会下载同名模块。比如，本地没有安装`http-server`模块，下面的命令会自动下载该模块，在当前目录启动一个 Web 服务。

3. npx的相关参数说明

| 参数名            | 参数说明                                 | 参数使用方式                                                 |
| ----------------- | ---------------------------------------- | ------------------------------------------------------------ |
| `--no-install`    | 让 npx 强制使用本地模块，不下载远程模块  | npx --no-install http-server                                 |
| --ignore-existing | 忽略本地的同名模块，强制安装使用远程模块 | npx --ignore-existing create-react-app my-react-app          |
| -p                | 用于指定 npx 所要安装的模块              | npx -p lolcatjs -p cowsay [command]（多个模块使用会非常简单） |

4. npx可以用于切换node版本的功能，这个功能就让npx可以作为版本管理器来使用，就很舒服。不过这种也就是临时下载下来，在网络比较好的环境的下会比使用nvm来管理node版本要来得方便，具体代码如下

```shell
npx node@0.12.8 -v
```

5. npx的-c参数的使用(内容较多，单独提出来)

```shell
npx -p lolcatjs -p cowsay 'cowsay hello | lolcatjs'
```

在上述指令中，作为**npx**指挥临时下载`cosway`而不会下载`lolcatjs`，npx会把`lolcatjs`交给`shell`去进行处理，这样就可能会导致报错。那么使用了**-c**参数之后，**npx**就全部都会用**npx**来解释。

```shell
npx -p lolcatjs -p cowsay -c 'cowsay hello | lolcatjs'
```

`-c`参数的另一个作用，是将环境变量带入所要执行的命令。

```shell
//npm 提供当前项目的一些环境变量，可以用下面的命令查看
npm run env | grep npm_
//-c参数可以把这些 npm 的环境变量带入 npx 命令
npx -c 'echo "$npm_package_name"'
```

5. npx还可以执行远程代码，但是这个远程代码也有前提，**必须是一个模块(必须包含`package.json`和其入口文件)**

```shell
# 执行 Gist 代码
$ npx https://gist.github.com/zkat/4bc19503fe9e9309e2bfaa2c58074d32
# 执行仓库代码
$ npx github:piuccio/cowsay hello
```



本篇文章主要参考了阮一峰老师的关于npx使用的说明加上自己的一些理解，[内容来源](http://www.ruanyifeng.com/blog/2019/02/npx.html)。





