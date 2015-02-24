var fs = require('fs');
var regenerate = require('regenerate');

// Let’s start with the safe/unsafe symbols in `Quoted-Printable` encoding.
// https://tools.ietf.org/html/rfc2045#section-6.7
// safe-char := <any octet with decimal value of 33 through
//              60 inclusive, and 62 through 126>
//              ; Characters not listed as "mail-safe" in
//              ; RFC 2049 are also not recommended.
// hex-octet := "=" 2(DIGIT / "A" / "B" / "C" / "D" / "E" / "F")
//              ; Octet must be used for characters > 127, =,
//              ; SPACEs or TABs at the ends of lines, and is
//              ; recommended for any character not listed in
//              ; RFC 2049 as "mail-safe".
var safeSymbols = regenerate()
	.addRange(33, 60)
	.addRange(62, 126)
	// Remove symbols that are unsafe in Q-encoding. Note: space is excluded
	// because it’s special-cased.
	.remove('?', '_', '\t');
var definitelyUnsafeSymbols = regenerate()
	.addRange(0x0, 0x10FFFF)
	// Note: the script assumes the input is already encoded into octets (e.g.
	// using UTF-8), and that the resulting octets are within the extended ASCII
	// range. Thus, there is no need to match astral symbols.
	.removeRange(0x010000, 0x10FFFF)
	.remove(safeSymbols)
	.remove(' '); // Note: space is excluded because it’s special-cased.
// https://mathiasbynens.be/notes/javascript-encoding#surrogate-pairs

module.exports = {
	'unsafeSymbols': definitelyUnsafeSymbols.toString({ 'bmpOnly': true }),
	'version': JSON.parse(fs.readFileSync('package.json', 'utf-8')).version
};
