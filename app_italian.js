// app_italian.js
const express = require("express");
const app = express();

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

// データ定義：イタリアンブレインロッド図鑑
// 仕様書に基づき、id, name, description, imageURL を持つ
let characters = [
  { 
    id: 1, 
    name: "トゥララレロ・トゥラララ", 
    description: "青いスニーカーを履いた3本足のサメ, トゥントゥントゥンサフールに次ぐ勢いの人気キャラクター.", 
    imageURL: "541623-backgroundImage1.jpg" 
  },
  { 
    id: 2, 
    name: "トゥントゥントゥンサフール", 
    description: "人間のような長い手足に不気味な笑顔を浮かべ, 野球のバットを持つ木製の遠投系キャラクター.", 
    imageURL: "Tung_tung_tung_sahur.png"
  },
  { 
    id: 3, 
    name: "ボンバルディーロ・クロコディーロ", 
    description: "ワニの頭を持つ巨大な爆撃機.", 
    imageURL: "519410-backgroundImage1.png" 
  }
];

// ルート: 一覧へリダイレクト
app.get("/", (req, res) => {
  res.redirect('/characters');
});

// 一覧表示 (Read)
app.get("/characters", (req, res) => {
  res.render('italian_list', { data: characters });
});

// 新規登録フォーム表示
app.get("/characters/add", (req, res) => {
  res.render('italian_add');
});

// 新規登録処理 (Create)
app.post("/characters/add", (req, res) => {
  const maxId = characters.reduce((max, item) => item.id > max ? item.id : max, 0);
  const newItem = {
    id: maxId + 1,
    name: req.body.name,
    description: req.body.description,
    imageURL: req.body.imageURL
  };
  characters.push(newItem);
  res.redirect('/characters');
});

// 詳細表示 (Read)
// 配列のインデックスではなく、IDで検索するように実装
app.get("/characters/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const target = characters.find(item => item.id === id);
  
  if (target) {
    res.render('italian_detail', { data: target });
  } else {
    res.status(404).send("Character not found");
  }
});

// 編集フォーム表示
app.get("/characters/edit/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const target = characters.find(item => item.id === id);

  if (target) {
    res.render('italian_edit', { data: target });
  } else {
    res.status(404).send("Character not found");
  }
});

// 更新処理 (Update)
app.post("/characters/update/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = characters.findIndex(item => item.id === id);

  if (index !== -1) {
    characters[index].name = req.body.name;
    characters[index].description = req.body.description;
    characters[index].imageURL = req.body.imageURL;
    // 詳細ページへリダイレクト
    res.redirect('/characters/' + id);
  } else {
    res.status(404).send("Character not found");
  }
});

// 削除処理 (Delete)
app.get("/characters/delete/:id", (req, res) => {
  const id = parseInt(req.params.id);
  // 指定されたID以外の要素だけを残す（＝削除）
  characters = characters.filter(item => item.id !== id);
  res.redirect('/characters');
});

// サーバ起動
app.listen(8080, () => console.log("Example app listening on port 8080!"));
