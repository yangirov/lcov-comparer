# lcov-comparer

[![npm version](https://badge.fury.io/js/lcov-comparer.svg)](https://www.npmjs.com/package/lcov-comparer)
[![license](https://img.shields.io/npm/l/lcov-comparer.svg)](./LICENSE)

A CLI tool to compare code coverage between two `lcov.info` reports and generate readable diffs across:

- Statements
- Branches
- Functions
- Lines

Supports multiple output formats and thresholds, ideal for CI and review workflows.

## 🚀 Usage

```sh
npx lcov-comparer <coverage-old.info> <coverage-new.info> [options]
```

## 🛠 Options

| Flag                      | Description                                                             | Default           |
| ------------------------- | ----------------------------------------------------------------------- | ----------------- |
| `--formats`               | Comma-separated list of formats: `html`, `json`, `csv`, `md`, `console` | `html`            |
| `--out-dir`               | Directory to output report files                                        | Current directory |
| `--threshold <n>`         | Only include files where any metric delta ≥ `n%`                        | `null` (disabled) |
| `--max-coverage-drop <n>` | Exit with code 1 if any average delta is below -n%                      | `null` (disabled) |
| `--summary`               | Print total coverage delta summary to stdout                            | `false`           |

## 📦 Format Support

Works with `lcov.info` files produced by:

- `vitest --coverage`
- `jest --coverage`
- `nyc`

## 📁 Output

Output is saved into the specified `--out-dir` (or current folder by default), one file per format.

For example:

```sh
npx lcov-comparer a.info b.info --formats html,json,md --out-dir ./coverage-diff
```

Will generate:

```
./coverage-diff/
  ├── coverage-diff.html
  ├── coverage-diff.json
  └── coverage-diff.md
```

## 📊 Example table

Files are sorted by the most significant delta across all metrics.

| File       | Statements    | Δ      | Branches       | Δ      | Functions       | Δ      | Lines         | Δ      |
| ---------- | ------------- | ------ | -------------- | ------ | --------------- | ------ | ------------- | ------ |
| src/app.ts | 70.0% → 90.0% | +20.0% | 40.0% → 80.0%  | +40.0% | 50.0% → 100.0%  | +50.0% | 70.0% → 90.0% | +20.0% |
| helpers.ts | 90.0% → 70.0% | −20.0% | 100.0% → 50.0% | −50.0% | 100.0% → 100.0% | +0.0%  | 95.0% → 70.0% | −25.0% |

## 💡 Tip for CI

Use `--summary` for console output, and `--max-coverage-drop` to break pipeline if coverage drops too much.

```sh
npx lcov-comparer old.info new.info --summary --max-coverage-drop 5
```
