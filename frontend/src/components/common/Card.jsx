import styles from './Card.module.css';

/**
 * 카드 (상세·등록 화면의 섹션 단위)
 * title: 섹션 제목, actions: 제목줄 오른쪽 버튼
 * fields: 본문을 2열 라벨-값(FormField) 구조로 배치
 * meta: 하단 회색 작은 글씨 (등록일시·수정일시 등)
 * footerStart / footer: 하단 버튼 영역 왼쪽 / 오른쪽 (주요 버튼은 footer 의 가장 오른쪽)
 */
export default function Card({ title, actions, fields = false, meta, footerStart, footer, children }) {
  return (
    <section className={styles.card}>
      {(title || actions) && (
        <header className={styles.head}>
          {title && <h2 className={styles.title}>{title}</h2>}
          {actions && <div className={styles.actions}>{actions}</div>}
        </header>
      )}
      <div className={fields ? styles.fields : styles.body}>{children}</div>
      {meta && <p className={styles.meta}>{meta}</p>}
      {(footerStart || footer) && (
        <footer className={styles.footer}>
          <div className={styles.actions}>{footerStart}</div>
          <div className={styles.actions}>{footer}</div>
        </footer>
      )}
    </section>
  );
}
