# @jeonghochoi/core

NestJS 기반 서비스에서 공통 인프라(로깅, DB, Redis, Health, 인증/인가 유틸)를 일관되게 구성하기 위한 Core 라이브러리입니다.

## 프로젝트 구조 요약

- `CoreModule`
  - 전역(`@Global`) 모듈
  - `RequestContextMiddleware` + `HttpLoggerMiddleware`를 모든 라우트에 자동 적용
  - 전역 `HttpExceptionFilter` 등록
  - 옵션에 따라 Logger/Database/Redis/JWT/RBAC 모듈 동적 로딩
- `DatabaseModule`
  - `TypeOrmModule.forRoot()` 패턴 대신 `DatabaseConnectionResolver`로 런타임 연결
  - `databaseKey + schema` 조합으로 DataSource 캐싱
- `RedisModule`
  - client/pub/sub 3개 ioredis 커넥션 제공
- `HealthModule`
  - `/health/live`, `/health/ready` 엔드포인트 제공
- `JwtModule`, `RbacModule`
  - `CoreModule` 내부 옵션 또는 앱에서 직접 `forRoot()`로 조합

---

## 설치

### 1) npm 레지스트리에서 설치

```bash
npm install @jeonghochoi/core
```

### 2) 로컬 패키지(tgz)로 설치 (개발/검증)

라이브러리 저장소에서:

```bash
npm run build
npm pack
```

앱 저장소에서:

```bash
npm install ../nest-jeonghochoi-core/jeonghochoi-core-0.1.4.tgz
```

> 파일명 버전(`0.1.4`)은 실제 pack 결과에 맞춰 변경하세요.

---

## 앱에서 바로 쓰는 방법

## 1) AppModule에 CoreModule 등록

```ts
import { Module } from '@nestjs/common';
import { CoreModule } from '@jeonghochoi/core';

@Module({
  imports: [
    CoreModule.forRoot({
      logger: {
        appName: 'user-api',
        level: 'info',
        pretty: true,
      },
      database: {
        enabled: true,
        registry: {
          main: {
            enabled: true,
            type: 'postgres',
            supportsSchema: true,
            options: {
              type: 'postgres',
              host: process.env.DB_HOST,
              port: Number(process.env.DB_PORT ?? 5432),
              username: process.env.DB_USER,
              password: process.env.DB_PASSWORD,
              database: process.env.DB_NAME,
              synchronize: false,
              logging: false,
              entities: [],
            },
          },
          billing: {
            enabled: true,
            type: 'mssql',
            supportsSchema: false,
            options: {
              type: 'mssql',
              host: process.env.BILLING_DB_HOST,
              port: Number(process.env.BILLING_DB_PORT ?? 1433),
              username: process.env.BILLING_DB_USER,
              password: process.env.BILLING_DB_PASSWORD,
              database: process.env.BILLING_DB_NAME,
              synchronize: false,
              entities: [],
            },
          },
        },
      },
      redis: {
        enabled: true,
        host: process.env.REDIS_HOST ?? '127.0.0.1',
        port: Number(process.env.REDIS_PORT ?? 6379),
      },
      jwt: {
        enabled: true,
        secret: process.env.JWT_SECRET!,
        signOptions: { expiresIn: '1h' },
      },
      rbac: {
        enabled: true,
        // contextProvider, permissionChecker 구현체를 앱에서 주입
      },
    }),
  ],
})
export class AppModule {}
```

## 2) 서비스에서 DatabaseConnectionResolver 사용

```ts
import { Injectable } from '@nestjs/common';
import {
  DatabaseConnectionResolver,
  DatabaseRequestContext,
} from '@jeonghochoi/core';

@Injectable()
export class ChargerService {
  constructor(private readonly resolver: DatabaseConnectionResolver) {}

  async findAll() {
    const ctx: DatabaseRequestContext = {
      databaseKey: 'main',
      schema: 'tenant_a',
    };

    const dataSource = await this.resolver.resolve(ctx);
    return dataSource.query('select now()');
  }
}
```

## 3) 서비스에서 RedisService 사용

```ts
import { Injectable } from '@nestjs/common';
import { RedisService } from '@jeonghochoi/core';

@Injectable()
export class CacheService {
  constructor(private readonly redis: RedisService) {}

  async ping() {
    return this.redis.getClient().ping();
  }
}
```

## 4) Health Check 호출

- Liveness: `GET /health/live`
- Readiness: `GET /health/ready`

---

## CoreModule 옵션 타입

```ts
export interface CoreOptions {
  database?: {
    enabled?: boolean;
    registry: Record<string, DatabaseDefinition>;
  };
  logger?: {
    appName: string;
    level?: 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';
    pretty?: boolean;
  };
  redis?: {
    enabled?: boolean;
    host: string;
    port: number;
    password?: string;
    db?: number;
    keyPrefix?: string;
    enableReadyCheck?: boolean;
  };
  jwt?: {
    enabled?: boolean;
    secret: string;
    signOptions?: JwtSignOptions;
  };
  rbac?: {
    enabled?: boolean;
    contextProvider?: Type<RbacContextProvider>;
    permissionChecker?: Type<PermissionChecker>;
  };
}
```

---

## JWT / RBAC 모듈 사용 (선택)

기본적으로 `CoreModule.forRoot()` 옵션으로 함께 등록할 수 있고, 필요하면 기존처럼 앱에서 직접 등록해서 사용해도 됩니다.

```ts
import { Module } from '@nestjs/common';
import { JwtModule, RbacModule } from '@jeonghochoi/core';

@Module({
  imports: [
    JwtModule.forRoot({
      secret: process.env.JWT_SECRET!,
      signOptions: { expiresIn: '1h' },
    }),
    RbacModule.forRoot({
      // contextProvider, permissionChecker 구현체를 앱에서 주입
    }),
  ],
})
export class AuthModule {}
```

---

## 주의사항

- `CoreModule`에서 `logger`를 생략하면 로거 모듈이 로딩되지 않습니다.
- `database.enabled !== false` 이고 `database.registry`가 있어야 DB 모듈이 로딩됩니다.
- `redis.enabled !== false` 이고 `redis` 옵션이 있어야 Redis 모듈이 로딩됩니다.
- `jwt.enabled !== false` 이고 `jwt` 옵션이 있어야 JWT 모듈이 로딩됩니다.
- `rbac.enabled !== false` 이고 `rbac` 옵션이 있어야 RBAC 모듈이 로딩됩니다.
- DB 연결은 요청 시점에 생성되며 캐시됩니다. 앱 종료 시 커넥션 정리 전략은 앱 레벨에서 함께 고려하세요.

---

## Peer Dependencies

```json
{
  "@nestjs/common": "^11.0.0",
  "@nestjs/core": "^11.0.0"
}
```

## License

MIT
