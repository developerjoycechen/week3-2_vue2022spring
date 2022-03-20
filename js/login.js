//使用 ESM 方式引入 vue
import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.31/vue.esm-browser.min.js';

// 將 api 網址宣告變數方便重複使用
const site = 'https://vue3-course-api.hexschool.io/v2';

// 進入 vue 結構模式
const app = createApp({
    data(){
        //回傳帳密資料
        return { 
            user:{
                username:'',
                password:'',
            },
        }
    },
    methods:{
        login(){
            const url = `${site}/admin/signin`;

            //發送帳密驗證資料請求並登入
            axios.post(url, this.user)
                // 發送請求要資料，取得資料回傳時，使用 then 來接收成功的結果
                .then(res => {
                    // 取得帳密金鑰和有效時間
                    const { token, expired } = res.data;
                    // console.log(token, expired); 此行檢查是否有正確取出帳密資料
                    // document.cookie 為儲存 cookie 的方法, 此為儲存 token 和 expired，hexToken 名稱可以自定義, new Date 為轉換為 unix timestamp 的格式
                    document.cookie = `hexToken=${token}; expires=${new Date(expired)};`;
                    //登入成功後轉址到新頁面
                    window.location = 'products.html';
                })
                //使用 catch 來接收失敗的結果
                .catch((err) => {
                    alert(error.data.message);
                });
        },
    },

});

// 掛載
app.mount('#app');