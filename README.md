<img src="docs/public/banner.jpg" style="width:100%;">

# recipes

[Demo](https://recipes-alpha-ten.vercel.app/)


```diff bash
# 🍳 レシピファイルの作成
$ pnpm run create-recipe <website_or_image_url>


---

# 実行サンプル(docs/recipes/豚汁.md)
$ pnpm run create-recipe https://mi-journey.jp/foodie/36632/ --output_dir=docs/recipes/

✅ Scraped text: 7452 characters
✅ Recipe generated: recipe.md

+ ---
+ title: 豚汁
+ servings: 4
+ source: 'https://mi-journey.jp/foodie/36632/'
+ tags:
+   - 時短レシピ
+   - 汁物
+ image: 'https://mi-journey.jp/foodie/wp-content/uploads/2017/04/1704_16_tonjiru_01.jpg'
+ time: 30
+ calories: 350
+ ---
+ 
+ # 🍳 豚汁
+ 
+ ## 📝 備考
+ 煮込まずに蒸し煮にすることで野菜の甘みを引き出したレシピです。野菜の皮をむかずに使うことで旨みを逃さず、炒めてから蒸し煮にすることで味をしっかりと閉じ込めます。
+ 
+ ## 🛒 材料（4人前）
+ | 材料 | 分量 | 備考 |
+ |:---|:---|:---|
+ | 豚バラ薄切り肉 | 150g | - |
+ | 大根 | 1/2本 | 皮を薄くむく |
+ | にんじん | 1本 | - |
+ ... # 省略
```


```bash
# 静的サイトのビルド
pnpm run dev
pnpm run build
pnpm run preview

# レシピの更新
pnpm run update
```