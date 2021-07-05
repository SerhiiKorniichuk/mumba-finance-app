import axios from '../../Api'

export const getTransactionsData = () => {
	axios
		.post("fetchTransactions.php")
		.then(({ data }) => {
			document.getElementById(
				"transTable"
			).innerHTML = data;
		});
}