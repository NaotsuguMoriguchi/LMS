jQuery(document).ready(function ($) {
	var $lp_withdrawals = $('#lp_withdrawals');
	var $lp_all = $('#lp_all');

	$lp_all.on('click', function (e) {
		var $this = $(this);
		var is_check = $this.attr('checked');
		if (is_check !== undefined && is_check === 'checked') {
			var all_money = $lp_withdrawals.data('all');
			$lp_withdrawals.val(all_money);
		}
	});

	$lp_withdrawals.on('change', function (e) {
		var $this = $(this);
		var all_money = $this.data('all');
		var current_money = $this.val();
		if (current_money < all_money) {
			$lp_all.attr('checked', false);
			return;
		}
		$lp_all.attr('checked', true);
	});

	$('.lp_payment_method').on('change', function (e) {
		var $this = $(this);

		var method = $this.val();
		if (method === 'online') {
			$('.lp_gateways_online').show();
		} else {
			$('.lp_gateways_online').hide();
		}
	});
});

function showWithdrawalForm(key){
	jQuery('.withdrawal_form_wraper').hide();
	jQuery('.withdrawal_form_wraper.'+key).show();
}