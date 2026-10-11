# Native Agent Starter

기업 환경에서 확장할 수 있는 **에이전트 런타임 MVP**입니다. 모델이 단순히 답변만 생성하는 대신 도구를 선택하고 실행하며, 부작용이 있는 작업은 사람의 승인을 받은 뒤 이어서 처리합니다.

## 포함된 기능

- OpenAI Responses API 어댑터와 API 키 없이 실행되는 데모 모델
- 함수 도구 호출 루프와 단계 수 제한
- 읽기 도구 자동 실행, 쓰기 도구 승인(Human-in-the-loop)
- 세션 메모리, 사용자 메모, 간단한 로컬 지식 검색
- 실행 이벤트/지연 시간 추적과 회귀 평가 CLI
- 의존성 없는 Python HTTP API와 반응형 웹 콘솔
- 모델 공급자와 도구를 분리한 교체 가능한 구조

## 빠른 시작

### 소개 웹페이지 배포

[Netlify에서 소개 페이지 열기](https://agent-native-build-choijinwon.netlify.app/)

Netlify는 `netlify.toml`에 지정된 `docs` 폴더를 게시합니다. 별도의 빌드 명령이나 의존성 설치는 필요하지 않습니다. 이 페이지는 기능 소개와 실행 과정 애니메이션을 제공하며, 실제 대화·도구 실행은 아래 Python 런타임에서 사용할 수 있습니다.

### Python 런타임 실행

Python 3.11 이상만 필요합니다.

```bash
python3 -m agent_native
```

브라우저에서 `http://127.0.0.1:8080`을 엽니다. 기본값은 `demo` 공급자이므로 API 키가 필요 없습니다.

실제 모델을 사용하려면:

```bash
export AGENT_PROVIDER=openai
export OPENAI_API_KEY=your_api_key
export OPENAI_MODEL=gpt-5.4-mini
python3 -m agent_native
```

환경 변수 전체는 [.env.example](.env.example)을 참고하세요.

## 데모 프롬프트

- `128 * 42를 계산해줘`
- `휴가 정책을 찾아줘`
- `내 이름은 민수라고 기억해줘`
- `금요일까지 보안 리뷰 할 일을 만들어줘` — 승인 카드가 표시됩니다.

## API

```text
GET  /api/health
GET  /api/config
GET  /api/sessions
GET  /api/tasks
GET  /api/runs/{run_id}
POST /api/chat                 {"session_id":"...", "message":"..."}
POST /api/approvals/{id}       {"approved":true}
```

## 검증

```bash
python3 -m unittest discover -s tests -v
python3 -m agent_native.evaluation
```

## 구조

```text
Browser UI -> HTTP API -> AgentRuntime -> ModelProvider
                            |      |
                            |      +-> ToolRegistry -> Knowledge / Tasks / Memory
                            +-> StateStore -> Sessions / Approvals / Traces
```

현재 저장소는 로컬 JSON을 사용합니다. 운영 환경에서는 `StateStore` 인터페이스 뒤에 PostgreSQL/Redis를, `KnowledgeSearchTool` 뒤에 사내 검색 또는 벡터 DB를 연결하고 인증·테넌트 분리·감사 로그를 추가하는 구성이 적합합니다.
