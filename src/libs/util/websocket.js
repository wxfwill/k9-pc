function Socket(opt = {}) {
  let defOpt = {
    url: '', // 必填 要连接的URL；这应该是WebSocket服务器将响应的URL
    // protocols: null, // 可选 一个协议字符串或者一个包含协议字符串的数组。这些字符串用于指定子协议，这样单个服务器可以实现多个WebSocket子协议（例如，您可能希望一台服务器能够根据指定的协议（protocol）处理不同类型的交互）。如果不指定协议字符串，则假定为空字符串。
    onConnecting: () => console.log('正在连接socket服务'),
    onConnect: () => console.log('连接socket服务成功'),
    onMessage: (d) => console.log('收到socket服务发来的消息', d),
    onReconnecting: () => console.log('正在重连socket服务'),
    onReconnect: () => console.log('重连socket服务成功'),
    onError: () => console.log('socket服务发生错误'),
    onClose: () => console.log('socket服务已关闭'),
    pingTimeout: 15000,
    pongTimeout: 10000,
    reConnectTimeout: 6000
  };
  Object.assign(this, defOpt, opt);

  this.connect();
  this.toBeSend = [];
}
Socket.prototype = {
  parse(str) {
    let res;
    try {
      res = JSON.parse(str);
    } catch (e) {
      res = str;
    }
    return res;
  },
  connect(isReconnect = false) {
    if (this.ws) return console.log('连接已存在');
    this.autoReconnect = true; // 开启自动重连
    this.ws = new WebSocket(this.url);
    isReconnect ? this.onReconnecting() : this.onConnecting();
    this.ws.onopen = (e) => {
      this.toBeSend.forEach((data) => this.send(data));
      this.toBeSend = [];
      isReconnect ? this.onReconnect(e) : this.onConnect(e);
      this.heartCheck();
    };
    this.ws.onmessage = (e) => {
      this.onMessage(this.parse(e.data));
      this.heartCheck();
    };
    this.ws.onerror = (e) => {
      this.heartStop();
      this.onError(e);
      this.autoReconnect && this.reConnect();
    };
    this.ws.onclose = (e) => {
      this.heartStop();
      this.onClose(e);
      this.autoReconnect && this.reConnect();
    };
  },
  reConnect() {
    // 重连，需要做重连节流
    let interval = Date.now() - this.connectTime;
    if (interval < this.reConnectTimeout) return;
    this.ws.close();
    this.ws = null;
    this.connect(true);
    this.connectTime = Date.now();
    setTimeout(() => {
      if (this.ws.readyState != 1) {
        this.autoReconnect && this.reConnect();
      }
    }, this.reConnectTimeout);
  },
  close() {
    this.autoReconnect = false; // 不再自动重连
    this.ws.close();
  },
  send(data) {
    if (this.ws && this.ws.readyState == 1) {
      let d = typeof data == 'string' ? data : JSON.stringify(data);
      this.ws.send(d);
    } else {
      this.toBeSend.push(data);
    }
  },
  heartStart() {
    this.pingTimeoutId = setTimeout(() => {
      this.send(JSON.stringify({serviceCode: 'ping'}));
      this.pongTimeoutId = setTimeout(() => {
        this.autoReconnect && this.reConnect();
      }, this.pongTimeout);
    }, this.pingTimeout);
  },
  heartStop() {
    clearTimeout(this.pingTimeoutId);
    clearTimeout(this.pongTimeoutId);
  },
  heartCheck() {
    this.heartStop();
    this.heartStart();
  }
};

export default Socket;
