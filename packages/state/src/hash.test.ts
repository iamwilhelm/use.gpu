import { getHash } from './hash';

const add = (a: number, b: number) => ((a|0) + (b|0)) >>> 0;
const rot = (a: number, b: number) => ((a << b) | (a >>> (32 - b))) >>> 0;
const mul = Math.imul;

describe('hash', () => {

  it("arithmetic", () => {
    expect(add(1, 1)).toEqual(2);
    expect(add(0x7fffffff, 1)).toEqual(0x80000000);
    expect(add(0xffffffff, 1)).toEqual(0);

    expect(mul(0x1000, 0x1000)).toEqual(0x1000000);
    expect(mul(0x7fffffff, 0x2)).toEqual(-2);
    expect(mul(0x80000001, 0x2)).toEqual(0x2);
    expect(mul(0x80000001, 0x80000001)).toEqual(0x1);

    expect(rot(0x7fffff00, 31)).toEqual(0x3fffff80);
    expect(rot(0x80000001, 31)).toEqual(0xc0000000);
  })

  it('hashes values', () => {
    expect(getHash(undefined)).toEqual('1l2iguh1n2');
    expect(getHash(null)).toEqual('8vth8a6rwg');
    expect(getHash("")).toEqual('uottwj0y3r');
    expect(getHash("0")).toEqual('38065vocck');
    expect(getHash(0)).toEqual('ho5ynhor7l');
    expect(getHash(1)).toEqual('3qqxx8ax1q');
    expect(getHash(0x100000000)).toEqual('pg9ib6fw0e');
    expect(getHash(0x100000001)).toEqual('fu6p2l1bp0');
    expect(getHash([])).toEqual('pcbqk3lwbn');
    expect(getHash([0])).toEqual('kgn6uidxoi');
    expect(getHash([1])).toEqual('y4kt22a416');
    expect(getHash({})).toEqual('9q11f1m8s9');
    expect(getHash({f:0})).toEqual('2idv4isjw6');
    expect(getHash({g:0})).toEqual('1i5s8eihs8');
    expect(getHash({f:1})).toEqual('jfsipl00fb');
    expect(getHash({g:1})).toEqual('s5kf067kro');

    const u8 = new Uint8Array(3);
    u8[0] = 1;
    u8[1] = 2;

    expect(getHash(u8)).toEqual('zoy66fqire');

    u8[2] = 2;

    expect(getHash(u8)).toEqual('9j8jh6vgmv');
  });
  
});