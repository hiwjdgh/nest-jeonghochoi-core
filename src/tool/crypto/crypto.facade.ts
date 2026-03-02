import { Aes } from './aes/aes';
import { Codec } from './codec/codec';
import { Hash } from './hash/hash';

export class Crypto {
    static aes = Aes;
    static codec = Codec;
    static hash = Hash;
}
