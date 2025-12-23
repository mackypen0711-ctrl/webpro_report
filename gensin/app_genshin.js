// app_genshin.js
const express = require("express");
const app = express();

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

// データ定義：原神キャラクター（レアリティを追加）
let characters = [
  { id: 1, name: "鍾離", rarity: 5, element: "岩", weapon: "長柄武器", description: "往生堂の客卿。正体は岩神モラクス。" },
  { id: 2, name: "雷電将軍", rarity: 5, element: "雷", weapon: "長柄武器", description: "稲妻を統べる最高神。永遠を追い求めている。" },
  { id: 3, name: "ウェンティ", rarity: 5, element: "風", weapon: "弓", description: "自由な吟遊詩人。正体は風神バルバトス。" },
  { id: 4, name: "ナヒーダ", rarity: 5, element: "草", weapon: "法器", description: "スメールの知恵の神。クラクサナリデビ。" },
  { id: 5, name: "フリーナ", rarity: 5, element: "水", weapon: "片手剣", description: "フォンテーヌの劇場のスター。かつての水神。" },
  { id: 6, name: "ディルック", rarity: 5, element: "炎", weapon: "両手剣", description: "モンドの闇の英雄。アカツキワイナリーのオーナー。" },
  { id: 7, name: "刻晴", rarity: 5, element: "雷", weapon: "片手剣", description: "璃月七星の「玉衡」。実務重視の仕事人間。" },
  { id: 8, name: "アンバー", rarity: 4, element: "炎", weapon: "弓", description: "西風騎士団の偵察騎士。元気いっぱいの少女。" },
  { id: 9, name: "ガイア", rarity: 4, element: "氷", weapon: "片手剣", description: "西風騎士団の騎兵隊隊長。" },
  { id: 10, name: "リサ", rarity: 4, element: "雷", weapon: "法器", description: "西風騎士団の図書館司書。知的でミステリアス。" },
  { id: 11, name: "バーバラ", rarity: 4, element: "水", weapon: "法器", description: "西風教会の祈祷牧師。モンドのアイドル。" },
  { id: 12, name: "香菱", rarity: 4, element: "炎", weapon: "長柄武器", description: "万民堂の新人シェフ。料理の腕はピカイチ。" },
  { id: 13, name: "行秋", rarity: 4, element: "水", weapon: "片手剣", description: "飛雲商会の次男坊。本を愛する義侠の士。" },
  { id: 14, name: "ベネット", rarity: 4, element: "炎", weapon: "片手剣", description: "不運な冒険者。「ベニー冒険団」の団長。" },
  { id: 15, name: "フィッシュル", rarity: 4, element: "雷", weapon: "弓", description: "断罪の皇女を自称する謎の少女。" }
];

app.get("/", (req, res) => {
  res.redirect('/genshin');
});

// 一覧表示
app.get("/genshin", (req, res) => {
  res.render('genshin_list', { data: characters });
});

// ▼▼▼ 新機能：ガチャを引く ▼▼▼
app.get("/genshin/gacha", (req, res) => {
  // データが空の場合はエラーを避けるため一覧に戻す
  if (characters.length === 0) {
    return res.redirect('/genshin');
  }
  // ランダムなインデックスを生成
  const randomIndex = Math.floor(Math.random() * characters.length);
  // 選ばれたキャラクター
  const resultCharacter = characters[randomIndex];
  
  // 結果画面を表示
  res.render('genshin_gacha_result', { data: resultCharacter });
});
// ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

app.get("/genshin/add", (req, res) => {
  res.render('genshin_add');
});

// 新規登録（レアリティ追加）
app.post("/genshin/add", (req, res) => {
  const maxId = characters.length > 0 ? characters.reduce((max, item) => item.id > max ? item.id : max, 0) : 0;
  characters.push({
    id: maxId + 1,
    name: req.body.name,
    rarity: parseInt(req.body.rarity), // 数値として保存
    element: req.body.element,
    weapon: req.body.weapon,
    description: req.body.description
  });
  res.redirect('/genshin');
});

// 詳細表示（カラー機能は削除）
app.get("/genshin/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const target = characters.find(item => item.id === id);
  if (target) res.render('genshin_detail', { data: target });
  else res.status(404).send("Not Found");
});

// 編集フォーム
app.get("/genshin/edit/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const target = characters.find(item => item.id === id);
  if (target) res.render('genshin_edit', { data: target });
  else res.status(404).send("Not Found");
});

// 更新（レアリティ追加）
app.post("/genshin/update/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = characters.findIndex(item => item.id === id);
  if (index !== -1) {
    characters[index] = {
      id: id,
      name: req.body.name,
      rarity: parseInt(req.body.rarity), // 数値として保存
      element: req.body.element,
      weapon: req.body.weapon,
      description: req.body.description
    };
    res.redirect('/genshin/' + id);
  } else {
    res.status(404).send("Not Found");
  }
});

// 削除
app.get("/genshin/delete/:id", (req, res) => {
  const id = parseInt(req.params.id);
  characters = characters.filter(item => item.id !== id);
  res.redirect('/genshin');
});

app.listen(8080, () => console.log("Genshin app listening on port 8080!"));