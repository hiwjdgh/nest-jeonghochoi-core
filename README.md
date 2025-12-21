# @jeonghochoi/core

> **NestJS Core Infrastructure Library**  
> NestJS 프로젝트에서 공통 인프라(DB, Redis, Logger, Health 등)를 표준화하기 위한 Core 라이브러리

---

## ✨ Features

- Global Config Module (Zod 기반)
- Structured Logger (requestId 기반)
- Database Module (TypeORM)
    - Multi Database 지원
    - Multi Tenant (Schema / DB per tenant)
    - Request / Event Context 기반 DB 라우팅
    - PostgreSQL / SQL Server
- Redis Module (ioredis)
- HTTP Request Context (AsyncLocalStorage)
- HTTP Access Log Middleware
- Global Exception Filter
- Health Check Endpoint (`@nestjs/terminus`)

---

## 📦 Installation

```bash
npm install @jeonghochoi/core
```

> ⚠️ 이 라이브러리는 **NestJS 기반 프로젝트 전용**입니다.

---

## 🚀 Quick Start

### AppModule 설정

```ts
import { Module } from '@nestjs/common';
import { CoreModule } from '@jeonghochoi/core';

@Module({
    imports: [
        CoreModule.forRoot({
            logger: {
                enabled: true,
                serviceName: 'user-api',
            },
            database: {
                main: {
                    enabled: true,
                    type: 'postgres',
                    supportsSchema: true,
                    options: {
                        type: 'postgres',
                        host: 'localhost',
                        port: 5432,
                        username: 'user',
                        password: 'password',
                        database: 'app',
                    },
                },

                billing: {
                    enabled: true,
                    type: 'mssql',
                    supportsSchema: false,
                    options: {
                        type: 'mssql',
                        host: 'localhost',
                        port: 1433,
                        username: 'billing',
                        password: 'password',
                        database: 'billing',
                    },
                },
            },
            redis: {
                enabled: true,
                host: 'localhost',
                port: 6379,
            },
        }),
    ],
})
export class AppModule {}
```

---

## ⚙️ CoreModule Options

```ts
export interface CoreModuleOptions {
    logger?: LoggerOptions;
    database?: DatabaseOptions;
    redis?: RedisOptions;
}
```

---

## 📝 Logger

### LoggerService 사용 예시

```ts
import { LoggerService } from '@jeonghochoi/core';

@Injectable()
export class UserService {
    constructor(private readonly logger: LoggerService) {}

    createUser() {
        this.logger.log('User created', 'UserService');
    }
}
```

### 로그 특징

- requestId 자동 포함
- JSON 기반 구조화 로그 (pino)
- HTTP Access Log 자동 기록

예시 로그:

```json
{
    "level": 30,
    "time": 1765904890235,
    "requestId": "6df912d7-7eff-4ab4-8c76-b2da8a1d41c2",
    "context": "UserService",
    "msg": "User created"
}
```

---

## 🗄️ Database (Multi-Tenant Runtime)

### 핵심 특징

- 단일 DB 설정 ❌
- `TypeOrmModule.forRoot()` ❌
- **Database Registry 기반 동적 연결 ⭕**
- 요청 / 이벤트 Context 기반 실행 ⭕

---

### Database 사용 (Runtime Resolve)

```ts
@Injectable()
export class ChargerService {
    constructor(private readonly resolver: DatabaseConnectionResolver) {}

    async findAll(ctx: DatabaseRequestContext) {
        const ds = await this.resolver.resolve(ctx);
        return ds.getRepository(ChargerEntity).find();
    }
}
```

```ts
// ctx 예시
{
  databaseKey: 'main',
  schema: 'tenant_a',
}
```

> 내부적으로 **TypeORM**을 사용합니다.

---

## 🔴 Redis

### 설정 예시

```ts
redis: {
  enabled: true,
  host: 'localhost',
  port: 6379,
}
```

### RedisService 사용

```ts
import { RedisService } from '@jeonghochoi/core';

@Injectable()
export class CacheService {
    constructor(private readonly redis: RedisService) {}

    async ping() {
        return this.redis.getClient().ping();
    }
}
```

> Redis는 **선택 사항(optional)** 이며  
> `enabled: false` 설정 시 로드되지 않습니다.

---

## ❤️ Health Check

### 기본 엔드포인트

```http
GET /health
```

응답 예시:

```json
{
    "status": "ok",
    "info": {
        "database": { "status": "up" },
        "redis": { "status": "up" }
    }
}
```

- Database / Redis 상태 자동 체크
- Kubernetes / Load Balancer 헬스체크 용도

---

## 🚨 Exception Handling

- Global `HttpExceptionFilter` 자동 적용
- 500 에러 발생 시:
    - 서버 로그에 stack trace 기록
    - 클라이언트 응답에는 내부 정보 미노출

---

## 🧠 Design Principles

- `main.ts` 없음 (라이브러리 구조)
- Nest CLI 비의존
- example app 포함 ❌
- 외부 Nest 애플리케이션에서 의존성으로만 사용
- public API (`index.ts`) 만 노출

---

## 🔐 Peer Dependencies

```json
"peerDependencies": {
  "@nestjs/common": "^11.0.0",
  "@nestjs/core": "^11.0.0"
}
```

> 사용하는 프로젝트의 NestJS 버전을 그대로 따릅니다.

---

## 🧪 Testing & Validation

라이브러리 검증은 **외부 Nest 애플리케이션**에서 수행합니다.

권장 방식:

```bash
npm pack
npm install ../jeonghochoi-core-x.y.z.tgz
```

---

## 📌 Versioning Policy

- `0.x.x` : 개발 / 검증 단계
- `1.0.0` : 사내 표준 Core 확정

| 변경 내용       | 버전  |
| --------------- | ----- |
| 기능 추가       | minor |
| 버그 수정       | patch |
| Public API 변경 | major |

---

## 📄 License

UNLICENSED  
(사내 전용 라이브러리)

---

## ✅ Summary

> **@jeonghochoi/core** 는  
> NestJS 서비스들의 **공통 인프라를 표준화**하고  
> 운영·로깅·확장성 문제를 줄이기 위한 Core 레이어입니다.

---
