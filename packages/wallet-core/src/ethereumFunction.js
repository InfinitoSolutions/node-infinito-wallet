const sha3 = require('js-sha3');

function sanitizeHex(hex) {
  hex = hex.substring(0, 2) == '0x' ? hex.substring(2) : hex
  if (hex == '') return ''
  return '0x' + this.padLeftEven(hex)
}

function padLeftEven(hex) {
  hex = hex.length % 2 != 0 ? '0' + hex : hex
  return hex
}

function getNakedAddress(address) {
  return address.toString().toLowerCase().replace('0x', '')
}

function padLeft(n, width, z) {
  z = z || '0'
  n = n + ''
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n
}

function hasUpperCase(address) {
  return (/[A-Z]/.test(address))
}

function hashMessage(message) {
  const payload = concat([
    utf8ToBytes('\x19Ethereum Signed Message:\n'),
    utf8ToBytes(String(message.length)),
    ((typeof (message) === 'string') ? utf8ToBytes(message) : message)
  ])
  return keccak256(payload)
}

function concat(objects) {
  var arrays = [];
  var length = 0;
  for (var i = 0; i < objects.length; i++) {
    var object = arrayify(objects[i])
    arrays.push(object);
    length += object.length;
  }

  var result = new Uint8Array(length);
  var offset = 0;
  for (var i = 0; i < arrays.length; i++) {
    result.set(arrays[i], offset);
    offset += arrays[i].length;
  }

  return addSlice(result);
}

function addSlice(array) {
  if (array.slice) { return array }

  array.slice = function () {
    const args = Array.prototype.slice.call(arguments)
    return new Uint8Array(Array.prototype.slice.apply(array, args))
  }

  return array
}

function utf8ToBytes(str) {
  var result = [];
  var offset = 0;
  for (var i = 0; i < str.length; i++) {
    var c = str.charCodeAt(i);
    if (c < 128) {
      result[offset++] = c;
    } else if (c < 2048) {
      result[offset++] = (c >> 6) | 192;
      result[offset++] = (c & 63) | 128;
    } else if (((c & 0xFC00) == 0xD800) && (i + 1) < str.length && ((str.charCodeAt(i + 1) & 0xFC00) == 0xDC00)) {
      // Surrogate Pair
      c = 0x10000 + ((c & 0x03FF) << 10) + (str.charCodeAt(++i) & 0x03FF);
      result[offset++] = (c >> 18) | 240;
      result[offset++] = ((c >> 12) & 63) | 128;
      result[offset++] = ((c >> 6) & 63) | 128;
      result[offset++] = (c & 63) | 128;
    } else {
      result[offset++] = (c >> 12) | 224;
      result[offset++] = ((c >> 6) & 63) | 128;
      result[offset++] = (c & 63) | 128;
    }
  }

  return arrayify(result);
};

function arrayify(value) {
  if (value == null) {
    // errors.throwError('cannot convert null value to array', errors.INVALID_ARGUMENT, { arg: 'value', value: value });
  }

  if (value && value.toHexString) {
    value = value.toHexString();
  }

  if (isHexString(value)) {
    value = value.substring(2);
    if (value.length % 2) { value = '0' + value; }

    var result = [];
    for (var i = 0; i < value.length; i += 2) {
      result.push(parseInt(value.substr(i, 2), 16));
    }

    return addSlice(new Uint8Array(result));

  } else if (typeof (value) === 'string') {
    if (value.match(/^[0-9a-fA-F]*$/)) {
      // errors.throwError('hex string must have 0x prefix', errors.INVALID_ARGUMENT, { arg: 'value', value: value });
    }
    // errors.throwError('invalid hexidecimal string', errors.INVALID_ARGUMENT, { arg: 'value', value: value });
  }

  if (isArrayish(value)) {
    return addSlice(new Uint8Array(value));
  }

  // errors.throwError('invalid arrayify value', { arg: 'value', value: value, type: typeof (value) });
}

function keccak256(data) {
  data = arrayify(data);
  return '0x' + sha3.keccak_256(data);
}

function isHexString(value, length) {
  if (typeof (value) !== 'string' || !value.match(/^0x[0-9A-Fa-f]*$/)) {
    return false
  }
  if (length && value.length !== 2 + 2 * length) { return false; }
  return true;
}

function isArrayish(value) {
  if (!value || parseInt(value.length) != value.length || typeof (value) === 'string') {
    return false;
  }

  for (var i = 0; i < value.length; i++) {
    var v = value[i];
    if (v < 0 || v >= 256 || parseInt(v) != v) {
      return false;
    }
  }

  return true;
}

function hexZeroPad(value, length) {
  while (value.length < 2 * length + 2) {
    value = '0x0' + value.substring(2);
  }
  return value;
}

module.exports = {
  sanitizeHex,
  padLeft,
  padLeftEven,
  getNakedAddress,
  hasUpperCase,
  hashMessage,
  concat,
  addSlice,
  utf8ToBytes,
  arrayify,
  keccak256,
  isHexString,
  isArrayish,
  hexZeroPad
}
