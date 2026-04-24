import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "개인정보처리방침 | TechFastForward",
  description: "TechFastForward 개인정보처리방침 — 개인정보 수집, 이용, 보호 방침을 안내합니다.",
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://techfastforward.com/ko/privacy",
    languages: { en: "https://techfastforward.com/privacy", ko: "https://techfastforward.com/ko/privacy" },
  },
};

const LAST_UPDATED = "2026년 4월 24일";

export default function KoPrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "var(--text-faint)" }}>법적 고지</p>
        <h1 className="text-3xl font-bold mb-3" style={{ color: "var(--text)" }}>개인정보처리방침</h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>최종 수정일: {LAST_UPDATED}</p>
      </div>

      <div className="space-y-8 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--text)" }}>1. 운영자 정보</h2>
          <p>
            TechFastForward(&ldquo;당사&rdquo;)는 DeblockX Labs가 운영하는 AI 및 기술 인텔리전스 미디어입니다.
            개인정보 관련 문의는{" "}
            <a href="mailto:privacy@techfastforward.com" className="underline" style={{ color: "var(--accent)" }}>
              privacy@techfastforward.com
            </a>
            으로 연락하십시오.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--text)" }}>2. 수집하는 개인정보</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>이메일 주소</strong> — 뉴스레터 구독 시 수집합니다.</li>
            <li><strong>이용 데이터</strong> — 방문 페이지, 브라우저 정보, 기기 정보를 Vercel Analytics를 통해 수집합니다(쿠키 없음, 개인 식별 불가).</li>
            <li><strong>IP 주소</strong> — 보안 목적으로 인프라에 일시적으로 기록됩니다.</li>
          </ul>
          <p className="mt-3">당사는 결제 정보를 수집하지 않으며, 제3자 광고 추적기를 사용하지 않고, 개인정보를 판매하지 않습니다.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--text)" }}>3. 개인정보 이용 목적</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>구독자에게 TechFastForward 일간 뉴스레터 발송</li>
            <li>콘텐츠 품질 개선을 위한 집계 독자 현황 파악</li>
            <li>어뷰징 탐지 및 방지</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--text)" }}>4. 제3자 제공</h2>
          <p>당사는 서비스 운영에 필수적인 협력사에 한해 데이터를 제공하며, 모두 데이터 처리 계약을 체결하고 있습니다.</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Supabase</strong> — 데이터베이스(구독자 목록), EU 내 호스팅</li>
            <li><strong>Vercel</strong> — 호스팅 및 분석, EU 규정 준수</li>
          </ul>
          <p className="mt-3">제3자에게 개인정보를 판매, 임대, 거래하지 않습니다.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--text)" }}>5. 쿠키 사용</h2>
          <p>
            TechFastForward는 광고 또는 추적 쿠키를 사용하지 않습니다.
            다크/라이트 모드 설정은 브라우저의 <code>localStorage</code>에만 저장되며, 외부로 전송되지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--text)" }}>6. 이용자 권리</h2>
          <p>개인정보보호법 및 GDPR에 따라 이용자는 다음 권리를 보유합니다.</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>보유 개인정보 열람 요청</li>
            <li>개인정보 정정 또는 삭제 요청</li>
            <li>뉴스레터 수신 동의 철회(이메일 내 수신 거부 링크 이용)</li>
            <li>개인정보 보호 감독기관에 민원 제기</li>
          </ul>
          <p className="mt-3">
            권리 행사는{" "}
            <a href="mailto:privacy@techfastforward.com" className="underline" style={{ color: "var(--accent)" }}>
              privacy@techfastforward.com
            </a>
            으로 요청하시면 30일 이내에 답변드립니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--text)" }}>7. 보유 기간</h2>
          <p>
            구독자 이메일은 수신 거부 시까지 보관합니다. 서버 로그는 30일 후 삭제됩니다.
            분석 데이터는 집계·익명화 처리되어 개인 기록은 저장되지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--text)" }}>8. 방침 변경</h2>
          <p>
            본 방침은 수시로 업데이트될 수 있습니다. 중요한 변경사항은 홈페이지 공지를 통해 안내합니다.
            변경 후 사이트를 계속 이용하면 변경된 방침에 동의한 것으로 간주합니다.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold mb-3" style={{ color: "var(--text)" }}>9. 문의</h2>
          <p>
            개인정보 관련 문의:{" "}
            <a href="mailto:privacy@techfastforward.com" className="underline" style={{ color: "var(--accent)" }}>
              privacy@techfastforward.com
            </a>
            {" "}또는{" "}
            <Link href="/ko/terms" className="underline" style={{ color: "var(--accent)" }}>이용약관</Link> 확인.
          </p>
        </section>

      </div>
    </div>
  );
}
