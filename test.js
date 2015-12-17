import test from 'ava';
import fn from './';

test('ambilux', t => {
	var interval = fn.run({
		ledsHorizontal: 11,
		ledsVertical: 8
	}, cb);

	function cb (colours) {
		t.is(colours.length, 4);
		t.is(colours[0].length, 11);
		t.is(colours[1].length, 8);
		t.is(colours[2].length, 11);
		t.is(colours[3].length, 8);
		t.end();

		clearInterval(interval);
	}
});
