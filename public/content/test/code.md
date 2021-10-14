```
//这是1.code的测试
String.prototype.matchAll(reg){
    let res = this.match(reg);
    if(res){
        let str = this.replace(reg, '^'.repeat(res[0].length));
        let match = this.matchAll(str);
        return [res, ...match];
    }

    return null;
}
```

```
//这是2.code的测试
handle() {
    this.returnHtml += this.handleTag.start;
    this.handleValue.map((currentValue, index) => {
        let innerHtml = pS;
        if(currentValue.length == 0){
            this.returnHtml += this.handleTag.br;
            return ;
        }
        
        currentValue = currentValue.replace(this.removeEndSpace)
        let spaceCount = currentValue.match(this.space).length;
        let tabLayour = this.getTabNum(spaceCount);
        innerHtml = innerHtml.slice(-3)+ " " + tabLayour + innerHtml.slice(-3, 0);

        currentValue = currentValue.replace(this.space);
    })
}
```
