<div class="container clearfix" id="mainBox">
        <script>
        if(!isCookieConcision){
            $('.main_father').removeClass('mainfather-concision')
            $('.main_father .container').removeClass('container-concision')
        }
        </script>
        <main>
<script type="text/javascript">
    function getQueryString(name) {   
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象  
      var r = window.location.search.substr(1).match(reg);  //匹配目标参数
      if( r != null ) return decodeURIComponent( r[2] ); return '';   
    }
    function stripscript(s){ 
      var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？%]") 
      var rs = ""; 
      for (var i = 0; i < s.length; i++) { 
        rs = rs+s.substr(i, 1).replace(pattern, ''); 
      } 
      return rs; 
    }
    var blogHotWords = stripscript(getQueryString('utm_term')).length > 1 ? stripscript(getQueryString('utm_term')) : ''
</script>
<div class="blog-content-box">
        <div class="article-header-box">
<hr> 
<h1><a name="t0"></a><a id="HTTP1x_7"></a>HTTP/1.x</h1> 
<p>http1.x是基于文本的<a href="https://so.csdn.net/so/search?q=%E9%80%9A%E4%BF%A1%E5%8D%8F%E8%AE%AE&amp;spm=1001.2101.3001.7020" target="_blank" class="hl hl-1" data-report-click="{&quot;spm&quot;:&quot;1001.2101.3001.7020&quot;,&quot;dest&quot;:&quot;https://so.csdn.net/so/search?q=%E9%80%9A%E4%BF%A1%E5%8D%8F%E8%AE%AE&amp;spm=1001.2101.3001.7020&quot;}" data-tit="通信协议" data-pretit="通信协议">通信协议</a>，分为start line（请求行），http header（请求头）和http body（请求体）三个部分。<br> 根据发起方的不同</p> 
<ul><li>start line又分为request line(请求行) 、status line(状态行)</li><li>http header又分为request header(请求头) 、response header（响应头）</li><li>http body又分为request body(请求体)、response body(响应体)</li></ul> 
<p>*进行http通讯之前必须先建立tcp连接，完成三次握手</p> 
<h5><a id="_16"></a>请求行</h5> 
<p>http请求的第一行是请求行，记录请求类型（get、post等）、请求URI、协议版本（http1.0、http1.1等），在http请求的第一行，以\n结尾，第二行开始才是请求头</p> 
<h5><a id="_18"></a>请求头</h5> 
<p>请求头从第二行开始，用来标识</p> 
<ul><li>请求体长度（必传）</li><li>能够接受的数据类型</li><li>语言</li><li>浏览器信息</li><li>压缩方式</li><li>编码方式</li><li>host</li><li>cookie</li><li>等</li></ul> 
<p>请求头是变长的，以连续两个\n为结束标识（即空一行）<br> 不同类型的请求请求头不一样，相同类型下有些请求头字段可以不传</p> 
<h5><a id="_32"></a>请求体</h5> 
<p>请求体没有格式要求，可以根据应用实际情况灵活处理，唯一一点要求就是必须要和请求头之间空一行。</p> 
<h5><a id="_35"></a>状态行</h5> 
<p>响应的第一行是状态行，返回该次响应的协议版本（http1.0、http1.1等）、请求的状态(200、404、500等)、状态描述</p> 
<h5><a id="_37"></a>响应头</h5> 
<p>响应头与请求头类似，都包含了一些关于请求本身的信息，可能包括</p> 
<ul><li>重定向时的新地址</li><li>服务器信息</li><li>编码格式</li><li>响应体长度</li><li>响应体语言</li><li>过期时间</li><li>等</li></ul> 
<p>响应头是变长的，以连续两个\n为结束标识（即空一行）</p> 
<h5><a id="_48"></a>响应体</h5> 
<p>响应体也没有格式要求，可以根据实际情况灵活处理，唯一一点要求仍然是必须要和响应头之间空一行。</p> 
<p>http请求头内容是http协议中非常重要的一块内容，知识点也很多。这几篇文章详细介绍了请求头的内容<br> <a href="https://www.cnblogs.com/imyalost/p/5708445.html">http协议（六）报文首部 - 老_张 - 博客园</a><br> <a href="https://www.cnblogs.com/imyalost/p/5717430.html">http协议（七）通用首部字段 - 老_张 - 博客园</a><br> <a href="https://www.cnblogs.com/imyalost/p/5726556.html">http协议（八）请求首部字段 - 老_张 - 博客园</a><br> <a href="https://www.cnblogs.com/imyalost/p/5737024.html">http协议（九）响应首部字段 - 老_张 - 博客园</a><br> <a href="https://www.cnblogs.com/imyalost/p/5740562.html">http协议（十）实体首部字段 - 老_张 - 博客园</a></p> 
<hr> 
<h1><a name="t1"></a><a id="HTTP10HTTP11_59"></a>HTTP/1.0与HTTP/1.1的区别</h1> 
<ol><li>支持的请求方法不同，http1.0不支持OPTIONS、TRACE、CONNECT三种请求方式，http1.1不支持LINK和UNLINK两种请求方式。其中，CONNECT（隧道协议）方式用来进行SSL\TLS加密通讯，所以http1.0自然也不支持https。</li><li>http1.0没有host请求头，意味着http1.0不支持在一台http服务器上搭建多个web站点。比如，你不能同时在一台服务器上托管www.baidu.com和www.taobao.com两个域名。而http1.1协议里host一定要传</li><li>http1.0默认都是非持久连接，一次http请求完成后就会断开；http1.1默认都是持久连接，一次连接后可以持续发送请求，直到一方断开连接</li><li>http1.1支持长链接，自然地会发展出管线化技术（pipeline），http1.0只有部分服务器通过非标准手段实现了长链接，所以不一定支持管线化</li><li>HTTP/1.1加入了一个新的状态码100（Continue）。</li><li>HTTP/1.1加入了一些cache的新特性，当缓存对象的Age超过Expire时变为stale对象，cache不需要直接抛弃stale对象，而是与源服务器进行重新激活（revalidation）。</li><li>HTTP/1.1引入了Chunked transfer-coding来将消息分割成若干个任意大小的数据块，避免缓冲整个消息带来的过载。</li></ol> 
<p>http1.1主要是在1.0的基础上优化性能，以及通过扩展http <a href="https://so.csdn.net/so/search?q=header&amp;spm=1001.2101.3001.7020" target="_blank" class="hl hl-1" data-report-click="{&quot;spm&quot;:&quot;1001.2101.3001.7020&quot;,&quot;dest&quot;:&quot;https://so.csdn.net/so/search?q=header&amp;spm=1001.2101.3001.7020&quot;}" data-tit="header" data-pretit="header">header</a>的方式增加了部分功能。1.1相当于1.0的特性增强版</p> 
<hr> 
<h1><a name="t2"></a><a id="HTTP20_71"></a>HTTP/2.0</h1> 
<p>http2.0是基于SPDY协议设计出来的、基于二进制帧流的通信协议。（SPDY协议与http2差别不大，就不单独介绍了）<br> 每一个二进制帧都分为length（24bit）、type（8bit）、flags（8bit）、预留位（1bit）、streamID（31bit）、payload（任意长度）六个部分。其中length、type、flags、预留位、streamID组成了帧头（frame header），固定长9字节（72比特）。</p> 
<ul><li>length：表示payload部分的长度，默认大小为0~16,384(2<sup>14</sup>)</li><li>type：表示此帧的类型，一共10种</li><li>flags：重要参数位，没一bit位代表一个参数</li><li>预留位：预留</li><li>streamID：表示此帧的顺序，用作流控制</li><li>payload：正文</li></ul> 
<p>http2.0的帧是比http1.1中的请求更小的传输单位，且http1.1的请求可以被封装到http2.0的帧里。每一个请求都可能对应多个帧的交互。<br> 每一帧的正文长度默认都不超过16384（2<sup>14</sup>）比特，除非接收方通知了SETTINGS_MAX_FRAME_SIZE（一般在2<sup>14</sup>到2<sup>24</sup>之间）</p> 
<p>帧的种类（type）：</p> 
<div class="table-box"><table><thead><tr><th>类型</th><th>对应类型码</th><th>说明</th></tr></thead><tbody><tr><td>DATA</td><td>0x0</td><td>数据帧，传输应用需要的数据</td></tr><tr><td>HEADERS</td><td>0x1</td><td>消息头帧，传输头信息，包括请求头、响应头等</td></tr><tr><td>PRIORITY</td><td>0x2</td><td>优先级帧，设定流优先级</td></tr><tr><td>RST_STREAM</td><td>0x3</td><td>流终止帧，中断流或者表示发生了一个错误，不中断连接</td></tr><tr><td>SETTINGS</td><td>0x4</td><td>设置帧，设置该连接的参数，作用于整个连接</td></tr><tr><td>PUSH_PROMISE</td><td>0x5</td><td>推送帧，服务端推送时使用，客户端可以返回一个RST_STREAM 帧来拒绝推</td></tr><tr><td>PING</td><td>0x6</td><td>PING帧，判断空闲连接是否可用，测量最小往返时间 (RTT)</td></tr><tr><td>GOAWAY</td><td>0x7</td><td>GOAWAY帧，发起关闭连接，或者警示严重错误。关闭连接前会处理完已建立的流</td></tr><tr><td>WINDOW_UPDATE</td><td>0x8</td><td>窗口更新帧，流量控制。可以针对某个流，也可以针对整个连接</td></tr><tr><td>CONTINUATION</td><td>0x9</td><td>延续帧，示意继续传输数据</td></tr></tbody></table></div>
<p>每一种类型的帧都有特定的格式，<s>详细的格式在<a href="#" target="_self">另一篇文章</a>中有说明（还没写）</s></p> 
<p>其中HEADERS帧和DATA帧用来兼容http1.x，分别对应1.x中的消息头和消息体。</p> 
<h5><a id="_101"></a>流和多路复用</h5> 
<p>流（stream）是一个逻辑概念，表示双向交换的独立的帧序列，由帧头（frame header）中的streamID标识。http2.0定义了高度独立的流来实现高效率的多路复用，任意流的阻塞不会影响其他流的处理。并且每一个流都可以有一个独立的优先级，用来帮助对端分配资源，挑选重要的信息优先传输。<br> 流是有状态的，并且在整个交互周期内会出现状态的流转，流的状态流转是通过不同类型的帧来控制的。<s>详细情况在<a href="#" target="_self">另一篇文章</a>中有说明（还没写）</s></p> 
<h5><a id="_104"></a>流量控制</h5> 
<p>请求发起方可以主动要求服务器只传输指定大小的数据，服务端在传输完成后会暂停流，直到客户端要求继续传输后面的数据。在某些场景下，这种机制可以极大的缓解网络压力，并且降低网页感知渲染时间。</p> 
<h5><a id="_106"></a>服务器主动推送</h5> 
<p>有了高度独立的流和多路复用机制，http2.0可以很容易的实现服务器主动推送的功能。即在tcp连接上服务端主动发起一个PUSH流，当然客户端也可以拒绝。</p> 
<h5><a id="_108"></a>压缩消息头</h5> 
<p>http2.0针对消息头做了很大程度的压缩：</p> 
<ul><li>通讯双方各自维护一份索引表（头列表），将常用的请求头维护到索引表中，通讯时直接发送索引号，而不是字符串，部分常用请求头信息的索引是硬编码的，不需要动态维护</li><li>需要发送字符串的情况下，使用哈夫曼编码压缩字符串</li></ul> 
<p>http2.0中的头字段与1.1的格式一样。当通讯双方需要交换头列表时，先将若干个头字段集合成头列表，再通过HPACK压缩算法压缩成头部块，然后将过大的头部块拆成若干头部块段，通过HEADERS帧、PUSH_PROMISE帧、或者CONTINUATION帧的payload进行传输。而Cookie字段比较特殊，需要特殊处理，详见<a href="https://httpwg.org/specs/rfc7540.html#CompressCookie">Hypertext Transfer Protocol Version 2 (HTTP/2)</a></p> 
<h5><a id="_114"></a>加密</h5> 
<p>http2.0协议不强制要求信息加密。对于没有安全层的http2.0实现，称其为 HTTP/2 Cleartext （h2c）<br> 目前，各大浏览器都不打算支持h2c，所以常见的http2.0基本都是基于https的<br> 很多http2.0的工具和类库同时支持 h2 和 h2c，<a href="https://github.com/http2/http2-spec/wiki/Implementations">支持的工具清单</a></p> 
<h5><a id="_118"></a>不足之处</h5> 
<ol><li>单连接开销比较大。HPACK数据压缩算法会更新两端的查找表。这样可以让连接有状态，而破坏状态就意味着要重建查找表，另外单连接占用内存较多。</li><li>你可能不需要SSL。如果你的数据不需要保护，或者已经使用DRM或其他编码进行保护了，那么TLS的安全性对你可能无所谓。如果C/S两端都能由你自己控制的话，可以自己实现h2c，然后这个点就不再是问题了</li><li>需要抛弃针对HTTP/1.x的优化。HTTP/1.x优化在支持HTTP/2的浏览器中会影响性能，因此可能需要花时间把它们推倒重来。（比如分域存储）</li><li>对下载大文件不利。如果你的应用主要提供大文件下载或者流媒体播放，那可能不想用TLS，而且在只有一个流的情况下，多路复用也体现不出什么优势。</li></ol> 
<hr> 
<h1><a name="t3"></a><a id="HTTP20HTTP1x_124"></a>HTTP/2.0与HTTP/1.x的区别</h1> 
<p>http2.0和1.x在报文格式上区别很大，但是语义、状态码、请求方法没有什么区别</p> 
<ul><li>http2.0使用的是二进制格式协议，比起http1.x的明文格式协议健壮性和效率都提升了很多</li><li>http2.0定义了stream双向帧流，可以在一个tcp连接内混杂发送多个stream的消息，而不必像http1.x中的管道化技术，必须等前一个响应完成后再发送后面的响应（HOLB，Head-Of-Line Blocking）</li><li>http1.x传的都是明文，安全性很差</li><li>http1.x每次请求和响应都需要带上完整的header，增加了不少网络开销</li><li>使用1.x协议时每个网页可能需要打开多个TCP连接来请求数据，而浏览器对每个域名打开的连接数又有限制；2.0协议可以只打开一个tcp连接，一个连接上能够支持上百个并发的流传输数据。相当于把tcp当成一个平台，在这个平台之上进行设计，实现各种花式特性</li><li>http2.0可以兼容http1.x，或者说http2.0包含了http1.1</li><li>虽然http2.0的协议不强制要求TLS层，但实际上所有浏览器实现时都要求必须有TLS层，所以现有的http2.0基本都依赖https，而http1.x并不强制依赖https</li></ul> 
<hr> 
<h1><a name="t4"></a><a id="HTTPS_134"></a>HTTPS</h1> 
<p>https是在http之下、TCP/IP之上多加了一层安全层，一般使用SSL/TLS作为加密协议（SSL协议所有版本都有漏洞，不建议使用，TLS1.0可以降级到SSL3.0，所以也不安全）<br> https中的http协议可以是http1.x版本，也可以是http2.0版本</p> 
<h5><a id="_137"></a>请求过程</h5> 
<p>https最有意思的地方在于它的请求过程以及安全通信的机制。（理解https安全通信机制需要先理解对称加密、非对称加密、数字证书的概念）<br> https在发起一个http请求时，需要通过三次握手先建立一个tcp连接，然后通过ssl的握手协议协商密钥、建立安全层连接。</p> 
<p>下面是建立https连接的简略通信过程：</p> 
<div class="mermaid">
 <svg xmlns="http://www.w3.org/2000/svg" id="mermaid-svg-bQnmOXVp5em4Med9" height="100%" width="100%" style="max-width:550px;" viewBox="-150 -10 550 1041">
  <g></g>
  <g>
   <line id="actor6" x1="75" y1="5" x2="75" y2="1030" class="actor-line" stroke-width="0.5px" stroke="#999"></line>
   <rect x="0" y="0" fill="#eaeaea" stroke="#666" width="150" height="65" rx="3" ry="3" class="actor"></rect>
   <text x="75" y="32.5" dominant-baseline="central" alignment-baseline="central" class="actor" style="text-anchor: middle;">
    <tspan x="75" dy="0">
     Client
    </tspan>
   </text>
  </g>
  <g>
   <line id="actor7" x1="275" y1="5" x2="275" y2="1030" class="actor-line" stroke-width="0.5px" stroke="#999"></line>
   <rect x="200" y="0" fill="#eaeaea" stroke="#666" width="150" height="65" rx="3" ry="3" class="actor"></rect>
   <text x="275" y="32.5" dominant-baseline="central" alignment-baseline="central" class="actor" style="text-anchor: middle;">
    <tspan x="275" dy="0">
     Server
    </tspan>
   </text>
  </g>
  <defs>
   <marker id="arrowhead" refX="5" refY="2" markerWidth="6" markerHeight="4" orient="auto">
    <path d="M 0,0 V 4 L6,2 Z"></path>
   </marker>
  </defs>
  <defs>
   <marker id="crosshead" markerWidth="15" markerHeight="8" orient="auto" refX="16" refY="4">
    <path fill="black" stroke="#000000" stroke-width="1px" d="M 9,2 V 6 L16,4 Z" style="stroke-dasharray: 0, 0;"></path>
    <path fill="none" stroke="#000000" stroke-width="1px" d="M 0,1 L 6,7 M 6,1 L 0,7" style="stroke-dasharray: 0, 0;"></path>
   </marker>
  </defs>
  <g>
   <rect x="-100" y="75" fill="#EDF2AE" stroke="#666" width="150" height="36" rx="0" ry="0" class="note"></rect>
   <text x="-84" y="104" fill="black" class="noteText">
    <tspan x="-84" fill="black">
     TCP握手阶段
    </tspan>
   </text>
  </g>
  <g>
   <text x="175" y="139" class="messageText" style="text-anchor: middle;">
    请求建立TCP连接
   </text>
   <line x1="75" y1="146" x2="275" y2="146" class="messageLine0" stroke-width="2" stroke="black" marker-end="url(#arrowhead)" style="fill: none;"></line>
  </g>
  <g>
   <text x="175" y="174" class="messageText" style="text-anchor: middle;">
    同意建立TCP连接
   </text>
   <line x1="275" y1="181" x2="75" y2="181" class="messageLine0" stroke-width="2" stroke="black" marker-end="url(#arrowhead)" style="fill: none;"></line>
  </g>
  <g>
   <text x="175" y="209" class="messageText" style="text-anchor: middle;">
    收到，准备发送数据
   </text>
   <line x1="75" y1="216" x2="275" y2="216" class="messageLine0" stroke-width="2" stroke="black" marker-end="url(#arrowhead)" style="fill: none;"></line>
  </g>
  <g>
   <rect x="-100" y="226" fill="#EDF2AE" stroke="#666" width="150" height="58" rx="0" ry="0" class="note"></rect>
   <text x="-84" y="255" fill="black" class="noteText">
    <tspan x="-84">
     TCP握手阶段结束
    </tspan>
    <tspan dy="22" x="-84">
     SSL握手阶段开始
    </tspan>
   </text>
  </g>
  <g>
   <text x="175" y="312" class="messageText" style="text-anchor: middle;">
    客户端打招呼：Hello
   </text>
   <line x1="75" y1="319" x2="275" y2="319" class="messageLine0" stroke-width="2" stroke="black" marker-end="url(#arrowhead)" style="fill: none;"></line>
  </g>
  <g>
   <text x="175" y="347" class="messageText" style="text-anchor: middle;">
    服务端打招呼：Hello
   </text>
   <line x1="275" y1="354" x2="75" y2="354" class="messageLine0" stroke-width="2" stroke="black" marker-end="url(#arrowhead)" style="fill: none;"></line>
  </g>
  <g>
   <rect x="-100" y="364" fill="#EDF2AE" stroke="#666" width="150" height="36" rx="0" ry="0" class="note"></rect>
   <text x="-84" y="393" fill="black" class="noteText">
    <tspan x="-84" fill="black">
     握手一阶段结束
    </tspan>
   </text>
  </g>
  <g>
   <text x="175" y="428" class="messageText" style="text-anchor: middle;">
    发送服务器证书
   </text>
   <line x1="275" y1="435" x2="75" y2="435" class="messageLine0" stroke-width="2" stroke="black" marker-end="url(#arrowhead)" style="fill: none;"></line>
  </g>
  <g>
   <text x="175" y="463" class="messageText" style="text-anchor: middle;">
    发送服务器公钥（可选，视具体算法而定）
   </text>
   <line x1="275" y1="470" x2="75" y2="470" class="messageLine0" stroke-width="2" stroke="black" marker-end="url(#arrowhead)" style="fill: none;"></line>
  </g>
  <g>
   <text x="175" y="498" class="messageText" style="text-anchor: middle;">
    请求客户端发送证书
   </text>
   <line x1="275" y1="505" x2="75" y2="505" class="messageLine0" stroke-width="2" stroke="black" marker-end="url(#arrowhead)" style="fill: none;"></line>
  </g>
  <g>
   <text x="175" y="533" class="messageText" style="text-anchor: middle;">
    服务端打招呼结束
   </text>
   <line x1="275" y1="540" x2="75" y2="540" class="messageLine0" stroke-width="2" stroke="black" marker-end="url(#arrowhead)" style="fill: none;"></line>
  </g>
  <g>
   <rect x="-100" y="550" fill="#EDF2AE" stroke="#666" width="150" height="36" rx="0" ry="0" class="note"></rect>
   <text x="-84" y="579" fill="black" class="noteText">
    <tspan x="-84" fill="black">
     握手二阶段结束
    </tspan>
   </text>
  </g>
  <g>
   <text x="175" y="614" class="messageText" style="text-anchor: middle;">
    发送客户端证书
   </text>
   <line x1="75" y1="621" x2="275" y2="621" class="messageLine0" stroke-width="2" stroke="black" marker-end="url(#arrowhead)" style="fill: none;"></line>
  </g>
  <g>
   <text x="175" y="649" class="messageText" style="text-anchor: middle;">
    发送客户端公钥
   </text>
   <line x1="75" y1="656" x2="275" y2="656" class="messageLine0" stroke-width="2" stroke="black" marker-end="url(#arrowhead)" style="fill: none;"></line>
  </g>
  <g>
   <text x="175" y="684" class="messageText" style="text-anchor: middle;">
    发送证书验证信息进行自证
   </text>
   <line x1="75" y1="691" x2="275" y2="691" class="messageLine0" stroke-width="2" stroke="black" marker-end="url(#arrowhead)" style="fill: none;"></line>
  </g>
  <g>
   <rect x="-100" y="701" fill="#EDF2AE" stroke="#666" width="150" height="36" rx="0" ry="0" class="note"></rect>
   <text x="-84" y="730" fill="black" class="noteText">
    <tspan x="-84" fill="black">
     握手三阶段结束
    </tspan>
   </text>
  </g>
  <g>
   <text x="175" y="765" class="messageText" style="text-anchor: middle;">
    发送预置主密钥
   </text>
   <line x1="75" y1="772" x2="275" y2="772" class="messageLine0" stroke-width="2" stroke="black" marker-end="url(#arrowhead)" style="fill: none;"></line>
  </g>
  <g>
   <text x="175" y="800" class="messageText" style="text-anchor: middle;">
    发送前面所有发出内容的hash值
   </text>
   <line x1="75" y1="807" x2="275" y2="807" class="messageLine0" stroke-width="2" stroke="black" marker-end="url(#arrowhead)" style="fill: none;"></line>
  </g>
  <g>
   <text x="175" y="835" class="messageText" style="text-anchor: middle;">
    通知客户端之后所有信息都是密文
   </text>
   <line x1="275" y1="842" x2="75" y2="842" class="messageLine0" stroke-width="2" stroke="black" marker-end="url(#arrowhead)" style="fill: none;"></line>
  </g>
  <g>
   <text x="175" y="870" class="messageText" style="text-anchor: middle;">
    发送前面所有发出内容的hash值
   </text>
   <line x1="275" y1="877" x2="75" y2="877" class="messageLine0" stroke-width="2" stroke="black" marker-end="url(#arrowhead)" style="fill: none;"></line>
  </g>
  <g>
   <rect x="-100" y="887" fill="#EDF2AE" stroke="#666" width="150" height="58" rx="0" ry="0" class="note"></rect>
   <text x="-84" y="916" fill="black" class="noteText">
    <tspan x="-84">
     SSL握手第四阶段
    </tspan>
    <tspan dy="22" x="-84">
     结束，开始密文通信
    </tspan>
   </text>
  </g>
  <g>
   <rect x="0" y="965" fill="#eaeaea" stroke="#666" width="150" height="65" rx="3" ry="3" class="actor"></rect>
   <text x="75" y="997.5" dominant-baseline="central" alignment-baseline="central" class="actor" style="text-anchor: middle;">
    <tspan x="75" dy="0">
     Client
    </tspan>
   </text>
  </g>
  <g>
   <rect x="200" y="965" fill="#eaeaea" stroke="#666" width="150" height="65" rx="3" ry="3" class="actor"></rect>
   <text x="275" y="997.5" dominant-baseline="central" alignment-baseline="central" class="actor" style="text-anchor: middle;">
    <tspan x="275" dy="0">
     Server
    </tspan>
   </text>
  </g>
 </svg>
</div> 
<p>上面的流程图是一个<strong>简略</strong>的握手过程示意，每一个阶段客户端和服务端都交换了很多信息。</p> 
<h5><a id="_169"></a>密钥交换和生成机制</h5> 
<p>SSL/TLS的安全机制依赖于数字证书和CA机构（申请证书一般都需要花钱），下图是SSL的密钥交换协商过程的简易示意图：</p> 
<p>以浏览器为例说明如下整个的校验过程：<br> <img src="https://img-blog.csdnimg.cn/20190612170108438.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3UwMTA2NDYyNTA=,size_16,color_FFFFFF,t_70" alt="在这里插入图片描述"><br> 为什么通过上面的过程之后，客户端和服务端就可以进行安全通信？<br> 原因就在于第三方证书机构的引入。<br> 以浏览器访问服务器为例：<br> <img src="https://img-blog.csdnimg.cn/20190612194543511.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3UwMTA2NDYyNTA=,size_16,color_FFFFFF,t_70" alt="在这里插入图片描述"><br> 其中最关键的是步骤3和步骤4：</p> 
<ul><li>步骤3通过内置的证书信任列表找到给服务端签发证书的CA机构，通过自己持有的CA公钥对服务器发来的证书进行验证；</li><li>步骤4利用步骤3获得的服务端公钥加密随机数，公钥加密后的密文只有私钥能够解开，而私钥只有服务端有，这就保证了其他人无法解开密文获得最关键的随机数，也就无法得到对称密钥</li></ul> 
<p>需要注意的是，上面两个步骤是通过<strong>CA机构公钥</strong>解密签名，获得签名中的<strong>服务器公钥</strong>，然后使用<strong>服务器公钥</strong>加密随机数的。</p> 
<p>下面是步骤3中浏览器的操作：</p> 
<ol><li>首先浏览器读取证书中的证书所有者、有效期等信息进行一一校验</li><li>浏览器开始查找操作系统中已内置的受信任的证书发布机构CA，与服务器发来的证书中的颁发者CA比对，用于校验证书是否为合法机构颁发</li><li>如果找不到，浏览器就会报错，说明服务器发来的证书是不可信任的。</li><li>如果找到，那么浏览器就会从操作系统中取出 颁发者CA 的公钥，然后对服务器发来的证书里面的签名进行解密</li><li>浏览器使用相同的hash算法计算出服务器发来的证书的hash值，将这个计算的hash值与证书中签名做对比</li><li>对比结果一致，则证明服务器发来的证书合法，没有被冒充</li><li>此时浏览器就可以读取证书中的公钥，用于后续加密了</li></ol> 
<hr> 
<h1><a name="t5"></a><a id="HTTP3_193"></a>HTTP/3</h1> 
<blockquote> 
 <p><strong>http3是一个正在制定中的协议，其前身是HTTP-over-QUIC协议。<br> HTTP-over-QUIC的意思是基于QUIC协议实现的HTTP通信协议。<br> QUIC（Quick UDP Internet Connections），是快速 UDP 互联网连接的缩写，这是一种实验性的传输层协议，由 Google 开发，在 2013 年实现。</strong></p> 
</blockquote> 
<p>所以，可以看出，未来的http3将会抛弃TCP而转向UDP，省去了TCP握手的时间以及其他TCP连接的限制。<br> 但是，UDP本身也有自己的问题，所以Google对UDP进行了改进，提出了新的传输层协议QUIC（Google真是个厉害的公司，HTTP2的前身SPDY协议也是Google提出的）</p> 
<h5><a id="QUIC_200"></a>QUIC</h5> 
<p>QUIC协议放弃了TCP协议而转用UDP协议，避免了TCP的各种问题和限制，并且设计了一系列的机制来改进优化UDP本身的问题。<br> TCP协议都是由操作系统内核实现的，想要修改TCP协议几乎不可能，再加上TCP通信时操作系统需要在<a href="https://msdn.microsoft.com/zh-cn/library/windows/hardware/ff554836%28v=vs.85%29.aspx">用户模式和内核模式</a>下切换（这种切换的消耗很可观），改用UDP似乎是个不错的想法。</p> 
<hr> 

