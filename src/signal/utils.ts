type Encoding = 'utf8' | 'binary' | 'base64' | 'hex' | 'latin1' | 'utf16le';

export function arrayBufferToString(buffer: ArrayBuffer, encoding: Encoding = 'utf8'): string {
  if (encoding == null) encoding = 'utf8';

  if (typeof global != 'undefined' && global.Buffer != null) {
    return Buffer.from(buffer).toString(encoding);
  } else {
    const uint8 = new Uint8Array(buffer);

    if (encoding === 'hex') {
      let out = '';
      for (let i = 0, l = uint8.byteLength; i < l; ++i) {
        const val = uint8[i];
        if (val == null) throw new Error("unreachable");
        out += toHex(val);
      }
      return out;
    }

    if (encoding === 'base64') {
      const str = String.fromCharCode.apply(null, Array.from(uint8));
      return btoa(str);
    }

    if (encoding === 'binary' || encoding === 'latin1' || typeof TextDecoder == 'undefined') {
      return String.fromCharCode.apply(null, Array.from(uint8));
    }

    //TextDecoder way
    const newEncoding = encoding === 'utf16le'
      ? 'utf-16le'
      : encoding;

    const decoder = new TextDecoder(newEncoding);
    return decoder.decode(uint8);
  }

}

function toHex(n: number): string {
  return n.toString(16).padStart(2, '0');
}
