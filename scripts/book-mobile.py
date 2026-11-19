"""Собирает телефонную вёрстку главы книги: узкая страница 95×165 мм, одна колонка.

Исходники книги не меняются: они копируются во временную папку, и шаблон
переключается на узкую страницу только в копии.

Запуск (вызывается из scripts/book-pages.mjs, руками не нужно):
    python book-mobile.py <папка исходников> <номер главы> <выходной.pdf>
Нужен Python-пакет typst (pip install typst).
"""
import os
import shutil
import sys
import tempfile

import typst

PAGE = '    width: 95mm,\n    height: 165mm,\n    margin: (x: 7mm, top: 13mm, bottom: 12mm),'


def main() -> None:
    src, number, out = sys.argv[1], int(sys.argv[2]), os.path.abspath(sys.argv[3])
    with tempfile.TemporaryDirectory() as tmp:
        work = os.path.join(tmp, "src")
        shutil.copytree(src, work)
        path = os.path.join(work, "template.typ")
        with open(path, encoding="utf-8") as fh:
            text = fh.read()

        replacements = [
            # одна колонка, как у одноколоночных глав книги
            ("#let book(chapter: 1, cols: 1, body) = {\n  let two = cols == 2",
             "#let book(chapter: 1, cols: 1, body) = {\n  let cols = 1\n  let two = false"),
            # узкая страница вместо A4
            ('    paper: "a4",\n    margin: if two { (inside: 24mm, outside: 18mm, top: 24mm, bottom: 22mm) }'
             ' else { (inside: 30mm, outside: 22mm, top: 27mm, bottom: 25mm) },', PAGE),
        ]
        for old, new in replacements:
            if old not in text:
                sys.exit(f"book-mobile: шаблон книги изменился, не нашёл фрагмент:\n{old}")
            text = text.replace(old, new, 1)
        with open(path, "w", encoding="utf-8") as fh:
            fh.write(text)

        os.chdir(work)
        typst.compile(f"chapter{number}.typ", output=out,
                      font_paths=["/System/Library/Fonts/Supplemental"], root=".")


if __name__ == "__main__":
    main()
