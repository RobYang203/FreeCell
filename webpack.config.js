var path = require('path'); //取得路徑
var webpack = require('webpack');

module.exports={
	entry:[//執行點
		"./src/main.jsx"
	],
	output:{//編譯輸出點
		path:path.join(__dirname,"dist"),//輸出路徑
		filename:"compiled.js",//編譯後的檔名
		publicPath:path.join(__dirname,"dist")//編譯後資源儲存的位置
	},
	resolve:{//當 import | require 時，會去指定目錄尋找 & 解析
		modules:[
			path.resolve(__dirname,'src'), 'node_modules'//尋找指定資料夾
		],
		extensions:['.js','jsx','css','scss']//尋找指定副檔名
	},
	module:{//針對不同的語言載入不同的模組 ex:babel、TypeScript，讓其可編譯後輸出成為直譯器所讀的檔案 .js
		rules:[
			{
				test:/\.(js|jsx)$/,//判斷是否為".js or jsx"
				loader:"babel-loader",//編譯器，把符合條件的檔案，編譯成指定樣式
				exclude:/node_modules/
			}
		]
	},
	devtool:'cheap-module-eval-source-map',
	plugins:[
		new webpack.HotModuleReplacementPlugin(),//在不更新頁面的情況下更新Module
		new webpack.ProvidePlugin({
			React:'react',
			RectDOM:'react-dom'
		})//建置時，碰到輸入的 key 直接 impot，指定 value
	]
};