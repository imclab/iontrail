load(libdir + "asm.js");

assertAsmTypeFail(USE_ASM + "var i; function f(){} return f");
assertEq(asmLink(asmCompile(USE_ASM + "var i=0; function f(){} return f"))(), undefined);
assertEq(asmLink(asmCompile(USE_ASM + "var i=42; function f(){ return i|0 } return f"))(), 42);
assertEq(asmLink(asmCompile(USE_ASM + "var i=4.2; function f(){ return +i } return f"))(), 4.2);
assertAsmTypeFail(USE_ASM + "var i=42; function f(){ return +(i+.1) } return f");
assertAsmTypeFail(USE_ASM + "var i=1.2; function f(){ return i|0 } return f");
assertAsmTypeFail(USE_ASM + "var i=0; function f(e){ e=+e; i=e } return f");
assertAsmTypeFail(USE_ASM + "var d=0.1; function f(i){ i=i|0; d=i } return f");
assertEq(asmLink(asmCompile(USE_ASM + "var i=13; function f(j) { j=j|0; i=j; return i|0 } return f"))(42), 42);
assertEq(asmLink(asmCompile(USE_ASM + "var d=.1; function f(e) { e=+e; d=e; return +e } return f"))(42.1), 42.1);

var f = asmLink(asmCompile(USE_ASM + "var i=13; function f(j) { j=j|0; if ((j|0) != -1) { i=j } else { return i|0 } return 0 } return f"));
assertEq(f(-1), 13);
assertEq(f(42), 0);
assertEq(f(-1), 42);

assertAsmTypeFail('global', USE_ASM + "var i=global; function f() { return i|0 } return f");
assertAsmTypeFail('global', USE_ASM + "var i=global|0; function f() { return i|0 } return f");
assertAsmTypeFail('global', USE_ASM + "var j=0;var i=j.i|0; function f() { return i|0 } return f");
assertAsmTypeFail('global', USE_ASM + "var i=global.i|0; function f() { return i|0 } return f");
assertAsmTypeFail('global', USE_ASM + "var i=global.i|0; function f() { return i|0 } return f");
assertAsmTypeFail('global', USE_ASM + 'var i=global.Infinity; function f() { i = 0.0 } return f');
var code = asmCompile('global', USE_ASM + 'var i=global.Infinity; function f() { return +i } return f');
assertAsmLinkAlwaysFail(code, undefined);
assertAsmLinkAlwaysFail(code, null);
assertAsmLinkFail(code, 3);
assertAsmLinkFail(code, {});
assertAsmLinkFail(code, {Infinity:NaN});
assertAsmLinkFail(code, {Infinity:-Infinity});
assertEq(asmLink(code, {Infinity:Infinity})(), Infinity);
var code = asmCompile('global', USE_ASM + 'var i=global.Infinity; function f() { return +i } return f');
assertEq(asmLink(code, this)(), Infinity);
var code = asmCompile('global', USE_ASM + 'var i=global.NaN; function f() { return +i } return f');
assertAsmLinkAlwaysFail(code, undefined);
assertAsmLinkAlwaysFail(code, null);
assertAsmLinkFail(code, 3);
assertAsmLinkFail(code, {});
assertAsmLinkFail(code, {Infinity:Infinity});
assertAsmLinkFail(code, {Infinity:-Infinity});
assertEq(asmLink(code, {NaN:NaN})(), NaN);
var code = asmCompile('global', USE_ASM + 'var i=global.NaN; function f() { return +i } return f');
assertEq(asmLink(code, this)(), NaN);

assertAsmTypeFail('global', 'imp', USE_ASM + "var i=imp; function f() { return i|0 } return f");
assertAsmTypeFail('global', 'imp', USE_ASM + "var j=0;var i=j.i|0; function f() { return i|0 } return f");
assertAsmLinkAlwaysFail(asmCompile('global','imp', USE_ASM + "var i=imp.i|0; function f() { return i|0 } return f"), null, undefined);
assertAsmLinkAlwaysFail(asmCompile('global','imp', USE_ASM + "var i=imp.i|0; function f() { return i|0 } return f"), this, undefined);
assertAsmLinkAlwaysFail(asmCompile('global', 'imp', USE_ASM + "var i=imp.i|0; function f() { return i|0 } return f"), null, null);
assertAsmLinkAlwaysFail(asmCompile('global', 'imp', USE_ASM + "var i=imp.i|0; function f() { return i|0 } return f"), this, null);
assertEq(asmLink(asmCompile('global', 'imp', USE_ASM + "var i=imp.i|0; function f() { return i|0 } return f"), this, 42)(), 0);
assertEq(asmLink(asmCompile('global', 'imp', USE_ASM + "var i=imp.i|0; function f() { return i|0 } return f")(null, {i:42})), 42);
assertEq(asmLink(asmCompile('global', 'imp', USE_ASM + "var i=imp.i|0; function f() { return i|0 } return f")(null, {i:1.4})), 1);
assertEq(asmLink(asmCompile('global', 'imp', USE_ASM + "var i=+imp.i; function f() { return +i } return f")(null, {i:42})), 42);
assertEq(asmLink(asmCompile('global', 'imp', USE_ASM + "var i=+imp.i; function f() { return +i } return f")(this, {i:1.4})), 1.4);
assertEq(asmLink(asmCompile(USE_ASM + "var g=0; function f() { var i=42; while (1) { break; } g = i; return g|0 } return f"))(), 42);
