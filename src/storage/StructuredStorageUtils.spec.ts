import o from 'ospec';
import * as utils from './StructuredStorageUtils';

o.spec("StructuredStorageUtils", function () {
  o("isChunk", function () {
    const isChunk = utils.isChunk;
    // these are chunks
    o(isChunk([])).equals(false);
    o(isChunk(['hello', "hello2"])).equals(true);

    // these are not
    o(isChunk([undefined])).equals(false);
    o(isChunk({})).equals(false);
    o(isChunk(null)).equals(false);
    o(isChunk(undefined)).equals(false);
    o(isChunk(new ArrayBuffer(10))).equals(false);
    o(isChunk(["hello", 123])).equals(false);
  });

  o('getTargetChunkIndex', function () {
    const getTargetChunkIndex = utils.getTargetChunkIndex;
    o(getTargetChunkIndex(2, [0, 3])).equals(0);
    o(getTargetChunkIndex(2, [0, 1, 3])).equals(1);
    o(getTargetChunkIndex(2, [0])).equals(0);
  });

  o('insertMessageToChunk', function () {
    const insertMessageToChunk = utils.insertMessageToChunk;
    const m = (t: number) => `{"timestamp": ${t}}`;
    o(insertMessageToChunk(1, "new", [m(0), m(1), m(12)]))
      .deepEquals([m(0), 'new', m(1), m(12)]);
  });

  o('isSerializedBuffer', function () {
    const isSerializedBuffer = utils.isSerializedBuffer;

    o(isSerializedBuffer({type: 'Buffer', data: [1, 2, 3]})).equals(true);
    o(isSerializedBuffer({type: 'Buffer', data: []})).equals(true);
    o(isSerializedBuffer({type: 'Buffer', data: [1, 2, 3], something: 'more'})).equals(false);
  });

  o('Uint8Array <-> Object conversion', function () {
    const to = utils.objectToUint8Array;
    const from = utils.uint8ArrayToObject;
    const compare = (a1: Uint8Array, a2: Uint8Array) => a1.every((n, i) => n === a2[i]);

    o(compare(to({}), Uint8Array.from([123,125]))).equals(true);
    o(from(Uint8Array.from([91, 93]))).deepEquals([]);
  });
});
