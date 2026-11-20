"""공통표준(용어/단어/도메인) 조회 도구.

사용법 (프로젝트 루트에서):
  python -X utf8 docs/standards/std.py term 품목        # 용어 검색 (한글명 또는 영문약어, 부분일치)
  python -X utf8 docs/standards/std.py word 등록        # 단어 검색
  python -X utf8 docs/standards/std.py domain 명V       # 도메인 검색
  python -X utf8 docs/standards/std.py make 등록자아이디  # 용어 확인, 없으면 단어 조합으로 신규 용어 제안
  옵션 --all : 폐기된 항목도 표시

원본: C:/SeanDad/10.Excel/TB_용어.xlsx, TB_단어.xlsx, TB_도메인.xlsx
CSV 갱신: python -X utf8 docs/standards/std.py export <엑셀폴더>
"""
import csv
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
FILES = {"terms": "TB_용어.xlsx", "words": "TB_단어.xlsx", "domains": "TB_도메인.xlsx"}


def load(name, include_discarded=False):
    with open(os.path.join(HERE, name + ".csv"), encoding="utf-8") as fp:
        rows = list(csv.DictReader(fp))
    if include_discarded:
        return rows
    return [r for r in rows if "폐기" not in r["제정차수_제정연월"] or "폐기후" in r["제정차수_제정연월"]]


def one_line(s):
    return " ".join((s or "").split())


def search(kind, keyword, include_discarded):
    keyword_up = keyword.upper()
    if kind == "term":
        rows = load("terms", include_discarded)
        hits = [r for r in rows if keyword in r["공통표준용어명"] or keyword_up in r["공통표준용어영문약어명"]]
        hits.sort(key=lambda r: (r["공통표준용어명"] != keyword, len(r["공통표준용어명"])))
        for r in hits[:50]:
            print(f'{r["공통표준용어명"]}\t{r["공통표준용어영문약어명"]}\t{r["공통표준도메인명"]}'
                  f'\t허용값={one_line(r["허용값"])}\t[{one_line(r["제정차수_제정연월"])}]')
    elif kind == "word":
        rows = load("words", include_discarded)
        hits = [r for r in rows
                if keyword in r["공통표준단어명"] or keyword_up == r["공통표준단어영문약어명"]
                or keyword in r["이음동의어 목록"] or keyword in r["금칙어 목록"]]
        hits.sort(key=lambda r: (r["공통표준단어명"] != keyword, len(r["공통표준단어명"])))
        for r in hits[:50]:
            print(f'{r["공통표준단어명"]}\t{r["공통표준단어영문약어명"]}\t형식단어={r["형식단어 여부"]}'
                  f'\t도메인분류={r["공통표준도메인분류명"]}\t동의어={one_line(r["이음동의어 목록"])}'
                  f'\t금칙어={one_line(r["금칙어 목록"])}')
    elif kind == "domain":
        rows = load("domains", include_discarded)
        hits = [r for r in rows if keyword in r["공통표준도메인명"] or keyword in r["공통표준도메인분류명"]]
        for r in hits:
            size = r["데이터길이"] + (f',{r["데이터소수점길이"]}' if r["데이터소수점길이"] else "")
            dtype = f'{r["데이터타입"]}({size})' if size else r["데이터타입"]
            print(f'{r["공통표준도메인명"]}\t분류={r["공통표준도메인분류명"]}\t{dtype}'
                  f'\t허용값={one_line(r["허용값"])}')
    print(f"-- {len(hits)}건" + (" (상위 50건만 표시)" if len(hits) > 50 else ""))


def make(term_name):
    terms = load("terms")
    exact = [r for r in terms if r["공통표준용어명"] == term_name]
    if exact:
        for r in exact:
            print(f'[표준용어] {r["공통표준용어명"]} = {r["공통표준용어영문약어명"]} / 도메인 {r["공통표준도메인명"]}')
        return

    words = load("words")
    by_name = {r["공통표준단어명"]: r for r in words}
    # 이음동의어·금칙어 → 표준단어 매핑
    alias = {}
    for r in words:
        for col, label in (("이음동의어 목록", "이음동의어"), ("금칙어 목록", "금칙어")):
            for a in r[col].replace("\n", ",").split(","):
                a = a.strip()
                if a and a != "-":
                    alias[a] = (r["공통표준단어명"], label)

    # 단어 수가 가장 적은 분해 (DP)
    n = len(term_name)
    best = [None] * (n + 1)
    best[0] = []
    for i in range(n):
        if best[i] is None:
            continue
        for j in range(i + 1, n + 1):
            piece = term_name[i:j]
            if piece in by_name or piece in alias:
                cand = best[i] + [piece]
                if best[j] is None or len(cand) < len(best[j]):
                    best[j] = cand
    if best[n] is None:
        covered = max(i for i in range(n + 1) if best[i] is not None)
        print(f"[분해 실패] '{term_name[covered:]}' 부분이 표준단어에 없습니다. → 신규 단어 등록 필요")
        return

    abbrs, problems = [], []
    for piece in best[n]:
        if piece in by_name:
            abbrs.append(by_name[piece]["공통표준단어영문약어명"])
        else:
            std, label = alias[piece]
            problems.append(f"'{piece}'은(는) {label} → 표준단어 '{std}' 사용")
            abbrs.append(by_name[std]["공통표준단어영문약어명"])

    last = by_name.get(best[n][-1]) or by_name[alias[best[n][-1]][0]]
    print(f'[신규용어 제안] {term_name} = {"_".join(abbrs)}  (단어: {" + ".join(best[n])})')
    for p in problems:
        print("  ! " + p)
    if last["형식단어 여부"] != "Y":
        print(f"  ! 마지막 단어 '{last['공통표준단어명']}'이(가) 형식단어가 아닙니다. 용어는 형식단어(명, 번호, 일시, 여부 등)로 끝나야 합니다.")
        return
    group = last["공통표준도메인분류명"]
    doms = [r["공통표준도메인명"] for r in load("domains") if r["공통표준도메인분류명"] == group]
    print(f"  도메인 후보(분류 '{group}'): {', '.join(doms) if doms else '없음 - 도메인 확인 필요'}")


def export(src_dir):
    import openpyxl  # 필요할 때만

    for key, fname in FILES.items():
        wb = openpyxl.load_workbook(os.path.join(src_dir, fname), read_only=True, data_only=True)
        rows = list(wb.worksheets[0].iter_rows(values_only=True))
        ncol = max(i + 1 for r in rows for i, v in enumerate(r) if v not in (None, ""))
        rows = [["" if v is None else str(v).replace("\r", "") for v in r[:ncol]]
                for r in rows if any(v not in (None, "") for v in r)]
        with open(os.path.join(HERE, key + ".csv"), "w", newline="", encoding="utf-8") as fp:
            csv.writer(fp).writerows(rows)
        print(f"{key}.csv: {len(rows) - 1}건")


def main():
    args = [a for a in sys.argv[1:] if a != "--all"]
    include_discarded = "--all" in sys.argv
    if len(args) != 2 or args[0] not in ("term", "word", "domain", "make", "export"):
        print(__doc__)
        sys.exit(1)
    cmd, value = args
    if cmd == "make":
        make(value)
    elif cmd == "export":
        export(value)
    else:
        search(cmd, value, include_discarded)


if __name__ == "__main__":
    main()
