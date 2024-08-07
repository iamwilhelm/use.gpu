// This file was generated by lezer-generator. You probably shouldn't edit it.
import {LRParser} from "@lezer/lr"
import {untilEOLToken, untilCommentCloseToken} from "./tokens"
const spec_Identifier = {__proto__:null,const:18, inout:20, in:22, out:24, centroid:26, patch:28, sample:30, uniform:32, buffer:34, shared:36, coherent:38, volatile:40, restrict:42, readonly:44, writeonly:46, subroutine:48, layout:56, common:64, partition:66, active:68, asm:70, class:72, union:74, enum:76, typedef:78, template:80, this:82, resource:84, goto:86, inline:88, noinline:90, public:92, static:94, extern:96, external:98, interface:100, long:102, short:104, half:106, fixed:108, unsigned:110, superp:112, input:114, output:116, hvec2:118, hvec3:120, hvec4:122, fvec2:124, fvec3:126, fvec4:128, sampler3DRect:130, filter:132, sizeof:134, cast:136, namespace:138, using:140, void:176, float:178, double:180, int:182, uint:184, atomic_uint:186, bool:188, mat2:190, mat3:192, mat4:194, dmat2:196, dmat3:198, dmat4:200, mat2x2:202, mat2x3:204, mat2x4:206, dmat2x2:208, dmat2x3:210, dmat2x4:212, mat3x2:214, mat3x3:216, mat3x4:218, dmat3x2:220, dmat3x3:222, dmat3x4:224, mat4x2:226, mat4x3:228, mat4x4:230, dmat4x2:232, dmat4x3:234, dmat4x4:236, vec2:238, vec3:240, vec4:242, ivec2:244, ivec3:246, ivec4:248, bvec2:250, bvec3:252, bvec4:254, dvec2:256, dvec3:258, dvec4:260, uvec2:262, uvec3:264, uvec4:266, sampler3D:268, samplerCube:270, sampler1DShadow:272, sampler2DShadow:274, samplerCubeShadow:276, sampler1DArray:278, sampler2DArray:280, sampler1DArrayShadow:282, sampler2DArrayShadow:284, samplerCubeArray:286, samplerCubeArrayShadow:288, isampler1D:290, isampler2D:292, isampler3D:294, isamplerCube:296, isampler1DArray:298, isampler2DArray:300, isamplerCubeArray:302, usampler1D:304, usampler2D:306, usampler3D:308, usamplerCube:310, usampler1DArray:312, usampler2DArray:314, usamplerCubeArray:316, sampler2DRect:318, sampler2DRectShadow:320, isampler2DRect:322, usampler2DRect:324, samplerBuffer:326, isamplerBuffer:328, usamplerBuffer:330, sampler2DMS:332, isampler2DMS:334, usampler2DMS:336, sampler2DMSArray:338, isampler2DMSArray:340, usampler2DMSArray:342, image1D:344, iimage1D:346, uimage1D:348, image2D:350, iimage2D:352, uimage2D:354, image3D:356, iimage3D:358, uimage3D:360, image2DRect:362, iimage2DRect:364, uimage2DRect:366, imageCube:368, iimageCube:370, uimageCube:372, imageBuffer:374, iimageBuffer:376, uimageBuffer:378, image1DArray:380, iimage1DArray:382, uimage1DArray:384, image2DArray:386, iimage2DArray:388, uimage2DArray:390, imageCubeArray:392, iimageCubeArray:394, uimageCubeArray:396, image2DMS:398, iimage2DMS:400, uimage2DMS:402, image2DMSArray:404, iimage2DMSArray:406, uimage2DMSArray:408, highp:468, medp:470, lowp:472, smooth:476, flat:478, noperspective:480, invariant:484, precise:488, struct:494, precision:522, if:528, else:530, switch:534, default:538, case:540, while:544, do:548, for:550, continue:554, break:556, return:558, discard:560, pragma:564, import:566, export:574, optional:576, global:578, optimize:580, debug:582, STDGL:584, define:588, undef:590, ifdef:592, ifndef:594, elif:596, endif:598, error:600, extension:602, version:604, line:606}
export const parser = LRParser.deserialize({
  version: 14,
  states: "HhO*wQSOOP+OOSOOOOQO'#I|'#I|O,wQSO'#CbO4sQSO'#HkOOQO'#Ca'#CaO<{QSO'#IyO=YQSO'#HxO=bQSO'#IaO>]QSO'#C_O>`QSO'#IxOOQO'#Jc'#JcOOQO'#I{'#I{O>eQSO'#JbQOQSOOOOQO'#Cc'#CcO>lQSO'#CcOOQO'#Jn'#JnOHWQSO'#CwOOQO'#H_'#H_OOQO'#Hc'#HcOOQO'#Hg'#HgOOQO'#Hi'#HiOH]QSO'#HlOHeQSO'#IxPOOO'#J_'#J_PHpQUO'#J_POOO)CER)CEROOQO-E<z-E<zOHuQSO'#HqOOQO'#Hq'#HqOOQO,5>V,5>VOI^QSO'#JRO!&TQSO,5?eOOQO,58{,58{O!'QQSO,58zO!'XQSO'#HyO!'dQSO,5>dO!'lQTO,5>{OOQP'#Im'#ImO!'qQSO,5>{O!(VQSO'#JvOOQO,58y,58yOOQO,5?d,5?dOOQO-E<y-E<yO!.QQSO,58}O!.VQSO,59cO!._QSO,5>WO!0WQSO,5>WO!0]QSO,5?dPOOO,5?y,5?yOOQO-E=P-E=POOQO,5>],5>]OI^QSO'#DvO!3PQWO'#JkOOQO'#Jk'#JkO!3^QSO'#JkO!3iQSO'#EVO!3nQWO'#JiOOQO'#Jj'#JjOI^QSO'#GuOOQO'#Ji'#JiO!7qQWO,5?mOOQO'#Jh'#JhOOQO'#C{'#C{O!._QSO1G5PO!7xQSO'#JYO!7}QSO1G5QO!8VQSO1G.fOOQO,5>f,5>fO!:OQSO,5>eO!:VQSO'#JWO!:[QSO1G4OOOQO1G4g1G4gO!:dQSO1G4gO!:lQTO1G4gO!:qQSO1G4gO!:vQWO'#JhO!=]QWO'#JmOOQO'#Jm'#JmO!=sQSO'#JlO!>UQWO'#JkO!>fQSO'#HkO!0]QSO'#CaO!>wQSO'#HxO!?PQSO'#HwOOQO'#Hv'#HvOOQO'#H|'#H|O!?UQSO'#H|OOQO'#Jw'#JwOOQO'#Hu'#HuOOQO'#JU'#JUO!?ZQSO'#HtO!EUQSO,5@bOHeQSO'#HwO!EZQSO'#H}O!E`QSO'#IQO!EeQSO'#ISOI^QSO'#ISO!EjQSO'#IVO!EoQSO'#IVO!KdQSO'#IVO!KiQSO'#I[O!KnQSO'#I[OOQO'#Cv'#CvO!KuQSO'#CuO!K}QSO1G.iOOQO'#Cz'#CzO!LSQSO'#CyOOQO'#Cy'#CyO!L_QSO1G.}O!LgQSO'#HoO!0]QSO'#HoOOQO'#JQ'#JQO!LlQSO'#HnO!NeQSO1G3rO!._QSO1G3rO!NjQSO1G5OO!NoQSO,5:bO#+hQSO,5:qOOQO,5@V,5@VOOQO,5=^,5=^OI^QSO,5:nO!LgQSO,5=]OOQO,5=a,5=aOI^QSO,5=fOI^QSO,5=fOI^QSO,5=fOI^QSO,5=fOI^QSO,5=fOI^QSO,5=fOI^QSO,5=fOI^QSO,5=fOI^QSO,5=fOI^QSO,5=fOI^QSO,5=fOI^QSO,5=xOOQO1G5X1G5XO#+rQSO7+*kOOQO,5?t,5?tOOQO-E=W-E=WO#+wQSO'#HsO!0]QSO'#HsOOQO7+$Q7+$QO#,SQSO7+$QOOQO'#Jx'#JxO!:OQSO'#JxOOQO1G4P1G4PO!&oQSO'#HzOOQO,5?r,5?rOOQO-E=U-E=UO#,[QSO'#IdO#,aQTO7+*RO#,fQ`O7+*ROOQO7+*R7+*ROI^QSO,5:cOI^QSO'#JOO#,kQSO,5@WOOQO,5>c,5>cOOQO,5>h,5>hOOQO-E=S-E=SOOQO1G5|1G5|O!0]QSO,5>cOI^QSO,5>iOI^QSO,5>lOOQO,5>n,5>nO#,|QSO,5>nO#-RQSO,5>qO#1zQSO,5>qO#2PQSO,5>qOOQO,5>v,5>vO#7OQSO,5>vO!.QQSO'#I}O#7TQSO,59aOOQO7+$T7+$TOI^QSO,59eO!.VQSO'#JPO#7]QSO7+$iOOQO7+$i7+$iO#7eQSO'#HpO#7sQSO'#JsO#7{QSO,5>ZO!LgQSO,5>ZOOQO-E=O-E=OOOQO7+)^7+)^O#8QQSO7+)^OOQO7+*j7+*jOOQO1G/|1G/|OOQO1G0]1G0]O#8VQSO1G0]O#8_QSO1G0]O#8gQSO1G0YOOQO1G2w1G2wOOQO1G3Q1G3QO#:YQWO1G3QO#:dQWO1G3QO#<UQWO1G3QO#<fQWO1G3QO#>gQWO1G3QO#@_QWO1G3QO#@fQWO1G3QO#B^QWO1G3QO#DUQWO1G3QO#D]QWO1G3QO#DdQSO1G3dO#DiQSO<<NVO#DqQSO,5>_O#EPQSO,5>_O#E[QSO'#JTO#GQQSO<<GlOOQO<<Gl<<GlO#GYQSO,5@dO#GbQ`O'#IeO#GmQSO,5?OO#,[QSO,5?OOOQO<<Mm<<MmO#GuQSO<<MmO#GzQWO1G/}OOQO,5?j,5?jOOQO-E<|-E<|O#HbQSO1G3}O#HgQSO1G4TO#HlQSO1G4WOOQO1G4Y1G4YOOQO'#IX'#IXO#HqQSO'#IXO#HvQSO1G4]O#H{QSO1G4]O#IQQSO1G4]OOQO1G4b1G4bOOQO,5?i,5?iOOQO-E<{-E<{O#MyQWO1G/POOQO,5?k,5?kOOQO-E<}-E<}OOQO<<HT<<HTOOQO,5>[,5>[O!LgQSO'#JSO#NTQSO,5@_OOQO1G3u1G3uO#N]QSO1G3uOOQO<<Lx<<LxO#NbQSO7+%wOOQO7+%w7+%wOOQO7+%t7+%tOI^QSO7+)OOOQOANCqANCqOOQO1G3y1G3yO#NjQSO1G3yOOQO,5?o,5?oOOQO-E=R-E=ROOQOAN=WAN=WO#NxQSO1G6OO$ SQSO1G6OOOQO1G6O1G6OO$ [QSO,5?PO$ aQSO1G4jOOQO1G4j1G4jO$ iQSO1G4jOOQO-E=V-E=VO$ qQTOANCXOOQO7+)i7+)iO!EoQSO7+)oO$ vQSO7+)rO$ {QSO,5>sO!EoQSO7+)wOI^QSO7+)wO$!QQSO7+)wOOQO,5?n,5?nOOQO-E=Q-E=QOOQO7+)a7+)aOOQO<<Ic<<IcOOQO<<Lj<<LjOOQO7+)e7+)eOOQO,5?q,5?qOOQO7++j7++jO$!VQSO7++jOOQO-E=T-E=TOOQO1G4k1G4kOOQO7+*U7+*UO$!aQSO7+*UP$!iQSO'#JXOOQOG28sG28sO$!nQSO<<MZO!(VQSO<<M^O!:OQSO1G4_OOQO<<Mc<<McO$0[QSO<<McO$0aQSO<<McOOQO<= U<= UP!:OQSO'#JVOOQO<<Mp<<MpPOQO,5?s,5?sO!EoQSOANBuO$0hQSOANBxOOQO7+)y7+)yO$0mQSOANB}OOQOANB}ANB}O$0rQSOANB}OOQOG28aG28aOOQOG28dG28dOOQOG28iG28iO$0wQWO'#Jk",
  stateData: "$3w~O(QOS(SPQ(TPQ~OWSOX_OY_OZ_O[_O]_O^_O__O`_Oa_Ob_Oc_Od_Oe_Of_Og_Oh`OlbO!zaO!{aO!|aO!}aO#OaO#PaO#QaO#RaO#SaO#TaO#UaO#VaO#WaO#XaO#YaO#ZaO#[aO#]aO#^aO#_aO#`aO#aaO#baO#caO#daO#eaO#faO#gaO#haO#iaO#jaO#kaO#laO#maO#naO#oaO#paO#qaO#raO#saO#taO#uaO#vaO#waO#xaO#yaO#zaO#{aO#|aO#}aO$OaO$PaO$QaO$RaO$SaO$TaO$UaO$VaO$WaO$XaO$YaO$ZaO$[aO$]aO$^aO$_aO$`aO$aaO$baO$caO$daO$eaO$faO$gaO$haO$iaO$jaO$kaO$laO$maO$naO$oaO$paO$qaO$raO$saO$taO$uaO$vaO$waO$xaO$yaO$zaO${aO$|aO$}aO%OaO%PaO%QaO%RaO%SaO%TaO%UaO%VaO%WaO%XaO%YaO%ZaO%[aO%]aO%^aO%_aO%`aO%aaO%baO%caO%daO&ScO&TcO&UcO&WdO&XdO&YdO&[eO&^fO&agO&ohO(mWO~O'}(UP~P]O(SiO(TjO~OX_OY_OZ_O[_O]_O^_O__O`_Oa_Ob_Oc_Od_Oe_Of_Og_Oh`OlbO&ScO&TcO&UcO&WdO&XdO&YdO&[eO&^fO~OWUX!zUX!{UX!|UX!}UX#OUX#PUX#QUX#RUX#SUX#TUX#UUX#VUX#WUX#XUX#YUX#ZUX#[UX#]UX#^UX#_UX#`UX#aUX#bUX#cUX#dUX#eUX#fUX#gUX#hUX#iUX#jUX#kUX#lUX#mUX#nUX#oUX#pUX#qUX#rUX#sUX#tUX#uUX#vUX#wUX#xUX#yUX#zUX#{UX#|UX#}UX$OUX$PUX$QUX$RUX$SUX$TUX$UUX$VUX$WUX$XUX$YUX$ZUX$[UX$]UX$^UX$_UX$`UX$aUX$bUX$cUX$dUX$eUX$fUX$gUX$hUX$iUX$jUX$kUX$lUX$mUX$nUX$oUX$pUX$qUX$rUX$sUX$tUX$uUX$vUX$wUX$xUX$yUX$zUX${UX$|UX$}UX%OUX%PUX%QUX%RUX%SUX%TUX%UUX%VUX%WUX%XUX%YUX%ZUX%[UX%]UX%^UX%_UX%`UX%aUX%bUX%cUX%dUX&aUX(hUX~P+WO!wpO&fnOW&_X(h&_X(X&_X(Y&_X~O!zaO!{aO!|aO!}aO#OaO#PaO#QaO#RaO#SaO#TaO#UaO#VaO#WaO#XaO#YaO#ZaO#[aO#]aO#^aO#_aO#`aO#aaO#baO#caO#daO#eaO#faO#gaO#haO#iaO#jaO#kaO#laO#maO#naO#oaO#paO#qaO#raO#saO#taO#uaO#vaO#waO#xaO#yaO#zaO#{aO#|aO#}aO$OaO$PaO$QaO$RaO$SaO$TaO$UaO$VaO$WaO$XaO$YaO$ZaO$[aO$]aO$^aO$_aO$`aO$aaO$baO$caO$daO$eaO$faO$gaO$haO$iaO$jaO$kaO$laO$maO$naO$oaO$paO$qaO$raO$saO$taO$uaO$vaO$waO$xaO$yaO$zaO${aO$|aO$}aO%OaO%PaO%QaO%RaO%SaO%TaO%UaO%VaO%WaO%XaO%YaO%ZaO%[aO%]aO%^aO%_aO%`aO%aaO%baO%caO%daO&agO~OWqO(h'mX(h'nX~P5XOWsO(h&lX~O&rwO&swO'UxO'bwO'cwO'dwO'ewO'fwO'gwO'hwO'iwO'jwO'kwO~O(fyO(h{O~O'}(UX~P]O(W}OWVXXVXYVXZVX[VX]VX^VX_VX`VXaVXbVXcVXdVXeVXfVXgVXhVXlVX!zVX!{VX!|VX!}VX#OVX#PVX#QVX#RVX#SVX#TVX#UVX#VVX#WVX#XVX#YVX#ZVX#[VX#]VX#^VX#_VX#`VX#aVX#bVX#cVX#dVX#eVX#fVX#gVX#hVX#iVX#jVX#kVX#lVX#mVX#nVX#oVX#pVX#qVX#rVX#sVX#tVX#uVX#vVX#wVX#xVX#yVX#zVX#{VX#|VX#}VX$OVX$PVX$QVX$RVX$SVX$TVX$UVX$VVX$WVX$XVX$YVX$ZVX$[VX$]VX$^VX$_VX$`VX$aVX$bVX$cVX$dVX$eVX$fVX$gVX$hVX$iVX$jVX$kVX$lVX$mVX$nVX$oVX$pVX$qVX$rVX$sVX$tVX$uVX$vVX$wVX$xVX$yVX$zVX${VX$|VX$}VX%OVX%PVX%QVX%RVX%SVX%TVX%UVX%VVX%WVX%XVX%YVX%ZVX%[VX%]VX%^VX%_VX%`VX%aVX%bVX%cVX%dVX&SVX&TVX&UVX&WVX&XVX&YVX&[VX&^VX&aVX(hVX~O(W!OO~OW!QO(f!PO~O&ScO&TcO&UcO~O(O!SO~O!wpO&f!UOW&eX(h&eX(X&eX(Z&eX(Y&eX~OW!WOp!bOq!bOr!bOs!bOt!bOu!bOv!bOw!bOx!bOy!bOz!bO{!bO|!bO}!bO!O!bO!P!bO!Q!bO!R!bO!S!bO!T!bO!U!bO!V!bO!W!bO!X!bO!Y!bO!Z!bO![!bO!]!bO!^!bO!_!bO!`!bO!a!bO!b!bO!c!bO!d!bO!e!bO!f!bO!g!bO!h!bO!i!XO!zaO!{aO!|aO!}aO#OaO#PaO#QaO#RaO#SaO#TaO#UaO#VaO#WaO#XaO#YaO#ZaO#[aO#]aO#^aO#_aO#`aO#aaO#baO#caO#daO#eaO#faO#gaO#haO#iaO#jaO#kaO#laO#maO#naO#oaO#paO#qaO#raO#saO#taO#uaO#vaO#waO#xaO#yaO#zaO#{aO#|aO#}aO$OaO$PaO$QaO$RaO$SaO$TaO$UaO$VaO$WaO$XaO$YaO$ZaO$[aO$]aO$^aO$_aO$`aO$aaO$baO$caO$daO$eaO$faO$gaO$haO$iaO$jaO$kaO$laO$maO$naO$oaO$paO$qaO$raO$saO$taO$uaO$vaO$waO$xaO$yaO$zaO${aO$|aO$}aO%OaO%PaO%QaO%RaO%SaO%TaO%UaO%VaO%WaO%XaO%YaO%ZaO%[aO%]aO%^aO%_aO%`aO%aaO%baO%caO%daO%g!^O%h!^O%j!^O%k!^O%l!^O%m!^O(W!VO~O!wpO&fnO(X!dO(f!cOW&_X(h&_X(h'ma(h'na~O!wpO&fnO(X&nX(Z&nX(h&nX~O(W!fO~P!&oO(Z!hO(X&mX(h&mX~O(X!iO(h&la~OP!kO~O'V!lO'Z!mO'[!mO']!mO'^!mO'_!nO~OW!sOX_OY_OZ_O[_O]_O^_O__O`_Oa_Ob_Oc_Od_Oe_Of_Og_Oh`OlbOp!bOq!bOr!bOs!bOt!bOu!bOv!bOw!bOx!bOy!bOz!bO{!bO|!bO}!bO!O!bO!P!bO!Q!bO!R!bO!S!bO!T!bO!U!bO!V!bO!W!bO!X!bO!Y!bO!Z!bO![!bO!]!bO!^!bO!_!bO!`!bO!a!bO!b!bO!c!bO!d!bO!e!bO!f!bO!g!bO!h!bO!i!XO%g!^O%h!^O%j!^O%k!^O%l!^O%m!^O&ScO&TcO&UcO&WdO&XdO&YdO&[eO&^fO&o#QO&r#RO&u#SO&w#TO&x#UO&z#VO&|#WO&}#XO'P#YO'Q#YO'R#ZO'S#YO(W!VO(fyO(h!yO(mWO(i&hP~P5XOW#[O~OW#_Ob#aO~OWSOX_OY_OZ_O[_O]_O^_O__O`_Oa_Ob_Oc_Od_Oe_Of_Og_Oh`OlbO&ScO&TcO&UcO&WdO&XdO&YdO&[eO&^fO(i&bP~P5XO(f#hO~OWSO~P5XO(W#kO!w(_X%g(_X%h(_X%j(_X%k(_X%o(_X%p(_X%q(_X%r(_X%s(_X%t(_X%u(_X%v(_X%w(_X%x(_X%y(_X%z(_X%{(_X%|(_X%}(_X&O(_X&P(_X(c(_X(d(_X!l(_X!m(_X!n(_X!o(_X!p(_X!q(_X!r(_X!s(_X!t(_X!u(_X(X(_X(Y(_X(Z(_X(h(_X~O!x(_X(e(_X(i(_X~P!0dOW#lO!i#lO(W!VO~O(W#kO~O!w#nO%g#mO%h#mO(c#oO!x(]X%j(]X%k(]X%o(]X%p(]X%q(]X%r(]X%s(]X%t(]X%u(]X%v(]X%w(]X%x(]X%y(]X%z(]X%{(]X%|(]X%}(]X&O(]X&P(]X(d(]X!l(]X!m(]X!n(]X!o(]X!p(]X!q(]X!r(]X!s(]X!t(]X!u(]X(X(]X(Z(]X(h(]X(Y(]X(e(]X(i(]X~O%j#rO%k#rO%o#qO%p#qO%q#qO%r#sO%s#sO%t#tO%u#tO%v#tO%w#tO%x#uO%y#uO%z#vO%{#wO%|#xO%}#yO&O#zO&P#{O(d#|O~O!x#}O~P!6aOW$PO~O(X!dO(h'ni~OWSOX_OY_OZ_O[_O]_O^_O__O`_Oa_Ob_Oc_Od_Oe_Of_Og_Oh`OlbO&ScO&TcO&UcO&WdO&XdO&YdO&[eO&^fO(Y$TO~P5XO(f$WO~PI^OW$YO~O(X!iO(h&li~O'Y$^O(f$]O~OP$`O~O'`$^O~O!l$aO!m$aO!n$aO!o$aO!p$aO!q$aO!r$aO!s$aO!t$aO!u$aO(Z$aO%j([X%k([X%o([X%p([X%q([X%r([X%s([X%t([X%u([X%v([X%w([X%x([X%y([X%z([X%{([X%|([X%}([X&O([X&P([X(X([X(d([X(h([X(Y([X(e([X!x([X(i([X~O(X(aX(h(aX(Y(aX(e(aX!x(aX(i(aX~P!6aO(X$bO(h(`X(Y(`X(e(`X!x(`X~O!wpO&fnOW&_X(h&_X~P!0dO!wpO&fnO(W#kOW&_X(h&_X~OW$YO(h&lX~O(h$dO~O(h$eO~OW!sOX_OY_OZ_O[_O]_O^_O__O`_Oa_Ob_Oc_Od_Oe_Of_Og_Oh`OlbOp!bOq!bOr!bOs!bOt!bOu!bOv!bOw!bOx!bOy!bOz!bO{!bO|!bO}!bO!O!bO!P!bO!Q!bO!R!bO!S!bO!T!bO!U!bO!V!bO!W!bO!X!bO!Y!bO!Z!bO![!bO!]!bO!^!bO!_!bO!`!bO!a!bO!b!bO!c!bO!d!bO!e!bO!f!bO!g!bO!h!bO!i!XO%g!^O%h!^O%j!^O%k!^O%l!^O%m!^O&ScO&TcO&UcO&WdO&XdO&YdO&[eO&^fO&o#QO&r#RO&u#SO&w#TO&x#UO&z#VO&|#WO&}#XO'P#YO'Q#YO'R#ZO'S#YO(W!VO(fyO(h!yO(mWO(i&hX~P5XO(i$gO~O(W$iO~O(W$jO~O(e$kO~O(W$mO~OW!sOX_OY_OZ_O[_O]_O^_O__O`_Oa_Ob_Oc_Od_Oe_Of_Og_Oh`OlbOp!bOq!bOr!bOs!bOt!bOu!bOv!bOw!bOx!bOy!bOz!bO{!bO|!bO}!bO!O!bO!P!bO!Q!bO!R!bO!S!bO!T!bO!U!bO!V!bO!W!bO!X!bO!Y!bO!Z!bO![!bO!]!bO!^!bO!_!bO!`!bO!a!bO!b!bO!c!bO!d!bO!e!bO!f!bO!g!bO!h!bO!i!XO%g!^O%h!^O%j!^O%k!^O%l!^O%m!^O&ScO&TcO&UcO&WdO&XdO&YdO&[eO&^fO&o#QO&r#RO&u#SO&w#TO&x#UO&z#VO&|#WO&}#XO'P#YO'Q#YO'R#ZO'S#YO(W!VO(fyO(h!yO~P5XO(W$oO~O(h$pO~O(h$pO~PI^O(X$rO(YiX~O(Y$tO~O(Z$uO(XmX(YmX~O(X$vO(Y$xO~OW#_O~OWSOX_OY_OZ_O[_O]_O^_O__O`_Oa_Ob_Oc_Od_Oe_Of_Og_Oh`OlbO&ScO&TcO&UcO&WdO&XdO&YdO&[eO&^fO(i&bX~P5XO(i%OO~O(h%QO~O(Y%RO~OW!WOp!bOq!bOr!bOs!bOt!bOu!bOv!bOw!bOx!bOy!bOz!bO{!bO|!bO}!bO!O!bO!P!bO!Q!bO!R!bO!S!bO!T!bO!U!bO!V!bO!W!bO!X!bO!Y!bO!Z!bO![!bO!]!bO!^!bO!_!bO!`!bO!a!bO!b!bO!c!bO!d!bO!e!bO!f!bO!g!bO!h!bO!i!XO!{aO!|aO!}aO#OaO#PaO#QaO#RaO#SaO#TaO#UaO#VaO#WaO#XaO#YaO#ZaO#[aO#]aO#^aO#_aO#`aO#aaO#baO#caO#daO#eaO#faO#gaO#haO#iaO#jaO#kaO#laO#maO#naO#oaO#paO#qaO#raO#saO#taO#uaO#vaO#waO#xaO#yaO#zaO#{aO#|aO#}aO$OaO$PaO$QaO$RaO$SaO$TaO$UaO$VaO$WaO$XaO$YaO$ZaO$[aO$]aO$^aO$_aO$`aO$aaO$baO$caO$daO$eaO$faO$gaO$haO$iaO$jaO$kaO$laO$maO$naO$oaO$paO$qaO$raO$saO$taO$uaO$vaO$waO$xaO$yaO$zaO${aO$|aO$}aO%OaO%PaO%QaO%RaO%SaO%TaO%UaO%VaO%WaO%XaO%YaO%ZaO%[aO%]aO%^aO%_aO%`aO%aaO%baO%caO%daO%g!^O%h!^O%j!^O%k!^O%l!^O%m!^O(W!VO~O!z%UO(Y%SO~P!NtO(i%eO~OW%fO(X&gX(Y&gX~O(X%hO(Y%jO~OW%lO~OP%oO~O(o%pO~O(X$bO(h(`a(Y(`a(e(`a!x(`a~O(e%wO~OW!sOX_OY_OZ_O[_O]_O^_O__O`_Oa_Ob_Oc_Od_Oe_Of_Og_Oh`OlbOp!bOq!bOr!bOs!bOt!bOu!bOv!bOw!bOx!bOy!bOz!bO{!bO|!bO}!bO!O!bO!P!bO!Q!bO!R!bO!S!bO!T!bO!U!bO!V!bO!W!bO!X!bO!Y!bO!Z!bO![!bO!]!bO!^!bO!_!bO!`!bO!a!bO!b!bO!c!bO!d!bO!e!bO!f!bO!g!bO!h!bO!i!XO%g!^O%h!^O%j!^O%k!^O%l!^O%m!^O&ScO&TcO&UcO&WdO&XdO&YdO&[eO&^fO(W!VO~P5XO&z%{O~OW!sOX_OY_OZ_O[_O]_O^_O__O`_Oa_Ob_Oc_Od_Oe_Of_Og_Oh`OlbOp!bOq!bOr!bOs!bOt!bOu!bOv!bOw!bOx!bOy!bOz!bO{!bO|!bO}!bO!O!bO!P!bO!Q!bO!R!bO!S!bO!T!bO!U!bO!V!bO!W!bO!X!bO!Y!bO!Z!bO![!bO!]!bO!^!bO!_!bO!`!bO!a!bO!b!bO!c!bO!d!bO!e!bO!f!bO!g!bO!h!bO!i!XO%g!^O%h!^O%j!^O%k!^O%l!^O%m!^O&ScO&TcO&UcO&WdO&XdO&YdO&[eO&^fO&o#QO(W!VO(h!yO~P5XO(h%}O~O(X$rO(Yia~O(X$vO(Y&TO~O!wpO&fnO(X&dX(h&dX~O(X&VO(h(gX~O(h&XO~O(i&ZO~O(X$bO(Y&]O~O(Y&]O(W(bX~O!x&^O~O%o#qO%p#qO%q#qO!x%ni%r%ni%s%ni%t%ni%u%ni%v%ni%w%ni%x%ni%y%ni%z%ni%{%ni%|%ni%}%ni&O%ni&P%ni(d%ni(X%ni(h%ni(Y%ni(e%ni(i%ni~O%j%ni%k%ni~P#8lO%j#rO%k#rO~P#8lO%j#rO%k#rO%o#qO%p#qO%q#qO%r#sO%s#sO!x%ni%x%ni%y%ni%z%ni%{%ni%|%ni%}%ni&O%ni&P%ni(d%ni(X%ni(h%ni(Y%ni(e%ni(i%ni~O%t%ni%u%ni%v%ni%w%ni~P#:nO%t#tO%u#tO%v#tO%w#tO~P#:nO%j#rO%k#rO%o#qO%p#qO%q#qO%r#sO%s#sO%t#tO%u#tO%v#tO%w#tO%x#uO%y#uO!x%ni%{%ni%|%ni%}%ni&O%ni&P%ni(d%ni(X%ni(h%ni(Y%ni(e%ni(i%ni~O%z%ni~P#<vO%j#rO%k#rO%o#qO%p#qO%q#qO%r#sO%s#sO%t#tO%u#tO%v#tO%w#tO%x#uO%y#uO%z#vO!x%ni%{%ni%}%ni&O%ni&P%ni(d%ni(X%ni(h%ni(Y%ni(e%ni(i%ni~O%|#xO~P#>nO%z#vO~P#<vO%j#rO%k#rO%o#qO%p#qO%q#qO%r#sO%s#sO%t#tO%u#tO%v#tO%w#tO%x#uO%y#uO%z#vO%{#wO%|#xO!x%ni&O%ni&P%ni(d%ni(X%ni(h%ni(Y%ni(e%ni(i%ni~O%}%ni~P#@mO%j#rO%k#rO%o#qO%p#qO%q#qO%r#sO%s#sO%t#tO%u#tO%v#tO%w#tO%x#uO%y#uO%z#vO%{#wO%|#xO%}#yO!x%ni&O%ni(d%ni(X%ni(h%ni(Y%ni(e%ni(i%ni~O&P#{O~P#BeO%}#yO~P#@mO(e&_O~OW$YO(h'my~O!wpO&fnO(X&ga(Y&ga~OW&bO(X&ga(Y&ga~OWSOX_OY_OZ_O[_O]_O^_O__O`_Oa_Ob_Oc_Od_Oe_Of_Og_Oh`OlbO&ScO&TcO&UcO&WdO&XdO&YdO&[eO&^fO~P5XO(X%hO(Y&eO~O(X&fO(i&hO~O(n&iO(X'XX(i'XX~O(X&jO(i&kO~O'Y&nO~O(X!ki(h!ki(Y!ki(e!ki!x!ki(i!ki~P!6aO(h&oO~O(Y&pO~O(Y&qO~OW&rO~O(Y&sO~O(W&tO~OW'jOX_OY_OZ_O[_O]_O^_O__O`_Oa_Ob_Oc_Od_Oe_Of_Og_Oh`OlbOp!bOq!bOr!bOs!bOt!bOu!bOv!bOw!bOx!bOy!bOz!bO{!bO|!bO}!bO!O!bO!P!bO!Q!bO!R!bO!S!bO!T!bO!U!bO!V!bO!W!bO!X!bO!Y!bO!Z!bO![!bO!]!bO!^!bO!_!bO!`!bO!a!bO!b!bO!c!bO!d!bO!e!bO!f!bO!g!bO!h!bO!i!XO%g!^O%h!^O%j!^O%k!^O%l!^O%m!^O&ScO&TcO&UcO&WdO&XdO&YdO&[eO&^fO(W!VO~P5XO(Xmi(Ymi~P!6aO(X&VO(h(ga~O(h&xO~O(X$bO(Y&yO~O!wpO&fnO(X&gi(Y&gi~O(f$WO(i&}O~PI^O(X'OO(i&}O~OW'QO~O(i'ROW'{a~O(X'SO(i'RO~OP'UO~O(f'WO~O(Z'XO~O(h'[O~O(f$WO(i']O~PI^O(i'_OW'{a~O(X'`O~O&s'aOW&qyX&qyY&qyZ&qy[&qy]&qy^&qy_&qy`&qya&qyb&qyc&qyd&qye&qyf&qyg&qyh&qyl&qyp&qyq&qyr&qys&qyt&qyu&qyv&qyw&qyx&qyy&qyz&qy{&qy|&qy}&qy!O&qy!P&qy!Q&qy!R&qy!S&qy!T&qy!U&qy!V&qy!W&qy!X&qy!Y&qy!Z&qy![&qy!]&qy!^&qy!_&qy!`&qy!a&qy!b&qy!c&qy!d&qy!e&qy!f&qy!g&qy!h&qy!i&qy!z&qy!{&qy!|&qy!}&qy#O&qy#P&qy#Q&qy#R&qy#S&qy#T&qy#U&qy#V&qy#W&qy#X&qy#Y&qy#Z&qy#[&qy#]&qy#^&qy#_&qy#`&qy#a&qy#b&qy#c&qy#d&qy#e&qy#f&qy#g&qy#h&qy#i&qy#j&qy#k&qy#l&qy#m&qy#n&qy#o&qy#p&qy#q&qy#r&qy#s&qy#t&qy#u&qy#v&qy#w&qy#x&qy#y&qy#z&qy#{&qy#|&qy#}&qy$O&qy$P&qy$Q&qy$R&qy$S&qy$T&qy$U&qy$V&qy$W&qy$X&qy$Y&qy$Z&qy$[&qy$]&qy$^&qy$_&qy$`&qy$a&qy$b&qy$c&qy$d&qy$e&qy$f&qy$g&qy$h&qy$i&qy$j&qy$k&qy$l&qy$m&qy$n&qy$o&qy$p&qy$q&qy$r&qy$s&qy$t&qy$u&qy$v&qy$w&qy$x&qy$y&qy$z&qy${&qy$|&qy$}&qy%O&qy%P&qy%Q&qy%R&qy%S&qy%T&qy%U&qy%V&qy%W&qy%X&qy%Y&qy%Z&qy%[&qy%]&qy%^&qy%_&qy%`&qy%a&qy%b&qy%c&qy%d&qy%g&qy%h&qy%j&qy%k&qy%l&qy%m&qy&S&qy&T&qy&U&qy&W&qy&X&qy&Y&qy&[&qy&^&qy&a&qy&o&qy&r&qy&u&qy&w&qy&x&qy&z&qy&|&qy&}&qy'P&qy'Q&qy'R&qy'S&qy(W&qy(f&qy(h&qy(i&qy(m&qy~O(Y'dO~O(Y'eO~PI^O(i'hO~O(h'iO~O(Y'iO~O!wpO&fnO(W#kOW&_X!l(_X!m(_X!n(_X!o(_X!p(_X!q(_X!r(_X!s(_X!t(_X!u(_X!w(_X%g(_X%h(_X%j(_X%k(_X%o(_X%p(_X%q(_X%r(_X%s(_X%t(_X%u(_X%v(_X%w(_X%x(_X%y(_X%z(_X%{(_X%|(_X%}(_X&O(_X&P(_X(X(_X(Z(_X(c(_X(d(_X(h(_X~O(S%p%}%z&O%{&P%|W&f!w%{~",
  goto: "@T(mPPP(n(r(v)Y)tPPPPPPPPPPPPPPPPP*Z*^)tP*d*j*vPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP+u,wPPPPPPPPPP-gPP-gPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP-g-gPP.fPPPP/ePPPPPPPPPPPPPPPPP/e0cPPP)tPPP)tP)tP1O1xP2d2m2s2zP3`3f3l3}4Z4e4s4zP3}5SPP5SP5SPP5SP5]PP5SPPPP5cPP5l5oPPPPPPP5uPPPPPPPPPP(n5x5x5|6S6k6q6{7R7Z7j7p7v7}8T8Z8aPPPP8gPP8j8mPPPP8q:];`-g<_=Y>QPPPP?cPP?i?l?uTZO]TXO]SVO]`!vy#O#W$o&p&s'W'aT%y$m%|SUO]d!uy#O#W$m$o%|&p&s'W'aW#d!P!c#f#hT$S!f%hwQOR]y!P!c!f#O#W#f#h$m$o%h%|&p&s'W'aR#^}Q#]}R&O$rQ#b!OR&R$vS#`!O$vU$y#c$|&VR%W#o!y!Ypy!V!^!h#O#U#W#Z#k#n#q#r#s#t#u#v#w#x#y#z#{#|$W$a$b$i$j$m$o$u%|&_&f&p&s&t'O'W'X'['^'a!x!Xpy!V!^!h#O#U#W#Z#k#n#q#r#s#t#u#v#w#x#y#z#{#|$W$a$b$i$j$m$o$u%|&_&f&p&s&t'O'W'X'['^'aR#l!Y!Z!qy!V!h#O#U#W#Z#k#n#|$W$b$i$j$m$o%|&_&f&p&s&t'O'W'X'['^'a!y!]py!V!^!h#O#U#W#Z#k#n#q#r#s#t#u#v#w#x#y#z#{#|$W$a$b$i$j$m$o$u%|&_&f&p&s&t'O'W'X'['^'a!y!_py!V!^!h#O#U#W#Z#k#n#q#r#s#t#u#v#w#x#y#z#{#|$W$a$b$i$j$m$o$u%|&_&f&p&s&t'O'W'X'['^'a!w!apy!V!h#O#U#W#Z#k#n#q#r#s#t#u#v#w#x#y#z#{#|$W$a$b$i$j$m$o$u%|&_&f&p&s&t'O'W'X'['^'avQOR]y!P!c!f#O#W#f#h$m$o%h%|&p&s'W'aQ!RhR$h#QhTO]y#O#W$m$o%|&p&s'W'aSrU!uW#c!P!c#f#hQ#i!RS$R!f%hQ$|#dQ%g$SR%t$h!RSOU]y!P!R!c!f!u#O#W#d#f#h$S$h$m$o%h%|&p&s'W'aQ#g!PQ$O!cR%P#hX#e!P!c#f#hS$z#c$|R&v&VYoSq!s!t'jS!gs$YQ&U$yQ&a%fR&{&bQ$U!fR&c%hQ#PyR'b'WU!}y#O'WQ$n#WQ'V&pQ'Y&sR'g'a^!{y#O#W&p&s'W'aR%|$oa!xy#O#W$o&p&s'W'aSYO]a!wy#O#W$o&p&s'W'aSuV!vR$Z!iUtV!i!vR&`%e_!{y#O#W&p&s'W'aQ%z$mR&u%|SZO]V!}y#O'WR$_!lQ%m$]R&l%nRvWTYO]Q]OR|]tRO]y!P!c!f#O#W#f#h$m$o%h%|&p&s'W'aRlRQ$s#]R&P$sQ$c!rS%s$c&[R&[%TQ$w#bR&S$wU#f!P!c#hR$}#fdmSqs!s!t$Y$y%f&b'jR!TmQ&W$zR&w&WQ%i$UR&d%iS#Oy'WR$f#OQ&g%kR'P&gQ!juR$[!jQ%n$]R&m%nQ!eqR$Q!eRkPR^OT[O]Q!`p!Y!py!V!h#O#U#W#Z#k#n#|$W$b$i$j$m$o%|&_&f&p&s&t'O'W'X'['^'aQ%X#qQ%Y#rQ%Z#sQ%[#tQ%]#uQ%^#vQ%_#wQ%`#xQ%a#yQ%b#zQ%c#{Q%q$aR&Q$ul!ap#q#r#s#t#u#v#w#x#y#z#{$a$u!Y!oy!V!h#O#U#W#Z#k#n#|$W$b$i$j$m$o%|&_&f&p&s&t'O'W'X'['^'aR#p!^!y![py!V!^!h#O#U#W#Z#k#n#q#r#s#t#u#v#w#x#y#z#{#|$W$a$b$i$j$m$o$u%|&_&f&p&s&t'O'W'X'['^'a`!zy#O#W$o&p&s'W'aQ#j!VQ$l#UQ$q#ZQ%V#nQ%d#|Q%u$iQ%v$jS%x$m%|Q'Z&tR'f'[v!ry!V#O#U#W#Z#n#|$i$j$m$o%|&p&s&t'W'['a[$V!h$W&f'O'X'^Q%T#kQ%r$bR&z&_lSOU]!P!R!c!f!u#d#f#h$S$h%h!d!Zp!V!^!h#U#Z#k#n#q#r#s#t#u#v#w#x#y#z#{#|$W$a$b$i$j$u&_&f&t'O'X'['^e!ty#O#W$m$o%|&p&s'W'aQ${#cR&Y$|QzX_!|y#O#W&p&s'W'aQ$X!hQ%k$WU&|&f'O'^R'c'X",
  nodeNames: "⚠ UntilEOL Program FunctionDefinition FunctionPrototype QualifiedType TypeQualifier StorageQualifier Identifier const inout in out centroid patch sample uniform buffer shared coherent volatile restrict readonly writeonly subroutine TypeNameList TypeName LayoutQualifier layout LayoutQualifierId PrivateIdentifier Reserved common partition active asm class union enum typedef template this resource goto inline noinline public static extern external interface long short half fixed unsigned superp input output hvec2 hvec3 hvec4 fvec2 fvec3 fvec4 sampler3DRect filter sizeof cast namespace using Number Parens Assignment MulAssign DivAssign ModAssign AddAssign SubAssign LeftAssign RightAssign AndAssign XorAssign OrAssign Index LeftBracket RightBracket FunctionCall void float double int uint atomic_uint bool mat2 mat3 mat4 dmat2 dmat3 dmat4 mat2x2 mat2x3 mat2x4 dmat2x2 dmat2x3 dmat2x4 mat3x2 mat3x3 mat3x4 dmat3x2 dmat3x3 dmat3x4 mat4x2 mat4x3 mat4x4 dmat4x2 dmat4x3 dmat4x4 vec2 vec3 vec4 ivec2 ivec3 ivec4 bvec2 bvec3 bvec4 dvec2 dvec3 dvec4 uvec2 uvec3 uvec4 sampler3D samplerCube sampler1DShadow sampler2DShadow samplerCubeShadow sampler1DArray sampler2DArray sampler1DArrayShadow sampler2DArrayShadow samplerCubeArray samplerCubeArrayShadow isampler1D isampler2D isampler3D isamplerCube isampler1DArray isampler2DArray isamplerCubeArray usampler1D usampler2D usampler3D usamplerCube usampler1DArray usampler2DArray usamplerCubeArray sampler2DRect sampler2DRectShadow isampler2DRect usampler2DRect samplerBuffer isamplerBuffer usamplerBuffer sampler2DMS isampler2DMS usampler2DMS sampler2DMSArray isampler2DMSArray usampler2DMSArray image1D iimage1D uimage1D image2D iimage2D uimage2D image3D iimage3D uimage3D image2DRect iimage2DRect uimage2DRect imageCube iimageCube uimageCube imageBuffer iimageBuffer uimageBuffer image1DArray iimage1DArray uimage1DArray image2DArray iimage2DArray uimage2DArray imageCubeArray iimageCubeArray uimageCubeArray image2DMS iimage2DMS uimage2DMS image2DMSArray iimage2DMSArray uimage2DMSArray Field Postfix Inc Dec Unary Add Sub Bang Tilde Binary Mul Div Mod Left Right Lt Lte Gt Gte Eq Neq And Or Xor AndAnd OrOr XorXor Conditional PrecisionQualifier highp medp lowp InterpolationQualifier smooth flat noperspective InvariantQualifier invariant PreciseQualifier precise TypeSpecifier Struct struct StructDeclarationList StructDeclaration StructDeclarationSpecifier ArraySpecifier EmptyBrackets ParameterDeclaration StatementList Statement DeclarationStatement LocalDeclaration VariableDeclaration SingleDeclaration DeclarationSpecifier precision ExpressionStatement SelectionStatement if else SwitchStatement switch CaseLabel default case IterationStatement while Condition do for JumpStatement continue break return discard Preprocessor pragma import ImportDeclarationList ImportDeclaration String export optional global optimize debug STDGL Directive define undef ifdef ifndef elif endif error extension version line GlobalDeclaration QualifiedStructDeclaration QualifiedDeclaration",
  maxTerm: 353,
  skippedNodes: [0],
  repeatNodeCount: 14,
  tokenData: "6x~R}X^$Opq$Oqr$srs%Qst&yuv'Ovw']wx'rxy)fyz)kz{)p{|)}|}*d}!O*i!O!P+O!P!Q,x!Q!R-y!R![.q![!]0W!]!^0]!^!_0b!_!`1P!`!a1^!a!b1{!c!}2Q!}#O2c#P#Q2p#Q#R2u#R#S2Q#T#U3[#U#Y2Q#Y#Z4W#Z#o2Q#o#p6S#p#q6X#q#r6n#r#s6s#y#z$O$f$g$O#BY#BZ$O$IS$I_$O$I|$JO$O$JT$JU$O$KV$KW$O&FU&FV$O~$TY(Q~X^$Opq$O#y#z$O$f$g$O#BY#BZ$O$IS$I_$O$I|$JO$O$JT$JU$O$KV$KW$O&FU&FV$OR$xP%lP!_!`${Q%QO%yQ~%TVOr%Qrs%js#O%Q#O#P%o#P;'S%Q;'S;=`&s<%lO%Q~%oO'Y~~%rVOr%Qrs&Xs#O%Q#O#P%o#P;'S%Q;'S;=`&s<%lO%Q~&^V'Y~Or%Qrs%js#O%Q#O#P%o#P;'S%Q;'S;=`&s<%lO%Q~&vP;=`<%l%Q~'OO(m~~'TP%q~!_!`'W~']O!n~~'bQ%z~vw'h!_!`'m~'mO%}~~'rO!s~~'uVOw'rwx%jx#O'r#O#P([#P;'S'r;'S;=`)`<%lO'r~(_VOw'rwx(tx#O'r#O#P([#P;'S'r;'S;=`)`<%lO'r~(yV'Y~Ow'rwx%jx#O'r#O#P([#P;'S'r;'S;=`)`<%lO'r~)cP;=`<%l'r~)kO(W~~)pO(Y~~)uP%o~!_!`)x~)}O!l~~*SQ%j~{|*Y!_!`*_~*_O%g~~*dO!o~~*iO(X~~*nQ%k~}!O*t!_!`*y~*yO%h~~+OO!p~R+TP(cQ!Q![+WP+]V!iP!Q![+W!g!h+r!h!i,g!n!o,l#X#Y+r#Y#Z,g#`#a,rP+uQ}!O+{!Q![,RP,OP!Q![,RP,WT!iP!Q![,R!h!i,g!n!o,l#Y#Z,g#`#a,rP,lO!iPP,oP!h!i,gP,uP#Y#Z,g~,}R%p~z{-W!P!Q-]!_!`-t~-]O(T~~-bS(S~OY-]Z;'S-];'S;=`-n<%lO-]~-qP;=`<%l-]~-yO!m~P.OZ!iP!O!P+W!Q![.q!g!h+r!h!i,g!n!o,l!w!x,g#X#Y+r#Y#Z,g#`#a,r#i#j,g#l#m/fP.vY!iP!O!P+W!Q![.q!g!h+r!h!i,g!n!o,l!w!x,g#X#Y+r#Y#Z,g#`#a,r#i#j,gP/iR!Q![/r!c!i/r#T#Z/rP/wT!iP!Q![/r!c!i/r!w!x,g#T#Z/r#i#j,g~0]O(e~~0bO(h~~0gQ%t~!^!_0m!_!`0z~0rP%r~!_!`0u~0zO!q~~1PO%u~~1UP(Z~!_!`1X~1^O%x~~1cQ%v~!_!`1i!`!a1n~1nO%w~~1sP%s~!_!`1v~1{O!r~~2QO(d~R2VSWR!Q![2Q!c!}2Q#R#S2Q#T#o2Q~2hP!w~#P#Q2k~2pO&f~~2uO!x~~2zQ%|~!_!`3Q#Q#R3V~3VO!t~~3[O&P~V3aUWR!Q![2Q!c!}2Q#R#S2Q#T#g2Q#g#h3s#h#o2QV3zS(nSWR!Q![2Q!c!}2Q#R#S2Q#T#o2QV4]UWR!Q![2Q!c!}2Q#R#S2Q#T#f2Q#f#g4o#g#o2QV4tUWR!Q![2Q!c!}2Q#R#S2Q#T#c2Q#c#d5W#d#o2QV5]UWR!Q![2Q!c!}2Q#R#S2Q#T#a2Q#a#b5o#b#o2QV5vS(oSWR!Q![2Q!c!}2Q#R#S2Q#T#o2Q~6XO(f~~6^Q%{~!_!`6d#p#q6i~6iO!u~~6nO&O~~6sO(i~~6xO%m~",
  tokenizers: [untilEOLToken, untilCommentCloseToken, 0, 1, 2],
  topRules: {"Program":[0,2]},
  specialized: [{term: 8, get: value => spec_Identifier[value] || -1}],
  tokenPrec: 7202
})
