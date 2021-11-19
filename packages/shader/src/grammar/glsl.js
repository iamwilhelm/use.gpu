// This file was generated by lezer-generator. You probably shouldn't edit it.
import {LRParser} from "@lezer/lr"
import {untilEOL, untilCommentClose} from "./tokens"
const spec_Identifier = {__proto__:null,const:18, inout:20, in:22, out:24, centroid:26, patch:28, sample:30, uniform:32, buffer:34, shared:36, coherent:38, volatile:40, restrict:42, readonly:44, writeonly:46, subroutine:48, layout:56, common:62, partition:64, active:66, asm:68, class:70, union:72, enum:74, typedef:76, template:78, this:80, resource:82, goto:84, inline:86, noinline:88, public:90, static:92, extern:94, external:96, interface:98, long:100, short:102, half:104, fixed:106, unsigned:108, superp:110, input:112, output:114, hvec2:116, hvec3:118, hvec4:120, fvec2:122, fvec3:124, fvec4:126, sampler3DRect:128, filter:130, sizeof:132, cast:134, namespace:136, using:138, void:174, float:176, double:178, int:180, uint:182, atomic_uint:184, bool:186, mat2:188, mat3:190, mat4:192, dmat2:194, dmat3:196, dmat4:198, mat2x2:200, mat2x3:202, mat2x4:204, dmat2x2:206, dmat2x3:208, dmat2x4:210, mat3x2:212, mat3x3:214, mat3x4:216, dmat3x2:218, dmat3x3:220, dmat3x4:222, mat4x2:224, mat4x3:226, mat4x4:228, dmat4x2:230, dmat4x3:232, dmat4x4:234, vec2:236, vec3:238, vec4:240, ivec2:242, ivec3:244, ivec4:246, bvec2:248, bvec3:250, bvec4:252, dvec2:254, dvec3:256, dvec4:258, uvec2:260, uvec3:262, uvec4:264, sampler3D:266, samplerCube:268, sampler1DShadow:270, sampler2DShadow:272, samplerCubeShadow:274, sampler1DArray:276, sampler2DArray:278, sampler1DArrayShadow:280, sampler2DArrayShadow:282, samplerCubeArray:284, samplerCubeArrayShadow:286, isampler1D:288, isampler2D:290, isampler3D:292, isamplerCube:294, isampler1DArray:296, isampler2DArray:298, isamplerCubeArray:300, usampler1D:302, usampler2D:304, usampler3D:306, usamplerCube:308, usampler1DArray:310, usampler2DArray:312, usamplerCubeArray:314, sampler2DRect:316, sampler2DRectShadow:318, isampler2DRect:320, usampler2DRect:322, samplerBuffer:324, isamplerBuffer:326, usamplerBuffer:328, sampler2DMS:330, isampler2DMS:332, usampler2DMS:334, sampler2DMSArray:336, isampler2DMSArray:338, usampler2DMSArray:340, image1D:342, iimage1D:344, uimage1D:346, image2D:348, iimage2D:350, uimage2D:352, image3D:354, iimage3D:356, uimage3D:358, image2DRect:360, iimage2DRect:362, uimage2DRect:364, imageCube:366, iimageCube:368, uimageCube:370, imageBuffer:372, iimageBuffer:374, uimageBuffer:376, image1DArray:378, iimage1DArray:380, uimage1DArray:382, image2DArray:384, iimage2DArray:386, uimage2DArray:388, imageCubeArray:390, iimageCubeArray:392, uimageCubeArray:394, image2DMS:396, iimage2DMS:398, uimage2DMS:400, image2DMSArray:402, iimage2DMSArray:404, uimage2DMSArray:406, highp:466, medp:468, lowp:470, smooth:474, flat:476, noperspective:478, invariant:482, precise:486, struct:492, precision:518, if:528, else:530, switch:534, default:538, case:540, while:544, do:548, for:550, continue:554, break:556, return:558, discard:560, pragma:564, import:566, export:574, optimize:576, debug:578, STDGL:580, define:584, undef:586, ifdef:588, ifndef:590, elif:592, endif:594, error:596, extension:598, version:600, line:602}
export const parser = LRParser.deserialize({
  version: 13,
  states: "FvO*qQSOOP*{OSOOOOQO'#Iv'#IvO,tQSO'#CbO4pQSO'#HjOOQO'#Ca'#CaO<xQSO'#HzO=VQSO'#HwO=_QSO'#HvO=bQSO'#HvO=gQSO'#IaOOQO'#J['#J[OOQO'#Cc'#CcO>bQSO'#CcOOQO'#Jg'#JgOG|QSO'#CwOOQO'#H^'#H^OOQO'#Hb'#HbOOQO'#Hf'#HfOOQO'#Hh'#HhOHRQSO'#HkOHZQSO'#HvQOQSOOPOOO'#JX'#JXPHfQUO'#JXPOOO)CD{)CD{OOQO-E<t-E<tOHkQSO'#HpOOQO'#Hp'#HpOOQO,5>U,5>UOISQSO'#I{O!%yQSO,5>fOOQO,58{,58{O!&vQSO,58zO!&}QSO'#HxO!'YQSO,5>cOOQO,5>b,5>bO!'bQSO'#JoOOQO,58y,58yO!+hQTO,5>{OOQP'#Ik'#IkO!+mQSO,5>{O!+{QSO,58}O!,QQSO,59cO!,YQSO,5>VO!.RQSO,5>VO!.WQSO,5>bPOOO,5?s,5?sOOQO-E<y-E<yOOQO,5>[,5>[OISQSO'#DuO!0zQWO'#JdOOQO'#Jd'#JdO!1XQSO'#JdO!1dQSO'#EUO!1iQWO'#JbOOQO'#Jc'#JcOISQSO'#GtOOQO'#Jb'#JbO!5lQWO,5?gOOQO'#Ja'#JaOOQO'#Cz'#CzO!,YQSO1G4QO!5sQSO'#JRO!5xQSO1G4ROOQO,5>Z,5>ZO!6QQSO1G.fO!7yQSO,5>dO!8QQSO'#JQO!8VQSO1G3}O!8_QWO'#JaO!:tQWO'#JfOOQO'#Jf'#JfO!;[QSO'#JeO!;mQWO'#JdO!;}QSO'#HjOOQO'#Hu'#HuOOQO'#H|'#H|O!<`QSO'#H|OOQO'#Jp'#JpOOQO'#Ht'#HtOOQO'#JO'#JOO!<eQSO'#HsO!@kQSO,5@ZO!@pQSO'#H}O!@uQSO'#IQO!@zQSO'#ISOISQSO'#ISO!APQSO'#IVO!AUQSO'#IVO!EXQSO'#IVO!E^QSO'#I[O!EcQSO'#I[OOQO1G4g1G4gO!EjQSO1G4gO!ErQTO1G4gO!EwQSO1G4gOOQO'#Cv'#CvO!E|QSO'#CuO!FUQSO1G.iO!FZQSO'#CyOOQO'#Cy'#CyO!FfQSO1G.}O!8QQSO'#HnO!.WQSO'#HnOOQO'#Iz'#IzO!FnQSO'#HmO!HgQSO1G3qO!,YQSO1G3qO!HlQSO1G3|O!HqQSO,5:aO#%jQSO,5:pOOQO,5@O,5@OOOQO,5=],5=]OISQSO,5:mO#%tQSO,5=[OOQO,5=`,5=`OISQSO,5=eOISQSO,5=eOISQSO,5=eOISQSO,5=eOISQSO,5=eOISQSO,5=eOISQSO,5=eOISQSO,5=eOISQSO,5=eOISQSO,5=eOISQSO,5=eOISQSO,5=wOOQO1G5R1G5RO#%yQSO7+)lOOQO,5?m,5?mOOQO-E=P-E=PO#&OQSO'#HrO!.WQSO'#HrOOQO7+$Q7+$QO#&ZQSO7+$QOOQO'#Jq'#JqO!7yQSO'#JqOOQO1G4O1G4OO!&eQSO'#HoOOQO,5?l,5?lOOQO-E=O-E=OOISQSO,5:bOISQSO'#IxO#&cQSO,5@POOQO,5>h,5>hOOQO-E<|-E<|OOQO1G5u1G5uOISQSO,5>iOISQSO,5>lOOQO,5>n,5>nO#&tQSO,5>nO#&yQSO,5>qO#+rQSO,5>qO#+wQSO,5>qOOQO,5>v,5>vO#/UQSO,5>vO#/ZQSO'#IdO#/`QTO7+*RO#/eQ`O7+*ROOQO7+*R7+*RO!+{QSO'#IwO#/jQSO,59aOOQO7+$T7+$TOISQSO,59eO!,QQSO'#IyO#/rQSO7+$iOOQO7+$i7+$iO#/zQSO'#JlO#0SQSO,5>YO!8QQSO,5>YOOQO-E<x-E<xOOQO7+)]7+)]O#0XQSO7+)]OOQO7+)h7+)hOOQO1G/{1G/{OOQO1G0[1G0[O#0^QSO1G0[O#0fQSO1G0[O#0nQSO1G0XOOQO1G2v1G2vOOQO1G3P1G3PO#2aQWO1G3PO#2kQWO1G3PO#4]QWO1G3PO#4mQWO1G3PO#6nQWO1G3PO#8fQWO1G3PO#8mQWO1G3PO#:eQWO1G3PO#<]QWO1G3PO#<dQWO1G3PO#<kQSO1G3cO#<pQSO<<MWO#<xQSO,5>^O#=WQSO,5>^O#=cQSO'#I}O#?XQSO<<GlOOQO<<Gl<<GlO#?aQSO,5@]O#?iQWO1G/|OOQO,5?d,5?dOOQO-E<v-E<vO#@PQSO1G4TO#@UQSO1G4WOOQO1G4Y1G4YO!.WQSO'#CaOOQO'#IX'#IXO#@ZQSO'#IXO#@`QSO1G4]O#@eQSO1G4]O#@jQSO1G4]OOQO1G4b1G4bO#EcQ`O'#IeO#EnQSO,5?OO#/ZQSO,5?OOOQO<<Mm<<MmO#EvQSO<<MmOOQO,5?c,5?cOOQO-E<u-E<uO#E{QWO1G/POOQO,5?e,5?eOOQO-E<w-E<wOOQO<<HT<<HTO!8QQSO'#I|O#FVQSO,5@WOOQO1G3t1G3tO#F_QSO1G3tOOQO<<Lw<<LwO#FdQSO7+%vOOQO7+%v7+%vOOQO7+%s7+%sOISQSO7+(}OOQOANBrANBrOOQO1G3x1G3xO#FlQSO1G3xOOQO,5?i,5?iOOQO-E<{-E<{OOQOAN=WAN=WO#FzQSO1G5wO#GUQSO1G5wOOQO1G5w1G5wO!AUQSO7+)oO#G^QSO7+)rO#GcQSO,5>sO!AUQSO7+)wOISQSO7+)wO#GhQSO7+)wO#GmQSO,5?PO#GrQSO1G4jOOQO1G4j1G4jO#GzQSO1G4jOOQO-E=Q-E=QO#HSQTOANCXOOQO,5?h,5?hOOQO-E<z-E<zOOQO7+)`7+)`OOQO<<Ib<<IbOOQO<<Li<<LiOOQO7+)d7+)dOOQO,5?k,5?kOOQO7++c7++cO#HXQSO7++cOOQO-E<}-E<}O#HcQSO<<MZO!'bQSO<<M^O!7yQSO1G4_OOQO<<Mc<<McO$'|QSO<<McO$(RQSO<<McOOQO1G4k1G4kOOQO7+*U7+*UO$(YQSO7+*UP$(bQSO'#JSOOQOG28sG28sOOQO<<N}<<N}P!7yQSO'#JPO!AUQSOANBuO$(gQSOANBxOOQO7+)y7+)yO$(lQSOANB}OOQOANB}ANB}O$(qQSOANB}OOQO<<Mp<<MpPOQO,5?n,5?nOOQOG28aG28aOOQOG28dG28dOOQOG28iG28iO$(vQWO'#Jd",
  stateData: "$+k~O'zOS'|PQ'}PQ~OX[OY[OZ[O[[O][O^[O_[O`[Oa[Ob[Oc[Od[Oe[Of[Og[Oh]Ol_O!y^O!z^O!{^O!|^O!}^O#O^O#P^O#Q^O#R^O#S^O#T^O#U^O#V^O#W^O#X^O#Y^O#Z^O#[^O#]^O#^^O#_^O#`^O#a^O#b^O#c^O#d^O#e^O#f^O#g^O#h^O#i^O#j^O#k^O#l^O#m^O#n^O#o^O#p^O#q^O#r^O#s^O#t^O#u^O#v^O#w^O#x^O#y^O#z^O#{^O#|^O#}^O$O^O$P^O$Q^O$R^O$S^O$T^O$U^O$V^O$W^O$X^O$Y^O$Z^O$[^O$]^O$^^O$_^O$`^O$a^O$b^O$c^O$d^O$e^O$f^O$g^O$h^O$i^O$j^O$k^O$l^O$m^O$n^O$o^O$p^O$q^O$r^O$s^O$t^O$u^O$v^O$w^O$x^O$y^O$z^O${^O$|^O$}^O%O^O%P^O%Q^O%R^O%S^O%T^O%U^O%V^O%W^O%X^O%Y^O%Z^O%[^O%]^O%^^O%_^O%`^O%a^O%b^O%c^O&R`O&S`O&T`O&VaO&WaO&XaO&ZbO&]cO&`dO&meO~OWSO(fYO~P]O'|gO'}hO~OX[OY[OZ[O[[O][O^[O_[O`[Oa[Ob[Oc[Od[Oe[Of[Og[Oh]Ol_O&R`O&S`O&T`O&VaO&WaO&XaO&ZbO&]cO~OWUX!yUX!zUX!{UX!|UX!}UX#OUX#PUX#QUX#RUX#SUX#TUX#UUX#VUX#WUX#XUX#YUX#ZUX#[UX#]UX#^UX#_UX#`UX#aUX#bUX#cUX#dUX#eUX#fUX#gUX#hUX#iUX#jUX#kUX#lUX#mUX#nUX#oUX#pUX#qUX#rUX#sUX#tUX#uUX#vUX#wUX#xUX#yUX#zUX#{UX#|UX#}UX$OUX$PUX$QUX$RUX$SUX$TUX$UUX$VUX$WUX$XUX$YUX$ZUX$[UX$]UX$^UX$_UX$`UX$aUX$bUX$cUX$dUX$eUX$fUX$gUX$hUX$iUX$jUX$kUX$lUX$mUX$nUX$oUX$pUX$qUX$rUX$sUX$tUX$uUX$vUX$wUX$xUX$yUX$zUX${UX$|UX$}UX%OUX%PUX%QUX%RUX%SUX%TUX%UUX%VUX%WUX%XUX%YUX%ZUX%[UX%]UX%^UX%_UX%`UX%aUX%bUX%cUX&`UX(aUX~P+TO!vnO&elOW&^X(a&^X(Q&^X(R&^X~O!y^O!z^O!{^O!|^O!}^O#O^O#P^O#Q^O#R^O#S^O#T^O#U^O#V^O#W^O#X^O#Y^O#Z^O#[^O#]^O#^^O#_^O#`^O#a^O#b^O#c^O#d^O#e^O#f^O#g^O#h^O#i^O#j^O#k^O#l^O#m^O#n^O#o^O#p^O#q^O#r^O#s^O#t^O#u^O#v^O#w^O#x^O#y^O#z^O#{^O#|^O#}^O$O^O$P^O$Q^O$R^O$S^O$T^O$U^O$V^O$W^O$X^O$Y^O$Z^O$[^O$]^O$^^O$_^O$`^O$a^O$b^O$c^O$d^O$e^O$f^O$g^O$h^O$i^O$j^O$k^O$l^O$m^O$n^O$o^O$p^O$q^O$r^O$s^O$t^O$u^O$v^O$w^O$x^O$y^O$z^O${^O$|^O$}^O%O^O%P^O%Q^O%R^O%S^O%T^O%U^O%V^O%W^O%X^O%Y^O%Z^O%[^O%]^O%^^O%_^O%`^O%a^O%b^O%c^O&`dO~OWoO(a&nX(a&oX~P5UOWqO(a&kX~O(_uO(atO~O&rxO&sxO'UyO'`xO'axO'bxO'cxO'dxO'exO'fxO'gxO'hxO'ixO~O(PzOWVXXVXYVXZVX[VX]VX^VX_VX`VXaVXbVXcVXdVXeVXfVXgVXhVXlVX!yVX!zVX!{VX!|VX!}VX#OVX#PVX#QVX#RVX#SVX#TVX#UVX#VVX#WVX#XVX#YVX#ZVX#[VX#]VX#^VX#_VX#`VX#aVX#bVX#cVX#dVX#eVX#fVX#gVX#hVX#iVX#jVX#kVX#lVX#mVX#nVX#oVX#pVX#qVX#rVX#sVX#tVX#uVX#vVX#wVX#xVX#yVX#zVX#{VX#|VX#}VX$OVX$PVX$QVX$RVX$SVX$TVX$UVX$VVX$WVX$XVX$YVX$ZVX$[VX$]VX$^VX$_VX$`VX$aVX$bVX$cVX$dVX$eVX$fVX$gVX$hVX$iVX$jVX$kVX$lVX$mVX$nVX$oVX$pVX$qVX$rVX$sVX$tVX$uVX$vVX$wVX$xVX$yVX$zVX${VX$|VX$}VX%OVX%PVX%QVX%RVX%SVX%TVX%UVX%VVX%WVX%XVX%YVX%ZVX%[VX%]VX%^VX%_VX%`VX%aVX%bVX%cVX&RVX&SVX&TVX&VVX&WVX&XVX&ZVX&]VX&`VX(aVX~O(P{O~OW}O(_|O~O&R`O&S`O&T`O~O'x!PO~O!vnO&e!ROW&dX(a&dX(Q&dX(S&dX(R&dX~OW!TOo!_Op!_Oq!_Or!_Os!_Ot!_Ou!_Ov!_Ow!_Ox!_Oy!_Oz!_O{!_O|!_O}!_O!O!_O!P!_O!Q!_O!R!_O!S!_O!T!_O!U!_O!V!_O!W!_O!X!_O!Y!_O!Z!_O![!_O!]!_O!^!_O!_!_O!`!_O!a!_O!b!_O!c!_O!d!_O!e!_O!f!_O!g!_O!h!UO!y^O!z^O!{^O!|^O!}^O#O^O#P^O#Q^O#R^O#S^O#T^O#U^O#V^O#W^O#X^O#Y^O#Z^O#[^O#]^O#^^O#_^O#`^O#a^O#b^O#c^O#d^O#e^O#f^O#g^O#h^O#i^O#j^O#k^O#l^O#m^O#n^O#o^O#p^O#q^O#r^O#s^O#t^O#u^O#v^O#w^O#x^O#y^O#z^O#{^O#|^O#}^O$O^O$P^O$Q^O$R^O$S^O$T^O$U^O$V^O$W^O$X^O$Y^O$Z^O$[^O$]^O$^^O$_^O$`^O$a^O$b^O$c^O$d^O$e^O$f^O$g^O$h^O$i^O$j^O$k^O$l^O$m^O$n^O$o^O$p^O$q^O$r^O$s^O$t^O$u^O$v^O$w^O$x^O$y^O$z^O${^O$|^O$}^O%O^O%P^O%Q^O%R^O%S^O%T^O%U^O%V^O%W^O%X^O%Y^O%Z^O%[^O%]^O%^^O%_^O%`^O%a^O%b^O%c^O%f!ZO%g!ZO%i!ZO%j!ZO%k!ZO%l!ZO(P!SO~O!vnO&elO(Q!aO(_!`OW&^X(a&^X(a&na(a&oa~O!vnO&elO(Q&cX(S&cX(a&cX~O(P!dO~P!&eO(S!eO(Q&lX(a&lX~O(Q!fO(a&ka~OW!lOo!_Op!_Oq!_Or!_Os!_Ot!_Ou!_Ov!_Ow!_Ox!_Oy!_Oz!_O{!_O|!_O}!_O!O!_O!P!_O!Q!_O!R!_O!S!_O!T!_O!U!_O!V!_O!W!_O!X!_O!Y!_O!Z!_O![!_O!]!_O!^!_O!_!_O!`!_O!a!_O!b!_O!c!_O!d!_O!e!_O!f!_O!g!_O!h!UO%f!ZO%g!ZO%i!ZO%j!ZO%k!ZO%l!ZO&r!vO&u!wO&w!xO&x!yO&z!zO&|!{O&}!|O'P!}O'Q!}O'R#OO'S!}O(P!SO(_uO(a!oO(b&gP~P]OP#PO~O'V#QO'Z#RO'[#RO']#SO~OW#TO~OW#WOb#XO~OWSOX[OY[OZ[O[[O][O^[O_[O`[Oa[Ob[Oc[Od[Oe[Of[Og[Oh]Ol_O&R`O&S`O&T`O&VaO&WaO&XaO&ZbO&]cO(b&aP~P5UO(_#`O~OWSO~P5UO(P#cO!v(WX%f(WX%g(WX%i(WX%j(WX%n(WX%o(WX%p(WX%q(WX%r(WX%s(WX%t(WX%u(WX%v(WX%w(WX%x(WX%y(WX%z(WX%{(WX%|(WX%}(WX&O(WX([(WX(](WX!k(WX!l(WX!m(WX!n(WX!o(WX!p(WX!q(WX!r(WX!s(WX!t(WX(Q(WX(R(WX(S(WX(a(WX~O!w(WX(^(WX(b(WX~P!._OW#dO!h#dO(P!SO~O(P#cO~O!v#fO%f#eO%g#eO([#gO!w(UX%i(UX%j(UX%n(UX%o(UX%p(UX%q(UX%r(UX%s(UX%t(UX%u(UX%v(UX%w(UX%x(UX%y(UX%z(UX%{(UX%|(UX%}(UX&O(UX(](UX!k(UX!l(UX!m(UX!n(UX!o(UX!p(UX!q(UX!r(UX!s(UX!t(UX(Q(UX(S(UX(a(UX(R(UX(^(UX(b(UX~O%i#jO%j#jO%n#iO%o#iO%p#iO%q#kO%r#kO%s#lO%t#lO%u#lO%v#lO%w#mO%x#mO%y#nO%z#oO%{#pO%|#qO%}#rO&O#sO(]#tO~O!w#uO~P!4[OW#wO~O(Q!aO(a&oi~OWSOX[OY[OZ[O[[O][O^[O_[O`[Oa[Ob[Oc[Od[Oe[Of[Og[Oh]Ol_O&R`O&S`O&T`O&VaO&WaO&XaO&ZbO&]cO(R#{O~P5UO(_$OO~PISOW$QO~O(Q!fO(a&ki~O!k$TO!l$TO!m$TO!n$TO!o$TO!p$TO!q$TO!r$TO!s$TO!t$TO(S$TO%i(TX%j(TX%n(TX%o(TX%p(TX%q(TX%r(TX%s(TX%t(TX%u(TX%v(TX%w(TX%x(TX%y(TX%z(TX%{(TX%|(TX%}(TX&O(TX(Q(TX(](TX(a(TX(R(TX(^(TX!w(TX(b(TX~O(Q(YX(a(YX(R(YX(^(YX!w(YX(b(YX~P!4[O(Q$UO(a(XX(R(XX(^(XX!w(XX~O!vnO&elOW&^X(a&^X~P!._O!vnO&elO(P#cOW&^X(a&^X~O(a$WO~OW!lOo!_Op!_Oq!_Or!_Os!_Ot!_Ou!_Ov!_Ow!_Ox!_Oy!_Oz!_O{!_O|!_O}!_O!O!_O!P!_O!Q!_O!R!_O!S!_O!T!_O!U!_O!V!_O!W!_O!X!_O!Y!_O!Z!_O![!_O!]!_O!^!_O!_!_O!`!_O!a!_O!b!_O!c!_O!d!_O!e!_O!f!_O!g!_O!h!UO%f!ZO%g!ZO%i!ZO%j!ZO%k!ZO%l!ZO&r!vO&u!wO&w!xO&x!yO&z!zO&|!{O&}!|O'P!}O'Q!}O'R#OO'S!}O(P!SO(_uO(a!oO(b&gX~P]O(b$YO~O(P$ZO~O(P$[O~O(^$]O~O(P$_O~OW!lOo!_Op!_Oq!_Or!_Os!_Ot!_Ou!_Ov!_Ow!_Ox!_Oy!_Oz!_O{!_O|!_O}!_O!O!_O!P!_O!Q!_O!R!_O!S!_O!T!_O!U!_O!V!_O!W!_O!X!_O!Y!_O!Z!_O![!_O!]!_O!^!_O!_!_O!`!_O!a!_O!b!_O!c!_O!d!_O!e!_O!f!_O!g!_O!h!UO%f!ZO%g!ZO%i!ZO%j!ZO%k!ZO%l!ZO&r!vO&u!wO&w!xO&x!yO&z!zO&|!{O&}!|O'P!}O'Q!}O'R#OO'S!}O(P!SO(_uO(a!oO~P]O(P$aO~O(a$bO~O(a$bO~PISO'Y$eO(_$dO~OP$gO~O'^$eO~O(Q$hO(RiX~O(R$jO~O(S$kO(QmX(RmX~O(Q$lO(R$nO~OWSOX[OY[OZ[O[[O][O^[O_[O`[Oa[Ob[Oc[Od[Oe[Of[Og[Oh]Ol_O&R`O&S`O&T`O&VaO&WaO&XaO&ZbO&]cO(b&aX~P5UO(b$sO~O(a$uO~O(R$vO~OW!TOo!_Op!_Oq!_Or!_Os!_Ot!_Ou!_Ov!_Ow!_Ox!_Oy!_Oz!_O{!_O|!_O}!_O!O!_O!P!_O!Q!_O!R!_O!S!_O!T!_O!U!_O!V!_O!W!_O!X!_O!Y!_O!Z!_O![!_O!]!_O!^!_O!_!_O!`!_O!a!_O!b!_O!c!_O!d!_O!e!_O!f!_O!g!_O!h!UO!z^O!{^O!|^O!}^O#O^O#P^O#Q^O#R^O#S^O#T^O#U^O#V^O#W^O#X^O#Y^O#Z^O#[^O#]^O#^^O#_^O#`^O#a^O#b^O#c^O#d^O#e^O#f^O#g^O#h^O#i^O#j^O#k^O#l^O#m^O#n^O#o^O#p^O#q^O#r^O#s^O#t^O#u^O#v^O#w^O#x^O#y^O#z^O#{^O#|^O#}^O$O^O$P^O$Q^O$R^O$S^O$T^O$U^O$V^O$W^O$X^O$Y^O$Z^O$[^O$]^O$^^O$_^O$`^O$a^O$b^O$c^O$d^O$e^O$f^O$g^O$h^O$i^O$j^O$k^O$l^O$m^O$n^O$o^O$p^O$q^O$r^O$s^O$t^O$u^O$v^O$w^O$x^O$y^O$z^O${^O$|^O$}^O%O^O%P^O%Q^O%R^O%S^O%T^O%U^O%V^O%W^O%X^O%Y^O%Z^O%[^O%]^O%^^O%_^O%`^O%a^O%b^O%c^O%f!ZO%g!ZO%i!ZO%j!ZO%k!ZO%l!ZO(P!SO~O!y$yO(R$wO~P!HvOW${O~O(b%YO~OW%ZO(Q&fX(R&fX~O(Q%]O(R%_O~O(Q$UO(a(Xa(R(Xa(^(Xa!w(Xa~O(^%fO~OW!lOX[OY[OZ[O[[O][O^[O_[O`[Oa[Ob[Oc[Od[Oe[Of[Og[Oh]Ol_Oo!_Op!_Oq!_Or!_Os!_Ot!_Ou!_Ov!_Ow!_Ox!_Oy!_Oz!_O{!_O|!_O}!_O!O!_O!P!_O!Q!_O!R!_O!S!_O!T!_O!U!_O!V!_O!W!_O!X!_O!Y!_O!Z!_O![!_O!]!_O!^!_O!_!_O!`!_O!a!_O!b!_O!c!_O!d!_O!e!_O!f!_O!g!_O!h!UO%f!ZO%g!ZO%i!ZO%j!ZO%k!ZO%l!ZO&R`O&S`O&T`O&VaO&WaO&XaO&ZbO&]cO(P!SO~P5UO&z%kO~OW!lOo!_Op!_Oq!_Or!_Os!_Ot!_Ou!_Ov!_Ow!_Ox!_Oy!_Oz!_O{!_O|!_O}!_O!O!_O!P!_O!Q!_O!R!_O!S!_O!T!_O!U!_O!V!_O!W!_O!X!_O!Y!_O!Z!_O![!_O!]!_O!^!_O!_!_O!`!_O!a!_O!b!_O!c!_O!d!_O!e!_O!f!_O!g!_O!h!UO%f!ZO%g!ZO%i!ZO%j!ZO%k!ZO%l!ZO(P!SO(a!oO~P]O(a%mO~OW%nO~OP%qO~O(h%rO~O(Q$hO(Ria~O(Q$lO(R%xO~O(Q%yO(a(`X~O(a%{O~O(b%}O~O(Q$UO(R&PO~O(R&PO(P(ZX~O!w&QO~O%n#iO%o#iO%p#iO!w%mi%q%mi%r%mi%s%mi%t%mi%u%mi%v%mi%w%mi%x%mi%y%mi%z%mi%{%mi%|%mi%}%mi&O%mi(]%mi(Q%mi(a%mi(R%mi(^%mi(b%mi~O%i%mi%j%mi~P#0sO%i#jO%j#jO~P#0sO%i#jO%j#jO%n#iO%o#iO%p#iO%q#kO%r#kO!w%mi%w%mi%x%mi%y%mi%z%mi%{%mi%|%mi%}%mi&O%mi(]%mi(Q%mi(a%mi(R%mi(^%mi(b%mi~O%s%mi%t%mi%u%mi%v%mi~P#2uO%s#lO%t#lO%u#lO%v#lO~P#2uO%i#jO%j#jO%n#iO%o#iO%p#iO%q#kO%r#kO%s#lO%t#lO%u#lO%v#lO%w#mO%x#mO!w%mi%z%mi%{%mi%|%mi%}%mi&O%mi(]%mi(Q%mi(a%mi(R%mi(^%mi(b%mi~O%y%mi~P#4}O%i#jO%j#jO%n#iO%o#iO%p#iO%q#kO%r#kO%s#lO%t#lO%u#lO%v#lO%w#mO%x#mO%y#nO!w%mi%z%mi%|%mi%}%mi&O%mi(]%mi(Q%mi(a%mi(R%mi(^%mi(b%mi~O%{#pO~P#6uO%y#nO~P#4}O%i#jO%j#jO%n#iO%o#iO%p#iO%q#kO%r#kO%s#lO%t#lO%u#lO%v#lO%w#mO%x#mO%y#nO%z#oO%{#pO!w%mi%}%mi&O%mi(]%mi(Q%mi(a%mi(R%mi(^%mi(b%mi~O%|%mi~P#8tO%i#jO%j#jO%n#iO%o#iO%p#iO%q#kO%r#kO%s#lO%t#lO%u#lO%v#lO%w#mO%x#mO%y#nO%z#oO%{#pO%|#qO!w%mi%}%mi(]%mi(Q%mi(a%mi(R%mi(^%mi(b%mi~O&O#sO~P#:lO%|#qO~P#8tO(^&RO~OW$QO(a&ny~O!vnO&elO(Q&fa(R&fa~OW&UO(Q&fa(R&fa~OWSOX[OY[OZ[O[[O][O^[O_[O`[Oa[Ob[Oc[Od[Oe[Of[Og[Oh]Ol_O&R`O&S`O&T`O&VaO&WaO&XaO&ZbO&]cO~P5UO(Q%]O(R&XO~O(Q&YO(b&[O~O(Q!ji(a!ji(R!ji(^!ji!w!ji(b!ji~P!4[O(R&]O~O(R&^O~OW&_O~O(R&`O~O(P&aO~OW']OX[OY[OZ[O[[O][O^[O_[O`[Oa[Ob[Oc[Od[Oe[Of[Og[Oh]Ol_Oo!_Op!_Oq!_Or!_Os!_Ot!_Ou!_Ov!_Ow!_Ox!_Oy!_Oz!_O{!_O|!_O}!_O!O!_O!P!_O!Q!_O!R!_O!S!_O!T!_O!U!_O!V!_O!W!_O!X!_O!Y!_O!Z!_O![!_O!]!_O!^!_O!_!_O!`!_O!a!_O!b!_O!c!_O!d!_O!e!_O!f!_O!g!_O!h!UO%f!ZO%g!ZO%i!ZO%j!ZO%k!ZO%l!ZO&R`O&S`O&T`O&VaO&WaO&XaO&ZbO&]cO(P!SO~P5UO(g&cO(Q'XX(b'XX~O(Q&dO(b&eO~O'Y&hO~O(Qmi(Rmi~P!4[O(Q%yO(a(`a~O(a&kO~O(Q$UO(R&lO~O!vnO&elO(Q&fi(R&fi~O(_$OO(b&pO~PISO(Q&qO(b&pO~O(_&tO~O(S&uO~O(a&xO~OW&yO~O(b&zOW'va~O(Q&{O(b&zO~OP&}O~O(_$OO(b'OO~PISO&s'QOW&qyX&qyY&qyZ&qy[&qy]&qy^&qy_&qy`&qya&qyb&qyc&qyd&qye&qyf&qyg&qyh&qyl&qyo&qyp&qyq&qyr&qys&qyt&qyu&qyv&qyw&qyx&qyy&qyz&qy{&qy|&qy}&qy!O&qy!P&qy!Q&qy!R&qy!S&qy!T&qy!U&qy!V&qy!W&qy!X&qy!Y&qy!Z&qy![&qy!]&qy!^&qy!_&qy!`&qy!a&qy!b&qy!c&qy!d&qy!e&qy!f&qy!g&qy!h&qy!y&qy!z&qy!{&qy!|&qy!}&qy#O&qy#P&qy#Q&qy#R&qy#S&qy#T&qy#U&qy#V&qy#W&qy#X&qy#Y&qy#Z&qy#[&qy#]&qy#^&qy#_&qy#`&qy#a&qy#b&qy#c&qy#d&qy#e&qy#f&qy#g&qy#h&qy#i&qy#j&qy#k&qy#l&qy#m&qy#n&qy#o&qy#p&qy#q&qy#r&qy#s&qy#t&qy#u&qy#v&qy#w&qy#x&qy#y&qy#z&qy#{&qy#|&qy#}&qy$O&qy$P&qy$Q&qy$R&qy$S&qy$T&qy$U&qy$V&qy$W&qy$X&qy$Y&qy$Z&qy$[&qy$]&qy$^&qy$_&qy$`&qy$a&qy$b&qy$c&qy$d&qy$e&qy$f&qy$g&qy$h&qy$i&qy$j&qy$k&qy$l&qy$m&qy$n&qy$o&qy$p&qy$q&qy$r&qy$s&qy$t&qy$u&qy$v&qy$w&qy$x&qy$y&qy$z&qy${&qy$|&qy$}&qy%O&qy%P&qy%Q&qy%R&qy%S&qy%T&qy%U&qy%V&qy%W&qy%X&qy%Y&qy%Z&qy%[&qy%]&qy%^&qy%_&qy%`&qy%a&qy%b&qy%c&qy%f&qy%g&qy%i&qy%j&qy%k&qy%l&qy&R&qy&S&qy&T&qy&V&qy&W&qy&X&qy&Z&qy&]&qy&`&qy&m&qy&r&qy&u&qy&w&qy&x&qy&z&qy&|&qy&}&qy'P&qy'Q&qy'R&qy'S&qy(P&qy(_&qy(a&qy(b&qy~O(R'TO~O(R'UO~PISO(b'WOW'va~O(Q'XO~O(b'ZO~O(a'[O~O(R'[O~O!vnO&elO(P#cOW&^X!k(WX!l(WX!m(WX!n(WX!o(WX!p(WX!q(WX!r(WX!s(WX!t(WX!v(WX%f(WX%g(WX%i(WX%j(WX%n(WX%o(WX%p(WX%q(WX%r(WX%s(WX%t(WX%u(WX%v(WX%w(WX%x(WX%y(WX%z(WX%{(WX%|(WX%}(WX&O(WX(Q(WX(S(WX([(WX(](WX(a(WX~OW~",
  goto: ">w(fPPP(g(j(w)W)qPPPPPPPPPPPPPPPPP*V*Y)qP*`*fPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP+e,gPPPPPPPPPP-VPP-VPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP-V-VPP.UPPPP/TPPPPPPPPPPPPPPPPP/T0RPPP)qPPP)qP)qP0j1`P1x2R2X2gP2x3O3U3g3s4Q4]P4Q4Q3g4cPP4cP4cPP4cP4lPP4cPPPP(gPP4r4uPPPPP4{PPPPPPPPPP5O5f5l5v5|6U6d6j6p6w6}7T7ZPPPP7aPP7dPPPP7g9R:U-V;T<O<vPPPP>VPP>]>`>iRZOQWOaXu!t!{$a&]&`&t'QbVOu!t!{$a&]&`&t'QT%i$_%lbUOu!t!{$a&]&`&t'QW#[|!`#^#`S#z!d%]T%g$_%luQORu|!`!d!t!{#^#`$_$a%]%l&]&`&t'QR#VzQ#UzR%s$hQ#Y{R%v$l!y!Vnu!S!Z!e!t!y!{#O#c#f#i#j#k#l#m#n#o#p#q#r#s#t$O$T$U$Z$[$_$a$k%l&R&Y&]&`&a&q&t&u&x'P'Q!x!Unu!S!Z!e!t!y!{#O#c#f#i#j#k#l#m#n#o#p#q#r#s#t$O$T$U$Z$[$_$a$k%l&R&Y&]&`&a&q&t&u&x'P'QR#d!V!Z!ju!S!e!t!y!{#O#c#f#t$O$U$Z$[$_$a%l&R&Y&]&`&a&q&t&u&x'P'Q!y!Ynu!S!Z!e!t!y!{#O#c#f#i#j#k#l#m#n#o#p#q#r#s#t$O$T$U$Z$[$_$a$k%l&R&Y&]&`&a&q&t&u&x'P'Q!y![nu!S!Z!e!t!y!{#O#c#f#i#j#k#l#m#n#o#p#q#r#s#t$O$T$U$Z$[$_$a$k%l&R&Y&]&`&a&q&t&u&x'P'Q!w!^nu!S!e!t!y!{#O#c#f#i#j#k#l#m#n#o#p#q#r#s#t$O$T$U$Z$[$_$a$k%l&R&Y&]&`&a&q&t&u&x'P'QtQORu|!`!d!t!{#^#`$_$a%]%l&]&`&t'QR!OefTOu!t!{$_$a%l&]&`&t'QSpU%gW#Z|!`#^#`Q#a!OS#y!d%]Q$q#[R%[#z}SOUu|!O!`!d!t!{#[#^#`#z$_$a%]%g%l&]&`&t'QQ#_|Q#v!`R$t#`X#]|!`#^#`SrV!fS$o#Z$qQ&S%YR&i%yYmSo!l!m']S!cq$QQ&T%ZR&n&UQ#|!dR&V%]Q!uuR'R&tU!su!t&tQ$`!{Q&s&]Q&v&`R'Y'Q^!qu!t!{&]&`&t'QR%l$aQZOa!nu!t!{$a&]&`&t'QcXOu!t!{$a&]&`&t'QQsVR$R!f_!qu!t!{&]&`&t'QQ%j$_R&b%lR$f#QQ%o$dR&f%pRwYrROu|!`!d!t!{#^#`$_$a%]%l&]&`&t'QRjRQ$i#UR%t$iQ$V!kS%c$V&OR&O$xQ$m#YR%w$mU#^|!`#`R$r#^bkSoq!l!m$Q%Z&U']R!QkQ%z$oR&j%zQ%^#|R&W%^S!tu&tR$X!tQ&Z%`R&r&ZQ!gsR$S!gQ!boR#x!bQ%p$dR&g%pRiPRfOQ!]n!Y!iu!S!e!t!y!{#O#c#f#t$O$U$Z$[$_$a%l&R&Y&]&`&a&q&t&u&x'P'QQ$|#iQ$}#jQ%O#kQ%P#lQ%Q#mQ%R#nQ%S#oQ%T#pQ%U#qQ%V#rQ%W#sQ%a$TR%u$kl!^n#i#j#k#l#m#n#o#p#q#r#s$T$k!Y!hu!S!e!t!y!{#O#c#f#t$O$U$Z$[$_$a%l&R&Y&]&`&a&q&t&u&x'P'QR#h!Z!y!Xnu!S!Z!e!t!y!{#O#c#f#i#j#k#l#m#n#o#p#q#r#s#t$O$T$U$Z$[$_$a$k%l&R&Y&]&`&a&q&t&u&x'P'Q`!pu!t!{$a&]&`&t'QQ#b!SQ$^!yQ$c#OQ$z#fQ%X#tQ%d$ZQ%e$[S%h$_%lQ&w&aR'V&xv!ku!S!t!y!{#O#f#t$Z$[$_$a%l&]&`&a&t&x'Q[#}!e$O&Y&q&u'PQ$x#cQ%b$UR&m&RhSOU|!O!`!d#[#^#`#z%]%g!d!Wn!S!Z!e!y#O#c#f#i#j#k#l#m#n#o#p#q#r#s#t$O$T$U$Z$[$k&R&Y&a&q&u&x'Pe!mu!t!{$_$a%l&]&`&t'QQ$p#ZR%|$qQvW_!ru!t!{&]&`&t'QQ$P!eQ%`$OU&o&Y&q'PR'S&u",
  nodeNames: "⚠ UntilEOL Program FunctionDefinition FunctionPrototype QualifiedType TypeQualifier StorageQualifier Identifier const inout in out centroid patch sample uniform buffer shared coherent volatile restrict readonly writeonly subroutine TypeNameList TypeName LayoutQualifier layout LayoutQualifierId Reserved common partition active asm class union enum typedef template this resource goto inline noinline public static extern external interface long short half fixed unsigned superp input output hvec2 hvec3 hvec4 fvec2 fvec3 fvec4 sampler3DRect filter sizeof cast namespace using Number Parens Assignment MulAssign DivAssign ModAssign AddAssign SubAssign LeftAssign RightAssign AndAssign XorAssign OrAssign Index LeftBracket RightBracket FunctionCall void float double int uint atomic_uint bool mat2 mat3 mat4 dmat2 dmat3 dmat4 mat2x2 mat2x3 mat2x4 dmat2x2 dmat2x3 dmat2x4 mat3x2 mat3x3 mat3x4 dmat3x2 dmat3x3 dmat3x4 mat4x2 mat4x3 mat4x4 dmat4x2 dmat4x3 dmat4x4 vec2 vec3 vec4 ivec2 ivec3 ivec4 bvec2 bvec3 bvec4 dvec2 dvec3 dvec4 uvec2 uvec3 uvec4 sampler3D samplerCube sampler1DShadow sampler2DShadow samplerCubeShadow sampler1DArray sampler2DArray sampler1DArrayShadow sampler2DArrayShadow samplerCubeArray samplerCubeArrayShadow isampler1D isampler2D isampler3D isamplerCube isampler1DArray isampler2DArray isamplerCubeArray usampler1D usampler2D usampler3D usamplerCube usampler1DArray usampler2DArray usamplerCubeArray sampler2DRect sampler2DRectShadow isampler2DRect usampler2DRect samplerBuffer isamplerBuffer usamplerBuffer sampler2DMS isampler2DMS usampler2DMS sampler2DMSArray isampler2DMSArray usampler2DMSArray image1D iimage1D uimage1D image2D iimage2D uimage2D image3D iimage3D uimage3D image2DRect iimage2DRect uimage2DRect imageCube iimageCube uimageCube imageBuffer iimageBuffer uimageBuffer image1DArray iimage1DArray uimage1DArray image2DArray iimage2DArray uimage2DArray imageCubeArray iimageCubeArray uimageCubeArray image2DMS iimage2DMS uimage2DMS image2DMSArray iimage2DMSArray uimage2DMSArray Field Postfix Inc Dec Unary Add Sub Bang Tilde Binary Mul Div Mod Left Right Lt Lte Gt Gte Eq Neq And Or Xor AndAnd OrOr XorXor Conditional PrecisionQualifier highp medp lowp InterpolationQualifier smooth flat noperspective InvariantQualifier invariant PreciseQualifier precise TypeSpecifier Struct struct StructDeclarationList StructDeclaration DeclarationSpecifier ArraySpecifier EmptyBrackets ParameterDeclaration StatementList Statement DeclarationStatement Declaration VariableDeclaration SingleDeclaration precision QualifiedStructDeclaration QualifiedDeclaration ExpressionStatement SelectionStatement if else SwitchStatement switch CaseLabel default case IterationStatement while Condition do for JumpStatement continue break return discard Preprocessor pragma import ImportDeclarationList ImportDeclaration String export optimize debug STDGL Directive define undef ifdef ifndef elif endif error extension version line",
  maxTerm: 346,
  skippedNodes: [0],
  repeatNodeCount: 13,
  tokenData: "5j~R}X^$Opq$Oqr$srs%Qst&auv&fvw&swx'Yxy(dyz(iz{(n{|({|})b}!O)g!O!P)|!P!Q+v!Q!R,k!R![-c![!].x!]!^.}!^!_/S!_!`/q!`!a0O!a!b0m!c!}0r!}#O1T#P#Q1b#Q#R1g#R#S0r#T#U1|#U#Y0r#Y#Z2x#Z#o0r#o#p4t#p#q4y#q#r5`#r#s5e#y#z$O$f$g$O#BY#BZ$O$IS$I_$O$I|$JO$O$JT$JU$O$KV$KW$O&FU&FV$O~$TY'z~X^$Opq$O#y#z$O$f$g$O#BY#BZ$O$IS$I_$O$I|$JO$O$JT$JU$O$KV$KW$O&FU&FV$OR$xP%kP!_!`${Q%QO%xQ~%TTOr%Qrs%ds#O%Q#O#P%i#P~%Q~%iO'Y~~%lTOr%Qrs%{s#O%Q#O#P%i#P~%Q~&QT'Y~Or%Qrs%ds#O%Q#O#P%i#P~%Q~&fO(f~~&kP%p~!_!`&n~&sO!m~~&xQ%y~vw'O!_!`'T~'TO%|~~'YO!r~~']TOw'Ywx%dx#O'Y#O#P'l#P~'Y~'oTOw'Ywx(Ox#O'Y#O#P'l#P~'Y~(TT'Y~Ow'Ywx%dx#O'Y#O#P'l#P~'Y~(iO(P~~(nO(R~~(sP%n~!_!`(v~({O!k~~)QQ%i~{|)W!_!`)]~)]O%f~~)bO!n~~)gO(Q~~)lQ%j~}!O)r!_!`)w~)wO%g~~)|O!o~R*RP([Q!Q![*UP*ZV!hP!Q![*U!g!h*p!h!i+e!n!o+j#X#Y*p#Y#Z+e#`#a+pP*sQ}!O*y!Q![+PP*|P!Q![+PP+UT!hP!Q![+P!h!i+e!n!o+j#Y#Z+e#`#a+pP+jO!hPP+mP!h!i+eP+sP#Y#Z+e~+{R%o~z{,U!P!Q,Z!_!`,f~,ZO'}~~,`Q'|~OY,ZZ~,Z~,kO!l~P,pZ!hP!O!P*U!Q![-c!g!h*p!h!i+e!n!o+j!w!x+e#X#Y*p#Y#Z+e#`#a+p#i#j+e#l#m.WP-hY!hP!O!P*U!Q![-c!g!h*p!h!i+e!n!o+j!w!x+e#X#Y*p#Y#Z+e#`#a+p#i#j+eP.ZR!Q![.d!c!i.d#T#Z.dP.iT!hP!Q![.d!c!i.d!w!x+e#T#Z.d#i#j+e~.}O(^~~/SO(a~~/XQ%s~!^!_/_!_!`/l~/dP%q~!_!`/g~/lO!p~~/qO%t~~/vP(S~!_!`/y~0OO%w~~0TQ%u~!_!`0Z!`!a0`~0`O%v~~0eP%r~!_!`0h~0mO!q~~0rO(]~R0wSWR!Q![0r!c!}0r#R#S0r#T#o0r~1YP!v~#P#Q1]~1bO&e~~1gO!w~~1lQ%{~!_!`1r#Q#R1w~1wO!s~~1|O&O~V2RUWR!Q![0r!c!}0r#R#S0r#T#g0r#g#h2e#h#o0rV2lS(gSWR!Q![0r!c!}0r#R#S0r#T#o0rV2}UWR!Q![0r!c!}0r#R#S0r#T#f0r#f#g3a#g#o0rV3fUWR!Q![0r!c!}0r#R#S0r#T#c0r#c#d3x#d#o0rV3}UWR!Q![0r!c!}0r#R#S0r#T#a0r#a#b4a#b#o0rV4hS(hSWR!Q![0r!c!}0r#R#S0r#T#o0r~4yO(_~~5OQ%z~!_!`5U#p#q5Z~5ZO!t~~5`O%}~~5eO(b~~5jO%l~",
  tokenizers: [untilEOL, untilCommentClose, 0, 1, 2],
  topRules: {"Program":[0,2]},
  specialized: [{term: 8, get: value => spec_Identifier[value] || -1}],
  tokenPrec: 6833
})
