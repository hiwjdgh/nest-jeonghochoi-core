# 코드베이스 리뷰 (nest-jeonghochoi-core)

## 전체 평가
- **아키텍처 방향은 좋습니다.** `CoreModule`에서 로깅/DB/Redis/JWT/RBAC를 선택적으로 조합하도록 한 점은 라이브러리 성격에 잘 맞습니다.
- **모듈 분리가 명확합니다.** `core/*` 하위로 도메인별 경계가 분명해 유지보수성이 높은 편입니다.
- 다만, 운영 환경 기준으로 보면 **리소스 정리, 동시성 제어, 옵션 검증 정밀도, 보안 기본값**에서 개선 여지가 큽니다.

## 잘된 점
1. **확장 가능한 동적 모듈 구조**
   - `CoreModule.forRoot()`에서 옵션에 따라 하위 모듈을 동적으로 import/export 하는 설계가 재사용성에 유리합니다.
2. **DB 연결 재사용 전략**
   - `databaseKey + schema` 기반 캐시 전략으로 멀티테넌트 시나리오를 고려한 점이 좋습니다.
3. **관심사 분리**
   - JWT, RBAC, Redis, Health, Logger가 각각 독립 모듈로 분리되어 있어 테스트 및 교체가 쉽습니다.
4. **운영용 미들웨어 일괄 적용**
   - Request context + HTTP logger를 전 라우트에 적용해 추적성을 확보한 점이 좋습니다.

## 부족한 부분 / 리스크

### 1) DB DataSource 정리(종료) 로직 부재
- 현재 `ConnectionCache`에 쌓인 `DataSource`를 모듈 종료 시 `destroy()` 하지 않습니다.
- 장기 실행/재배포 환경에서 커넥션 누수나 graceful shutdown 품질 저하로 이어질 수 있습니다.
- **개선 제안**
  - `DatabaseModule` 또는 별도 lifecycle provider에서 `OnModuleDestroy` 구현.
  - 캐시 전체 순회 후 `isInitialized` 체크 뒤 `destroy()` 실행.

### 2) DB 연결 생성 동시성 제어 미흡
- `DatabaseConnectionResolver.resolve()`는 동일한 `cacheKey`로 동시에 요청이 들어오면 초기화가 중복 실행될 수 있습니다.
- **개선 제안**
  - `Map<string, Promise<DataSource>>` 형태의 in-flight 초기화 맵을 두고 single-flight 패턴 적용.

### 3) 옵션 스키마 검증이 느슨함
- `coreOptionsSchema`의 `database.registry`가 `z.object().optional()`로 정의되어 실제 shape 검증력이 낮습니다.
- 타입스크립트 타입과 런타임 검증 정합성이 어긋날 가능성이 있습니다.
- **개선 제안**
  - 최소한 `z.record(z.object({...}))` 형태로 DB definition 구조 검증.
  - `redis.port`는 범위(1~65535) 검증 추가.

### 4) 보안 기본값 관점의 RBAC Guard 동작
- RBAC provider(`permissionChecker` 또는 `contextProvider`) 미주입 시 현재는 **허용(true)** 으로 동작합니다.
- 의도치 않은 설정 누락이 전체 우회로 이어질 수 있어 운영 리스크가 큽니다.
- **개선 제안**
  - 기본값을 deny 또는 경고 로그 + 환경별 fail-safe 전략 선택 가능하게 옵션화.

### 5) 테스트 자동화 부족
- 패키지에 테스트 스크립트/케이스가 사실상 없습니다.
- 핵심 경로(옵션 파싱, DB resolver 캐싱, guard 권한 분기, redis 종료 등)에 대한 회귀 방어가 약합니다.
- **개선 제안**
  - 최소 smoke 테스트 + unit 테스트 추가.
  - PR 단계에서 `build + test`를 기본 게이트로 설정.

## 우선순위 제안
1. **P0:** DB 종료 로직 + 동시성 제어(single-flight)
2. **P1:** RBAC fail-safe 정책 명확화
3. **P1:** 스키마 검증 강화(zod)
4. **P2:** 테스트 스위트 구축(최소 핵심 유즈케이스)

## 한 줄 총평
- “현재도 구조는 깔끔하고 실무 친화적이지만, 운영 안정성(리소스/동시성/보안 기본값)과 테스트 안전망을 보강하면 훨씬 강한 코어 라이브러리가 됩니다.”
