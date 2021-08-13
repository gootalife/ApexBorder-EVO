# ApexBorder-EVO
Apex Ledgendsのプレデターのボーダーを可視化するシステムです。
## 環境変数(ルートに.envファイルを配置)
例
```
NODE_ENV=production # デプロイ環境
DB_HOST=db # DBサービス名
DB_PORT=5432 # DBポート
DB_USER=admin # DBユーザ
DB_PASSWORD=password # DBパスワード
DB_DATABASE=apex_border # DB名

SEASON=10sp1 # シーズン
BORDER=500 # ボーダーの人数

TZ=Asia/Tokyo # タイムゾーン
```

## Docker
```
docker-comopose up -d # 起動

docker cp db:/var/lib/postgresql/data {xxx} # DBデータ取得
```
