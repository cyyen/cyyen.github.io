
new Vue({
    el: '#app',

    data: {
        // url: 'http://127.0.0.1:8000',
        url: 'https://mystock-chve.onrender.com',
        users: [],
        stocks: [],
        selectedStock: null,
        isLoading: false,
        searchStock: {
            user_id: null,
            endDate: new Date().toISOString().slice(0, 10),
        },
        newStock: {
            user_id: null,
            stock_code: '',
            buy_quantity: null,
            buy_price: null,
            buy_date: new Date().toISOString().slice(0, 10)
        }
    },
    mounted() {
        this.fetchUsers();
        this.fetchStocks();

    },
    methods: {
        fetchUsers() {
            // console.log('fetchUsers');
            axios.get(this.url + '/users/')
                .then(response => {
                    this.users = response.data;
                    // console.log(this.users);
                })
                .catch(error => {
                    console.error('Error fetching users:', error);
                });
        },
        confirmDelete(id) {
            if (confirm('Are you sure you want to delete this stock?')) {
                this.deleteStock(id);
            }
        },
        deleteStock(id) {
            axios.delete(this.url + '/stocks/' + id + '/')
                .then(response => {
                    this.fetchStocks();
                })
                .catch(error => {
                    console.error('Error deleting stock:', error);
                })

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
                        buy_date: new Date().toISOString().slice(0, 10)
                    };
                })
                .catch(error => {
                    console.error('Error creating stock:', error);
                    alert('Failed to add stock');
                })
                .finally(() => {
                    this.fetchStocks();
                })


        },
        formatNumber(number) {
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
        fetchStocks() {
            // console.log('fetchStocks');
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
                    if (this.stocks.length > 0) {
                        if (!this.selectedStock)
                            this.selectedStock = this.stocks[0];
                        else
                            this.showDetails(this.selectedStock.summary.stock_code);
                    }
                    // console.log(this.stocks);
                })
                .catch(error => {
                    console.error('Error fetching stocks:', error);
                    alert('Failed to fetch stocks data');
                })
                .finally(() => {
                    this.isLoading = false;
                });
        },
        showDetails(code) {
            this.selectedStock = this.stocks.find(stock => stock.summary.stock_code === code);
        },
        closeDetails() {
            // this.selectedStock = null;
            // var detailsModal = new bootstrap.Modal(document.getElementById('detailsModal'));
            // detailsModal.hide();
        }
    }
});