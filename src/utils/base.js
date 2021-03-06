/**
 * @component Base.js
 * @description 基础方法库
 * @time 2017/4/3
 * @author JOKER XU
 */
export function delay(time = 300) {
  return new Promise((resolve) => setTimeout(() => resolve(time), time));
}

/** * 根据数组对象排序 默认升序
 * @param prop 属性值
 * */
export function compareProps(prop) {
  return function (obj1, obj2) {
    const val1 = obj1[prop];
    const val2 = obj2[prop];
    if (val1 < val2) {
      return -1;
    } else if (val1 > val2) {
      return 1;
    }
    return 0;
  };
}

/** * 切割base64字符串
 * @param baseString baseString64编码字符串
 * */
export function sliceBase64(baseString = '') {
  const str = 'data:image/jpeg;base64,';
  if (!baseString) return;
  if (baseString.startsWith(str)) {
    return baseString.replace(str, '');
  }
  if (baseString.startsWith('http')) {
    return baseString;
  }
  return null;
}


function padLeftZero(str) {
  return (`00${str}`).substr(str.length);
}

// 格式化时间
export function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear().toString()).substr(4 - RegExp.$1.length));
  }
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
  };
  /* eslint-disable no-restricted-syntax */
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      const str = `${o[k]}`;
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
}

// 去除html中的标签
export function replaceHtml(str) {
  if (!str) return '';
  return str.replace(/<[^>]+>/g, '');
}

// 获取字符串img标签
export function matchImg(str) {
  if (!str) return '';
  return str.match(/<img.*?(?:>|\/>)/gi);
}

// 设置title
export function setTitle(title = '') {
  document.title = title;
  if (/ip(hone|od|ad)/i.test(navigator.userAgent)) {
    const i = document.createElement('iframe');
    i.src = '/static/favicon.ico';
    i.style.display = 'none';
    i.onload = () => {
      setTimeout(() => {
        i.remove();
      }, 9);
    };
    document.body.appendChild(i);
  }
}

// 处理搜索
export function transformKeyword(value, keyword) {
  if (!keyword || !value) return value;
  const reg = new RegExp(`(${keyword})`, 'ig');
  return value.replace(reg, `<span style="color: #ff4747">${keyword}</span>`);
}

// 防止重复点击
export const noDoubleHandle = {
  lastPressTime: 1,
  onHandle(callback) {
    const curTime = new Date().getTime();
    if (curTime - this.lastPressTime > 500) {
      this.lastPressTime = curTime;
      callback();
    }
  },
};

// array 去重
export function uniqueArr(arr = [], type = 'name') {
  if (!Array.isArray(arr)) throw new Error('params must be array');
  if (arr.length === 0) return arr;
  const hash = {};
  return arr.reduce((item, next) => {
    hash[next[type]] ? '' : hash[next[type]] = true && item.push(next);
    return item;
  }, []);
}


/**
 * 格式化money 适用于numberInput
 * @param {*} value
 * return 1,000
 */
export function formatMoney(value) {
  if (!value && value !== 0) return null;
  if (typeof value === 'number') {
    value = String(value);
  }
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * 解析money 1,000,000 适用于numberInput
 * @param {*} value
 */
export function parserMoney(value) {
  if (!value && value !== 0) return null;
  if (typeof value === 'number') {
    value = String(value);
  }
  const res = value.replace(/\$\s?|(,*)/g, '');
  if (Number.isNaN(Number(res))) return value;
  return Number(res);
}

/**
 * 递归查询tree path
 * @param {Array} list
 * @param {String} value
 * @param options 配置
 * {
 *   {String} equalKey 比对key
 *   {String} returnKey 返回key
 *   {Bool} returnIndex 是否返回index
 * }
 * @return [*] 从顶层到当前层级
 */
export function getTreePathList(list, value, {
  equalKey = 'name',
  returnKey = 'uid',
  returnIndex = false,
} = {}) {
  for (let i = 0; i < list.length; i++) {
    const { children = [], [equalKey]: name, [returnKey]: uid } = list[i];
    const returnMap = returnIndex ? {
      [returnKey]: uid,
      index: i,
    } : uid;
    if (name === value) {
      return [returnMap];
    }
    if (children && children.length) {
      const res = getTreePathList(children, value, {
        equalKey,
        returnKey,
        returnIndex,
      });
      if (res) {
        return [returnMap, res].flat();
      }
    }
  }
}
