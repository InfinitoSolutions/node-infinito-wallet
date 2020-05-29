/* tslint:disable */
var wasm;

const stack = [];

const slab = [{ obj: undefined }, { obj: null }, { obj: true }, { obj: false }];

function getObject(idx) {
    if ((idx & 1) === 1) {
        return stack[idx >> 1];
    } else {
        const val = slab[idx >> 1];

        return val.obj;

    }
}

let slab_next = slab.length;

function dropRef(idx) {

    idx = idx >> 1;
    if (idx < 4) return;
    let obj = slab[idx];

    obj.cnt -= 1;
    if (obj.cnt > 0) return;

    // If we hit 0 then free up our space in the slab
    slab[idx] = slab_next;
    slab_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropRef(idx);
    return ret;
}

function addHeapObject(obj) {
    if (slab_next === slab.length) slab.push(slab.length + 1);
    const idx = slab_next;
    const next = slab[idx];

    slab_next = next;

    slab[idx] = { obj, cnt: 1 };
    return idx << 1;
}

// const TextEncoder = require('util').TextEncoder;
const TextEncoder = require('text-encoding').TextEncoder;

let cachedTextEncoder = new TextEncoder('utf-8');

let cachegetUint8Memory = null;
function getUint8Memory() {
    if (cachegetUint8Memory === null || cachegetUint8Memory.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory;
}

function passStringToWasm(arg) {

    const buf = cachedTextEncoder.encode(arg);
    const ptr = wasm.__wbindgen_malloc(buf.length);
    getUint8Memory().set(buf, ptr);
    return [ptr, buf.length];
}

// const TextDecoder = require('util').TextDecoder;
const TextDecoder = require('text-encoding').TextDecoder;

let cachedTextDecoder = new TextDecoder('utf-8');

function getStringFromWasm(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory().subarray(ptr, ptr + len));
}

let cachedGlobalArgumentPtr = null;
function globalArgumentPtr() {
    if (cachedGlobalArgumentPtr === null) {
        cachedGlobalArgumentPtr = wasm.__wbindgen_global_argument_ptr();
    }
    return cachedGlobalArgumentPtr;
}

let cachegetUint32Memory = null;
function getUint32Memory() {
    if (cachegetUint32Memory === null || cachegetUint32Memory.buffer !== wasm.memory.buffer) {
        cachegetUint32Memory = new Uint32Array(wasm.memory.buffer);
    }
    return cachegetUint32Memory;
}

function passArray8ToWasm(arg) {
    const ptr = wasm.__wbindgen_malloc(arg.length * 1);
    getUint8Memory().set(arg, ptr / 1);
    return [ptr, arg.length];
}
/**
* @param {Entropy} arg0
* @param {Uint8Array} arg1
* @param {string} arg2
* @returns {any}
*/
module.exports.paper_wallet_scramble = function(arg0, arg1, arg2) {
    const [ptr1, len1] = passArray8ToWasm(arg1);
    const [ptr2, len2] = passStringToWasm(arg2);
    try {
        return takeObject(wasm.paper_wallet_scramble(arg0.ptr, ptr1, len1, ptr2, len2));

    } finally {
        wasm.__wbindgen_free(ptr1, len1 * 1);
        wasm.__wbindgen_free(ptr2, len2 * 1);

    }

};

/**
* @param {Uint8Array} arg0
* @param {string} arg1
* @returns {Entropy}
*/
module.exports.paper_wallet_unscramble = function(arg0, arg1) {
    const [ptr0, len0] = passArray8ToWasm(arg0);
    const [ptr1, len1] = passStringToWasm(arg1);
    try {
        return Entropy.__wrap(wasm.paper_wallet_unscramble(ptr0, len0, ptr1, len1));

    } finally {
        wasm.__wbindgen_free(ptr0, len0 * 1);
        wasm.__wbindgen_free(ptr1, len1 * 1);

    }

};

/**
* encrypt the given data with a password, a salt and a nonce
*
* Salt: must be 32 bytes long;
* Nonce: must be 12 bytes long;
*
* @param {string} arg0
* @param {Uint8Array} arg1
* @param {Uint8Array} arg2
* @param {Uint8Array} arg3
* @returns {any}
*/
module.exports.password_encrypt = function(arg0, arg1, arg2, arg3) {
    const [ptr0, len0] = passStringToWasm(arg0);
    const [ptr1, len1] = passArray8ToWasm(arg1);
    const [ptr2, len2] = passArray8ToWasm(arg2);
    const [ptr3, len3] = passArray8ToWasm(arg3);
    try {
        return takeObject(wasm.password_encrypt(ptr0, len0, ptr1, len1, ptr2, len2, ptr3, len3));

    } finally {
        wasm.__wbindgen_free(ptr0, len0 * 1);
        wasm.__wbindgen_free(ptr1, len1 * 1);
        wasm.__wbindgen_free(ptr2, len2 * 1);
        wasm.__wbindgen_free(ptr3, len3 * 1);

    }

};

/**
* decrypt the data with the password
*
* @param {string} arg0
* @param {Uint8Array} arg1
* @returns {any}
*/
module.exports.password_decrypt = function(arg0, arg1) {
    const [ptr0, len0] = passStringToWasm(arg0);
    const [ptr1, len1] = passArray8ToWasm(arg1);
    try {
        return takeObject(wasm.password_decrypt(ptr0, len0, ptr1, len1));

    } finally {
        wasm.__wbindgen_free(ptr0, len0 * 1);
        wasm.__wbindgen_free(ptr1, len1 * 1);

    }

};

function freeDerivationScheme(ptr) {

    wasm.__wbg_derivationscheme_free(ptr);
}
/**
* There is a special function to use when deriving Addresses. This function
* has been revised to offer stronger properties. This is why there is a
* V2 derivation scheme. The V1 being the legacy one still used in daedalus
* now a days.
*
* It is strongly advised to use V2 as the V1 is deprecated since April 2018.
* Its support is already provided for backward compatibility with old
* addresses.
*/
class DerivationScheme {

    static __wrap(ptr) {
        const obj = Object.create(DerivationScheme.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;
        freeDerivationScheme(ptr);
    }

    /**
    * deprecated, provided here only for backward compatibility with
    * Daedalus\' addresses
    * @returns {DerivationScheme}
    */
    static v1() {
        return DerivationScheme.__wrap(wasm.derivationscheme_v1());
    }
    /**
    * the recommended settings
    * @returns {DerivationScheme}
    */
    static v2() {
        return DerivationScheme.__wrap(wasm.derivationscheme_v2());
    }
}
module.exports.DerivationScheme = DerivationScheme;

function freePrivateKey(ptr) {

    wasm.__wbg_privatekey_free(ptr);
}
/**
* A given private key. You can use this key to sign transactions.
*
* # security considerations
*
* * do not store this key without encrypting it;
* * if leaked anyone can _spend_ a UTxO (Unspent Transaction Output)
*   with it;
*
*/
class PrivateKey {

    static __wrap(ptr) {
        const obj = Object.create(PrivateKey.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;
        freePrivateKey(ptr);
    }

    /**
    * create a new private key from a given Entropy
    * @param {Entropy} arg0
    * @param {string} arg1
    * @returns {PrivateKey}
    */
    static new(arg0, arg1) {
        const [ptr1, len1] = passStringToWasm(arg1);
        try {
            return PrivateKey.__wrap(wasm.privatekey_new(arg0.ptr, ptr1, len1));

        } finally {
            wasm.__wbindgen_free(ptr1, len1 * 1);

        }

    }
    /**
    * retrieve a private key from the given hexadecimal string
    * @param {string} arg0
    * @returns {PrivateKey}
    */
    static from_hex(arg0) {
        const [ptr0, len0] = passStringToWasm(arg0);
        try {
            return PrivateKey.__wrap(wasm.privatekey_from_hex(ptr0, len0));

        } finally {
            wasm.__wbindgen_free(ptr0, len0 * 1);

        }

    }
    /**
    * convert the private key to an hexadecimal string
    * @returns {string}
    */
    to_hex() {
        const retptr = globalArgumentPtr();
        wasm.privatekey_to_hex(retptr, this.ptr);
        const mem = getUint32Memory();
        const rustptr = mem[retptr / 4];
        const rustlen = mem[retptr / 4 + 1];

        const realRet = getStringFromWasm(rustptr, rustlen).slice();
        wasm.__wbindgen_free(rustptr, rustlen * 1);
        return realRet;

    }
    /**
    * get the public key associated to this private key
    * @returns {PublicKey}
    */
    public() {
        return PublicKey.__wrap(wasm.privatekey_public(this.ptr));
    }
    /**
    * sign some bytes with this private key
    * @param {Uint8Array} arg0
    * @returns {Signature}
    */
    sign(arg0) {
        const [ptr0, len0] = passArray8ToWasm(arg0);
        try {
            return Signature.__wrap(wasm.privatekey_sign(this.ptr, ptr0, len0));

        } finally {
            wasm.__wbindgen_free(ptr0, len0 * 1);

        }

    }
    /**
    * derive this private key with the given index.
    *
    * # Security considerations
    *
    * * prefer the use of DerivationScheme::v2 when possible;
    * * hard derivation index cannot be soft derived with the public key
    *
    * # Hard derivation vs Soft derivation
    *
    * If you pass an index below 0x80000000 then it is a soft derivation.
    * The advantage of soft derivation is that it is possible to derive the
    * public key too. I.e. derivation the private key with a soft derivation
    * index and then retrieving the associated public key is equivalent to
    * deriving the public key associated to the parent private key.
    *
    * Hard derivation index does not allow public key derivation.
    *
    * This is why deriving the private key should not fail while deriving
    * the public key may fail (if the derivation index is invalid).
    *
    * @param {DerivationScheme} arg0
    * @param {number} arg1
    * @returns {PrivateKey}
    */
    derive(arg0, arg1) {
        const ptr0 = arg0.ptr;
        arg0.ptr = 0;
        return PrivateKey.__wrap(wasm.privatekey_derive(this.ptr, ptr0, arg1));
    }
}
module.exports.PrivateKey = PrivateKey;

function freeBip44ChainPrivate(ptr) {

    wasm.__wbg_bip44chainprivate_free(ptr);
}
/**
*/
class Bip44ChainPrivate {

    static __wrap(ptr) {
        const obj = Object.create(Bip44ChainPrivate.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;
        freeBip44ChainPrivate(ptr);
    }

    /**
    * @param {PrivateKey} arg0
    * @param {DerivationScheme} arg1
    * @returns {Bip44ChainPrivate}
    */
    static new(arg0, arg1) {
        const ptr0 = arg0.ptr;
        arg0.ptr = 0;
        const ptr1 = arg1.ptr;
        arg1.ptr = 0;
        return Bip44ChainPrivate.__wrap(wasm.bip44chainprivate_new(ptr0, ptr1));
    }
    /**
    * @returns {Bip44ChainPublic}
    */
    public() {
        return Bip44ChainPublic.__wrap(wasm.bip44chainprivate_public(this.ptr));
    }
    /**
    * @param {AddressKeyIndex} arg0
    * @returns {PrivateKey}
    */
    address_key(arg0) {
        const ptr0 = arg0.ptr;
        arg0.ptr = 0;
        return PrivateKey.__wrap(wasm.bip44chainprivate_address_key(this.ptr, ptr0));
    }
    /**
    * @returns {PrivateKey}
    */
    key() {
        return PrivateKey.__wrap(wasm.bip44chainprivate_key(this.ptr));
    }
}
module.exports.Bip44ChainPrivate = Bip44ChainPrivate;

function freeBip44ChainPublic(ptr) {

    wasm.__wbg_bip44chainpublic_free(ptr);
}
/**
*/
class Bip44ChainPublic {

    static __wrap(ptr) {
        const obj = Object.create(Bip44ChainPublic.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;
        freeBip44ChainPublic(ptr);
    }

    /**
    * @param {PublicKey} arg0
    * @param {DerivationScheme} arg1
    * @returns {Bip44ChainPublic}
    */
    static new(arg0, arg1) {
        const ptr0 = arg0.ptr;
        arg0.ptr = 0;
        const ptr1 = arg1.ptr;
        arg1.ptr = 0;
        return Bip44ChainPublic.__wrap(wasm.bip44chainpublic_new(ptr0, ptr1));
    }
    /**
    * @param {AddressKeyIndex} arg0
    * @returns {PublicKey}
    */
    address_key(arg0) {
        const ptr0 = arg0.ptr;
        arg0.ptr = 0;
        return PublicKey.__wrap(wasm.bip44chainpublic_address_key(this.ptr, ptr0));
    }
    /**
    * @returns {PublicKey}
    */
    key() {
        return PublicKey.__wrap(wasm.bip44chainpublic_key(this.ptr));
    }
}
module.exports.Bip44ChainPublic = Bip44ChainPublic;

function freeRedeemSignature(ptr) {

    wasm.__wbg_redeemsignature_free(ptr);
}
/**
*/
class RedeemSignature {

    static __wrap(ptr) {
        const obj = Object.create(RedeemSignature.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;
        freeRedeemSignature(ptr);
    }

    /**
    * @param {string} arg0
    * @returns {RedeemSignature}
    */
    static from_hex(arg0) {
        const [ptr0, len0] = passStringToWasm(arg0);
        try {
            return RedeemSignature.__wrap(wasm.redeemsignature_from_hex(ptr0, len0));

        } finally {
            wasm.__wbindgen_free(ptr0, len0 * 1);

        }

    }
    /**
    * @returns {string}
    */
    to_hex() {
        const retptr = globalArgumentPtr();
        wasm.redeemsignature_to_hex(retptr, this.ptr);
        const mem = getUint32Memory();
        const rustptr = mem[retptr / 4];
        const rustlen = mem[retptr / 4 + 1];

        const realRet = getStringFromWasm(rustptr, rustlen).slice();
        wasm.__wbindgen_free(rustptr, rustlen * 1);
        return realRet;

    }
}
module.exports.RedeemSignature = RedeemSignature;

function freePublicKey(ptr) {

    wasm.__wbg_publickey_free(ptr);
}
/**
* The public key associated to a given private key.
*
* It is not possible to sign (and then spend) with a public key.
* However it is possible to verify a Signature.
*
* # Security Consideration
*
* * Leaking a public key leads to privacy loss and in case of bip44 may compromise your wallet
*  (see hardened indices for more details)
*
*/
class PublicKey {

    static __wrap(ptr) {
        const obj = Object.create(PublicKey.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;
        freePublicKey(ptr);
    }

    /**
    * @param {string} arg0
    * @returns {PublicKey}
    */
    static from_hex(arg0) {
        const [ptr0, len0] = passStringToWasm(arg0);
        try {
            return PublicKey.__wrap(wasm.publickey_from_hex(ptr0, len0));

        } finally {
            wasm.__wbindgen_free(ptr0, len0 * 1);

        }

    }
    /**
    * @returns {string}
    */
    to_hex() {
        const retptr = globalArgumentPtr();
        wasm.publickey_to_hex(retptr, this.ptr);
        const mem = getUint32Memory();
        const rustptr = mem[retptr / 4];
        const rustlen = mem[retptr / 4 + 1];

        const realRet = getStringFromWasm(rustptr, rustlen).slice();
        wasm.__wbindgen_free(rustptr, rustlen * 1);
        return realRet;

    }
    /**
    * @param {Uint8Array} arg0
    * @param {Signature} arg1
    * @returns {boolean}
    */
    verify(arg0, arg1) {
        const [ptr0, len0] = passArray8ToWasm(arg0);
        try {
            return (wasm.publickey_verify(this.ptr, ptr0, len0, arg1.ptr)) !== 0;

        } finally {
            wasm.__wbindgen_free(ptr0, len0 * 1);

        }

    }
    /**
    * derive this public key with the given index.
    *
    * # Errors
    *
    * If the index is not a soft derivation index (< 0x80000000) then
    * calling this method will fail.
    *
    * # Security considerations
    *
    * * prefer the use of DerivationScheme::v2 when possible;
    * * hard derivation index cannot be soft derived with the public key
    *
    * # Hard derivation vs Soft derivation
    *
    * If you pass an index below 0x80000000 then it is a soft derivation.
    * The advantage of soft derivation is that it is possible to derive the
    * public key too. I.e. derivation the private key with a soft derivation
    * index and then retrieving the associated public key is equivalent to
    * deriving the public key associated to the parent private key.
    *
    * Hard derivation index does not allow public key derivation.
    *
    * This is why deriving the private key should not fail while deriving
    * the public key may fail (if the derivation index is invalid).
    *
    * @param {DerivationScheme} arg0
    * @param {number} arg1
    * @returns {PublicKey}
    */
    derive(arg0, arg1) {
        const ptr0 = arg0.ptr;
        arg0.ptr = 0;
        return PublicKey.__wrap(wasm.publickey_derive(this.ptr, ptr0, arg1));
    }
    /**
    * get the bootstrap era address. I.E. this is an address without
    * stake delegation.
    * @param {BlockchainSettings} arg0
    * @returns {Address}
    */
    bootstrap_era_address(arg0) {
        return Address.__wrap(wasm.publickey_bootstrap_era_address(this.ptr, arg0.ptr));
    }
}
module.exports.PublicKey = PublicKey;

function freeTxoPointer(ptr) {

    wasm.__wbg_txopointer_free(ptr);
}
/**
*/
class TxoPointer {

    static __wrap(ptr) {
        const obj = Object.create(TxoPointer.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;
        freeTxoPointer(ptr);
    }

    /**
    * @param {TransactionId} arg0
    * @param {number} arg1
    * @returns {TxoPointer}
    */
    static new(arg0, arg1) {
        return TxoPointer.__wrap(wasm.txopointer_new(arg0.ptr, arg1));
    }
    /**
    * serialize into a JsValue object
    * @returns {any}
    */
    to_json() {
        return takeObject(wasm.txopointer_to_json(this.ptr));
    }
    /**
    * retrieve the object from a JsValue.
    * @param {any} arg0
    * @returns {TxoPointer}
    */
    static from_json(arg0) {
        return TxoPointer.__wrap(wasm.txopointer_from_json(addHeapObject(arg0)));
    }
}
module.exports.TxoPointer = TxoPointer;

function freeAddress(ptr) {

    wasm.__wbg_address_free(ptr);
}
/**
*/
class Address {

    static __wrap(ptr) {
        const obj = Object.create(Address.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;
        freeAddress(ptr);
    }

    /**
    * @returns {string}
    */
    to_base58() {
        const retptr = globalArgumentPtr();
        wasm.address_to_base58(retptr, this.ptr);
        const mem = getUint32Memory();
        const rustptr = mem[retptr / 4];
        const rustlen = mem[retptr / 4 + 1];

        const realRet = getStringFromWasm(rustptr, rustlen).slice();
        wasm.__wbindgen_free(rustptr, rustlen * 1);
        return realRet;

    }
    /**
    * @param {string} arg0
    * @returns {Address}
    */
    static from_base58(arg0) {
        const [ptr0, len0] = passStringToWasm(arg0);
        try {
            return Address.__wrap(wasm.address_from_base58(ptr0, len0));

        } finally {
            wasm.__wbindgen_free(ptr0, len0 * 1);

        }

    }
}
module.exports.Address = Address;

function freeAccountIndex(ptr) {

    wasm.__wbg_accountindex_free(ptr);
}
/**
*/
class AccountIndex {

    static __wrap(ptr) {
        const obj = Object.create(AccountIndex.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;
        freeAccountIndex(ptr);
    }

    /**
    * @param {number} arg0
    * @returns {AccountIndex}
    */
    static new(arg0) {
        return AccountIndex.__wrap(wasm.accountindex_new(arg0));
    }
}
module.exports.AccountIndex = AccountIndex;

function freeEntropy(ptr) {

    wasm.__wbg_entropy_free(ptr);
}
/**
* the entropy associated to mnemonics. This is a bytes representation of the
* mnemonics the user has to remember how to generate the root key of an
* HD Wallet.
*
* TODO: interface to generate a new entropy
*
* # Security considerations
*
* * do not store this value without encrypting it;
* * do not leak the mnemonics;
* * make sure the user remembers the mnemonics string;
*
*/
class Entropy {

    static __wrap(ptr) {
        const obj = Object.create(Entropy.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;
        freeEntropy(ptr);
    }

    /**
    * retrieve the initial entropy of a wallet from the given
    * english mnemonics.
    * @param {string} arg0
    * @returns {Entropy}
    */
    static from_english_mnemonics(arg0) {
        const [ptr0, len0] = passStringToWasm(arg0);
        try {
            return Entropy.__wrap(wasm.entropy_from_english_mnemonics(ptr0, len0));

        } finally {
            wasm.__wbindgen_free(ptr0, len0 * 1);

        }

    }
    /**
    * @returns {string}
    */
    to_english_mnemonics() {
        const retptr = globalArgumentPtr();
        wasm.entropy_to_english_mnemonics(retptr, this.ptr);
        const mem = getUint32Memory();
        const rustptr = mem[retptr / 4];
        const rustlen = mem[retptr / 4 + 1];

        const realRet = getStringFromWasm(rustptr, rustlen).slice();
        wasm.__wbindgen_free(rustptr, rustlen * 1);
        return realRet;

    }
    /**
    * @returns {any}
    */
    to_array() {
        return takeObject(wasm.entropy_to_array(this.ptr));
    }
}
module.exports.Entropy = Entropy;

function freeTransactionSignature(ptr) {

    wasm.__wbg_transactionsignature_free(ptr);
}
/**
*/
class TransactionSignature {

    static __wrap(ptr) {
        const obj = Object.create(TransactionSignature.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;
        freeTransactionSignature(ptr);
    }

    /**
    * @param {string} arg0
    * @returns {TransactionSignature}
    */
    static from_hex(arg0) {
        const [ptr0, len0] = passStringToWasm(arg0);
        try {
            return TransactionSignature.__wrap(wasm.transactionsignature_from_hex(ptr0, len0));

        } finally {
            wasm.__wbindgen_free(ptr0, len0 * 1);

        }

    }
    /**
    * @returns {string}
    */
    to_hex() {
        const retptr = globalArgumentPtr();
        wasm.transactionsignature_to_hex(retptr, this.ptr);
        const mem = getUint32Memory();
        const rustptr = mem[retptr / 4];
        const rustlen = mem[retptr / 4 + 1];

        const realRet = getStringFromWasm(rustptr, rustlen).slice();
        wasm.__wbindgen_free(rustptr, rustlen * 1);
        return realRet;

    }
}
module.exports.TransactionSignature = TransactionSignature;

function freeOutputPolicy(ptr) {

    wasm.__wbg_outputpolicy_free(ptr);
}
/**
* This is the Output policy for automatic Input selection.
*/
class OutputPolicy {

    static __wrap(ptr) {
        const obj = Object.create(OutputPolicy.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;
        freeOutputPolicy(ptr);
    }

    /**
    * requires to send back all the spare changes to only one given address
    * @param {Address} arg0
    * @returns {OutputPolicy}
    */
    static change_to_one_address(arg0) {
        const ptr0 = arg0.ptr;
        arg0.ptr = 0;
        return OutputPolicy.__wrap(wasm.outputpolicy_change_to_one_address(ptr0));
    }
}
module.exports.OutputPolicy = OutputPolicy;

function freeCoin(ptr) {

    wasm.__wbg_coin_free(ptr);
}
/**
*/
class Coin {

    static __wrap(ptr) {
        const obj = Object.create(Coin.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;
        freeCoin(ptr);
    }

    /**
    * @returns {}
    */
    constructor() {
        this.ptr = wasm.coin_new();
    }
    /**
    * @param {string} arg0
    * @returns {Coin}
    */
    static from_str(arg0) {
        const [ptr0, len0] = passStringToWasm(arg0);
        try {
            return Coin.__wrap(wasm.coin_from_str(ptr0, len0));

        } finally {
            wasm.__wbindgen_free(ptr0, len0 * 1);

        }

    }
    /**
    * @returns {string}
    */
    to_str() {
        const retptr = globalArgumentPtr();
        wasm.coin_to_str(retptr, this.ptr);
        const mem = getUint32Memory();
        const rustptr = mem[retptr / 4];
        const rustlen = mem[retptr / 4 + 1];

        const realRet = getStringFromWasm(rustptr, rustlen).slice();
        wasm.__wbindgen_free(rustptr, rustlen * 1);
        return realRet;

    }
    /**
    * @param {number} arg0
    * @param {number} arg1
    * @returns {Coin}
    */
    static from(arg0, arg1) {
        return Coin.__wrap(wasm.coin_from(arg0, arg1));
    }
    /**
    * @returns {number}
    */
    ada() {
        return wasm.coin_ada(this.ptr);
    }
    /**
    * @returns {number}
    */
    lovelace() {
        return wasm.coin_lovelace(this.ptr);
    }
    /**
    * @param {Coin} arg0
    * @returns {Coin}
    */
    add(arg0) {
        return Coin.__wrap(wasm.coin_add(this.ptr, arg0.ptr));
    }
}
module.exports.Coin = Coin;

function freeTransactionId(ptr) {

    wasm.__wbg_transactionid_free(ptr);
}
/**
*/
class TransactionId {

    static __wrap(ptr) {
        const obj = Object.create(TransactionId.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;
        freeTransactionId(ptr);
    }

    /**
    * @returns {string}
    */
    to_hex() {
        const retptr = globalArgumentPtr();
        wasm.transactionid_to_hex(retptr, this.ptr);
        const mem = getUint32Memory();
        const rustptr = mem[retptr / 4];
        const rustlen = mem[retptr / 4 + 1];

        const realRet = getStringFromWasm(rustptr, rustlen).slice();
        wasm.__wbindgen_free(rustptr, rustlen * 1);
        return realRet;

    }
    /**
    * @param {string} arg0
    * @returns {TransactionId}
    */
    static from_hex(arg0) {
        const [ptr0, len0] = passStringToWasm(arg0);
        try {
            return TransactionId.__wrap(wasm.transactionid_from_hex(ptr0, len0));

        } finally {
            wasm.__wbindgen_free(ptr0, len0 * 1);

        }

    }
}
module.exports.TransactionId = TransactionId;

function freeDaedalusWallet(ptr) {

    wasm.__wbg_daedaluswallet_free(ptr);
}
/**
*/
class DaedalusWallet {

    static __wrap(ptr) {
        const obj = Object.create(DaedalusWallet.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;
        freeDaedalusWallet(ptr);
    }

    /**
    * @param {PrivateKey} arg0
    * @returns {DaedalusWallet}
    */
    static new(arg0) {
        const ptr0 = arg0.ptr;
        arg0.ptr = 0;
        return DaedalusWallet.__wrap(wasm.daedaluswallet_new(ptr0));
    }
    /**
    * @param {Entropy} arg0
    * @returns {DaedalusWallet}
    */
    static recover(arg0) {
        return DaedalusWallet.__wrap(wasm.daedaluswallet_recover(arg0.ptr));
    }
}
module.exports.DaedalusWallet = DaedalusWallet;

function freeDaedalusAddressChecker(ptr) {

    wasm.__wbg_daedalusaddresschecker_free(ptr);
}
/**
*/
class DaedalusAddressChecker {

    static __wrap(ptr) {
        const obj = Object.create(DaedalusAddressChecker.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;
        freeDaedalusAddressChecker(ptr);
    }

    /**
    * create a new address checker for the given daedalus address
    * @param {DaedalusWallet} arg0
    * @returns {DaedalusAddressChecker}
    */
    static new(arg0) {
        return DaedalusAddressChecker.__wrap(wasm.daedalusaddresschecker_new(arg0.ptr));
    }
    /**
    * check that we own the given address.
    *
    * This is only possible like this because some payload is embedded in the
    * address that only our wallet can decode. Once decoded we can retrieve
    * the associated private key.
    *
    * The return private key is the key needed to sign the transaction to unlock
    * UTxO associated to the address.
    * @param {Address} arg0
    * @returns {DaedalusCheckedAddress}
    */
    check_address(arg0) {
        return DaedalusCheckedAddress.__wrap(wasm.daedalusaddresschecker_check_address(this.ptr, arg0.ptr));
    }
}
module.exports.DaedalusAddressChecker = DaedalusAddressChecker;

function freeWitness(ptr) {

    wasm.__wbg_witness_free(ptr);
}
/**
* sign the inputs of the transaction (i.e. unlock the funds the input are
* referring to).
*
* The signature must be added one by one in the same order the inputs have
* been added.
*/
class Witness {

    static __wrap(ptr) {
        const obj = Object.create(Witness.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;
        freeWitness(ptr);
    }

    /**
    * @param {BlockchainSettings} arg0
    * @param {PrivateKey} arg1
    * @param {TransactionId} arg2
    * @returns {Witness}
    */
    static new_extended_key(arg0, arg1, arg2) {
        return Witness.__wrap(wasm.witness_new_extended_key(arg0.ptr, arg1.ptr, arg2.ptr));
    }
    /**
    * @param {BlockchainSettings} arg0
    * @param {PrivateRedeemKey} arg1
    * @param {TransactionId} arg2
    * @returns {Witness}
    */
    static new_redeem_key(arg0, arg1, arg2) {
        return Witness.__wrap(wasm.witness_new_redeem_key(arg0.ptr, arg1.ptr, arg2.ptr));
    }
    /**
    * used to add signatures created by hardware wallets where we don\'t have access
    * to the private key
    * @param {PublicKey} arg0
    * @param {TransactionSignature} arg1
    * @returns {Witness}
    */
    static from_external(arg0, arg1) {
        return Witness.__wrap(wasm.witness_from_external(arg0.ptr, arg1.ptr));
    }
}
module.exports.Witness = Witness;

function freeInputSelectionResult(ptr) {

    wasm.__wbg_inputselectionresult_free(ptr);
}
/**
*/
class InputSelectionResult {

    static __wrap(ptr) {
        const obj = Object.create(InputSelectionResult.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;
        freeInputSelectionResult(ptr);
    }

    /**
    * @param {TxoPointer} arg0
    * @returns {boolean}
    */
    is_input(arg0) {
        return (wasm.inputselectionresult_is_input(this.ptr, arg0.ptr)) !== 0;
    }
    /**
    * @returns {Coin}
    */
    estimated_fees() {
        return Coin.__wrap(wasm.inputselectionresult_estimated_fees(this.ptr));
    }
    /**
    * @returns {Coin}
    */
    estimated_change() {
        return Coin.__wrap(wasm.inputselectionresult_estimated_change(this.ptr));
    }
}
module.exports.InputSelectionResult = InputSelectionResult;

function freeAddressKeyIndex(ptr) {

    wasm.__wbg_addresskeyindex_free(ptr);
}
/**
*/
class AddressKeyIndex {

    static __wrap(ptr) {
        const obj = Object.create(AddressKeyIndex.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;
        freeAddressKeyIndex(ptr);
    }

    /**
    * @param {number} arg0
    * @returns {AddressKeyIndex}
    */
    static new(arg0) {
        return AddressKeyIndex.__wrap(wasm.addresskeyindex_new(arg0));
    }
}
module.exports.AddressKeyIndex = AddressKeyIndex;

function freeBip44RootPrivateKey(ptr) {

    wasm.__wbg_bip44rootprivatekey_free(ptr);
}
/**
* Root Private Key of a BIP44 HD Wallet
*/
class Bip44RootPrivateKey {

    static __wrap(ptr) {
        const obj = Object.create(Bip44RootPrivateKey.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;
        freeBip44RootPrivateKey(ptr);
    }

    /**
    * @param {PrivateKey} arg0
    * @param {DerivationScheme} arg1
    * @returns {Bip44RootPrivateKey}
    */
    static new(arg0, arg1) {
        const ptr0 = arg0.ptr;
        arg0.ptr = 0;
        const ptr1 = arg1.ptr;
        arg1.ptr = 0;
        return Bip44RootPrivateKey.__wrap(wasm.bip44rootprivatekey_new(ptr0, ptr1));
    }
    /**
    * recover a wallet from the given mnemonic words and the given password
    *
    * To recover an icarus wallet:
    * * 15 mnemonic words;
    * * empty password;
    *
    * @param {Entropy} arg0
    * @param {string} arg1
    * @returns {Bip44RootPrivateKey}
    */
    static recover(arg0, arg1) {
        const [ptr1, len1] = passStringToWasm(arg1);
        try {
            return Bip44RootPrivateKey.__wrap(wasm.bip44rootprivatekey_recover(arg0.ptr, ptr1, len1));

        } finally {
            wasm.__wbindgen_free(ptr1, len1 * 1);

        }

    }
    /**
    * @param {AccountIndex} arg0
    * @returns {Bip44AccountPrivate}
    */
    bip44_account(arg0) {
        const ptr0 = arg0.ptr;
        arg0.ptr = 0;
        return Bip44AccountPrivate.__wrap(wasm.bip44rootprivatekey_bip44_account(this.ptr, ptr0));
    }
    /**
    * @returns {PrivateKey}
    */
    key() {
        return PrivateKey.__wrap(wasm.bip44rootprivatekey_key(this.ptr));
    }
}
module.exports.Bip44RootPrivateKey = Bip44RootPrivateKey;

function freeTransaction(ptr) {

    wasm.__wbg_transaction_free(ptr);
}
/**
* a transaction type, this is not ready for sending to the network. It is only an
* intermediate type to use between the transaction builder and the transaction
* finalizer. It allows separation of concerns:
*
* 1. build the transaction on one side/thread/machine/...;
* 2. sign the transaction on the other/thread/machines/cold-wallet...;
*
*/
class Transaction {

    static __wrap(ptr) {
        const obj = Object.create(Transaction.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;
        freeTransaction(ptr);
    }

    /**
    * @returns {TransactionId}
    */
    id() {
        return TransactionId.__wrap(wasm.transaction_id(this.ptr));
    }
    /**
    * @returns {any}
    */
    to_json() {
        return takeObject(wasm.transaction_to_json(this.ptr));
    }
    /**
    * @param {any} arg0
    * @returns {Transaction}
    */
    static from_json(arg0) {
        return Transaction.__wrap(wasm.transaction_from_json(addHeapObject(arg0)));
    }
    /**
    * @returns {Transaction}
    */
    clone() {
        return Transaction.__wrap(wasm.transaction_clone(this.ptr));
    }
    /**
    * @returns {string}
    */
    to_hex() {
        const retptr = globalArgumentPtr();
        wasm.transaction_to_hex(retptr, this.ptr);
        const mem = getUint32Memory();
        const rustptr = mem[retptr / 4];
        const rustlen = mem[retptr / 4 + 1];

        const realRet = getStringFromWasm(rustptr, rustlen).slice();
        wasm.__wbindgen_free(rustptr, rustlen * 1);
        return realRet;

    }
}
module.exports.Transaction = Transaction;

function freeLinearFeeAlgorithm(ptr) {

    wasm.__wbg_linearfeealgorithm_free(ptr);
}
/**
* This is the linear fee algorithm used buy the current cardano blockchain.
*
* However it is possible the linear fee algorithm may change its settings:
*
* It is currently a function `fee(n) = a * x + b`. `a` and `b` can be
* re-configured by a protocol update. Users of this object need to be aware
* that it may change and that they might need to update its settings.
*
*/
class LinearFeeAlgorithm {

    static __wrap(ptr) {
        const obj = Object.create(LinearFeeAlgorithm.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;
        freeLinearFeeAlgorithm(ptr);
    }

    /**
    * this is the default mainnet linear fee algorithm. It is also known to work
    * with the staging network and the current testnet.
    *
    * @returns {LinearFeeAlgorithm}
    */
    static default() {
        return LinearFeeAlgorithm.__wrap(wasm.linearfeealgorithm_default());
    }
}
module.exports.LinearFeeAlgorithm = LinearFeeAlgorithm;

function freeBlockchainSettings(ptr) {

    wasm.__wbg_blockchainsettings_free(ptr);
}
/**
* setting of the blockchain
*
* This includes the `ProtocolMagic` a discriminant value to differentiate
* different instances of the cardano blockchain (Mainnet, Testnet... ).
*/
class BlockchainSettings {

    static __wrap(ptr) {
        const obj = Object.create(BlockchainSettings.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;
        freeBlockchainSettings(ptr);
    }

    /**
    * serialize into a JsValue object. Allowing the client to store the settings
    * or see changes in the settings or change the settings.
    *
    * Note that this is not recommended to change the settings on the fly. Doing
    * so you might not be able to recover your funds anymore or to send new
    * transactions.
    * @returns {any}
    */
    to_json() {
        return takeObject(wasm.blockchainsettings_to_json(this.ptr));
    }
    /**
    * retrieve the object from a JsValue.
    * @param {any} arg0
    * @returns {BlockchainSettings}
    */
    static from_json(arg0) {
        return BlockchainSettings.__wrap(wasm.blockchainsettings_from_json(addHeapObject(arg0)));
    }
    /**
    * default settings to work with Cardano Mainnet
    * @returns {BlockchainSettings}
    */
    static mainnet() {
        return BlockchainSettings.__wrap(wasm.blockchainsettings_mainnet());
    }
}
module.exports.BlockchainSettings = BlockchainSettings;

function freeTransactionFinalized(ptr) {

    wasm.__wbg_transactionfinalized_free(ptr);
}
/**
*/
class TransactionFinalized {

    free() {
        const ptr = this.ptr;
        this.ptr = 0;
        freeTransactionFinalized(ptr);
    }

    /**
    * @param {Transaction} arg0
    * @returns {}
    */
    constructor(arg0) {
        const ptr0 = arg0.ptr;
        arg0.ptr = 0;
        this.ptr = wasm.transactionfinalized_new(ptr0);
    }
    /**
    * @returns {TransactionId}
    */
    id() {
        return TransactionId.__wrap(wasm.transactionfinalized_id(this.ptr));
    }
    /**
    * @param {Witness} arg0
    * @returns {void}
    */
    add_witness(arg0) {
        const ptr0 = arg0.ptr;
        arg0.ptr = 0;
        return wasm.transactionfinalized_add_witness(this.ptr, ptr0);
    }
    /**
    * @returns {SignedTransaction}
    */
    finalize() {
        const ptr = this.ptr;
        this.ptr = 0;
        return SignedTransaction.__wrap(wasm.transactionfinalized_finalize(ptr));
    }
}
module.exports.TransactionFinalized = TransactionFinalized;

function freeCoinDiff(ptr) {

    wasm.__wbg_coindiff_free(ptr);
}
/**
*/
class CoinDiff {

    static __wrap(ptr) {
        const obj = Object.create(CoinDiff.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;
        freeCoinDiff(ptr);
    }

    /**
    * @returns {boolean}
    */
    is_zero() {
        return (wasm.coindiff_is_zero(this.ptr)) !== 0;
    }
    /**
    * @returns {boolean}
    */
    is_negative() {
        return (wasm.coindiff_is_negative(this.ptr)) !== 0;
    }
    /**
    * @returns {boolean}
    */
    is_positive() {
        return (wasm.coindiff_is_positive(this.ptr)) !== 0;
    }
    /**
    * @returns {Coin}
    */
    value() {
        return Coin.__wrap(wasm.coindiff_value(this.ptr));
    }
}
module.exports.CoinDiff = CoinDiff;

function freeBip44AccountPublic(ptr) {

    wasm.__wbg_bip44accountpublic_free(ptr);
}
/**
*/
class Bip44AccountPublic {

    static __wrap(ptr) {
        const obj = Object.create(Bip44AccountPublic.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;
        freeBip44AccountPublic(ptr);
    }

    /**
    * @param {PublicKey} arg0
    * @param {DerivationScheme} arg1
    * @returns {Bip44AccountPublic}
    */
    static new(arg0, arg1) {
        const ptr0 = arg0.ptr;
        arg0.ptr = 0;
        const ptr1 = arg1.ptr;
        arg1.ptr = 0;
        return Bip44AccountPublic.__wrap(wasm.bip44accountpublic_new(ptr0, ptr1));
    }
    /**
    * @param {boolean} arg0
    * @returns {Bip44ChainPublic}
    */
    bip44_chain(arg0) {
        return Bip44ChainPublic.__wrap(wasm.bip44accountpublic_bip44_chain(this.ptr, arg0));
    }
    /**
    * @returns {PublicKey}
    */
    key() {
        return PublicKey.__wrap(wasm.bip44accountpublic_key(this.ptr));
    }
}
module.exports.Bip44AccountPublic = Bip44AccountPublic;

function freeDaedalusCheckedAddress(ptr) {

    wasm.__wbg_daedaluscheckedaddress_free(ptr);
}
/**
* result value of the check_address function of the DaedalusAddressChecker.
*
* If the address passed to check_address was recognised by the daedalus wallet
* then this object will contain the private key associated to this wallet
* private key necessary to sign transactions
*/
class DaedalusCheckedAddress {

    static __wrap(ptr) {
        const obj = Object.create(DaedalusCheckedAddress.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;
        freeDaedalusCheckedAddress(ptr);
    }

    /**
    * return if the value contains the private key (i.e. the check_address
    * recognised an address).
    * @returns {boolean}
    */
    is_checked() {
        return (wasm.daedaluscheckedaddress_is_checked(this.ptr)) !== 0;
    }
    /**
    * @returns {PrivateKey}
    */
    private_key() {
        return PrivateKey.__wrap(wasm.daedaluscheckedaddress_private_key(this.ptr));
    }
}
module.exports.DaedalusCheckedAddress = DaedalusCheckedAddress;

function freeTxOut(ptr) {

    wasm.__wbg_txout_free(ptr);
}
/**
*/
class TxOut {

    static __wrap(ptr) {
        const obj = Object.create(TxOut.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;
        freeTxOut(ptr);
    }

    /**
    * @param {Address} arg0
    * @param {Coin} arg1
    * @returns {TxOut}
    */
    static new(arg0, arg1) {
        return TxOut.__wrap(wasm.txout_new(arg0.ptr, arg1.ptr));
    }
    /**
    * serialize into a JsValue object
    * @returns {any}
    */
    to_json() {
        return takeObject(wasm.txout_to_json(this.ptr));
    }
    /**
    * retrieve the object from a JsValue.
    * @param {any} arg0
    * @returns {TxOut}
    */
    static from_json(arg0) {
        return TxOut.__wrap(wasm.txout_from_json(addHeapObject(arg0)));
    }
}
module.exports.TxOut = TxOut;

function freeSignature(ptr) {

    wasm.__wbg_signature_free(ptr);
}
/**
*/
class Signature {

    static __wrap(ptr) {
        const obj = Object.create(Signature.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;
        freeSignature(ptr);
    }

    /**
    * @param {string} arg0
    * @returns {Signature}
    */
    static from_hex(arg0) {
        const [ptr0, len0] = passStringToWasm(arg0);
        try {
            return Signature.__wrap(wasm.signature_from_hex(ptr0, len0));

        } finally {
            wasm.__wbindgen_free(ptr0, len0 * 1);

        }

    }
    /**
    * @returns {string}
    */
    to_hex() {
        const retptr = globalArgumentPtr();
        wasm.signature_to_hex(retptr, this.ptr);
        const mem = getUint32Memory();
        const rustptr = mem[retptr / 4];
        const rustlen = mem[retptr / 4 + 1];

        const realRet = getStringFromWasm(rustptr, rustlen).slice();
        wasm.__wbindgen_free(rustptr, rustlen * 1);
        return realRet;

    }
}
module.exports.Signature = Signature;

function freeTxInput(ptr) {

    wasm.__wbg_txinput_free(ptr);
}
/**
*/
class TxInput {

    static __wrap(ptr) {
        const obj = Object.create(TxInput.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;
        freeTxInput(ptr);
    }

    /**
    * @param {TxoPointer} arg0
    * @param {TxOut} arg1
    * @returns {TxInput}
    */
    static new(arg0, arg1) {
        return TxInput.__wrap(wasm.txinput_new(arg0.ptr, arg1.ptr));
    }
    /**
    * @returns {any}
    */
    to_json() {
        return takeObject(wasm.txinput_to_json(this.ptr));
    }
    /**
    * @param {any} arg0
    * @returns {TxInput}
    */
    static from_json(arg0) {
        return TxInput.__wrap(wasm.txinput_from_json(addHeapObject(arg0)));
    }
}
module.exports.TxInput = TxInput;

function freePrivateRedeemKey(ptr) {

    wasm.__wbg_privateredeemkey_free(ptr);
}
/**
*/
class PrivateRedeemKey {

    static __wrap(ptr) {
        const obj = Object.create(PrivateRedeemKey.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;
        freePrivateRedeemKey(ptr);
    }

    /**
    * retrieve the private redeeming key from the given bytes (expect 64 bytes)
    * @param {Uint8Array} arg0
    * @returns {PrivateRedeemKey}
    */
    static from_bytes(arg0) {
        const [ptr0, len0] = passArray8ToWasm(arg0);
        try {
            return PrivateRedeemKey.__wrap(wasm.privateredeemkey_from_bytes(ptr0, len0));

        } finally {
            wasm.__wbindgen_free(ptr0, len0 * 1);

        }

    }
    /**
    * retrieve a private key from the given hexadecimal string
    * @param {string} arg0
    * @returns {PrivateRedeemKey}
    */
    static from_hex(arg0) {
        const [ptr0, len0] = passStringToWasm(arg0);
        try {
            return PrivateRedeemKey.__wrap(wasm.privateredeemkey_from_hex(ptr0, len0));

        } finally {
            wasm.__wbindgen_free(ptr0, len0 * 1);

        }

    }
    /**
    * convert the private key to an hexadecimal string
    * @returns {string}
    */
    to_hex() {
        const retptr = globalArgumentPtr();
        wasm.privateredeemkey_to_hex(retptr, this.ptr);
        const mem = getUint32Memory();
        const rustptr = mem[retptr / 4];
        const rustlen = mem[retptr / 4 + 1];

        const realRet = getStringFromWasm(rustptr, rustlen).slice();
        wasm.__wbindgen_free(rustptr, rustlen * 1);
        return realRet;

    }
    /**
    * get the public key associated to this private key
    * @returns {PublicRedeemKey}
    */
    public() {
        return PublicRedeemKey.__wrap(wasm.privateredeemkey_public(this.ptr));
    }
    /**
    * sign some bytes with this private key
    * @param {Uint8Array} arg0
    * @returns {RedeemSignature}
    */
    sign(arg0) {
        const [ptr0, len0] = passArray8ToWasm(arg0);
        try {
            return RedeemSignature.__wrap(wasm.privateredeemkey_sign(this.ptr, ptr0, len0));

        } finally {
            wasm.__wbindgen_free(ptr0, len0 * 1);

        }

    }
}
module.exports.PrivateRedeemKey = PrivateRedeemKey;

function freeSignedTransaction(ptr) {

    wasm.__wbg_signedtransaction_free(ptr);
}
/**
* a signed transaction, ready to be sent to the network.
*/
class SignedTransaction {

    static __wrap(ptr) {
        const obj = Object.create(SignedTransaction.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;
        freeSignedTransaction(ptr);
    }

    /**
    * @returns {string}
    */
    id() {
        const retptr = globalArgumentPtr();
        wasm.signedtransaction_id(retptr, this.ptr);
        const mem = getUint32Memory();
        const rustptr = mem[retptr / 4];
        const rustlen = mem[retptr / 4 + 1];

        const realRet = getStringFromWasm(rustptr, rustlen).slice();
        wasm.__wbindgen_free(rustptr, rustlen * 1);
        return realRet;

    }
    /**
    * @returns {any}
    */
    to_json() {
        return takeObject(wasm.signedtransaction_to_json(this.ptr));
    }
    /**
    * @param {any} arg0
    * @returns {SignedTransaction}
    */
    static from_json(arg0) {
        return SignedTransaction.__wrap(wasm.signedtransaction_from_json(addHeapObject(arg0)));
    }
    /**
    * @param {Uint8Array} arg0
    * @returns {SignedTransaction}
    */
    static from_bytes(arg0) {
        const [ptr0, len0] = passArray8ToWasm(arg0);
        try {
            return SignedTransaction.__wrap(wasm.signedtransaction_from_bytes(ptr0, len0));

        } finally {
            wasm.__wbindgen_free(ptr0, len0 * 1);

        }

    }
    /**
    * @returns {string}
    */
    to_hex() {
        const retptr = globalArgumentPtr();
        wasm.signedtransaction_to_hex(retptr, this.ptr);
        const mem = getUint32Memory();
        const rustptr = mem[retptr / 4];
        const rustlen = mem[retptr / 4 + 1];

        const realRet = getStringFromWasm(rustptr, rustlen).slice();
        wasm.__wbindgen_free(rustptr, rustlen * 1);
        return realRet;

    }
}
module.exports.SignedTransaction = SignedTransaction;

function freeInputSelectionBuilder(ptr) {

    wasm.__wbg_inputselectionbuilder_free(ptr);
}
/**
*/
class InputSelectionBuilder {

    static __wrap(ptr) {
        const obj = Object.create(InputSelectionBuilder.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;
        freeInputSelectionBuilder(ptr);
    }

    /**
    * @returns {InputSelectionBuilder}
    */
    static first_match_first() {
        return InputSelectionBuilder.__wrap(wasm.inputselectionbuilder_first_match_first());
    }
    /**
    * @returns {InputSelectionBuilder}
    */
    static largest_first() {
        return InputSelectionBuilder.__wrap(wasm.inputselectionbuilder_largest_first());
    }
    /**
    * @param {Coin} arg0
    * @returns {InputSelectionBuilder}
    */
    static blackjack(arg0) {
        const ptr0 = arg0.ptr;
        arg0.ptr = 0;
        return InputSelectionBuilder.__wrap(wasm.inputselectionbuilder_blackjack(ptr0));
    }
    /**
    * @param {TxInput} arg0
    * @returns {void}
    */
    add_input(arg0) {
        return wasm.inputselectionbuilder_add_input(this.ptr, arg0.ptr);
    }
    /**
    * @param {TxOut} arg0
    * @returns {void}
    */
    add_output(arg0) {
        return wasm.inputselectionbuilder_add_output(this.ptr, arg0.ptr);
    }
    /**
    * @param {LinearFeeAlgorithm} arg0
    * @param {OutputPolicy} arg1
    * @returns {InputSelectionResult}
    */
    select_inputs(arg0, arg1) {
        return InputSelectionResult.__wrap(wasm.inputselectionbuilder_select_inputs(this.ptr, arg0.ptr, arg1.ptr));
    }
}
module.exports.InputSelectionBuilder = InputSelectionBuilder;

function freeBip44AccountPrivate(ptr) {

    wasm.__wbg_bip44accountprivate_free(ptr);
}
/**
*/
class Bip44AccountPrivate {

    static __wrap(ptr) {
        const obj = Object.create(Bip44AccountPrivate.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;
        freeBip44AccountPrivate(ptr);
    }

    /**
    * @param {PrivateKey} arg0
    * @param {DerivationScheme} arg1
    * @returns {Bip44AccountPrivate}
    */
    static new(arg0, arg1) {
        const ptr0 = arg0.ptr;
        arg0.ptr = 0;
        const ptr1 = arg1.ptr;
        arg1.ptr = 0;
        return Bip44AccountPrivate.__wrap(wasm.bip44accountprivate_new(ptr0, ptr1));
    }
    /**
    * @returns {Bip44AccountPublic}
    */
    public() {
        return Bip44AccountPublic.__wrap(wasm.bip44accountprivate_public(this.ptr));
    }
    /**
    * @param {boolean} arg0
    * @returns {Bip44ChainPrivate}
    */
    bip44_chain(arg0) {
        return Bip44ChainPrivate.__wrap(wasm.bip44accountprivate_bip44_chain(this.ptr, arg0));
    }
    /**
    * @returns {PrivateKey}
    */
    key() {
        return PrivateKey.__wrap(wasm.bip44accountprivate_key(this.ptr));
    }
}
module.exports.Bip44AccountPrivate = Bip44AccountPrivate;

function freePublicRedeemKey(ptr) {

    wasm.__wbg_publicredeemkey_free(ptr);
}
/**
*/
class PublicRedeemKey {

    static __wrap(ptr) {
        const obj = Object.create(PublicRedeemKey.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;
        freePublicRedeemKey(ptr);
    }

    /**
    * retrieve a public key from the given hexadecimal string
    * @param {string} arg0
    * @returns {PublicRedeemKey}
    */
    static from_hex(arg0) {
        const [ptr0, len0] = passStringToWasm(arg0);
        try {
            return PublicRedeemKey.__wrap(wasm.publicredeemkey_from_hex(ptr0, len0));

        } finally {
            wasm.__wbindgen_free(ptr0, len0 * 1);

        }

    }
    /**
    * convert the public key to an hexadecimal string
    * @returns {string}
    */
    to_hex() {
        const retptr = globalArgumentPtr();
        wasm.publicredeemkey_to_hex(retptr, this.ptr);
        const mem = getUint32Memory();
        const rustptr = mem[retptr / 4];
        const rustlen = mem[retptr / 4 + 1];

        const realRet = getStringFromWasm(rustptr, rustlen).slice();
        wasm.__wbindgen_free(rustptr, rustlen * 1);
        return realRet;

    }
    /**
    * verify the signature with the given public key
    * @param {Uint8Array} arg0
    * @param {RedeemSignature} arg1
    * @returns {boolean}
    */
    verify(arg0, arg1) {
        const [ptr0, len0] = passArray8ToWasm(arg0);
        try {
            return (wasm.publicredeemkey_verify(this.ptr, ptr0, len0, arg1.ptr)) !== 0;

        } finally {
            wasm.__wbindgen_free(ptr0, len0 * 1);

        }

    }
    /**
    * generate the address for this redeeming key
    * @param {BlockchainSettings} arg0
    * @returns {Address}
    */
    address(arg0) {
        return Address.__wrap(wasm.publicredeemkey_address(this.ptr, arg0.ptr));
    }
}
module.exports.PublicRedeemKey = PublicRedeemKey;

function freeTransactionBuilder(ptr) {

    wasm.__wbg_transactionbuilder_free(ptr);
}
/**
* The transaction builder provides a set of tools to help build
* a valid Transaction.
*/
class TransactionBuilder {

    free() {
        const ptr = this.ptr;
        this.ptr = 0;
        freeTransactionBuilder(ptr);
    }

    /**
    * create a new transaction builder
    * @returns {}
    */
    constructor() {
        this.ptr = wasm.transactionbuilder_new();
    }
    /**
    * @param {TxoPointer} arg0
    * @param {Coin} arg1
    * @returns {void}
    */
    add_input(arg0, arg1) {
        const ptr1 = arg1.ptr;
        arg1.ptr = 0;
        return wasm.transactionbuilder_add_input(this.ptr, arg0.ptr, ptr1);
    }
    /**
    * @returns {Coin}
    */
    get_input_total() {
        return Coin.__wrap(wasm.transactionbuilder_get_input_total(this.ptr));
    }
    /**
    * @param {TxOut} arg0
    * @returns {void}
    */
    add_output(arg0) {
        return wasm.transactionbuilder_add_output(this.ptr, arg0.ptr);
    }
    /**
    * @param {LinearFeeAlgorithm} arg0
    * @param {OutputPolicy} arg1
    * @returns {any}
    */
    apply_output_policy(arg0, arg1) {
        return takeObject(wasm.transactionbuilder_apply_output_policy(this.ptr, arg0.ptr, arg1.ptr));
    }
    /**
    * @returns {Coin}
    */
    get_output_total() {
        return Coin.__wrap(wasm.transactionbuilder_get_output_total(this.ptr));
    }
    /**
    * @param {LinearFeeAlgorithm} arg0
    * @returns {Coin}
    */
    estimate_fee(arg0) {
        return Coin.__wrap(wasm.transactionbuilder_estimate_fee(this.ptr, arg0.ptr));
    }
    /**
    * @param {LinearFeeAlgorithm} arg0
    * @returns {CoinDiff}
    */
    get_balance(arg0) {
        return CoinDiff.__wrap(wasm.transactionbuilder_get_balance(this.ptr, arg0.ptr));
    }
    /**
    * @returns {CoinDiff}
    */
    get_balance_without_fees() {
        return CoinDiff.__wrap(wasm.transactionbuilder_get_balance_without_fees(this.ptr));
    }
    /**
    * @returns {Transaction}
    */
    make_transaction() {
        const ptr = this.ptr;
        this.ptr = 0;
        return Transaction.__wrap(wasm.transactionbuilder_make_transaction(ptr));
    }
}
module.exports.TransactionBuilder = TransactionBuilder;

module.exports.__wbindgen_object_drop_ref = function(i) {
    dropRef(i);
};

module.exports.__wbindgen_string_new = function(p, l) {
    return addHeapObject(getStringFromWasm(p, l));
};

module.exports.__wbindgen_json_parse = function(ptr, len) {
    return addHeapObject(JSON.parse(getStringFromWasm(ptr, len)));
};

module.exports.__wbindgen_json_serialize = function(idx, ptrptr) {
    const [ptr, len] = passStringToWasm(JSON.stringify(getObject(idx)));
    getUint32Memory()[ptrptr / 4] = ptr;
    return len;
};

module.exports.__wbindgen_rethrow = function(idx) { throw takeObject(idx); };

module.exports.__wbindgen_throw = function(ptr, len) {
    throw new Error(getStringFromWasm(ptr, len));
};

// wasm = require('./cardano_wallet_bg');
wasm = require('./xx');
