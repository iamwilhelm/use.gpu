// This file was generated by lezer-generator. You probably shouldn't edit it.
import {LRParser} from "@lezer/lr"
import {untilEOL} from "./tokens"
const spec_Identifier = {__proto__:null,const:26, inout:28, in:30, out:32, centroid:34, patch:36, sample:38, uniform:40, buffer:42, shared:44, coherent:46, volatile:48, restrict:50, readonly:52, writeonly:54, subroutine:56, layout:64, common:72, partition:74, active:76, asm:78, class:80, union:82, enum:84, typedef:86, template:88, this:90, resource:92, goto:94, inline:96, noinline:98, public:100, static:102, extern:104, external:106, interface:108, long:110, short:112, half:114, fixed:116, unsigned:118, superp:120, input:122, output:124, hvec2:126, hvec3:128, hvec4:130, fvec2:132, fvec3:134, fvec4:136, sampler3DRect:138, filter:140, sizeof:142, cast:144, namespace:146, using:148, void:160, float:162, double:164, int:166, uint:168, atomic_uint:170, bool:172, mat2:174, mat3:176, mat4:178, dmat2:180, dmat3:182, dmat4:184, mat2x2:186, mat2x3:188, mat2x4:190, dmat2x2:192, dmat2x3:194, dmat2x4:196, mat3x2:198, mat3x3:200, mat3x4:202, dmat3x2:204, dmat3x3:206, dmat3x4:208, mat4x2:210, mat4x3:212, mat4x4:214, dmat4x2:216, dmat4x3:218, dmat4x4:220, vec2:222, vec3:224, vec4:226, ivec2:228, ivec3:230, ivec4:232, bvec2:234, bvec3:236, bvec4:238, dvec2:240, dvec3:242, dvec4:244, uvec2:246, uvec3:248, uvec4:250, sampler3D:252, samplerCube:254, sampler1DShadow:256, sampler2DShadow:258, samplerCubeShadow:260, sampler1DArray:262, sampler2DArray:264, sampler1DArrayShadow:266, sampler2DArrayShadow:268, samplerCubeArray:270, samplerCubeArrayShadow:272, isampler1D:274, isampler2D:276, isampler3D:278, isamplerCube:280, isampler1DArray:282, isampler2DArray:284, isamplerCubeArray:286, usampler1D:288, usampler2D:290, usampler3D:292, usamplerCube:294, usampler1DArray:296, usampler2DArray:298, usamplerCubeArray:300, sampler2DRect:302, sampler2DRectShadow:304, isampler2DRect:306, usampler2DRect:308, samplerBuffer:310, isamplerBuffer:312, usamplerBuffer:314, sampler2DMS:316, isampler2DMS:318, usampler2DMS:320, sampler2DMSArray:322, isampler2DMSArray:324, usampler2DMSArray:326, image1D:328, iimage1D:330, uimage1D:332, image2D:334, iimage2D:336, uimage2D:338, image3D:340, iimage3D:342, uimage3D:344, image2DRect:346, iimage2DRect:348, uimage2DRect:350, imageCube:352, iimageCube:354, uimageCube:356, imageBuffer:358, iimageBuffer:360, uimageBuffer:362, image1DArray:364, iimage1DArray:366, uimage1DArray:368, image2DArray:370, iimage2DArray:372, uimage2DArray:374, imageCubeArray:376, iimageCubeArray:378, uimageCubeArray:380, image2DMS:382, iimage2DMS:384, uimage2DMS:386, image2DMSArray:388, iimage2DMSArray:390, uimage2DMSArray:392, highp:450, medp:452, lowp:454, smooth:458, flat:460, noperspective:462, invariant:466, precise:470, struct:474, precision:500, if:506, else:508, switch:512, default:516, case:518, while:522, do:526, for:528, continue:532, break:534, return:536, discard:538, define:546, undef:548, ifdef:550, ifndef:552, elif:554, endif:556, error:558, pragma:560, extension:562, version:564, line:566}
export const parser = LRParser.deserialize({
  version: 13,
  states: "EUO*qQQOOP*xOQOOOOQO'#Id'#IdO,qQQO'#CfO4mQQO'#JROOQO'#Ce'#CeO<uQQO'#CeO=PQQO'#HnO=UQQO'#HmO=XQQO'#HmO=^QQO'#IUOOQO'#Is'#IsOOQO'#Cg'#CgO>XQQO'#CgOOQO'#I}'#I}OGsQQO'#C{OOQO'#HU'#HUOOQO'#HY'#HYOOQO'#H^'#H^OOQO'#H`'#H`OGxQQO'#HbOHQQQO'#HmQOQQOOPOOO'#C_'#C_PH]QRO'#C_POOO)CDg)CDgOOQO-E<b-E<bOHbQQO'#HgOOQO'#Hg'#HgOOQO,5?m,5?mOHyQQO'#IiOOQO,59P,59POOQO,5>X,5>XO!%pQQO,5>XO!&^QQO,59OO!&eQQO'#HoO!&pQQO,5>YO!&xQQO'#JWOOQO,58},58}O!)mQRO,5>pOOQP'#IW'#IWO!)rQQO,59RO!)wQQO,59gO!*PQQO,5=|O!+uQQO,5=|O5RQQO,5>XPOOO,58y,58yOOQO-E<g-E<gOOQO,5>R,5>RO!+zQSO'#IzOOQO'#Iz'#IzOHyQQO'#IzO!-}QQO'#IzO!.YQQO'#D}O!._QSO'#IxOOQO'#Iy'#IyOHyQQO'#GmOOQO'#Ix'#IxO!1lQSO,5?TOOQO'#Iw'#IwOOQO'#DP'#DPO!1sQQO'#IoO!1xQQO1G3sOOQO1G3s1G3sO!*PQQO1G3sOOQO,5>Q,5>QO!2QQQO1G.jO!3vQQO,5>ZO!3}QQO'#InO!4SQQO1G3tO!4[QSO'#I|O!4rQSO'#IwO!6fQQO'#I{O!6wQQO'#JROOQO'#Hl'#HlOOQO'#Hq'#HqO!7VQQO'#HqOOQO'#JX'#JXOOQO'#Hk'#HkOOQO'#Il'#IlO!7[QQO'#HjO!:PQQO,5?rO!:UQQO'#HrO!:ZQQO'#HuO!:`QQO'#HwOHyQQO'#HwO!:eQQO'#HzO!:jQQO'#HzO!=[QQO'#HzO!=aQQO'#IPO!=fQQO'#IPOOQO1G4[1G4[OOQO'#Cz'#CzO!=mQQO'#CyO!=uQQO1G.mO!=zQQO'#C}OOQO'#C}'#C}O!>VQQO1G/RO!3}QQO'#HeO5RQQO'#HeOOQO'#Ih'#IhO!>_QQO'#HdO!@TQQO1G3hO!*PQQO1G3hO!1{QQO1G3sO!J|QQO,5:iO!KWQQO,5?fOOQO,5?f,5?fOHyQQO,5?fOOQO,5=U,5=UOHyQQO,5:fO!K]QQO,5=TOOQO,5=X,5=XOHyQQO,5=^OHyQQO,5=^OHyQQO,5=^OHyQQO,5=^OHyQQO,5=^OHyQQO,5=^OHyQQO,5=^OHyQQO,5=^OHyQQO,5=^OHyQQO,5=^OHyQQO,5=^OHyQQO,5=oOOQO1G4o1G4oOOQO,5?Z,5?ZOOQO-E<m-E<mOOQO7+)_7+)_O!KbQQO7+)_O!KgQQO'#HiO5RQQO'#HiOOQO7+$U7+$UO!KrQQO7+$UOOQO'#JY'#JYO!3vQQO'#JYOOQO1G3u1G3uO!%{QQO'#HfOOQO,5?Y,5?YOOQO-E<l-E<lOHyQQO,5?hOHyQQO'#IfO!KzQQO,5?gOOQO,5>],5>]OOQO-E<j-E<jOOQO1G5^1G5^OHyQQO,5>^OHyQQO,5>aOOQO,5>c,5>cO!L]QQO,5>cO!LbQQO,5>fO!NWQQO,5>fO!N]QQO,5>fOOQO,5>k,5>kO#!XQQO,5>kO!)rQQO'#IeO#!^QQO,59eOOQO7+$X7+$XOHyQQO,59iO!)wQQO'#IgO#!fQQO7+$mOOQO7+$m7+$mO#!nQQO'#JTO#!vQQO,5>PO!3}QQO,5>POOQO-E<f-E<fOOQO7+)S7+)SO#!{QQO7+)SOOQO1G0T1G0TO##QQQO1G0TO##YQQO1G0TOOQO1G5Q1G5QO##bQQO1G5QO##gQQO1G0QOOQO1G2o1G2oOOQO1G2x1G2xO#%VQSO1G2xO#%aQSO1G2xO#'OQSO1G2xO#'`QSO1G2xO#)^QSO1G2xO#+RQSO1G2xO#+YQSO1G2xO#,}QSO1G2xO#.rQSO1G2xO#.yQSO1G2xO#/QQQO1G3ZO#/VQQO<<LyO#/_QQO,5>TO#/mQQO,5>TO#/xQQO'#IkO#1kQQO<<GpOOQO<<Gp<<GpO#1sQQO,5?tOOQO1G5S1G5SOOQO,5?Q,5?QOOQO-E<d-E<dO#1{QQO1G3xO#2QQQO1G3{OOQO1G3}1G3}O5RQQO'#CeOOQO'#H|'#H|O#2VQQO'#H|O#2[QQO1G4QO#2aQQO1G4QO!LbQQO1G4QOOQO1G4V1G4VOOQO,5?P,5?POOQO-E<c-E<cO#2fQSO1G/TOOQO,5?R,5?ROOQO-E<e-E<eOOQO<<HX<<HXO!3}QQO'#IjO#2pQQO,5?oOOQO1G3k1G3kO#2xQQO1G3kOOQO<<Ln<<LnO#2}QQO7+%oOOQO7+%o7+%oOOQO7+*l7+*lOOQO7+%l7+%lOHyQQO7+(uOOQOANBeANBeO#3VQQOANBeOOQO1G3o1G3oO#3[QQO1G3oOOQO,5?V,5?VOOQO-E<i-E<iOOQOAN=[AN=[O#3jQQO1G5`O#3tQQO1G5`OOQO1G5`1G5`O#3|QQO7+)dO#6nQQO7+)gO#6sQQO,5>hO!:jQQO7+)lOHyQQO7+)lO#6xQQO7+)lOOQO,5?U,5?UOOQO-E<h-E<hOOQO7+)V7+)VOOQO<<IZ<<IZOOQO<<La<<LaOOQOG28PG28POOQO7+)Z7+)ZOOQO,5?X,5?XOOQO7+*z7+*zO#6}QQO7+*zOOQO-E<k-E<kO#7XQQO<<MOO!&xQQO<<MRO!3vQQO1G4SOOQO<<MW<<MWO#DrQQO<<MWO#DwQQO<<MWOOQO<<Nf<<NfP!3vQQO'#ImO!:jQQOANBjO#EOQQOANBmOOQO7+)n7+)nO#ETQQOANBrOOQOANBrANBrO#EYQQOANBrOOQOG28UG28UOOQOG28XG28XOOQOG28^G28^OOQO<<MO<<MOO#3|QQO7+)dO#E_QQO1G3xOHyQQO,5>^O#EdQQO'#HrO#3|QQO7+)lP#3|QQOANBjO#EiQQO1G4QO!LbQQO,5>fO#EnQQO'#Hz",
  stateData: "#Es~O'fOSSPQTPQ~O][O^[O_[O`[Oa[Ob[Oc[Od[Oe[Of[Og[Oh[Oi[Oj[Ok[Ol]Op_O!r^O!s^O!t^O!u^O!v^O!w^O!x^O!y^O!z^O!{^O!|^O!}^O#O^O#P^O#Q^O#R^O#S^O#T^O#U^O#V^O#W^O#X^O#Y^O#Z^O#[^O#]^O#^^O#_^O#`^O#a^O#b^O#c^O#d^O#e^O#f^O#g^O#h^O#i^O#j^O#k^O#l^O#m^O#n^O#o^O#p^O#q^O#r^O#s^O#t^O#u^O#v^O#w^O#x^O#y^O#z^O#{^O#|^O#}^O$O^O$P^O$Q^O$R^O$S^O$T^O$U^O$V^O$W^O$X^O$Y^O$Z^O$[^O$]^O$^^O$_^O$`^O$a^O$b^O$c^O$d^O$e^O$f^O$g^O$h^O$i^O$j^O$k^O$l^O$m^O$n^O$o^O$p^O$q^O$r^O$s^O$t^O$u^O$v^O$w^O$x^O$y^O$z^O${^O$|^O$}^O%O^O%P^O%Q^O%R^O%S^O%T^O%U^O%V^O%W^O%X^O%Y^O%Z^O%[^O%y`O%z`O%{`O%}aO&OaO&PaO&RbO&TcO&VdO&deO~O&yYO~P]OSgOThO~O][O^[O_[O`[Oa[Ob[Oc[Od[Oe[Of[Og[Oh[Oi[Oj[Ok[Ol]Op_O%y`O%z`O%{`O%}aO&OaO&PaO&RbO&TcO~O[YX!rYX!sYX!tYX!uYX!vYX!wYX!xYX!yYX!zYX!{YX!|YX!}YX#OYX#PYX#QYX#RYX#SYX#TYX#UYX#VYX#WYX#XYX#YYX#ZYX#[YX#]YX#^YX#_YX#`YX#aYX#bYX#cYX#dYX#eYX#fYX#gYX#hYX#iYX#jYX#kYX#lYX#mYX#nYX#oYX#pYX#qYX#rYX#sYX#tYX#uYX#vYX#wYX#xYX#yYX#zYX#{YX#|YX#}YX$OYX$PYX$QYX$RYX$SYX$TYX$UYX$VYX$WYX$XYX$YYX$ZYX$[YX$]YX$^YX$_YX$`YX$aYX$bYX$cYX$dYX$eYX$fYX$gYX$hYX$iYX$jYX$kYX$lYX$mYX$nYX$oYX$pYX$qYX$rYX$sYX$tYX$uYX$vYX$wYX$xYX$yYX$zYX${YX$|YX$}YX%OYX%PYX%QYX%RYX%SYX%TYX%UYX%VYX%WYX%XYX%YYX%ZYX%[YX&VYX'xYX~P+QO!onO&[lO['uX'x'uX'i'uX'j'uX~O!r^O!s^O!t^O!u^O!v^O!w^O!x^O!y^O!z^O!{^O!|^O!}^O#O^O#P^O#Q^O#R^O#S^O#T^O#U^O#V^O#W^O#X^O#Y^O#Z^O#[^O#]^O#^^O#_^O#`^O#a^O#b^O#c^O#d^O#e^O#f^O#g^O#h^O#i^O#j^O#k^O#l^O#m^O#n^O#o^O#p^O#q^O#r^O#s^O#t^O#u^O#v^O#w^O#x^O#y^O#z^O#{^O#|^O#}^O$O^O$P^O$Q^O$R^O$S^O$T^O$U^O$V^O$W^O$X^O$Y^O$Z^O$[^O$]^O$^^O$_^O$`^O$a^O$b^O$c^O$d^O$e^O$f^O$g^O$h^O$i^O$j^O$k^O$l^O$m^O$n^O$o^O$p^O$q^O$r^O$s^O$t^O$u^O$v^O$w^O$x^O$y^O$z^O${^O$|^O$}^O%O^O%P^O%Q^O%R^O%S^O%T^O%U^O%V^O%W^O%X^O%Y^O%Z^O%[^O&VdO~O[qO'xpO~P5RO[rO~O'vuO'xpO~O&gxO&hxO&{xO&|xO&}xO'OxO'PxO'QxO'RxO'SxO'TxO'UxO'VxO~O'hyO[ZX]ZX^ZX_ZX`ZXaZXbZXcZXdZXeZXfZXgZXhZXiZXjZXkZXlZXpZX!rZX!sZX!tZX!uZX!vZX!wZX!xZX!yZX!zZX!{ZX!|ZX!}ZX#OZX#PZX#QZX#RZX#SZX#TZX#UZX#VZX#WZX#XZX#YZX#ZZX#[ZX#]ZX#^ZX#_ZX#`ZX#aZX#bZX#cZX#dZX#eZX#fZX#gZX#hZX#iZX#jZX#kZX#lZX#mZX#nZX#oZX#pZX#qZX#rZX#sZX#tZX#uZX#vZX#wZX#xZX#yZX#zZX#{ZX#|ZX#}ZX$OZX$PZX$QZX$RZX$SZX$TZX$UZX$VZX$WZX$XZX$YZX$ZZX$[ZX$]ZX$^ZX$_ZX$`ZX$aZX$bZX$cZX$dZX$eZX$fZX$gZX$hZX$iZX$jZX$kZX$lZX$mZX$nZX$oZX$pZX$qZX$rZX$sZX$tZX$uZX$vZX$wZX$xZX$yZX$zZX${ZX$|ZX$}ZX%OZX%PZX%QZX%RZX%SZX%TZX%UZX%VZX%WZX%XZX%YZX%ZZX%[ZX%yZX%zZX%{ZX%}ZX&OZX&PZX&RZX&TZX&VZX'xZX~O'hzO~O[|O'v{O~O%y`O%z`O%{`O~OQ!OO~O!onO&[!QO[&ZXr&ZX'i&ZX'x&ZX'j&ZX~O[!ROt!^Ou!^Ov!^Ow!^Ox!^Oy!^Oz!^O{!^O|!^O}!^O!O!^O!P!^O!Q!^O!R!^O!S!^O!T!^O!U!^O!V!^O!W!^O!X!^O!Y!^O!Z!^O![!^O!]!^O!^!^O!_!^O!`!^O!a!^O!b!^O!c!^O!d!^O!e!^O!f!^O!g!^O!h!^O!i!^O!j!^O!k!^O!l!^O!m!SO!r^O!s^O!t^O!u^O!v^O!w^O!x^O!y^O!z^O!{^O!|^O!}^O#O^O#P^O#Q^O#R^O#S^O#T^O#U^O#V^O#W^O#X^O#Y^O#Z^O#[^O#]^O#^^O#_^O#`^O#a^O#b^O#c^O#d^O#e^O#f^O#g^O#h^O#i^O#j^O#k^O#l^O#m^O#n^O#o^O#p^O#q^O#r^O#s^O#t^O#u^O#v^O#w^O#x^O#y^O#z^O#{^O#|^O#}^O$O^O$P^O$Q^O$R^O$S^O$T^O$U^O$V^O$W^O$X^O$Y^O$Z^O$[^O$]^O$^^O$_^O$`^O$a^O$b^O$c^O$d^O$e^O$f^O$g^O$h^O$i^O$j^O$k^O$l^O$m^O$n^O$o^O$p^O$q^O$r^O$s^O$t^O$u^O$v^O$w^O$x^O$y^O$z^O${^O$|^O$}^O%O^O%P^O%Q^O%R^O%S^O%T^O%U^O%V^O%W^O%X^O%Y^O%Z^O%[^O%_!YO%`!YO%b!YO%c!YO%d!YO%e!YO'h!TO~O'i!_O'v!bO'x!aO~O!onO&[lOr&YX'i&YX'x&YX~O'h!dO~P!%{Or!eO'i&cX'x&cX~O'i!fO'x&ba~O][O^[O_[O`[Oa[Ob[Oc[Od[Oe[Of[Og[Oh[Oi[Oj[Ok[Ol]Op_O%y`O%z`O%{`O%}aO&OaO&PaO&RbO&TcO&VdO&deO&g!tO&j!uO&l!vO&m!wO&o!xO&q!yO&r!zO&t!{O&u!{O&v!|O&w!{O'vuO'x!mO'y&^P~PHyOP!}O~O[#OO~O[#ROf#SO~O][O^[O_[O`[Oa[Ob[Oc[Od[Oe[Of[Og[Oh[Oi[Oj[Ok[Ol]Op_O%y`O%z`O%{`O%}aO&OaO&PaO&RbO&TcO'y&WP~P5RO'v#ZO~O'h#]O!o'nX!p'nX%_'nX%`'nX%b'nX%c'nX%g'nX%h'nX%i'nX%j'nX%k'nX%l'nX%m'nX%n'nX%o'nX%p'nX%q'nX%r'nX%s'nX%t'nX%u'nX%v'nX'r'nX's'nXr'nX'i'nX'x'nX'j'nX't'nX'y'nX~O[#_O!m#_O'h#`O~O'h#]O~O!o#bO%_#aO%`#aO'r#cO!p'lX%b'lX%c'lX%g'lX%h'lX%i'lX%j'lX%k'lX%l'lX%m'lX%n'lX%o'lX%p'lX%q'lX%r'lX%s'lX%t'lX%u'lX%v'lX's'lXr'lX'i'lX'x'lX'j'lX't'lX'y'lX~O%b#fO%c#fO%g#eO%h#eO%i#gO%j#gO%k#hO%l#hO%m#hO%n#hO%o#iO%p#iO%q#jO%r#kO%s#lO%t#mO%u#nO%v#oO's#pO~O!p#qO~P!0_O[#rO~O'i!_O'x#tO~O][O^[O_[O`[Oa[Ob[Oc[Od[Oe[Of[Og[Oh[Oi[Oj[Ok[Ol]Op_O%y`O%z`O%{`O%}aO&OaO&PaO&RbO&TcO'j#xO~P5RO'v#{O~PHyO[#}O~O'i!fO'x&bi~O'i'pX'x'pX'j'pX't'pX!p'pX'y'pX~P!0_Or$QO%b'kX%c'kX%g'kX%h'kX%i'kX%j'kX%k'kX%l'kX%m'kX%n'kX%o'kX%p'kX%q'kX%r'kX%s'kX%t'kX%u'kX%v'kX'i'kX's'kX'x'kX'j'kX't'kX!p'kX'y'kX~O'i$RO'x'oX'j'oX't'oX!p'oX~O!onO&[lO'h#]O['uX~O'x$TO~O][O^[O_[O`[Oa[Ob[Oc[Od[Oe[Of[Og[Oh[Oi[Oj[Ok[Ol]Op_O%y`O%z`O%{`O%}aO&OaO&PaO&RbO&TcO&VdO&deO&g!tO&j!uO&l!vO&m!wO&o!xO&q!yO&r!zO&t!{O&u!{O&v!|O&w!{O'vuO'x!mO'y&^X~PHyO'y$VO~O'h$WO~O'h$XO~O't$YO~O'h$[O~O][O^[O_[O`[Oa[Ob[Oc[Od[Oe[Of[Og[Oh[Oi[Oj[Ok[Ol]Op_O%y`O%z`O%{`O%}aO&OaO&PaO&RbO&TcO&VdO&deO&g!tO&j!uO&l!vO&m!wO&o!xO&q!yO&r!zO&t!{O&u!{O&v!|O&w!{O'vuO'x!mO~PHyO'h$^O~O'x$_O~O'x$_O~PHyO'i$aO'jmX~O'j$cO~Or$dO'iqX'jqX~O'i$eO'j$gO~O][O^[O_[O`[Oa[Ob[Oc[Od[Oe[Of[Og[Oh[Oi[Oj[Ok[Ol]Op_O%y`O%z`O%{`O%}aO&OaO&PaO&RbO&TcO'y&WX~P5RO'y$lO~O[!ROt!^Ou!^Ov!^Ow!^Ox!^Oy!^Oz!^O{!^O|!^O}!^O!O!^O!P!^O!Q!^O!R!^O!S!^O!T!^O!U!^O!V!^O!W!^O!X!^O!Y!^O!Z!^O![!^O!]!^O!^!^O!_!^O!`!^O!a!^O!b!^O!c!^O!d!^O!e!^O!f!^O!g!^O!h!^O!i!^O!j!^O!k!^O!l!^O!m!SO!s^O!t^O!u^O!v^O!w^O!x^O!y^O!z^O!{^O!|^O!}^O#O^O#P^O#Q^O#R^O#S^O#T^O#U^O#V^O#W^O#X^O#Y^O#Z^O#[^O#]^O#^^O#_^O#`^O#a^O#b^O#c^O#d^O#e^O#f^O#g^O#h^O#i^O#j^O#k^O#l^O#m^O#n^O#o^O#p^O#q^O#r^O#s^O#t^O#u^O#v^O#w^O#x^O#y^O#z^O#{^O#|^O#}^O$O^O$P^O$Q^O$R^O$S^O$T^O$U^O$V^O$W^O$X^O$Y^O$Z^O$[^O$]^O$^^O$_^O$`^O$a^O$b^O$c^O$d^O$e^O$f^O$g^O$h^O$i^O$j^O$k^O$l^O$m^O$n^O$o^O$p^O$q^O$r^O$s^O$t^O$u^O$v^O$w^O$x^O$y^O$z^O${^O$|^O$}^O%O^O%P^O%Q^O%R^O%S^O%T^O%U^O%V^O%W^O%X^O%Y^O%Z^O%[^O%_!YO%`!YO%b!YO%c!YO%d!YO%e!YO'h!TO~O!r$pO'j$nO~P!@YO'j$qO~O[$tO~O'y%RO~O[%SO'i&]X'j&]X~O'i%UO'j%WO~O'i$RO'x'oa'j'oa't'oa!p'oa~O't%_O~O][O^[O_[O`[Oa[Ob[Oc[Od[Oe[Of[Og[Oh[Oi[Oj[Ok[Ol]Op_O%y`O%z`O%{`O%}aO&OaO&PaO&RbO&TcO&VdO~PHyO&o%dO~O][O^[O_[O`[Oa[Ob[Oc[Od[Oe[Of[Og[Oh[Oi[Oj[Ok[Ol]Op_O%y`O%z`O%{`O%}aO&OaO&PaO&RbO&TcO&VdO&deO'x!mO~PHyO'x%fO~O'i$aO'jma~O'i$eO'j%lO~O'i%mO'x'wX~O'x%oO~O'y%qO~O'i$RO'j%sO~O'j%sO'h'qX~O'j%tO~O!p%uO~O%g#eO%h#eO!p%fi%i%fi%j%fi%k%fi%l%fi%m%fi%n%fi%o%fi%p%fi%q%fi%r%fi%s%fi%t%fi%u%fi%v%fi's%fi'i%fi'x%fi'j%fi't%fi'y%fi~O%b%fi%c%fi~P##lO%b#fO%c#fO~P##lO%b#fO%c#fO%g#eO%h#eO%i#gO%j#gO!p%fi%o%fi%p%fi%q%fi%r%fi%s%fi%t%fi%u%fi%v%fi's%fi'i%fi'x%fi'j%fi't%fi'y%fi~O%k%fi%l%fi%m%fi%n%fi~P#%kO%k#hO%l#hO%m#hO%n#hO~P#%kO%b#fO%c#fO%g#eO%h#eO%i#gO%j#gO%k#hO%l#hO%m#hO%n#hO%o#iO%p#iO!p%fi%r%fi%s%fi%t%fi%u%fi%v%fi's%fi'i%fi'x%fi'j%fi't%fi'y%fi~O%q%fi~P#'pO%b#fO%c#fO%g#eO%h#eO%i#gO%j#gO%k#hO%l#hO%m#hO%n#hO%o#iO%p#iO%q#jO!p%fi%r%fi%t%fi%u%fi%v%fi's%fi'i%fi'x%fi'j%fi't%fi'y%fi~O%s#lO~P#)eO%q#jO~P#'pO%b#fO%c#fO%g#eO%h#eO%i#gO%j#gO%k#hO%l#hO%m#hO%n#hO%o#iO%p#iO%q#jO%r#kO%s#lO!p%fi%u%fi%v%fi's%fi'i%fi'x%fi'j%fi't%fi'y%fi~O%t%fi~P#+aO%b#fO%c#fO%g#eO%h#eO%i#gO%j#gO%k#hO%l#hO%m#hO%n#hO%o#iO%p#iO%q#jO%r#kO%s#lO%t#mO!p%fi%u%fi's%fi'i%fi'x%fi'j%fi't%fi'y%fi~O%v#oO~P#-UO%t#mO~P#+aO't%vO~O[#}O'x%wO~O!onO&[lO'i&]a'j&]a~O[%zO'i&]a'j&]a~O][O^[O_[O`[Oa[Ob[Oc[Od[Oe[Of[Og[Oh[Oi[Oj[Ok[Ol]Op_O%y`O%z`O%{`O%}aO&OaO&PaO&RbO&TcO~P5RO'i%UO'j%}O~O'i&OO'y&QO~O'j&RO~O'j&SO~O[&TO~O'j&UO~O'h&VO~O'iqi'jqi~P!0_O'i%mO'x'wa~O'x&ZO~O'i$RO'j&[O~O'x&^O~O!onO&[lO'i&]i'j&]i~O'v#{O'y&aO~PHyO'i&bO'y&aO~O][O^[O_[O`[Oa[Ob[Oc[Od[Oe[Of[Og[Oh[Oi[Oj[Ok[Ol]Op_O%y`O%z`O%{`O%}aO&OaO&PaO&RbO&TcO&VdO&deO&g&yO&j!uO&l!vO&m!wO&o'OO&q!yO&r!zO&t!{O&u!{O&v!|O&w!{O'vuO'x!mO~PHyO'v&eO~Or&fO~O'x&iO~O'v#{O'y&jO~PHyO&h&lO[&fy]&fy^&fy_&fy`&fya&fyb&fyc&fyd&fye&fyf&fyg&fyh&fyi&fyj&fyk&fyl&fyp&fyt&fyu&fyv&fyw&fyx&fyy&fyz&fy{&fy|&fy}&fy!O&fy!P&fy!Q&fy!R&fy!S&fy!T&fy!U&fy!V&fy!W&fy!X&fy!Y&fy!Z&fy![&fy!]&fy!^&fy!_&fy!`&fy!a&fy!b&fy!c&fy!d&fy!e&fy!f&fy!g&fy!h&fy!i&fy!j&fy!k&fy!l&fy!m&fy!r&fy!s&fy!t&fy!u&fy!v&fy!w&fy!x&fy!y&fy!z&fy!{&fy!|&fy!}&fy#O&fy#P&fy#Q&fy#R&fy#S&fy#T&fy#U&fy#V&fy#W&fy#X&fy#Y&fy#Z&fy#[&fy#]&fy#^&fy#_&fy#`&fy#a&fy#b&fy#c&fy#d&fy#e&fy#f&fy#g&fy#h&fy#i&fy#j&fy#k&fy#l&fy#m&fy#n&fy#o&fy#p&fy#q&fy#r&fy#s&fy#t&fy#u&fy#v&fy#w&fy#x&fy#y&fy#z&fy#{&fy#|&fy#}&fy$O&fy$P&fy$Q&fy$R&fy$S&fy$T&fy$U&fy$V&fy$W&fy$X&fy$Y&fy$Z&fy$[&fy$]&fy$^&fy$_&fy$`&fy$a&fy$b&fy$c&fy$d&fy$e&fy$f&fy$g&fy$h&fy$i&fy$j&fy$k&fy$l&fy$m&fy$n&fy$o&fy$p&fy$q&fy$r&fy$s&fy$t&fy$u&fy$v&fy$w&fy$x&fy$y&fy$z&fy${&fy$|&fy$}&fy%O&fy%P&fy%Q&fy%R&fy%S&fy%T&fy%U&fy%V&fy%W&fy%X&fy%Y&fy%Z&fy%[&fy%_&fy%`&fy%b&fy%c&fy%d&fy%e&fy%y&fy%z&fy%{&fy%}&fy&O&fy&P&fy&R&fy&T&fy&V&fy&d&fy&g&fy&j&fy&l&fy&m&fy&o&fy&q&fy&r&fy&t&fy&u&fy&v&fy&w&fy'h&fy'v&fy'x&fy'y&fy~O'j&oO~O'j&pO~PHyO'y&sO~O'x&tO~O'j&tO~O'j&vO~O'h&xO~O'j&zO~O'h&}O~O",
  goto: ">t'}PPP(OPPP(R(U(f(y)hPPPPPPPPPPPPPPPPP*Q*T)hP*ZP*aPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP+fPP+fPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP+f+fPP,kPPPP-pPPPPPPPPPPPPPPPP-p.tPPP)hPPP)hP)hP/aP/}0W0^0lP0z1Q1W1n1}2_2mP1n2sPP2sP2sPP2sP3PPP2sPPPP(RP3YPPPPPPPPPPP3]3w3}4X4_4g4r4x5O5V5]5cPPP5iPPP5l7[8e+f9j:o;pPPP=VP>PPP>V>Y>fRiPRZOQWOgXu!r!y$^&R&U&e&l&v&z&{hVOu!r!y$^&R&U&e&l&v&z&{V%b$[%e&}hUOu!r!y$^&R&U&e&l&v&z&{W#V{!b#X#ZS#w!d%UV%`$[%e&}}QORu{!b!d!r!y#X#Z$[$^%U%e&R&U&e&l&v&z&{&}R#QyQ#PyR%g$aQ#TzR%j$e#V!Unu!T!Y!e!r!w!y!|#]#`#b#e#f#g#h#i#j#k#l#m#n#o#p#{$Q$R$W$X$[$^$d%e%v&O&R&U&V&b&e&f&i&k&l&v&x&z&{&}#V!Xnu!T!Y!e!r!w!y!|#]#`#b#e#f#g#h#i#j#k#l#m#n#o#p#{$Q$R$W$X$[$^$d%e%v&O&R&U&V&b&e&f&i&k&l&v&x&z&{&}#V!Znu!T!Y!e!r!w!y!|#]#`#b#e#f#g#h#i#j#k#l#m#n#o#p#{$Q$R$W$X$[$^$d%e%v&O&R&U&V&b&e&f&i&k&l&v&x&z&{&}#T!]nu!T!e!r!w!y!|#]#`#b#e#f#g#h#i#j#k#l#m#n#o#p#{$Q$R$W$X$[$^$d%e%v&O&R&U&V&b&e&f&i&k&l&v&x&z&{&}|QORu{!b!d!r!y#X#Z$[$^%U%e&R&U&e&l&v&z&{&}R}e!VSOUu{}!b!d!r!y#V#X#Z#w$[$^%U%`%e&R&U&e&l&v&z&{&}Q#Y{Q#u!bR$m#ZX#W{!b#X#ZSsV!fS$h#U$jQ%x%RR&X%mSmS!kS!cr#}Q%y%SR&_%zQ#y!dR%{%UQ!suR&m&eU!qu!r&eQ$]!yQ&d&RS&g&U&zS&r&l&{R&u&vd!ou!r!y&R&U&e&l&v&z&{R%e$^QZOg!lu!r!y$^&R&U&e&l&v&z&{iXOu!r!y$^&R&U&e&l&v&z&{QtVR$O!fe!ou!r!y&R&U&e&l&v&z&{Q%c$[Q&W%eR&|&}RwYzROu{!b!d!r!y#X#Z$[$^%U%e&R&U&e&l&v&z&{&}RjRQ$b#PR%h$bQ$S!jS%[$S%rR%r$oQ$f#TR%k$fU#X{!b#ZR$k#X[kSr!k#}%S%zR!PkQ%n$hR&Y%nQ%V#yR%|%VS!ru&eR$U!rQ&P%XR&c&PQ!gtR$P!gQ!`qR#s!`RfOQ![n!h!hu!T!e!r!w!y!|#]#`#b#p#{$Q$R$W$X$[$^%e%v&O&R&U&V&b&e&f&i&k&l&v&x&z&{&}Q$u#eQ$v#fQ$w#gQ$x#hQ$y#iQ$z#jQ${#kQ$|#lQ$}#mQ%O#nQ%P#oR%i$dj!]n#e#f#g#h#i#j#k#l#m#n#o$d!h!iu!T!e!r!w!y!|#]#`#b#p#{$Q$R$W$X$[$^%e%v&O&R&U&V&b&e&f&i&k&l&v&x&z&{&}R#d!Y#V!Wnu!T!Y!e!r!w!y!|#]#`#b#e#f#g#h#i#j#k#l#m#n#o#p#{$Q$R$W$X$[$^$d%e%v&O&R&U&V&b&e&f&i&k&l&v&x&z&{&}f!nu!r!y$^&R&U&e&l&v&z&{Q#^!TQ$Z!wQ$`!|Q$r#`Q$s#bQ%Q#pQ%]$WQ%^$XU%a$[%e&}Q&h&VQ&q&iR&w&x!S!ju!T!r!w!y!|#`#b#p$W$X$[$^%e&R&U&V&e&i&l&v&x&z&{&}[#z!e#{&O&b&f&kQ$o#]Q%Y$QQ%Z$RR&]%vhSOU{}!b!d#V#X#Z#w%U%`!h!Vn!T!Y!e!w!|#]#`#b#e#f#g#h#i#j#k#l#m#n#o#p#{$Q$R$W$X$d%v&O&V&b&f&i&k&xm!ku!r!y$[$^%e&R&U&e&l&v&z&{&}nTOu!r!y$[$^%e&R&U&e&l&v&z&{&}SoU%`W#U{!b#X#ZQ#[}S#v!d%UQ$j#VR%T#wQ$i#UR%p$jQvWe!pu!r!y&R&U&e&l&v&z&{Q#|!eQ%X#{U&`&O&b&kR&n&f",
  nodeNames: "⚠ UntilEOL UntilCommentClose Comment CommentLine CommentOpen Program FunctionDefinition FunctionPrototype QualifiedType TypeQualifier StorageQualifier Identifier const inout in out centroid patch sample uniform buffer shared coherent volatile restrict readonly writeonly subroutine TypeNameList TypeName LayoutQualifier layout LayoutQualifierId Assign Reserved common partition active asm class union enum typedef template this resource goto inline noinline public static extern external interface long short half fixed unsigned superp input output hvec2 hvec3 hvec4 fvec2 fvec3 fvec4 sampler3DRect filter sizeof cast namespace using Number Index LeftBracket RightBracket FunctionCall void float double int uint atomic_uint bool mat2 mat3 mat4 dmat2 dmat3 dmat4 mat2x2 mat2x3 mat2x4 dmat2x2 dmat2x3 dmat2x4 mat3x2 mat3x3 mat3x4 dmat3x2 dmat3x3 dmat3x4 mat4x2 mat4x3 mat4x4 dmat4x2 dmat4x3 dmat4x4 vec2 vec3 vec4 ivec2 ivec3 ivec4 bvec2 bvec3 bvec4 dvec2 dvec3 dvec4 uvec2 uvec3 uvec4 sampler3D samplerCube sampler1DShadow sampler2DShadow samplerCubeShadow sampler1DArray sampler2DArray sampler1DArrayShadow sampler2DArrayShadow samplerCubeArray samplerCubeArrayShadow isampler1D isampler2D isampler3D isamplerCube isampler1DArray isampler2DArray isamplerCubeArray usampler1D usampler2D usampler3D usamplerCube usampler1DArray usampler2DArray usamplerCubeArray sampler2DRect sampler2DRectShadow isampler2DRect usampler2DRect samplerBuffer isamplerBuffer usamplerBuffer sampler2DMS isampler2DMS usampler2DMS sampler2DMSArray isampler2DMSArray usampler2DMSArray image1D iimage1D uimage1D image2D iimage2D uimage2D image3D iimage3D uimage3D image2DRect iimage2DRect uimage2DRect imageCube iimageCube uimageCube imageBuffer iimageBuffer uimageBuffer image1DArray iimage1DArray uimage1DArray image2DArray iimage2DArray uimage2DArray imageCubeArray iimageCubeArray uimageCubeArray image2DMS iimage2DMS uimage2DMS image2DMSArray iimage2DMSArray uimage2DMSArray Field Postfix Inc Dec Unary Add Sub Bang Tilde Binary Mul Div ShiftLeft ShiftRight Lt Lte Gt Gte Eq Neq And Or Xor AndAnd OrOr XorXor Conditional PrecisionQualifier highp medp lowp InterpolationQualifier smooth flat noperspective InvariantQualifier invariant PreciseQualifier precise Struct struct StructDeclarationList StructDeclaration DeclarationSpecifier ArraySpecifier EmptyBrackets ParameterDeclaration StatementList Statement DeclarationStatement Declaration VariableDeclaration SingleDeclaration precision ExpressionStatement SelectionStatement if else SwitchStatement switch CaseLabel default case IterationStatement while Condition do for JumpStatement continue break return discard Preprocessor Hash Directive define undef ifdef ifndef elif endif error pragma extension version line",
  maxTerm: 320,
  skippedNodes: [0,2,3,4,5],
  repeatNodeCount: 12,
  tokenData: "-|~RwX^#lpq#lqr$ast$nvw$sxy%Qyz%Vz{%[{|%a|}%n}!O%s!O!P&Q!P!Q'z!Q!R(g!R![)_![!]*t!]!^*y!^!_+O!_!`+e!`!a+r!a!b,X!c!},^!}#O,o#P#Q,|#Q#R-R#R#S,^#T#o,^#o#p-`#p#q-e#q#r-r#r#s-w#y#z#l$f$g#l#BY#BZ#l$IS$I_#l$I|$JO#l$JT$JU#l$KV$KW#l&FU&FV#l~#qY'f~X^#lpq#l#y#z#l$f$g#l#BY#BZ#l$IS$I_#l$I|$JO#l$JT$JU#l$KV$KW#l&FU&FV#lR$fP%dP!_!`$iQ$nO%pQ~$sO&y~~$xP%q~vw${~%QO%t~~%VO'h~~%[O'j~~%aO%g~~%fP%b~{|%i~%nO%_~~%sO'i~~%xP%c~}!O%{~&QO%`~R&VP'rQ!Q![&YP&_V!mP!Q![&Y!g!h&t!h!i'i!n!o'n#X#Y&t#Y#Z'i#`#a'tP&wQ}!O&}!Q!['TP'QP!Q!['TP'YT!mP!Q!['T!h!i'i!n!o'n#Y#Z'i#`#a'tP'nO!mPP'qP!h!i'iP'wP#Y#Z'i~(PQ%h~z{(V!P!Q([~([OT~~(aQS~OY([Z~([P(lZ!mP!O!P&Y!Q![)_!g!h&t!h!i'i!n!o'n!w!x'i#X#Y&t#Y#Z'i#`#a't#i#j'i#l#m*SP)dY!mP!O!P&Y!Q![)_!g!h&t!h!i'i!n!o'n!w!x'i#X#Y&t#Y#Z'i#`#a't#i#j'iP*VR!Q![*`!c!i*`#T#Z*`P*eT!mP!Q![*`!c!i*`!w!x'i#T#Z*`#i#j'i~*yO't~~+OO'x~~+TQ%k~!^!_+Z!_!`+`~+`O%i~~+eO%l~~+jPr~!_!`+m~+rO%o~~+wQ%m~!_!`+}!`!a,S~,SO%n~~,XO%j~~,^O's~~,cS[~!Q![,^!c!},^#R#S,^#T#o,^~,tP!o~#P#Q,w~,|O&[~~-RO!p~~-WP%s~#Q#R-Z~-`O%v~~-eO'v~~-jP%r~#p#q-m~-rO%u~~-wO'y~~-|O%e~",
  tokenizers: [untilEOL, 0, 1],
  topRules: {"Program":[0,6]},
  specialized: [{term: 12, get: value => spec_Identifier[value] || -1}],
  tokenPrec: 0
})
