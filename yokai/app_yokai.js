const express = require("express");
const app = express();

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

// データ定義：妖怪ウォッチ（15匹に増量！）
let yokais = [
  { id: 1, name: "ジバニャン", tribe: "プリチー", description: "車にひかれて死んだ地縛霊。チョコボーが大好き。" },
  { id: 2, name: "コマさん", tribe: "プリチー", description: "田舎から都会に出てきた狛犬の妖怪。ソフトクリームが好き。" },
  { id: 3, name: "ブシニャン", tribe: "イサマシ", description: "カツオ節を食べて変身した伝説の妖怪。レジェンド妖怪。" },
  { id: 4, name: "メラメライオン", tribe: "イサマシ", description: "取り憑かれると熱血になる。いつでもやる気満々。" },
  { id: 5, name: "ウィスパー", tribe: "ニョロロン", description: "妖怪執事。知ったかぶりをするが、実は何も知らない。" },
  { id: 6, name: "USAピョン", tribe: "ウスラカゲ", description: "宇宙開発機関にいたウサギの妖怪。ベイダーモードに変身する。" },
  { id: 7, name: "ロボニャン", tribe: "ゴーケツ", description: "未来から来たロボットのジバニャン。体内はチョコボー工場。" },
  { id: 8, name: "オロチ", tribe: "ニョロロン", description: "自らのオーラで作り出した龍のマフラーを巻いているエリート妖怪。" },
  { id: 9, name: "キュウビ", tribe: "フシギ", description: "人の心を読み取る力を持つ、九つの尾を持つキツネの妖怪。" },
  { id: 10, name: "じんめん犬", tribe: "ブキミー", description: "リストラされたサラリーマンと犬が混ざってしまった妖怪。" },
  { id: 11, name: "ツチノコ", tribe: "ニョロロン", description: "見つけると幸運になれると言われるレアな妖怪。" },
  { id: 12, name: "ヒキコウモリ", tribe: "ウスラカゲ", description: "クローゼットや暗い場所に引きこもっている妖怪。" },
  { id: 13, name: "イケメン犬", tribe: "ブキミー", description: "取り憑かれるとイケメンになれるが、中身は変わらない。" },
  { id: 14, name: "ひも爺", tribe: "ポカポカ", description: "取り憑かれるとお腹が空いて力がでなくなるお爺ちゃん妖怪。" },
  { id: 15, name: "ノガッパ", tribe: "プリチー", description: "水筒を持ち歩いているカッパ。お寿司が好物。" }
];

app.get("/", (req, res) => {
  res.redirect('/yokai');
});

// 一覧表示 (Filtering機能付き)
app.get("/yokai", (req, res) => {
  const tribeFilter = req.query.tribe;
  let displayData = yokais;

  if (tribeFilter) {
    displayData = yokais.filter(item => item.tribe === tribeFilter);
  }

  res.render('yokai_list', { data: displayData, currentTribe: tribeFilter });
});

app.get("/yokai/add", (req, res) => {
  res.render('yokai_add');
});

// 新規登録処理
app.post("/yokai/add", (req, res) => {
  // IDの最大値を探して+1する（データが空の場合も考慮）
  const maxId = yokais.length > 0 ? yokais.reduce((max, item) => item.id > max ? item.id : max, 0) : 0;
  yokais.push({
    id: maxId + 1,
    name: req.body.name,
    tribe: req.body.tribe,
    description: req.body.description
  });
  res.redirect('/yokai');
});

// 詳細表示
app.get("/yokai/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const target = yokais.find(item => item.id === id);
  if (target) res.render('yokai_detail', { data: target });
  else res.status(404).send("Not Found");
});

// 編集フォーム表示
app.get("/yokai/edit/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const target = yokais.find(item => item.id === id);
  if (target) res.render('yokai_edit', { data: target });
  else res.status(404).send("Not Found");
});

// 更新処理
app.post("/yokai/update/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = yokais.findIndex(item => item.id === id);
  if (index !== -1) {
    yokais[index] = {
      id: id,
      name: req.body.name,
      tribe: req.body.tribe,
      description: req.body.description
    };
    res.redirect('/yokai/' + id);
  } else {
    res.status(404).send("Not Found");
  }
});

// 削除
app.get("/yokai/delete/:id", (req, res) => {
  const id = parseInt(req.params.id);
  yokais = yokais.filter(item => item.id !== id);
  res.redirect('/yokai');
});

app.listen(8080, () => console.log("Yokai app listening on port 8080!"));