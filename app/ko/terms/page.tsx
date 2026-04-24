import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "이용약관 | TechFastForward",
  description: "TechFastForward 이용약관 — 사이트 이용에 관한 규정을 안내합니다.",
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://techfastforward.com/ko/terms",
    languages: { en: "https://techfastforward.com/terms", ko: "https://techfastforward.com/ko/terms" },
  },
};

const LAST_UPDATED = "2026년 4월 24일";

export default function KoTermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "var(--text-faint)" }}>법적 고지</p>
        <h1 className="text-3xl font-bold mb-3" style={{ color: "var(--text)" }}>이용약관</h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>최종 수정일: {LAST_UPDATED}</p>
      </div>

      <div className="space-y-8 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--text)" }}>1. 약관 동의</h2>
          <p>
            TechFastForward(&ldquo;사이트&rdquo;)에 접속하거나 이용함으로써 본 이용약관에 동의한 것으로 간주합니다.
            동의하지 않으실 경우 즉시 이용을 중단하십시오. 본 약관은 대한민국 법률의 적용을 받습니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--text)" }}>2. 콘텐츠 및 편집 방침</h2>
          <p>
            TechFastForward는 기술 및 AI 관련 편집 논평과 뉴스 요약을 제공합니다.
            모든 콘텐츠는 정보 제공 목적으로만 제공되며, 금융·법률·투자 자문을 구성하지 않습니다.
            정확성을 위해 노력하지만 완전성이나 적시성에 대한 보장은 하지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--text)" }}>3. 지식재산권</h2>
          <p>
            사이트의 모든 원본 콘텐츠(기사, 헤드라인, 디자인, 브랜딩 포함)는 DeblockX Labs의 소유이며
            저작권법의 보호를 받습니다. 개별 기사는 출처 표기 및 원문 링크를 포함하면 공유 가능합니다.
            서면 동의 없이 상당한 분량을 무단 복제하는 것은 금지됩니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--text)" }}>4. AI 생성 콘텐츠</h2>
          <p>
            일부 기사는 AI 도구의 지원을 받아 초안이 작성되며, 편집팀의 검토를 거칩니다.
            해당하는 경우 이를 명시합니다. AI 지원 콘텐츠도 인간 저작 콘텐츠와 동일한 사실 정확성 기준을 적용합니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--text)" }}>5. 뉴스레터 구독</h2>
          <p>
            뉴스레터를 구독하면 일간 이메일 수신에 동의한 것입니다. 모든 이메일의 수신 거부 링크를 통해
            언제든지 구독을 취소할 수 있습니다. 명시적 동의 없이 다른 목적으로 이메일을 사용하지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--text)" }}>6. 금지 행위</h2>
          <p>다음 행위를 금지합니다.</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>상업적 재배포 목적의 콘텐츠 대량 스크래핑</li>
            <li>자동화 도구를 이용한 서버 과부하 유발</li>
            <li>TechFastForward 콘텐츠를 본인 저작물로 허위 표시</li>
            <li>불법적 목적의 사이트 이용</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--text)" }}>7. 외부 링크</h2>
          <p>
            사이트에는 외부 웹사이트 링크가 포함될 수 있습니다. TechFastForward는 제3자 사이트의 콘텐츠,
            개인정보 처리 방침 또는 정확성에 대해 책임지지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--text)" }}>8. 보증 부인</h2>
          <p>
            사이트는 어떠한 보증도 없이 &ldquo;있는 그대로&rdquo; 제공됩니다. 무중단 접속이나 오류 없는 운영을
            보장하지 않습니다. 사이트 이용은 이용자의 책임 하에 이루어집니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--text)" }}>9. 책임 제한</h2>
          <p>
            관련 법률이 허용하는 최대 범위 내에서, DeblockX Labs는 사이트 이용 또는 콘텐츠 의존으로
            발생하는 간접적·우발적·결과적 손해에 대해 책임을 지지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--text)" }}>10. 약관 변경</h2>
          <p>
            당사는 언제든지 본 약관을 변경할 수 있습니다. 변경 후 사이트를 계속 이용하면 변경된 약관에
            동의한 것으로 간주합니다. 중요한 변경사항은 홈페이지 공지를 통해 안내합니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--text)" }}>11. 문의</h2>
          <p>
            약관 관련 문의:{" "}
            <a href="mailto:legal@techfastforward.com" className="underline" style={{ color: "var(--accent)" }}>
              legal@techfastforward.com
            </a>
            {" "}또는{" "}
            <Link href="/ko/privacy" className="underline" style={{ color: "var(--accent)" }}>개인정보처리방침</Link> 확인.
          </p>
        </section>

      </div>
    </div>
  );
}
