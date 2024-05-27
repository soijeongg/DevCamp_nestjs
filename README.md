# DevCamp_nestjs
스파르타코딩클럽 데브캠프 nestjs

### 파일 구조

├─ .github
│  └─ workflows
│     └─ cd.yml
├─ .gitignore
├─ .prettierrc
├─ Dockerfile
├─ README.md
├─ src
│  ├─ app.controller.spec.ts
│  ├─ app.controller.ts
│  ├─ app.module.ts
│  ├─ app.service.ts
│  ├─ auth
│  │  ├─ auth.controller.spec.ts
│  │  ├─ auth.service.spec.ts
│  │  ├─ controller
│  │  │  └─ auth.controller.ts
│  │  ├─ dto
│  │  │  ├─ create-auth.dto
│  │  │  ├─ index.ts
│  │  │  ├─ login-req.dto.ts
│  │  │  └─ login-res.dto.ts
│  │  ├─ entities
│  │  │  ├─ accessToken.entity.ts
│  │  │  ├─ blacklist_token.ts
│  │  │  ├─ index.ts
│  │  │  └─ refrashToken.entity.ts
│  │  ├─ guards
│  │  │  └─ jwt-auth.guard
│  │  │     └─ jwt-auth.guard.ts
│  │  ├─ repositories
│  │  │  ├─ accessToken.repository.ts
│  │  │  ├─ blacklisted_token.repository.ts
│  │  │  ├─ index.ts
│  │  │  └─ refrashToken.repository.ts
│  │  ├─ service
│  │  │  └─ auth.service.ts
│  │  ├─ strategies
│  │  │  └─ jwt.strategy
│  │  │     └─ jwt.strategy.ts
│  │  └─ types
│  │     ├─ auth.module.ts
│  │     └─ index.ts
│  ├─ main.ts
│  ├─ payment
│  │  ├─ dto
│  │  │  └─ create-payment.dto.ts
│  │  ├─ entities
│  │  │  ├─ coupon.entity.ts
│  │  │  ├─ order.entity.ts
│  │  │  ├─ payment.entity.ts
│  │  │  └─ point.entity.ts
│  │  ├─ payment.controller.spec.ts
│  │  ├─ payment.controller.ts
│  │  ├─ payment.module.ts
│  │  ├─ payment.service.spec.ts
│  │  ├─ repositories
│  │  │  ├─ coupon.repository.ts
│  │  │  ├─ index.ts
│  │  │  ├─ order.repository.ts
│  │  │  ├─ payment.repository.spec.ts
│  │  │  ├─ payment.repository.ts
│  │  │  └─ point.repository.ts
│  │  └─ service
│  │     ├─ index.ts
│  │     └─ payment.service.ts
│  ├─ product
│  │  ├─ controller
│  │  │  └─ product.controller.ts
│  │  ├─ dto
│  │  │  ├─ create-product.dto.ts
│  │  │  └─ update-product.dto.ts
│  │  ├─ entities
│  │  │  └─ product.entity.ts
│  │  ├─ product.controller.spec.ts
│  │  ├─ product.module.ts
│  │  ├─ product.service.ts
│  │  ├─ repositories
│  │  │  └─ product.repository.ts
│  │  └─ service
│  │     ├─ product.service.spec.ts
│  │     └─ product.service.ts
│  └─ user
│     ├─ controller
│     │  └─ user.controller.ts
│     ├─ dto
│     │  ├─ create-user.dto.ts
│     │  ├─ index.ts
│     │  └─ update-user.dto.ts
│     ├─ entities
│     │  ├─ index.ts
│     │  └─ user.entity.ts
│     ├─ repositories
│     │  └─ user.respository.ts
│     ├─ services
│     │  └─ user.service.ts
│     ├─ types
│     │  └─ user.module.ts
│     ├─ user.controller.spec.ts
│     └─ user.service.spec.ts
├─ test
│  ├─ app.e2e-spec.ts
│  └─ jest-e2e.json
├─ tsconfig.build.json
└─ tsconfig.json

### 기술스택
nest.js+ 타입스크립트
npm
typeORM+ PostgreSQL
Joi
Jest

### 인증서비스 
사용자의 인증과 권한을 처리 jwt를 사용해 인증을 처리하고 엑세스토큰, 리프래시토큰, 토큰 블랙리스트를 활용

### 결제와 쿠폰 서비스 
사용자의 결제를 위해 PG사를 연결하고 정액제, 정률제 쿠폰을 구현
포인트 기능을 구현(포인트가 없는 경우, 쿠폰을 먼저 적용한 경우 ,쿠폰과 포인트 적용 금약이 상품 금약 넘어가는 경우 )

### 배포 
GCP(google cloud platfom)의 artifact Registy에 도커 이미지를 저장하고 cloud run으로 배포 