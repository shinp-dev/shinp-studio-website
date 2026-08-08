# Shinp Studio

Shinp Studio の静的ブランドサイトです。HTML/CSS/JavaScript と Node.js の小さなビルドスクリプトで構成しています。

## Local development

```sh
npm run dev
```

## Validation and build

```sh
npm run check
npm run build
```

`npm run build` は公開対象を `dist/` に一度だけ生成し、公開ファイルの SHA-256 manifest と `provenance/provenance.json` を同じ成果物へ書き出します。

## GitHub Actions / Cloudflare Pages

Pull request では `check` と `build` だけを実行し、本番用 Secret、リリース時刻、デプロイ処理にはアクセスしません。

`main` への push では次の順に処理します。

1. check と build を一度だけ実行
2. `dist/` を GitHub Actions artifact として保存
3. deploy job で同じ artifact を取得し、manifest を検証
4. 取得した `dist/` に GitHub Artifact Attestation を発行
5. 再ビルドせず Cloudflare Pages の `shinp-studio` プロジェクトへデプロイ
6. `https://shinp-studio.com` の provenance が対象 commit と一致することを確認

必要な GitHub Actions Secrets:

- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`（対象アカウント限定、Cloudflare Pages: Edit）

同時に複数の `main` push が走った場合は、古い実行をキャンセルして最新 commit のデプロイを優先します。artifact の保持期間は 30 日です。

## Provenance timestamp

`releaseStartedAt` は本番リリース用 artifact の準備を開始した UTC 時刻です。デプロイ完了時刻を artifact 内へ後書きすると Attestation の対象が変わるため、`publishedAt` は意図的に `null` のままにしています。実際のデプロイ完了時刻は GitHub Actions の production environment 履歴と Cloudflare Pages の deployment 履歴で確認します。
