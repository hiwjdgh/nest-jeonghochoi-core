import type { InjectionToken } from '@nestjs/common';
import type Redis from 'ioredis';

export const REDIS_CLIENT: InjectionToken<Redis> = Symbol('REDIS_CLIENT');
export const REDIS_PUB: InjectionToken<Redis> = Symbol('REDIS_PUB');
export const REDIS_SUB: InjectionToken<Redis> = Symbol('REDIS_SUB');
