# Shinp Studio

Shinp Studio の静的ブランドサイトです。依存パッケージを使わず、HTML/CSS/JavaScript と Node の小さなビルドスクリプトで構成しています。

## Local

```sh
npm run dev
```

## Build

```sh
npm run check
npm run build
```

`npm run build` は `dist/` を生成し、公開対象ファイルの SHA-256 manifest と `provenance/provenance.json` を同じ成果物に書き出します。GitHub Actions では `GITHUB_REPOSITORY`、`GITHUB_SHA`、`GITHUB_WORKFLOW`、`GITHUB_RUN_ID` を利用します。実際の公開時刻はデプロイ工程から `PUBLISHED_AT` を渡した場合だけ記録し、Artifact Attestation の検証 URL は `ATTESTATION_URL` がある場合だけ表示します。

製品 LP の URL や製品ビジュアルは、既存リポジトリに確認できる情報がないため推測していません。公開先が確定した時点で `index.html` の製品カードを接続してください。
