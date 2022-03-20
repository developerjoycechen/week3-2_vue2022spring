import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.31/vue.esm-browser.min.js';


const site = 'https://vue3-course-api.hexschool.io/v2';
// api_path 為個人 API Path
const api_path = 'jc22';

let productModal = {};
let delProductModal = {};

const app = createApp({
    data(){
        return { 
            products:[],
            // 點擊查看單一產品的暫存空間
            tempProduct:{
                imagesUrl:[],
            },
            isNew: false,
        }
    },
    methods:{
        //登入確認
        checkLogin(){
            const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
            //每次發送請求時，都將 token 放到預設的 headers 內，如果不同站點，就不能使用預設值，要依站點做區分
            axios.defaults.headers.common['Authorization'] = token;
                const url = `${site}/api/user/check`;
                axios.post(url)
                    .then(res => {
                        //觸發取得遠端產品品項函式
                        this.getProducts();
                    })
                    .catch((err) => {
                        alert(err.data.message)
                        window.location = 'index.html';
                    })
        },
        //取得產品列表
        getProducts(){
            const url = `${site}/api/${api_path}/admin/products/all`;

            //打 api 取得遠端資料
            axios.get(url)
                .then(res => {
                    this.products = res.data.products;
                })
                .catch((err) => {
                    alert(err.data.message);
                })
                

        },
        openproduct(item){ 
            this.tempProduct = item;
        },
        // 參數 status，判斷新增使用還是編輯使用的狀態
        openModal(status, product){
            if(status === 'isNew'){
                this.tempProduct = {
                    imagesUrl:[],
                }
                productModal.show();
                this.isNew = true;
            }else if(status === 'edit'){
                // 使用淺拷貝，避免物件傳參考狀況
                this.tempProduct = {...product};
                productModal.show();
                this.isNew = false;
            }else if(status === 'delete'){
                delProductModal.show();
                this.tempProduct = {...product};
            }
        },
        updateProduct(){
            let url = `${site}/api/${api_path}/admin/product`;
            let method = 'post';
            if(!this.isNew){
                url = `${site}/api/${api_path}/admin/product/${this.tempProduct.id}`;
                method = 'put';
            }

            //打 api 取得遠端資料
            axios[method](url, { data: this.tempProduct })
                .then(res => {
                    // 重新取一次列表
                    this.getProducts();
                    // 把列表關掉
                    productModal.hide();
                })
                .catch((err) => {
                    alert(err.data.message);
                })
        },
        delProduct(){
            let url = `${site}/api/${api_path}/admin/product/${this.tempProduct.id}`;

            //打 api 取得遠端資料
            axios.delete(url)
                .then(res => {
                    // 重新取一次列表
                    this.getProducts();
                    // 把列表關掉
                    delProductModal.hide();
                })
                .catch((err) => {
                    alert(err.data.message);
                })
        }
    },
    //使用 mounted 生命週期，觸發登入行為
    mounted(){
        this.checkLogin();
        productModal = new bootstrap.Modal(document.getElementById('productModal'));
        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'));
    }

});

app.mount('#app');