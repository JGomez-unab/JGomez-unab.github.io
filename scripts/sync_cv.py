#!/usr/bin/env python3
"""Generate the public bibliography page from the private CV BibTeX file."""

from __future__ import annotations

import argparse
import html
import re
from collections import defaultdict
from pathlib import Path

import bibtexparser
from bibtexparser.bparser import BibTexParser


TYPE_ORDER = {"unpublished": 0, "article": 1, "inproceedings": 2, "thesis": 3}
TYPE_LABEL = {"unpublished": "W", "article": "J", "inproceedings": "C", "thesis": "T"}


def clean_latex(value: str) -> str:
    replacements = {
        r"\&": "&", r"\%": "%", r"\_": "_", "---": "—", "--": "–",
        r"\'a": "á", r"\'e": "é", r"\'i": "í", r"\'o": "ó", r"\'u": "ú",
        r'\"a': "ä", r'\"e': "ë", r'\"i': "ï", r'\"o': "ö", r'\"u': "ü",
        r"\~n": "ñ", r"\c{c}": "ç",
    }
    value = value.replace("{\\'a}", "á").replace("{\\'e}", "é").replace("{\\'i}", "í")
    value = value.replace("{\\'o}", "ó").replace("{\\'u}", "ú").replace("{\\~n}", "ñ")
    for source, target in replacements.items():
        value = value.replace(source, target)
    value = re.sub(r"\\(?:textit|emph|textbf|mathrm|url)\{([^{}]*)\}", r"\1", value)
    value = re.sub(r"\\[A-Za-z]+", "", value)
    value = value.replace("{", "").replace("}", "")
    return re.sub(r"\s+", " ", value).strip()


def first_author(authors: str) -> str:
    author = clean_latex(re.split(r"\s+and\s+", authors, maxsplit=1, flags=re.I)[0])
    if "," in author:
        family, given = [part.strip() for part in author.split(",", 1)]
    else:
        pieces = author.split()
        family, given = (pieces[-1], " ".join(pieces[:-1])) if pieces else ("", "")
    initials = " ".join(f"{part[0]}." for part in re.findall(r"[A-Za-zÁÉÍÓÚÑáéíóúñ]+", given) if part)
    return f"{initials} {family}".strip()


def group_year(entry_type: str, year: int) -> str:
    if entry_type == "article" and 2020 <= year <= 2022:
        return "2020–2022"
    if entry_type == "inproceedings" and 2022 <= year <= 2024:
        return "2022–2024"
    if entry_type == "inproceedings" and 2019 <= year <= 2020:
        return "2019–2020"
    return str(year) if year else "In progress"


def entry_html(entry: dict[str, str], label: str) -> str:
    title = html.escape(clean_latex(entry.get("title", "Untitled")))
    year = clean_latex(entry.get("year", "In progress"))
    venue = clean_latex(entry.get("journal") or entry.get("booktitle") or entry.get("note") or "Work in progress")
    lead = first_author(entry.get("author", ""))
    doi = clean_latex(entry.get("doi", "")).removeprefix("https://doi.org/")
    url = f"https://doi.org/{html.escape(doi, quote=True)}" if doi else clean_latex(entry.get("url", ""))
    tag = "a" if url else "article"
    href = f' href="{html.escape(url, quote=True)}"' if url else ""
    stable_key = re.sub(r"[^a-z0-9]+", "-", entry.get("ID", label).lower()).strip("-")
    entry_id = f' id="publication-{stable_key}"'
    arrow = "<b aria-hidden=\"true\">↗</b>" if url else "<b></b>"
    doi_line = f"<small>DOI: {html.escape(doi)}</small>" if doi else ""
    lead_line = f"<em>Lead author: {html.escape(lead)}</em>" if lead else ""
    return (
        f"  <{tag}{entry_id}{href} class=\"citation\"><span>{label}</span><div><h3>{title}</h3>"
        f"<p>{html.escape(venue)} · {html.escape(year)}</p>{lead_line}{doi_line}</div>{arrow}</{tag}>"
    )


def render_section(title: str, section_id: str, entries: list[dict[str, str]], css_class: str = "") -> str:
    if not entries:
        return ""
    by_year: dict[str, list[dict[str, str]]] = defaultdict(list)
    entry_type = entries[0]["ENTRYTYPE"].lower()
    for entry in entries:
        try:
            year = int(re.search(r"\d{4}", entry.get("year", "")).group())
        except (AttributeError, ValueError):
            year = 0
        by_year[group_year(entry_type, year)].append(entry)

    heading = f'<header class="conference-heading" id="{section_id}"><p class="overline">Research outputs</p><h2>{title}</h2></header>'
    blocks = []
    for year_label, year_entries in sorted(by_year.items(), key=lambda item: max([int(y) for y in re.findall(r"\d{4}", item[0])] or [0]), reverse=True):
        citations = "\n".join(entry_html(item, item["_label"]) for item in reversed(year_entries))
        blocks.append(f'<section class="publication-year {css_class}"><h2>{year_label}</h2><div class="bibliography">\n{citations}\n</div></section>')
    return heading + "\n" + "\n".join(blocks)


def render_in_progress(entries: list[dict[str, str]]) -> str:
    if not entries:
        return ""
    citations = "\n".join(entry_html(entry, entry["_label"]) for entry in entries)
    return f'''<dialog class="publication-modal" id="in-progress-dialog" aria-labelledby="in-progress-title">
  <button class="publication-modal-close" type="button" aria-label="Close work in progress">Close ×</button>
  <header><p class="overline">Current pipeline</p><h2 id="in-progress-title">Work in progress</h2><p>Listed in the order maintained in the academic CV bibliography.</p></header>
  <div class="bibliography">{citations}</div>
</dialog>'''


def build_page(entries: list[dict[str, str]]) -> str:
    accepted = [entry for entry in entries if entry.get("ENTRYTYPE", "").lower() in TYPE_ORDER]
    counters: dict[str, int] = defaultdict(int)
    for entry in accepted:
        kind = entry["ENTRYTYPE"].lower()
        counters[kind] += 1
        entry["_label"] = f"{TYPE_LABEL[kind]}{counters[kind]}"
    grouped = {kind: [e for e in accepted if e["ENTRYTYPE"].lower() == kind] for kind in TYPE_ORDER}
    sections = "\n".join(filter(None, [
        render_in_progress(grouped["unpublished"]),
        render_section("Journal articles", "journals", grouped["article"]),
        render_section("Conferences", "conferences", grouped["inproceedings"], "conference-year"),
        render_section("Thesis", "thesis", grouped["thesis"]),
    ]))
    return f'''<!doctype html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="Journal articles, conference papers, and research outputs by Juan Sebastián Gómez Quintero."><title>Publications | Juan Sebastián Gómez Quintero</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Source+Serif+4:opsz,wght@8..60,400;8..60,500&display=swap" rel="stylesheet"><link rel="stylesheet" href="styles.css?v=site-26"></head>
<body><a class="skip-link" href="#main">Skip to content</a><header class="site-header"><a class="identity" href="index.html"><span class="identity-text"><strong>Juan Sebastián Gómez Quintero</strong><small>Cyberphysical Energy Systems</small></span></a><button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button><nav id="site-nav" aria-label="Main navigation"><a href="index.html">Home</a><a href="team.html">Team</a><a href="projects.html">Projects</a><a href="code.html">Code</a><a class="active" href="publications.html">Publications</a><a href="teaching.html">Teaching</a></nav></header>
<main id="main" class="publications-page"><header class="listing-intro"><p class="overline">Research outputs</p><h1>Publications</h1><p>Generated from the bibliography maintained with my academic CV. Full citation records are also available through <a href="https://scholar.google.com/" target="_blank" rel="noreferrer">Google Scholar ↗</a> and <a href="https://orcid.org/0000-0002-6507-1462" target="_blank" rel="noreferrer">ORCID ↗</a>.</p></header>
<nav class="publication-index" aria-label="Publication sections"><span>On this page</span><a href="index.html">Home</a><a href="#in-progress-dialog" data-dialog-target="in-progress-dialog">In progress</a><a href="#journals">Journals</a><a href="#conferences">Conferences</a><a href="#thesis">Thesis</a></nav>
{sections}
</main><footer><p>Energy Transformation Center · Faculty of Engineering · Universidad Andrés Bello</p><p>juan.gomez@unab.cl</p><p>Last updated <span id="updated-year"></span></p></footer><script src="script.js?v=site-26"></script></body></html>
'''


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--bib", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    args = parser.parse_args()
    bib_parser = BibTexParser(common_strings=True)
    bib_parser.ignore_nonstandard_types = False
    with args.bib.open(encoding="utf-8") as bib_file:
        database = bibtexparser.load(bib_file, parser=bib_parser)
    args.output.write_text(build_page(database.entries), encoding="utf-8")


if __name__ == "__main__":
    main()
