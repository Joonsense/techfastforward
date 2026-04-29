const GHOST_URL = process.env.GHOST_URL || '';
const GHOST_KEY = process.env.GHOST_CONTENT_KEY || '';

export interface GhostPost {
  id: string;
  slug: string;
  title: string;
  html: string;
  excerpt: string;
  feature_image: string | null;
  published_at: string;
  reading_time: number;
  tags: Array<{ id: string; name: string; slug: string }>;
  authors: Array<{ id: string; name: string; slug: string }>;
  primary_tag?: { name: string; slug: string } | null;
  primary_author?: { name: string; slug: string } | null;
}

export async function getPosts(limit = 10): Promise<GhostPost[]> {
  if (!GHOST_URL || !GHOST_KEY || GHOST_KEY === 'placeholder') {
    return getMockPosts(limit);
  }

  try {
    const res = await fetch(
      `${GHOST_URL}/ghost/api/content/posts/?key=${GHOST_KEY}&limit=${limit}&include=tags,authors&formats=html`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return getMockPosts(limit);
    const data = await res.json();
    return data.posts || [];
  } catch {
    return getMockPosts(limit);
  }
}

export async function getPost(slug: string): Promise<GhostPost | null> {
  if (!GHOST_URL || !GHOST_KEY || GHOST_KEY === 'placeholder') {
    return getMockPosts(20).find((p) => p.slug === slug) ?? getMockPosts(1)[0];
  }

  try {
    const res = await fetch(
      `${GHOST_URL}/ghost/api/content/posts/slug/${slug}/?key=${GHOST_KEY}&include=tags,authors&formats=html`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.posts?.[0] || null;
  } catch {
    return null;
  }
}

export async function getPostsByTag(tag: string, limit = 10): Promise<GhostPost[]> {
  if (!GHOST_URL || !GHOST_KEY || GHOST_KEY === 'placeholder') {
    return getMockPosts(limit).filter(
      (p) => p.primary_tag?.slug === tag || p.tags.some((t) => t.slug === tag)
    );
  }

  try {
    const res = await fetch(
      `${GHOST_URL}/ghost/api/content/posts/?key=${GHOST_KEY}&limit=${limit}&filter=tag:${tag}&include=tags,authors&formats=html`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.posts || [];
  } catch {
    return [];
  }
}

// ─── Mock data for demo mode ────────────────────────────────────────────────

function getMockPosts(limit: number): GhostPost[] {
  const posts: GhostPost[] = [
    {
      id: '1',
      slug: 'ai-job-displacement-white-collar-truth-2026',
      title: 'AI가 당신의 일자리를 빼앗는 방식은 당신이 생각하는 것과 다르다',
      html: `<p>많은 사람들이 AI 일자리 위협을 공장 자동화처럼 상상한다. 어느 날 갑자기 해고 통보가 날아오는 것. 하지만 2026년 현재 실제로 벌어지고 있는 일은 훨씬 더 조용하고, 그래서 더 무섭다.</p>

<h2>대량 해고가 아니라 "채용 감소"다</h2>
<p>2025년 한 해 동안 미국 기업들이 AI로 인해 직접 해고했다고 공식 발표한 일자리는 약 54,836개다. 충격적으로 들리지만, 경제학자들의 모델링 기반 추정치는 <strong>20만~30만 개</strong>에 달한다. 차이가 나는 이유는 단순하다. 기업들이 "AI 때문에"라고 밝히지 않기 때문이다. 대신 그들은 그냥 채용을 하지 않는다.</p>

<p>Anthropic의 내부 연구 보고서는 이 현상을 "고용 대체(displacement)"가 아닌 <strong>고용 공동화(hollowing)</strong>라고 부른다. 기존 직원은 내보내지 않는다. 다만 그들이 떠났을 때 뒤를 채워줄 사람을 더 이상 뽑지 않는 것이다. 결과적으로 팀은 줄어들고, 살아남은 시니어 직원들은 AI 도구로 과거보다 훨씬 많은 일을 처리한다.</p>

<h2>가장 위험한 세대: 22~25세</h2>
<p>이 변화가 가장 직격으로 타격하는 곳은 신입 사원 채용 시장이다. AI에 노출된 직종에서 22~25세 청년층의 고용률은 이미 <strong>16% 감소</strong>했다. ChatGPT가 등장한 2022년 이후 AI 노출도 높은 직군의 취업 성공률은 14% 하락했다.</p>

<p>이 패턴이 중요한 이유가 있다. 과거에는 주니어로 입사해 시니어가 되는 경력 경로가 존재했다. 지금은 그 진입점 자체가 사라지고 있다. 10년 뒤에는 시니어 인력이 절대적으로 부족해질 수 있고, 이는 오히려 AI 전환의 속도를 늦추는 역설을 만들어낼 수 있다.</p>

<h2>숨은 인사이트: 이미 해고한 기업은 용기 있는 것이다</h2>
<p>HBR의 2026년 1월 연구는 충격적인 결론을 내놨다. 기업들이 AI를 이유로 직원을 해고하는 것은 AI의 <em>현재 성능</em> 때문이 아니라 <em>미래 잠재력</em>에 대한 기대 때문이라는 것이다. 60%의 조직이 아직 검증도 안 된 AI 역량을 전제로 선제적으로 인력을 줄였다. 만약 AI가 기대에 못 미친다면, 이 기업들은 경쟁력 없는 팀으로 전락할 위험을 안고 있다.</p>

<p>AI 임금 프리미엄은 56%에 달한다. AI를 잘 다루는 사람과 그렇지 못한 사람 사이의 임금 격차는 이미 역대 최대다. 문제는 이 격차가 앞으로 더 벌어진다는 것이 아니라, 그 속도가 개인의 스킬 습득 속도를 앞서고 있다는 점이다.</p>

<blockquote><p>지금 당신이 해야 할 질문은 "AI가 내 일자리를 빼앗을까?"가 아니다. "내 직속 후배가 채용되지 않고 있다는 걸 알아채고 있는가?"다.</p></blockquote>

<hr/>

<div class="summary-box">
<h3>이 기사의 핵심</h3>
<ul>
<li>기업의 AI 일자리 충격은 대규모 해고가 아니라 <strong>신규 채용 축소</strong>로 나타나고 있다</li>
<li>22~25세 청년층 고용률이 AI 노출 직종에서 <strong>16% 감소</strong> — 커리어 진입로가 사라지는 중</li>
<li>기업의 60%가 AI 성능 검증 전에 선제 감원을 단행 — 이 베팅이 틀릴 경우 역효과 발생</li>
<li>AI 숙련 노동자 임금 프리미엄 56% — 격차는 이미 스킬 습득 속도를 앞섰다</li>
<li>공식 발표 해고(5.5만) vs 실제 추정 손실(20~30만) — 숫자의 정치학을 인식해야 한다</li>
</ul>
</div>

<div class="think-box">
<h3>더 생각해볼 것들</h3>
<ol>
<li>당신의 직군에서 지난 1년간 신입 채용이 줄었는가? 줄었다면, 이유를 공개적으로 밝혔는가?</li>
<li>"AI를 잘 다루는 사람"이 되려면 지금 어떤 스킬을 습득해야 하는가 — 도구 사용법인가, 아니면 판단 능력인가?</li>
<li>주니어 인력이 줄어드는 지금, 10년 뒤 시니어 인력 부족은 어떤 직종에서 가장 먼저 나타날까?</li>
</ol>
</div>`,
      excerpt: '대량 해고가 아니다. AI는 채용을 멈추는 방식으로 일자리를 지운다. 22~25세 고용률 16% 급감, 신입 진입로 소멸 — 이것이 2026년 AI 고용 충격의 실체다.',
      feature_image: null,
      published_at: '2026-04-28T09:00:00.000Z',
      reading_time: 7,
      tags: [{ id: '6', name: 'Analysis', slug: 'other' }],
      authors: [{ id: '1', name: 'TFF Editorial', slug: 'tff-editorial' }],
      primary_tag: { name: 'Analysis', slug: 'other' },
      primary_author: { name: 'TFF Editorial', slug: 'tff-editorial' },
    },
    {
      id: '2',
      slug: 'openai-ipo-2026-what-retail-investors-must-know',
      title: 'OpenAI IPO에 투자하려는 당신이 모르는 것들',
      html: `<p>OpenAI가 최근 $122B 라운드를 $852B 밸류에이션으로 마감하면서 소매 투자자들도 처음으로 참여할 수 있는 기회를 얻었다. Robinhood는 이미 IPO 전 접근 채널을 열었고, CFO Sarah Friar는 정식 IPO 때도 개인 투자자 물량을 배정하겠다고 밝혔다. 분위기는 뜨겁다. 그런데 진짜 숫자를 들여다보면 이야기가 달라진다.</p>

<h2>$25B 매출이지만 $14B 적자다</h2>
<p>OpenAI는 2026년 2월 기준 연간 매출 $25B을 돌파했다. 14개월 만에 4배 성장이다. 하지만 같은 기간 적자도 급증했다. 2026년 한 해 예상 손실만 <strong>$14B</strong>이다. 수익 흑자 전환 예상 시점은 2030년. IPO 이후에도 수년간 지속적인 자본 조달이 필요하다는 의미다. HSBC 추정에 따르면 2030년까지의 자금 조달 갭은 $207B에 달한다.</p>

<h2>시장 점유율이 이미 빠지고 있다</h2>
<p>Similarweb 데이터가 보여주는 지표는 불편하다. ChatGPT의 AI 어시스턴트 웹트래픽 점유율은 12개월 전 86.7%에서 <strong>64.5%</strong>로 하락했다. 같은 기간 Google Gemini는 5.7%에서 21.5%로 치솟았다. OpenAI가 압도적 선두임에는 변함없지만, 궤적(trajectory)이 역전되고 있다.</p>

<h2>숨은 인사이트: $852B는 무엇을 가정하고 있나</h2>
<p>$852B 밸류에이션은 2030년 수익성 달성과 AI 시장 내 지배적 점유율 유지를 동시에 가정한다. 하지만 현재 모델 사이클을 보면 GPT-5.5가 출시된 다음 날 DeepSeek V4가 1/6 가격으로 거의 동급 성능으로 나왔다. 단일 기업이 프리미엄 가격 구조를 방어할 수 있는 해자(moat)가 얼마나 견고한지 시장은 아직 검증하지 못했다.</p>

<p>한 가지 더. OpenAI는 2030년까지 광고 수익 <strong>연 $100B</strong>를 목표로 한다. 그것이 실현되려면 ChatGPT가 지금의 Google Search만큼 생활에 깊이 박혀야 한다. 그것이 가능하다고 믿는가 — 이 질문에 당신이 YES라면 $852B은 오히려 저평가일 수 있다. NO라면, 이 IPO는 역사상 가장 비싸게 팔린 성장주 중 하나가 될 것이다.</p>

<blockquote><p>OpenAI IPO는 AI의 미래에 베팅하는 것이 아니다. AI 시장에서 OpenAI가 지금의 점유율을 10년간 방어할 수 있다는 것에 베팅하는 것이다. 이 두 가지는 전혀 다른 질문이다.</p></blockquote>

<hr/>

<div class="summary-box">
<h3>투자 전 체크리스트</h3>
<ul>
<li>밸류에이션 <strong>$852B</strong> — 2026년 예상 손실 $14B 기준 PER 계산 불가, 흑자 전환 예상 2030년</li>
<li>ChatGPT 점유율 <strong>86.7% → 64.5%</strong> (12개월), Gemini 5.7% → 21.5%로 급반등</li>
<li>2030년까지 추가 자금 조달 필요액 HSBC 추정 <strong>$207B</strong> — IPO 후에도 희석 리스크 존재</li>
<li>광고 수익 $100B/년 목표 — 실현되려면 ChatGPT가 Google Search 수준의 생활 밀착도 확보 필요</li>
<li>소매 투자자 배정 확정, Robinhood 통해 IPO 전 접근 가능 — 접근성과 리스크는 별개다</li>
</ul>
</div>

<div class="think-box">
<h3>더 생각해볼 것들</h3>
<ol>
<li>OpenAI의 수익 모델은 구독료, API, 광고 세 가지다. 이 중 10년 뒤 가장 큰 비중을 차지할 것은?</li>
<li>ChatGPT의 점유율 하락은 일시적 경쟁 압박인가, 구조적 추세인가?</li>
<li>$852B 밸류에이션이 정당화되려면 OpenAI가 2030년까지 달성해야 할 최소 조건은 무엇인가?</li>
</ol>
</div>`,
      excerpt: '$852B 밸류에이션, 2026년 손실 $14B, ChatGPT 점유율 86%→64%로 하락 중. OpenAI IPO를 앞두고 소매 투자자가 반드시 봐야 할 숫자들.',
      feature_image: null,
      published_at: '2026-04-27T08:00:00.000Z',
      reading_time: 7,
      tags: [{ id: '1', name: 'Funding', slug: 'funding' }],
      authors: [{ id: '1', name: 'TFF Editorial', slug: 'tff-editorial' }],
      primary_tag: { name: 'Funding', slug: 'funding' },
      primary_author: { name: 'TFF Editorial', slug: 'tff-editorial' },
    },
    {
      id: '3',
      slug: 'chatgpt-vs-claude-vs-gemini-which-to-use-2026',
      title: 'ChatGPT vs Claude vs Gemini: 2026년에 실제로 어떤 걸 써야 하나',
      html: `<p>벤치마크 점수를 나열하는 비교 글은 이미 넘쳐난다. 이 글은 다르게 접근한다. 실제로 어떤 작업에, 어떤 모델을 쓰면 가장 결과가 좋은지 — 그리고 왜 많은 사람들이 "잘못된" 모델을 메인으로 쓰고 있는지를 짚는다.</p>

<h2>코딩 — Claude의 압승, 이유가 있다</h2>
<p>여러 2026년 비교 연구에서 코딩 분야 결론은 일치한다. <strong>Claude, not even close.</strong> Claude 4.7은 복잡한 디버깅, 다중 파일 리팩토링, 긴 컨텍스트 코드베이스 이해에서 GPT-5.5보다 확연히 적은 오류를 만든다. 이유는 구조적이다. Anthropic이 Claude를 처음부터 "긴 문서를 정확하게 처리하는 모델"로 설계했기 때문이다. 코드는 결국 긴 구조화 문서다.</p>

<h2>일반 작업 — ChatGPT가 여전히 No.1인 이유</h2>
<p>ChatGPT의 강점은 단일 task 최고 성능이 아니다. <em>모든 것을 무난하게 잘 한다</em>는 것이다. 웹 브라우징, 이미지 생성(DALL-E), 데이터 분석, 코드 실행, 일정 관리까지 하나의 인터페이스에서 처리할 수 있다. 일상적인 업무 자동화에서는 이 올인원 특성이 Claude의 코딩 우위를 압도한다.</p>

<h2>대규모 문서 처리 — Gemini의 숨은 강점</h2>
<p>Gemini 3.1의 2M 토큰 컨텍스트 윈도우는 법률 계약서 전체, 대형 코드 레포, 수백 페이지 보고서를 한 번에 처리할 수 있다는 의미다. Google Workspace 연동까지 더하면 기업 환경에서는 경쟁력이 뚜렷하다. 단, 매우 긴 컨텍스트에서 품질 유지는 Claude가 더 신뢰할 만하다는 평가가 지배적이다.</p>

<h2>숨은 인사이트: 대부분의 사람은 잘못된 모델을 메인으로 쓴다</h2>
<p>현실적으로 대부분의 지식 노동자는 ChatGPT를 기본값으로 쓴다. 이유는 간단하다. 가장 먼저 알려졌기 때문이다. 하지만 실제로 하루 업무를 분석해 보면 코딩, 문서 초안, 이메일 작성이 대부분을 차지하고 — 이 영역에서 Claude가 더 나은 결과를 낸다.</p>

<p>전략은 단순하다. <strong>기본값을 Claude로 바꾸고, 웹 검색이 필요할 때만 ChatGPT를 쓰고, 대규모 문서를 처리할 때 Gemini를 꺼낸다.</strong> 이 세 가지를 구분하는 것만으로도 AI 생산성이 체감할 만큼 달라진다. DeepSeek V4가 코딩과 추론에서 이미 이 세 모델을 위협하고 있다는 점도 염두에 두자. 6개월 뒤 이 순위는 다시 달라질 수 있다.</p>

<blockquote><p>당신이 ChatGPT를 쓰는 이유가 "가장 좋아서"가 아니라 "가장 먼저 알아서"라면, 지금 당장 Claude로 2주를 시험해볼 이유가 충분하다.</p></blockquote>

<hr/>

<div class="summary-box">
<h3>용도별 추천 모델 요약</h3>
<ul>
<li><strong>코딩 · 디버깅 · 리팩토링</strong> → Claude 4.7 (복잡한 추론, 오류 최소화)</li>
<li><strong>일상 업무 · 이미지 생성 · 웹 검색</strong> → ChatGPT (올인원 인터페이스)</li>
<li><strong>대용량 문서 · Google Workspace 연동</strong> → Gemini 3.1 (2M 토큰 컨텍스트)</li>
<li><strong>비용 효율 추론 · 오픈소스 필요</strong> → DeepSeek V4 (GPT-5.5 대비 1/6 비용)</li>
<li>단일 모델에 고착되지 말고 <strong>작업 유형별로 분리</strong>하는 것이 최고의 전략</li>
</ul>
</div>

<div class="think-box">
<h3>더 생각해볼 것들</h3>
<ol>
<li>당신이 하루에 AI에게 맡기는 작업을 유형별로 분류하면 어떻게 되는가?</li>
<li>모델 선택보다 중요한 것은 프롬프트 설계다 — 같은 모델로도 결과 품질은 10배 달라진다. 당신의 프롬프트는?</li>
<li>6개월 뒤 이 순위는 어떻게 바뀔까? DeepSeek V5, GPT-6, Claude 5가 나온다면?</li>
</ol>
</div>`,
      excerpt: '코딩은 Claude, 올인원은 ChatGPT, 대규모 문서는 Gemini. 벤치마크가 아닌 실제 업무 기준으로 2026년 AI 모델 선택 가이드를 정리했다.',
      feature_image: null,
      published_at: '2026-04-26T10:00:00.000Z',
      reading_time: 6,
      tags: [{ id: '6', name: 'Analysis', slug: 'other' }],
      authors: [{ id: '1', name: 'TFF Editorial', slug: 'tff-editorial' }],
      primary_tag: { name: 'Analysis', slug: 'other' },
      primary_author: { name: 'TFF Editorial', slug: 'tff-editorial' },
    },
    {
      id: '4',
      slug: 'deepseek-v4-real-question-for-silicon-valley',
      title: 'DeepSeek V4가 실리콘밸리에 던진 불편한 질문: "미국 AI는 왜 이렇게 비싼가?"',
      html: `<p>DeepSeek V4가 4월 24일 GPT-5.5 출시 24시간 만에 등장했다. V4 Flash 기준 입력 토큰당 $0.14, 출력 토큰당 $0.28 — Anthropic의 Opus 4.7이나 GPT-5.5와 비교하면 1/6 수준이다. 성능은? DeepSeek 자신들의 말로는 "거의 격차를 좁혔다(almost closed the gap)"고 한다. 독립 벤치마크들은 이를 상당 부분 확인한다.</p>

<h2>이건 그냥 저렴한 모델이 아니다</h2>
<p>DeepSeek V4의 의미를 단순히 "저렴한 중국 AI 모델"로 보면 핵심을 놓친다. 진짜 질문은 다른 곳에 있다. 미국 AI 기업들이 $100B 이상을 데이터센터에 쏟아붓는 동안, DeepSeek는 어떻게 훨씬 적은 예산으로 거의 같은 결과를 냈는가?</p>

<p>V4는 Huawei 칩과 더 긴밀하게 통합된 MoE(Mixture of Experts) 아키텍처를 사용한다. 미국의 반도체 수출 규제로 NVIDIA H100/H200에 접근할 수 없는 DeepSeek가 대신 선택한 경로는 하드웨어 효율성을 극대화하는 소프트웨어 혁신이었다. 제약이 혁신을 낳은 셈이다.</p>

<h2>숨은 인사이트: 반도체 규제는 역효과를 낳고 있다</h2>
<p>미국 정부의 AI 칩 수출 규제는 중국의 AI 발전을 늦추려는 의도였다. 결과는 반대로 나오고 있다. 최고급 칩 없이도 경쟁력 있는 모델을 만드는 방법을 중국 AI 기업들이 개발하도록 강요한 것이다. 최악의 경우, 이 기술 경로가 더 효율적인 것으로 판명되면 미국의 칩 우위 자체가 AI 경쟁력으로 직결되지 않는 시대가 열린다.</p>

<p>1M 토큰 컨텍스트 윈도우, 오픈 웨이트 공개, 경쟁적 가격 — DeepSeek가 계속 이 패턴을 반복한다면, 미국 AI 기업들의 프리미엄 가격 정책은 정당화하기 점점 어려워진다. 기업 고객 입장에서 6배 비싼 모델을 쓸 이유가 있는가? 그 답이 "보안", "규정 준수", "지원 품질"이라면 — 그것이 향후 미국 AI의 진짜 경쟁 포인트가 될 것이다.</p>

<blockquote><p>DeepSeek V4는 모델 전쟁이 아니라 비즈니스 모델 전쟁을 선언한 것이다. 성능이 아니라 가격으로 싸운다면, 실리콘밸리는 이길 수 없다.</p></blockquote>

<hr/>

<div class="summary-box">
<h3>DeepSeek V4 핵심 스펙</h3>
<ul>
<li>모델: <strong>V4 Flash + V4 Pro</strong> (MoE 아키텍처, 각 1M 토큰 컨텍스트)</li>
<li>가격: Flash <strong>$0.14/M input · $0.28/M output</strong> — Opus 4.7 대비 약 1/6</li>
<li>칩: Huawei 칩 긴밀 통합 — NVIDIA H100 없이도 프론티어 근접 성능 달성</li>
<li>오픈 웨이트 공개 — 기업이 자체 인프라에서 무료 실행 가능</li>
<li>벤치마크: 코딩·추론에서 GPT-5.5와의 격차 "거의 좁혔다" — 독립 테스트가 상당 부분 확인</li>
</ul>
</div>

<div class="think-box">
<h3>더 생각해볼 것들</h3>
<ol>
<li>미국의 대중국 반도체 수출 규제는 중국 AI를 억제했는가, 아니면 오히려 효율 혁신을 강제했는가?</li>
<li>기업 입장에서 GPT-5.5($0.8+/M)와 DeepSeek V4($0.14/M)를 선택하는 기준은 무엇이어야 하는가?</li>
<li>오픈 웨이트 모델이 계속 프론티어를 따라잡는다면, 폐쇄형 모델의 존재 이유는 무엇으로 남는가?</li>
</ol>
</div>`,
      excerpt: 'GPT-5.5의 1/6 가격, 거의 동급 성능. DeepSeek V4는 단순한 저가 모델이 아니다. 미국 반도체 수출 규제가 오히려 중국 AI 효율화를 강제한 역설을 분석한다.',
      feature_image: null,
      published_at: '2026-04-25T14:00:00.000Z',
      reading_time: 6,
      tags: [{ id: '2', name: 'Model Release', slug: 'model_release' }],
      authors: [{ id: '1', name: 'TFF Editorial', slug: 'tff-editorial' }],
      primary_tag: { name: 'Model Release', slug: 'model_release' },
      primary_author: { name: 'TFF Editorial', slug: 'tff-editorial' },
    },
    {
      id: '5',
      slug: 'ai-bubble-burst-warning-signs-2026',
      title: 'AI 버블은 터질까? 경제학자들이 말하는 4가지 경고 신호',
      html: `<p>Capital Economics의 수석 시장 경제학자 John Higgins는 이렇게 말한다. "AI 주식 버블은 이미 터졌다." 하지만 동시에 "더 희귀한 종류의 버블은 아직 성장 중"이라고 덧붙인다. 이 두 문장이 공존할 수 있는 이유를 이해하는 것이 2026년 AI 투자를 판단하는 핵심이다.</p>

<h2>4가지 버블 신호가 모두 켜져 있다</h2>
<p>경제학자들은 버블을 진단할 때 네 가지 지표를 본다. <strong>과잉 투자(overinvestment), 과잉 밸류에이션(overvaluation), 과잉 소유(over-ownership), 과잉 레버리지(over-leverage).</strong> 현재 AI 시장은 이 네 가지에 모두 해당한다.</p>

<p>S&P 500의 선행 PER은 23배, 미국 시장 전체의 Case-Shiller PE 비율은 닷컴 버블 이후 처음으로 40을 넘었다. S&P 500 시가총액의 30%, MSCI 세계 지수의 20%가 단 5개 대형주에 집중되어 있다 — 반 세기 만의 최고 집중도다.</p>

<h2>그런데 생산성 데이터는 비어 있다</h2>
<p>2026년 2월 NBER(전미경제연구소) 연구 결과는 충격적이다. 기업의 90%가 AI 도입 후 생산성에 눈에 띄는 영향이 없다고 보고했다. 경영진들은 AI가 생산성을 1.4% 높일 것이라고 예상하지만 — 그건 미래 예상이지 현재 실적이 아니다. $300B이 Q1에 투자되는 동안, 그에 상응하는 생산성 데이터는 아직 나타나지 않고 있다.</p>

<h2>숨은 인사이트: 두 종류의 버블이 동시에 존재한다</h2>
<p>Higgins의 핵심 구분이 여기에 있다. 이미 터진 버블은 "AI 테마주 전반"이다. Nvidia의 급등세, AI 인프라 관련 소형주들이 2024~2025년에 크게 하락했다. 아직 성장 중인 버블은 "실제로 AI 수익을 만들어내는 극소수 기업"들이다 — OpenAI, Anthropic, Google, Microsoft. 이들의 밸류에이션은 아직 꺼지지 않았다.</p>

<p>역사는 이 패턴을 알고 있다. 닷컴 버블 때도 Amazon과 Google만 살아남았다. AI 버블이 터진다면 마찬가지로 2~3개 기업만 살아남을 것이다. 문제는, IPO 전인 지금 어떤 기업이 그 2~3개인지 알기 어렵다는 점이다. $33T가 증발하는 시나리오에서 살아남으려면, 지금 어떤 포지션을 갖고 있는가.</p>

<blockquote><p>버블을 피하는 가장 좋은 방법은 버블이 터질 날짜를 맞추는 게 아니다. 버블이 터진 후에도 살아남을 기업을 고르는 것이다.</p></blockquote>

<hr/>

<div class="summary-box">
<h3>버블 진단 체크리스트 — 현재 상태</h3>
<ul>
<li><strong>과잉 투자</strong> ✓ — Q1 2026 글로벌 VC 투자 $300B, 전분기 대비 150% 증가</li>
<li><strong>과잉 밸류에이션</strong> ✓ — Case-Shiller PE 40 초과, S&P 선행 PER 23배 (닷컴 수준)</li>
<li><strong>과잉 소유</strong> ✓ — S&P 500의 30%가 상위 5개 종목에 집중, 반 세기 최고</li>
<li><strong>과잉 레버리지</strong> ✓ — 저금리 시대 조달 자금으로 AI 인프라 과도 확장</li>
<li><strong>반론</strong> — 90%의 기업이 AI 도입 후 생산성 변화 없음 보고 (NBER, 2026.02)</li>
</ul>
</div>

<div class="think-box">
<h3>더 생각해볼 것들</h3>
<ol>
<li>닷컴 버블 생존자는 Amazon과 Google이었다. AI 버블의 생존자는 누가 될 가능성이 높은가?</li>
<li>"이미 터진 버블"(AI 테마주)과 "아직 성장 중인 버블"(수익 AI 기업)을 구분하는 기준은 무엇인가?</li>
<li>금리가 다시 오른다면, 가장 먼저 타격받을 AI 기업 유형은?</li>
</ol>
</div>`,
      excerpt: '과잉 투자·밸류에이션·소유·레버리지 — 4가지 버블 지표가 모두 점등됐다. 그러나 이미 꺼진 버블과 아직 성장 중인 버블이 동시에 존재한다는 경제학자들의 분석.',
      feature_image: null,
      published_at: '2026-04-24T09:00:00.000Z',
      reading_time: 7,
      tags: [{ id: '6', name: 'Analysis', slug: 'other' }],
      authors: [{ id: '1', name: 'TFF Editorial', slug: 'tff-editorial' }],
      primary_tag: { name: 'Analysis', slug: 'other' },
      primary_author: { name: 'TFF Editorial', slug: 'tff-editorial' },
    },
    {
      id: '6',
      slug: 'spacex-xai-cursor-elon-musk-endgame',
      title: '일론 머스크는 지금 무엇을 만들고 있나: SpaceX + xAI + Cursor의 숨은 그림',
      html: `<p>숫자부터 보자. 2026년 2월 SpaceX가 xAI를 $250B에 인수했다. 4월 1일 $1.75T 밸류에이션으로 Nasdaq IPO 기밀 신청을 했다. 4월 21일 AI 코딩 편집기 Cursor를 만드는 Anysphere를 $60B에 인수할 수 있는 옵션을 확보했다. 이 세 가지를 연결하면 어떤 그림이 나오는가?</p>

<h2>수직 통합의 완성</h2>
<p>머스크가 구축하고 있는 것은 단순한 AI 기업이 아니다. <strong>AI 모델(Grok) → AI 개발 도구(Cursor) → AI 훈련 인프라(Starlink + 위성 데이터) → 물리적 AI(Tesla 로봇) → 우주 배포(SpaceX)</strong>를 하나의 기업 생태계로 묶는 수직 통합이다. 실리콘밸리의 어떤 기업도 이 범위의 수직 통합을 추진하고 있지 않다.</p>

<p>Cursor는 현재 전 세계에서 가장 많이 쓰이는 AI 코딩 도구다. GitHub Copilot을 밀어낸 그 도구가 xAI의 Grok 모델과 깊이 통합된다면 — 개발자 생태계 전체를 Grok 위에 묶는 효과가 생긴다. 개발자가 Cursor를 쓰는 순간 Grok을 쓰게 되고, Grok API 매출이 오르고, xAI가 성장한다. ChatGPT가 소비자를 통해 성장하는 것과 달리, xAI는 개발자를 통해 성장하는 경로를 택했다.</p>

<h2>숨은 인사이트: IPO가 목적이 아니다</h2>
<p>xAI는 IPO 전 월 $1B를 태우고 있었다. SpaceX의 연간 이익 $8B이 이 소각률을 커버해줬다. 그런데 IPO로 $75B을 조달한다면? 그 자금은 Grok 5, 6, 7 훈련과 데이터센터 규모 확장에 투입된다. IPO는 자금 조달 수단이지, 출구 전략이 아니다.</p>

<p>더 중요한 것은 SpaceX IPO가 성사되면 Starlink 구독자 데이터와 위성 인프라가 공개 시장의 가치 평가를 받게 된다는 점이다. 이 데이터는 AI 훈련을 위한 독점적인 실시간 지구 관측 데이터다. 이것이 공개적으로 평가받기 시작하면, 시장은 AI 인프라로서의 SpaceX를 다시 볼 것이다. $1.75T은 시작 숫자일 수 있다.</p>

<blockquote><p>OpenAI가 소비자를 플랫폼으로 삼는다면, xAI는 개발자를 플랫폼으로 삼는다. 역사적으로 개발자 플랫폼은 소비자 플랫폼보다 더 오래 살아남았다.</p></blockquote>

<hr/>

<div class="summary-box">
<h3>SpaceX-xAI 수직 통합 지도</h3>
<ul>
<li><strong>AI 모델</strong> — Grok 4.20 Beta (4 에이전트 병렬), Grok 5 훈련 중</li>
<li><strong>개발 도구</strong> — Anysphere(Cursor) $60B 인수 옵션 확보 (2026.04.21)</li>
<li><strong>컴퓨트 자금</strong> — SpaceX 연간 이익 $8B이 xAI 월 소각 $1B 커버</li>
<li><strong>데이터 인프라</strong> — Starlink 위성 네트워크, 실시간 지구 관측 데이터</li>
<li><strong>IPO</strong> — Nasdaq 기밀 신청, 목표 밸류 $1.75T, 조달 목표 최대 $75B</li>
</ul>
</div>

<div class="think-box">
<h3>더 생각해볼 것들</h3>
<ol>
<li>개발자 플랫폼 전략(xAI-Cursor)과 소비자 플랫폼 전략(ChatGPT)의 장기 경쟁에서 어느 쪽이 더 강한 해자를 만드는가?</li>
<li>SpaceX IPO가 성사되면 AI 인프라로서의 Starlink 가치가 재평가될 수 있다. 이것이 위성 데이터의 AI 훈련 활용을 어떻게 바꿀까?</li>
<li>머스크의 모든 기업(Tesla, SpaceX, xAI, X)이 단일 생태계로 묶인다면, 이것은 독점인가 시너지인가?</li>
</ol>
</div>`,
      excerpt: 'SpaceX $1.75T IPO, xAI 합병, Cursor $60B 인수 옵션. 이 세 가지를 연결하면 머스크가 그리는 AI 수직 통합 제국의 윤곽이 보인다.',
      feature_image: null,
      published_at: '2026-04-22T11:00:00.000Z',
      reading_time: 7,
      tags: [{ id: '3', name: 'Acquisition', slug: 'acquisition' }],
      authors: [{ id: '1', name: 'TFF Editorial', slug: 'tff-editorial' }],
      primary_tag: { name: 'Acquisition', slug: 'acquisition' },
      primary_author: { name: 'TFF Editorial', slug: 'tff-editorial' },
    },
    {
      id: '7',
      slug: 'companies-failing-ai-adoption-pwc-2026',
      title: 'AI 도입 기업 80%가 가치를 못 뽑는 이유 — PwC 5천 개 기업 분석',
      html: `<p>PwC가 27개국 5,000개 기업을 분석한 2026 AI 성과 연구의 결론은 간결하다. AI의 경제적 가치의 75%는 단 20%의 기업이 가져간다. 나머지 80%는? 비용만 지출하고 있다. 왜 이런 일이 벌어지는가.</p>

<h2>가치를 가져가는 기업과 그렇지 못한 기업의 차이</h2>
<p>PwC는 두 그룹의 AI 활용 목적이 근본적으로 다르다는 것을 발견했다. 상위 20%는 AI를 <strong>성장 도구</strong>로 쓴다 — 새로운 수익원 창출, 신규 고객 확보, 새로운 시장 진입. 하위 80%는 AI를 <strong>비용 절감 도구</strong>로 쓴다 — 기존 프로세스 자동화, 헤드카운트 감소, 효율성 개선.</p>

<p>이 차이가 왜 중요한가. 비용 절감은 천장이 있다. 인건비를 0으로 만들어도 매출은 그대로다. 반면 성장에는 천장이 없다. AI가 새로운 매출을 만드는 도구가 될 때, 그 복리 효과는 단순한 효율화와 비교할 수 없다.</p>

<h2>숨은 인사이트: 왜 대부분의 기업이 "잘못된" 방향으로 쓰는가</h2>
<p>이유는 간단하다. 비용 절감은 ROI가 측정하기 쉽다. "AI 도입 후 고객 서비스 인력 30% 감소, 연간 $2M 절약"은 경영진에게 명확한 숫자다. 반면 "AI로 새로운 제품 라인 개발 가능성 탐색"은 불확실하고 측정이 어렵다.</p>

<p>결과적으로 CFO가 AI 예산을 승인하는 방식이 AI 활용의 방향을 결정한다. 단기 ROI를 요구하는 재무 구조는 비용 절감형 AI 투자를 만들고, 이것이 하위 80%에 갇히는 구조적 원인이다.</p>

<p>글로벌 AI 시장은 2033년 $4.8T으로 성장할 것으로 PwC는 예측한다. 현재 집중도 기준으로 그 중 $3.6T는 상위 20% 기업에게 돌아간다. 당신의 회사는 지금 어느 쪽에 있는가. 그리고 그 방향을 바꾸는 것이 기술 문제인가, 의사결정 구조 문제인가.</p>

<blockquote><p>AI 도입 예산을 비용 센터(cost center)에서 승인받는 기업은 AI를 비용 절감 도구로만 쓰게 되어 있다. AI를 성장 도구로 쓰려면 성장 조직(growth org)이 예산 통제권을 가져야 한다.</p></blockquote>

<hr/>

<div class="summary-box">
<h3>PwC 연구 핵심 데이터</h3>
<ul>
<li>조사 대상: <strong>27개국 5,000개 기업</strong> (2026년 발표)</li>
<li>AI 경제 가치의 <strong>75%</strong>를 상위 <strong>20%</strong> 기업이 독점</li>
<li>상위 그룹 공통점: AI를 <strong>성장 도구</strong>로 활용 (신규 매출, 신규 고객, 신규 시장)</li>
<li>하위 그룹 공통점: AI를 <strong>비용 절감 도구</strong>로만 활용 (자동화, 헤드카운트 감소)</li>
<li>글로벌 AI 시장 2033년 <strong>$4.8T</strong> 전망 — 이 중 $3.6T는 상위 20%로 귀속 예상</li>
</ul>
</div>

<div class="think-box">
<h3>더 생각해볼 것들</h3>
<ol>
<li>당신의 조직에서 AI 도입 예산 결정권은 누가 갖고 있는가 — CFO인가, CMO인가, CPO인가?</li>
<li>"AI로 비용을 줄이는 것"과 "AI로 매출을 늘리는 것" 중 어느 쪽이 더 먼저 실현 가능한가? 이유는?</li>
<li>AI 도입 ROI를 단기(1년)로 측정하는 기업과 중장기(3~5년)로 측정하는 기업 중 어느 쪽이 더 가치를 만들어낼 가능성이 높은가?</li>
</ol>
</div>`,
      excerpt: 'PwC 5천 기업 분석: AI 가치의 75%는 상위 20%가 독식. 차이는 기술이 아니라 의사결정 구조다. 비용 절감 vs 성장 — 어떤 목적으로 AI를 쓰는가가 기업의 미래를 가른다.',
      feature_image: null,
      published_at: '2026-04-20T09:00:00.000Z',
      reading_time: 6,
      tags: [{ id: '6', name: 'Analysis', slug: 'other' }],
      authors: [{ id: '1', name: 'TFF Editorial', slug: 'tff-editorial' }],
      primary_tag: { name: 'Analysis', slug: 'other' },
      primary_author: { name: 'TFF Editorial', slug: 'tff-editorial' },
    },
    {
      id: '8',
      slug: 'claude-opus-47-agentic-ai-deep-dive',
      title: 'Claude Opus 4.7 심층 분석: 에이전트 AI 시대에 "좋은 모델"의 기준이 바뀌었다',
      html: `<p>Anthropic이 4월 16일 Claude Opus 4.7을 출시하면서 붙인 설명은 주목할 만하다. "복잡한 추론과 장기 실행 에이전트 워크플로우를 위해 특별히 설계됐다." 이 문장에서 핵심은 "장기 실행(long-running)"이다. 이것이 왜 중요한가.</p>

<h2>에이전트 AI의 문제: 중간에 멈추는 모델</h2>
<p>현재 AI 에이전트의 가장 큰 실패 원인은 모델 성능이 아니다. 작업 중간에 불필요하게 사용자에게 확인을 구하거나, 긴 작업 체인에서 앞 맥락을 잃어버리거나, 여러 도구를 동시에 호출해야 할 때 순차적으로만 처리하는 것이다.</p>

<p>Opus 4.7은 이 세 가지를 모두 개선했다. 네이티브 도구 사용 병렬화(parallel tool-use)로 여러 API를 동시에 호출할 수 있고, 200K 토큰 컨텍스트 내에서 앞선 결정들을 일관성 있게 추적한다. 결과적으로 에이전트가 중간에 끊기지 않고 더 긴 작업을 완료할 수 있다.</p>

<h2>Project Glasswing이 보여주는 것</h2>
<p>Opus 4.7 출시와 함께 발표된 Project Glasswing은 Amazon, Microsoft, Apple, Google, Nvidia와의 방어적 사이버보안 협력 프로그램이다. 이 모델이 이미 수만 개의 소프트웨어 취약점을 탐지했다는 초기 결과가 나왔다.</p>

<p>이것이 보여주는 것은 두 가지다. 첫째, Anthropic이 단순한 채팅 인터페이스 회사를 넘어 엔터프라이즈 보안 인프라로 포지셔닝하고 있다. 둘째, AI 모델이 수동적인 응답 시스템이 아니라 능동적인 위협 탐지 에이전트로 쓰이기 시작했다는 것이다.</p>

<h2>숨은 인사이트: 연매출 $19B 기업이 아직 비상장인 이유</h2>
<p>Anthropic은 연매출 $19B를 향해 달려가고 있다. 그런데 아직 비상장이다. OpenAI가 IPO를 준비하는 것과 대조적으로, Anthropic은 의도적으로 상장을 늦추는 것처럼 보인다. 가능한 해석: 공개 시장의 단기 수익성 압박 없이 장기 연구에 집중하려는 전략. Amazon이 4조원 이상을 투자한 주요 주주라는 사실이 이 전략을 가능하게 한다.</p>

<p>만약 Anthropic이 IPO를 하지 않고도 최고 수준의 모델을 유지할 수 있다면, 이는 "상장 = 성공의 증거"라는 실리콘밸리의 기존 공식에 도전하는 것이다.</p>

<blockquote><p>에이전트 AI 시대의 모델 평가 기준은 "얼마나 영리한가"에서 "얼마나 오랫동안 혼자 일할 수 있는가"로 이동하고 있다. Opus 4.7은 그 기준 변화를 의식적으로 설계한 최초의 플래그십 모델이다.</p></blockquote>

<hr/>

<div class="summary-box">
<h3>Claude Opus 4.7 스펙 요약</h3>
<ul>
<li>출시일: <strong>2026년 4월 16일</strong> (Anthropic)</li>
<li>핵심 설계 목표: 장기 실행 에이전트 워크플로우 — 단발성 채팅이 아님</li>
<li>주요 기능: <strong>네이티브 병렬 도구 호출</strong> — 여러 API를 동시에 실행 가능</li>
<li>컨텍스트: <strong>200K 토큰</strong> — 긴 작업 체인에서도 일관성 유지</li>
<li>Project Glasswing: Amazon, Microsoft, Apple, Google, Nvidia와 방어적 사이버보안 협력, 수만 개 취약점 탐지 확인</li>
</ul>
</div>

<div class="think-box">
<h3>더 생각해볼 것들</h3>
<ol>
<li>"에이전트가 중간에 멈추지 않고 긴 작업을 완료하는 것" — 이 능력이 당신의 업무에 적용된다면 어떤 프로세스가 가장 먼저 자동화될 수 있는가?</li>
<li>Anthropic이 비상장을 유지하는 것은 전략인가, 아니면 아직 IPO 조건이 안 된 것인가?</li>
<li>AI 모델이 사이버보안 취약점을 자동 탐지한다면, 반대로 공격에도 활용될 수 있다. 이 양면성을 어떻게 규제해야 하는가?</li>
</ol>
</div>`,
      excerpt: 'Anthropic Opus 4.7은 단순히 더 똑똑한 모델이 아니다. 에이전트 AI 시대의 새로운 설계 기준 — 장기 실행, 병렬 도구 호출, Project Glasswing 보안 통합을 심층 분석한다.',
      feature_image: null,
      published_at: '2026-04-17T10:00:00.000Z',
      reading_time: 7,
      tags: [{ id: '2', name: 'Model Release', slug: 'model_release' }],
      authors: [{ id: '1', name: 'TFF Editorial', slug: 'tff-editorial' }],
      primary_tag: { name: 'Model Release', slug: 'model_release' },
      primary_author: { name: 'TFF Editorial', slug: 'tff-editorial' },
    },
    {
      id: '9',
      slug: 'ai-power-map-2026-who-is-winning',
      title: '2026년 AI 권력 지도: OpenAI, Google, Anthropic, xAI — 누가 이기고 있나',
      html: `<p>2026년 4월 기준 AI 산업의 지형을 숫자로 정리하면 이렇다. OpenAI 연매출 $25B, Anthropic $19B 접근 중, Google은 AI 어시스턴트 시장 점유율을 5.7%에서 21.5%로 키웠고, xAI는 SpaceX와 합병해 $1.25T 규모 기업이 됐다. 이 숫자들은 무엇을 말하는가.</p>

<h2>OpenAI: 선두지만 가장 많은 것을 잃고 있는 기업</h2>
<p>ChatGPT 점유율 64.5%는 여전히 압도적이지만, 12개월 전 86.7%에서 내려온 것이다. 연매출은 가장 빠르게 성장하고 있지만 손실도 가장 크다($14B/년). 광고 수익 모델로 전환을 시도하고 있는데, 이것이 사용자 경험을 해칠 경우 점유율 하락이 가속될 수 있다.</p>

<h2>Google: 조용히 가장 위험한 플레이어가 됐다</h2>
<p>Google의 무기는 세 가지다. 검색 사용자 데이터(인류 역사상 가장 큰 의도 데이터셋), Gmail/Docs/Drive 생태계 깊이 박힌 사용자 습관, 그리고 DeepMind의 연구 역량. Gemini의 점유율 21.5%는 숫자 이상의 의미가 있다. 기존 Google 서비스 사용자가 AI 기능을 자연스럽게 확장하는 것이기 때문이다. 새로운 사용자를 확보하는 것이 아니라 기존 사용자를 더 깊이 잠그는 전략이다.</p>

<h2>Anthropic: 가장 조용하지만 가장 빠르게 성장하는 기업</h2>
<p>$19B 연매출을 향해 달리면서 비상장을 유지하고, Claude를 에이전트 AI 시대의 플랫폼으로 포지셔닝하고, Amazon의 지원 아래 AWS 생태계 깊이 들어가고 있다. B2B 엔터프라이즈 중심의 전략이 ChatGPT의 B2C 위기와 대조적이다.</p>

<h2>숨은 인사이트: 승자는 모델이 아니라 플랫폼을 가진 기업이다</h2>
<p>AI 모델 자체는 빠르게 범용화(commoditize)되고 있다. DeepSeek V4가 증명했듯, 최신 프론티어 모델과 거의 동급의 성능을 1/6 가격에 제공하는 것이 가능해졌다. 이 환경에서 장기 경쟁력은 모델 성능이 아니라 <strong>사용자를 묶어두는 플랫폼</strong>에서 나온다.</p>

<p>Google은 검색, Gmail, YouTube. Microsoft는 Office, Azure, GitHub. Apple은 온디바이스 프라이버시. xAI는 개발자 도구(Cursor). OpenAI는 — ChatGPT 브랜드와 플러그인 생태계. 이 중 "대체하기 가장 어려운" 플랫폼은 어디인가. 그것이 10년 후 AI 전쟁의 승자를 결정할 것이다.</p>

<blockquote><p>AI 모델은 2026년에 이미 유틸리티(utility)가 되고 있다. 전기처럼. 중요한 것은 누가 전력망을 소유하느냐다.</p></blockquote>

<hr/>

<div class="summary-box">
<h3>2026년 4월 기준 AI 4강 스냅샷</h3>
<ul>
<li><strong>OpenAI</strong> — 연매출 $25B, ChatGPT 점유율 64.5% (하락 중), IPO 검토 중, 2026 예상 손실 $14B</li>
<li><strong>Google / DeepMind</strong> — Gemini 점유율 21.5% (12개월 만에 4배), 검색·Workspace 생태계 활용 잠금 전략</li>
<li><strong>Anthropic</strong> — 연매출 $19B 접근, 비상장 유지, Claude를 에이전트 AI 플랫폼으로 포지셔닝, Amazon 지원</li>
<li><strong>xAI (SpaceX)</strong> — $1.25T 합병 기업, Cursor $60B 인수 옵션, 개발자 생태계 중심 성장 전략</li>
<li>공통 리스크: 모델의 빠른 범용화(DeepSeek V4 충격) — 플랫폼 해자 없이는 프리미엄 가격 방어 불가</li>
</ul>
</div>

<div class="think-box">
<h3>더 생각해볼 것들</h3>
<ol>
<li>10년 뒤 AI 시장에서 "전력망(플랫폼)"을 소유할 기업은 어디인가 — 지금의 4강 중에 있는가?</li>
<li>Google은 AI 기업인가, AI를 활용한 검색 기업인가? 이 구분이 밸류에이션에 어떤 영향을 미치는가?</li>
<li>모델 성능이 범용화되면, AI 기업들의 차별화 포인트는 무엇으로 옮겨가는가 — 데이터, UX, 규정 준수, 가격?</li>
</ol>
</div>`,
      excerpt: 'OpenAI $25B 매출·점유율 하락, Google 21.5%로 급성장, Anthropic 조용한 질주, xAI 수직 통합. 2026년 4월 기준 AI 패권 경쟁의 실제 지형도.',
      feature_image: null,
      published_at: '2026-04-15T09:00:00.000Z',
      reading_time: 8,
      tags: [{ id: '6', name: 'Analysis', slug: 'other' }],
      authors: [{ id: '1', name: 'TFF Editorial', slug: 'tff-editorial' }],
      primary_tag: { name: 'Analysis', slug: 'other' },
      primary_author: { name: 'TFF Editorial', slug: 'tff-editorial' },
    },
    {
      id: '10',
      slug: 'q1-2026-vc-300b-record-ai-investment-bubble-or-foundation',
      title: '$300B이 쏟아졌다: Q1 2026 AI 투자 폭증, 버블인가 기초공사인가',
      html: `<p>Crunchbase에 따르면 2026년 1분기 글로벌 스타트업 투자는 전분기 대비 150% 이상 증가한 $300B을 기록했다. 6,000개 스타트업이 이 자금을 나눠 받았다. 미국에서만 4월까지 $274B이 2,490건의 라운드에 쏟아졌다. 이 숫자를 어떻게 읽어야 하는가.</p>

<h2>어디에 가장 많이 투자됐나</h2>
<p>섹터별로 보면 AI 인프라(데이터센터, 칩, 클라우드), 피지컬 AI(로봇공학), 양자 컴퓨팅, 법률·의료 AI 순이다. 주목할 거래들: 독일 로봇 AI Sereact $110M Series B(4/26), 법률 AI Manifest OS $60M Series A at $750M 밸류에이션(4월), 생성 미디어 인프라 Quantum Art $140M Series A 익스텐션(4/27).</p>

<h2>버블 신호와 기초공사 신호가 동시에 존재한다</h2>
<p>버블 신호: Case-Shiller PE 비율이 닷컴 이후 최고치 40 초과, S&P 500 상위 5개 종목이 지수의 30% 차지, AI 기업들의 수익성 부재에도 계속 올라가는 밸류에이션.</p>

<p>기초공사 신호: 1990년대 인터넷 버블과 달리 이번 AI 투자의 상당 부분이 인프라(데이터센터, 에너지, 반도체)에 집중되어 있다. 닷컴은 소프트웨어 아이디어에 돈을 넣었다. 지금은 물리적 인프라에 돈을 넣고 있다. 이 인프라는 AI 버블이 터져도 사라지지 않고, 다음 사이클의 기반이 된다.</p>

<h2>숨은 인사이트: 누가 인프라를 소유하는가가 다음 10년을 결정한다</h2>
<p>1990년대 인터넷 버블 때 수많은 닷컴 기업이 망했지만, Cisco와 Qualcomm의 네트워크 인프라는 살아남아 2000년대의 모바일 혁명을 가능하게 했다. 지금 데이터센터, 전력망, AI 칩 공장에 투자되는 자금이 그와 유사한 역할을 할 가능성이 있다.</p>

<p>개인 투자자 관점에서 이것이 의미하는 것은 명확하다. AI 소프트웨어 기업의 생존 여부를 예측하기 어렵다면, AI 인프라 기업에 주목하라. 누가 이기든 인프라는 필요하다. Nvidia가 AI 시대의 Cisco가 됐다면 — 다음 Cisco는 누구인가. 전력 회사인가, 냉각 시스템 업체인가, 아니면 아직 이름을 모르는 스타트업인가.</p>

<blockquote><p>투자 버블에서 돈을 버는 가장 확실한 방법은 골드러시 때 금을 캐는 것이 아니라 삽과 청바지를 파는 것이다. AI 시대의 삽은 무엇인가.</p></blockquote>

<hr/>

<div class="summary-box">
<h3>Q1 2026 VC 투자 주요 수치</h3>
<ul>
<li>글로벌 투자 총액: <strong>$300B</strong> (6,000개 스타트업, 전분기 대비 +150%)</li>
<li>미국 단독: 4월까지 <strong>$274B</strong> / 2,490건 라운드</li>
<li>섹터별 집중: AI 인프라 &gt; 피지컬 AI(로봇) &gt; 양자컴퓨팅 &gt; 법률·의료 AI</li>
<li>주목 딜: Sereact $110M (로봇), Manifest OS $60M at $750M val (법률 AI), Quantum Art $140M (미디어 인프라)</li>
<li>닷컴과의 차이: 이번 자금은 소프트웨어 아이디어가 아닌 <strong>물리적 인프라</strong>에 집중</li>
</ul>
</div>

<div class="think-box">
<h3>더 생각해볼 것들</h3>
<ol>
<li>AI 버블이 터진다면, 데이터센터와 전력망 인프라는 살아남는가? 닷컴 버블 당시 Cisco의 운명은?</li>
<li>"AI 시대의 삽"으로 볼 수 있는 기업이나 섹터는 무엇인가 — 지금 당신의 포트폴리오에 있는가?</li>
<li>로봇공학(Sereact 등)에 쏟아지는 자금은 "피지컬 AI" 시대가 얼마나 가까이 왔다는 신호인가?</li>
</ol>
</div>`,
      excerpt: 'Q1 2026 글로벌 VC 투자 $300B 신기록 — 버블 신호와 인프라 기초공사 신호가 동시에 존재한다. 닷컴 버블과의 결정적 차이, 그리고 다음 10년의 진짜 승자를 분석한다.',
      feature_image: null,
      published_at: '2026-04-13T10:00:00.000Z',
      reading_time: 7,
      tags: [{ id: '1', name: 'Funding', slug: 'funding' }],
      authors: [{ id: '1', name: 'TFF Editorial', slug: 'tff-editorial' }],
      primary_tag: { name: 'Funding', slug: 'funding' },
      primary_author: { name: 'TFF Editorial', slug: 'tff-editorial' },
    },
  ];

  return posts.slice(0, limit);
}
