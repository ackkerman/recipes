#!/usr/bin/env tsx

// npx tsx package/scripts/batch_estimate_time_calories.ts

import * as fs from 'fs/promises';
import * as path from 'path';
import { spawn } from 'child_process';

// 対象ディレクトリ
const TARGET_DIR = '../docs/recipes/';

async function main() {
  const fullPath = path.resolve(TARGET_DIR);
  const files = await fs.readdir(fullPath);

  const mdFiles = files.filter(file => file.endsWith('.md'));

  for (const file of mdFiles) {
    const inputPath = path.join(fullPath, file);
    const outputPath = inputPath; // 上書き保存

    console.log(`処理中: ${inputPath}`);

    await new Promise<void>((resolve, reject) => {
      const proc = spawn('npx', [
        'tsx',
        './scripts/estimate_time_calories.ts',
        inputPath,
        '--output_file=' + outputPath,
      ], {
        stdio: 'inherit',
      });

      proc.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`${file} の推定に失敗 (exit code ${code})`));
        }
      });
    });
  }

  console.log('✅ 全ファイルの処理が完了しました');
}

main().catch((err) => {
  console.error('エラー:', err);
  process.exit(1);
});
