(function(root) {
	'use strict';

	var noop = Function.prototype;

	var load = (typeof require == 'function' && !(root.define && define.amd)) ?
		require :
		(!root.document && root.java && root.load) || noop;

	var QUnit = (function() {
		return root.QUnit || (
			root.addEventListener || (root.addEventListener = noop),
			root.setTimeout || (root.setTimeout = noop),
			root.QUnit = load('../node_modules/qunitjs/qunit/qunit.js') || root.QUnit,
			addEventListener === noop && delete root.addEventListener,
			root.QUnit
		);
	}());

	var qe = load('../node_modules/qunit-extras/qunit-extras.js');
	if (qe) {
		qe.runInContext(root);
	}

	// The `q` object to test
	var q = root.q || (root.q = (
		q = load('../q.js') || root.q,
		q = q.q || q
	));

	// The `utf8` object to be used in tests
	var utf8 = root.utf8 || (root.utf8 = (
		utf8 = load('../node_modules/utf8/utf8.js') || root.utf8,
		utf8 = utf8.utf8 || utf8
	));

	/*--------------------------------------------------------------------------*/

	// `throws` is a reserved word in ES3; alias it to avoid errors
	var raises = QUnit.assert['throws'];

	// explicitly call `QUnit.module()` instead of `module()`
	// in case we are in a CLI environment
	QUnit.module('q');

// UTF-8 '=C2=A1Hola, se=C3=B1or!' → '\xA1Hola, se\xF1or!'

	test('q.encode', function() {
		equal(
			q.encode(utf8.encode('If you believe that truth=beauty, then surely mathematics is the most beautiful branch of philosophy.')),
			'If_you_believe_that_truth=3Dbeauty=2C_then_surely_mathematics_is_the_most_beautiful_branch_of_philosophy=2E',
			'Equals sign'
		);
		equal(
			q.encode(utf8.encode('Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.')),
			'Lorem_ipsum_dolor_sit_amet=2C_consectetuer_adipiscing_elit=2C_sed_diam_nonummy_nibh_euismod_tincidunt_ut_laoreet_dolore_magna_aliquam_erat_volutpat=2E_Ut_wisi_enim_ad_minim_veniam=2C_quis_nostrud_exerci_tation_ullamcorper_suscipit_lobortis_nisl_ut_aliquip_ex_ea_commodo_consequat=2E_Duis_autem_vel_eum_iriure_dolor_in_hendrerit_in_vulputate_velit_esse_molestie_consequat=2C_vel_illum_dolore_eu_feugiat_nulla_facilisis_at_vero_eros_et_accumsan_et_iusto_odio_dignissim_qui_blandit_praesent_luptatum_zzril_delenit_augue_duis_dolore_te_feugait_nulla_facilisi=2E_Nam_liber_tempor_cum_soluta_nobis_eleifend_option_congue_nihil_imperdiet_doming_id_quod_mazim_placerat_facer_possim_assum=2E_Typi_non_habent_claritatem_insitam=3B_est_usus_legentis_in_iis_qui_facit_eorum_claritatem=2E_Investigationes_demonstraverunt_lectores_legere_me_lius_quod_ii_legunt_saepius=2E_Claritas_est_etiam_processus_dynamicus=2C_qui_sequitur_mutationem_consuetudium_lectorum=2E_Mirum_est_notare_quam_littera_gothica=2C_quam_nunc_putamus_parum_claram=2C_anteposuerit_litterarum_formas_humanitatis_per_seacula_quarta_decima_et_quinta_decima=2E_Eodem_modo_typi=2C_qui_nunc_nobis_videntur_parum_clari=2C_fiant_sollemnes_in_futurum=2E',
			'Long text'
		);
		equal(
			q.encode(utf8.encode('foo ')),
			'foo_',
			'Trailing space'
		);
		equal(
			q.encode(utf8.encode('foo\t')),
			'foo=09',
			'Trailing tab'
		);
		equal(
			q.encode(utf8.encode('foo\r\nbar')),
			'foo=0D=0Abar',
			'CRLF'
		);
		equal(
			q.encode(utf8.encode('fooI\xF1t\xEBrn\xE2ti\xF4n\xE0liz\xE6ti\xF8n\u2603\uD83D\uDCA9bar')),
			'fooI=C3=B1t=C3=ABrn=C3=A2ti=C3=B4n=C3=A0liz=C3=A6ti=C3=B8n=E2=98=83=F0=9F=92=A9bar',
			'Supports UTF-8-encoded input'
		);
		equal(
			q.encode('foo\0bar\xFFbaz'), // Note: no UTF-8-encoding
			'foo=00bar=FFbaz',
			'Lowest and highest octet values (U+0000 and U+00FF)'
		);
		equal(
			q.encode('ooh: ahh'),
			'ooh=3A_ahh',
			'colons'
		);
		raises(
			function() {
				// Note: “forgot” to UTF-8-encode first
				q.encode('fooI\xF1t\xEBrn\xE2ti\xF4n\xE0liz\xE6ti\xF8n\u2603\uD83D\uDCA9bar')
			},
			RangeError,
			'Invalid input (input must be character-encoded into octets using any encoding)'
		);
	});

	test('q.decode', function() {
		equal(
			utf8.decode(q.decode('If_you_believe_that_truth=3Dbeauty,_then_surely_mathematics_is_the_most_beautiful_branch_of_philosophy.')),
			'If you believe that truth=beauty, then surely mathematics is the most beautiful branch of philosophy.',
			'Equals sign'
		);
		equal(
			utf8.decode(q.decode('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')),
			'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
			'76 * 2 characters'
		);
		equal(
			utf8.decode(q.decode('Now\'s_the_time_for_all_folk_to_come_to_the_aid_of_their_country.')),
			'Now\'s the time for all folk to come to the aid of their country.',
			'Soft line break example from the RFC'
		);
		equal(
			utf8.decode(q.decode('fooI=C3=B1t=C3=ABrn=C3=A2ti=C3=B4n=C3=A0liz=C3=A6ti=C3=B8n=E2=98=83=F0=9F=92=A9bar')),
			'fooI\xF1t\xEBrn\xE2ti\xF4n\xE0liz\xE6ti\xF8n\u2603\uD83D\uDCA9bar',
			'UTF-8-decoding Q-decoded UTF-8-encoded content'
		);
	});

	/*--------------------------------------------------------------------------*/

	// configure QUnit and call `QUnit.start()` for
	// Narwhal, Node.js, PhantomJS, Rhino, and RingoJS
	if (!root.document || root.phantom) {
		QUnit.config.noglobals = true;
		QUnit.start();
	}
}(typeof global == 'object' && global || this));
