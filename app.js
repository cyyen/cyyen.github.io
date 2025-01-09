
new Vue({
    el: '#app',
    data: {
        // url: 'http://127.0.0.1:8000',
		url: 'https://mystock-chve.onrender.com/',
        users: [],
        endDate: '',
        stocks: [],
        selectedStock: null,
        isLoading: false,
        searchStock: {
            user_id: null,
            endDate: '',
        },
        newStock: {
            user_id: null,
            stock_code: '',
            buy_quantity: null,
            buy_price: null,
            buy_date: ''
        }
    },
    mounted() {
        this.fetchUsers();
    },
    methods: {
        fetchUsers() {
            axios.get(this.url + '/users/')
                .then(response => {
                    this.users = response.data;
                })
                .catch(error => {
                    console.error('Error fetching users:', error);
                });
        },
        createStock() {
            if (!this.newStock.user_id) {
                alert('Please select a user first');
                return;
            }
            axios.post(this.url + '/stocks/', this.newStock)
                .then(response => {
                    alert('Stock added successfully');
                    this.fetchStocks();
                    // Reset form
                    this.newStock = {
                        user_id: null,
                        stock_code: '',
                        buy_quantity: null,
                        buy_price: null,
                        buy_date: ''
                    };
                })
                .catch(error => {
                    console.error('Error creating stock:', error);
                    alert('Failed to add stock');
                });
        },
        formatNumber(number) {
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
        fetchStocks() {
            this.isLoading = true;
            let url = this.url + '/stocks/?';
            if (this.searchStock.user_id) {
                url += `user_id=${this.searchStock.user_id}&`;
            }
            if (this.searchStock.endDate) {
                url += `end_date=${this.searchStock.endDate}`;
            }

            axios.get(url)
                .then(response => {
                    this.stocks = response.data;
                })
                .catch(error => {
                    console.error('Error fetching stocks:', error);
                    alert('Failed to fetch stocks data');
                })
                .finally(() => {
                    this.isLoading = false;
                });
        },
        showDetails(stock) {
            this.selectedStock = stock;
        },
        closeDetails() {
            this.selectedStock = null;
        }
    }
});