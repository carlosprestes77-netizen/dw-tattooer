# DEPLOY — DW Tattooer (instruções para a sessão com acesso ao repo dw-tattooer)

Você está numa sessão do Claude Code com acesso ao repositório
`carlosprestes77-netizen/dw-tattooer` (vazio) **e ao Google Drive (MCP)**.
Este projeto já está pronto, só faltam as IMAGENS (binárias) e o push.

## Passo 1 — Extrair este código na raiz do repositório
Os arquivos de código já vêm neste pacote. Garanta que ficaram na raiz do repo
(`package.json`, `app/`, `components/`, `lib/`, `public/`, etc.).

## Passo 2 — Baixar as 12 fotos originais do Google Drive
Pasta "Dw Tatto" (id `1uVO0ptE6NvjgswWNWir3rIJSGyPltCHS`). Baixe cada arquivo com
`mcp__Google_Drive__download_file_content`, extraia o campo `.content` (base64),
decodifique e salve em `/tmp/dw_src/` com o nome indicado:

| Salvar como | Drive file ID |
|---|---|
| IMG_7637.PNG | 1cNpnKqTqJ68OuVVb6-OP9kbWir7yKTuy |
| IMG_7638.PNG | 1oBI69tdaGWPigTPKqtHl9aOI0QFSWh_1 |
| IMG_7639.PNG | 1ioH1HyZ6tibcCCa0iRmFlc3nME0idQBl |
| IMG_7640.PNG | 12RkTSzINlZXLzI7agdBONfcOyuXk5ZBI |
| IMG_7641.PNG | 1v1RoCcCgV5q-7UaALiUjU71OZfZ0TQu7 |
| IMG_7642.PNG | 1YjU6C7PJFTrsL9sRJcUH3CmzEVzBI7Kx |
| IMG_7643.PNG | 1Rj1BFvbWaOWXXPCXKJwLXJKeTQP_zOBy |
| IMG_7644.PNG | 1MDg3kvcLv2jk7Ivjmbz8vclT6ZZHxb0g |
| IMG_7645.PNG | 1OqGsCJBjhzeu22LsNUMvxwaFdBZmYY4j |
| IMG_7646.PNG | 1yPi4lhK3T8VFGahqFD_LSwi2kr7rwKzI |
| IMG_7647.PNG | 12U3yfIFt9xCeR7Mz-_JuQSasXTwAykYM |
| IMG_7648.PNG | 1u7K2u60TKbG1MHYG4kVL3PTSSBZUULVT |

Exemplo por arquivo (o download grande salva em arquivo .txt — use jq):
```
jq -r '.content' <arquivo_resultado_do_download>.txt | base64 -d > /tmp/dw_src/IMG_7637.PNG
```

## Passo 3 — Gerar as imagens do site
```
pip install pillow   # se necessário
python3 scripts_regen_images.py
```
Isso cria: `public/portfolio/hero.jpg`, `public/artist/portrait.jpg`,
`public/portfolio/work-01..07.jpg`, `public/flashes/flash-01..04.png` e
`public/flashes/sim/flash-01..04.png`.

## Passo 4 — Build de verificação
```
npm install
npm run build      # deve gerar ./out sem erros
```

## Passo 5 — Commit e push para main
```
git add -A
git commit -m "DW Tattooer — site completo (realismo P&B, efeitos editoriais)"
git push -u origin main
```
> Use committer `noreply@anthropic.com` / `Claude` para o commit ficar verificado.

## Passo 6 — Ativar GitHub Pages
O workflow `.github/workflows/deploy.yml` já existe (deploy on push to main).
Diga ao usuário para ir em **Settings → Pages → Source: GitHub Actions**.
Site final: `https://carlosprestes77-netizen.github.io/dw-tattooer`

## Observações
- `basePath` já está `/dw-tattooer` (next.config.mjs). NÃO mude, ou quebra os links.
- `NEXT_PUBLIC_GA_ID` está vazio no workflow (sem analytics até o DW ter um ID GA4).
- Ainda são placeholder: depoimentos, estatísticas (+500, 8 anos), horários,
  nomes/locais dos trabalhos no portfólio. Ajuste em `lib/data.ts` quando quiser.
