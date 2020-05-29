/* tslint:disable */
export function paper_wallet_scramble(arg0: Entropy, arg1: Uint8Array, arg2: string): any;

export function paper_wallet_unscramble(arg0: Uint8Array, arg1: string): Entropy;

export function password_encrypt(arg0: string, arg1: Uint8Array, arg2: Uint8Array, arg3: Uint8Array): any;

export function password_decrypt(arg0: string, arg1: Uint8Array): any;

export class DerivationScheme {
free(): void;

static  v1(): DerivationScheme;

static  v2(): DerivationScheme;

}
export class PrivateKey {
free(): void;

static  new(arg0: Entropy, arg1: string): PrivateKey;

static  from_hex(arg0: string): PrivateKey;

 to_hex(): string;

 public(): PublicKey;

 sign(arg0: Uint8Array): Signature;

 derive(arg0: DerivationScheme, arg1: number): PrivateKey;

}
export class Bip44ChainPrivate {
free(): void;

static  new(arg0: PrivateKey, arg1: DerivationScheme): Bip44ChainPrivate;

 public(): Bip44ChainPublic;

 address_key(arg0: AddressKeyIndex): PrivateKey;

 key(): PrivateKey;

}
export class Bip44ChainPublic {
free(): void;

static  new(arg0: PublicKey, arg1: DerivationScheme): Bip44ChainPublic;

 address_key(arg0: AddressKeyIndex): PublicKey;

 key(): PublicKey;

}
export class RedeemSignature {
free(): void;

static  from_hex(arg0: string): RedeemSignature;

 to_hex(): string;

}
export class PublicKey {
free(): void;

static  from_hex(arg0: string): PublicKey;

 to_hex(): string;

 verify(arg0: Uint8Array, arg1: Signature): boolean;

 derive(arg0: DerivationScheme, arg1: number): PublicKey;

 bootstrap_era_address(arg0: BlockchainSettings): Address;

}
export class TxoPointer {
free(): void;

static  new(arg0: TransactionId, arg1: number): TxoPointer;

 to_json(): any;

static  from_json(arg0: any): TxoPointer;

}
export class Address {
free(): void;

 to_base58(): string;

static  from_base58(arg0: string): Address;

}
export class AccountIndex {
free(): void;

static  new(arg0: number): AccountIndex;

}
export class Entropy {
free(): void;

static  from_english_mnemonics(arg0: string): Entropy;

 to_english_mnemonics(): string;

 to_array(): any;

}
export class TransactionSignature {
free(): void;

static  from_hex(arg0: string): TransactionSignature;

 to_hex(): string;

}
export class OutputPolicy {
free(): void;

static  change_to_one_address(arg0: Address): OutputPolicy;

}
export class Coin {
free(): void;

 constructor();

static  from_str(arg0: string): Coin;

 to_str(): string;

static  from(arg0: number, arg1: number): Coin;

 ada(): number;

 lovelace(): number;

 add(arg0: Coin): Coin;

}
export class TransactionId {
free(): void;

 to_hex(): string;

static  from_hex(arg0: string): TransactionId;

}
export class DaedalusWallet {
free(): void;

static  new(arg0: PrivateKey): DaedalusWallet;

static  recover(arg0: Entropy): DaedalusWallet;

}
export class DaedalusAddressChecker {
free(): void;

static  new(arg0: DaedalusWallet): DaedalusAddressChecker;

 check_address(arg0: Address): DaedalusCheckedAddress;

}
export class Witness {
free(): void;

static  new_extended_key(arg0: BlockchainSettings, arg1: PrivateKey, arg2: TransactionId): Witness;

static  new_redeem_key(arg0: BlockchainSettings, arg1: PrivateRedeemKey, arg2: TransactionId): Witness;

static  from_external(arg0: PublicKey, arg1: TransactionSignature): Witness;

}
export class InputSelectionResult {
free(): void;

 is_input(arg0: TxoPointer): boolean;

 estimated_fees(): Coin;

 estimated_change(): Coin;

}
export class AddressKeyIndex {
free(): void;

static  new(arg0: number): AddressKeyIndex;

}
export class Bip44RootPrivateKey {
free(): void;

static  new(arg0: PrivateKey, arg1: DerivationScheme): Bip44RootPrivateKey;

static  recover(arg0: Entropy, arg1: string): Bip44RootPrivateKey;

 bip44_account(arg0: AccountIndex): Bip44AccountPrivate;

 key(): PrivateKey;

}
export class Transaction {
free(): void;

 id(): TransactionId;

 to_json(): any;

static  from_json(arg0: any): Transaction;

 clone(): Transaction;

 to_hex(): string;

}
export class LinearFeeAlgorithm {
free(): void;

static  default(): LinearFeeAlgorithm;

}
export class BlockchainSettings {
free(): void;

 to_json(): any;

static  from_json(arg0: any): BlockchainSettings;

static  mainnet(): BlockchainSettings;

}
export class TransactionFinalized {
free(): void;

 constructor(arg0: Transaction);

 id(): TransactionId;

 add_witness(arg0: Witness): void;

 finalize(): SignedTransaction;

}
export class CoinDiff {
free(): void;

 is_zero(): boolean;

 is_negative(): boolean;

 is_positive(): boolean;

 value(): Coin;

}
export class Bip44AccountPublic {
free(): void;

static  new(arg0: PublicKey, arg1: DerivationScheme): Bip44AccountPublic;

 bip44_chain(arg0: boolean): Bip44ChainPublic;

 key(): PublicKey;

}
export class DaedalusCheckedAddress {
free(): void;

 is_checked(): boolean;

 private_key(): PrivateKey;

}
export class TxOut {
free(): void;

static  new(arg0: Address, arg1: Coin): TxOut;

 to_json(): any;

static  from_json(arg0: any): TxOut;

}
export class Signature {
free(): void;

static  from_hex(arg0: string): Signature;

 to_hex(): string;

}
export class TxInput {
free(): void;

static  new(arg0: TxoPointer, arg1: TxOut): TxInput;

 to_json(): any;

static  from_json(arg0: any): TxInput;

}
export class PrivateRedeemKey {
free(): void;

static  from_bytes(arg0: Uint8Array): PrivateRedeemKey;

static  from_hex(arg0: string): PrivateRedeemKey;

 to_hex(): string;

 public(): PublicRedeemKey;

 sign(arg0: Uint8Array): RedeemSignature;

}
export class SignedTransaction {
free(): void;

 id(): string;

 to_json(): any;

static  from_json(arg0: any): SignedTransaction;

static  from_bytes(arg0: Uint8Array): SignedTransaction;

 to_hex(): string;

}
export class InputSelectionBuilder {
free(): void;

static  first_match_first(): InputSelectionBuilder;

static  largest_first(): InputSelectionBuilder;

static  blackjack(arg0: Coin): InputSelectionBuilder;

 add_input(arg0: TxInput): void;

 add_output(arg0: TxOut): void;

 select_inputs(arg0: LinearFeeAlgorithm, arg1: OutputPolicy): InputSelectionResult;

}
export class Bip44AccountPrivate {
free(): void;

static  new(arg0: PrivateKey, arg1: DerivationScheme): Bip44AccountPrivate;

 public(): Bip44AccountPublic;

 bip44_chain(arg0: boolean): Bip44ChainPrivate;

 key(): PrivateKey;

}
export class PublicRedeemKey {
free(): void;

static  from_hex(arg0: string): PublicRedeemKey;

 to_hex(): string;

 verify(arg0: Uint8Array, arg1: RedeemSignature): boolean;

 address(arg0: BlockchainSettings): Address;

}
export class TransactionBuilder {
free(): void;

 constructor();

 add_input(arg0: TxoPointer, arg1: Coin): void;

 get_input_total(): Coin;

 add_output(arg0: TxOut): void;

 apply_output_policy(arg0: LinearFeeAlgorithm, arg1: OutputPolicy): any;

 get_output_total(): Coin;

 estimate_fee(arg0: LinearFeeAlgorithm): Coin;

 get_balance(arg0: LinearFeeAlgorithm): CoinDiff;

 get_balance_without_fees(): CoinDiff;

 make_transaction(): Transaction;

}
