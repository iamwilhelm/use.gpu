// This file was generated by lezer-generator. You probably shouldn't edit it.
import {LRParser} from "@lezer/lr"
import {untilEOLToken, untilCommentCloseToken} from "./tokens"
const spec_Identifier = {__proto__:null,enable:8, array:14, bool:16, f16:18, f32:20, i32:22, u32:24, vec2:26, vec3:28, vec4:30, vec2i:32, vec3i:34, vec4i:36, vec2u:38, vec3u:40, vec4u:42, vec2f:44, vec3f:46, vec4f:48, vec2h:50, vec3h:52, vec4h:54, ptr:56, function:58, private:60, workgroup:62, uniform:64, storage:66, read:68, write:70, read_write:72, mat2x2:78, mat2x3:80, mat2x4:82, mat3x2:84, mat3x3:86, mat3x4:88, mat4x2:90, mat4x3:92, mat4x4:94, atomic:96, sampler:98, sampler_comparison:100, texture_depth_2d:102, texture_depth_2d_array:104, texture_depth_cube:106, texture_depth_cube_array:108, texture_depth_multisampled_2d:110, texture_1d:112, texture_2d:114, texture_2d_array:116, texture_3d:118, texture_cube:120, texture_cube_array:122, texture_multisampled_2d:124, texture_storage_1d:126, texture_storage_2d:128, texture_storage_2d_array:130, texture_storage_3d:132, rgba8unorm:134, rgba8snorm:136, rgba8uint:138, rgba8sint:140, rgba16uint:142, rgba16sint:144, rgba16float:146, r32uint:148, r32sint:150, r32float:152, rg32uint:154, rg32sint:156, rg32float:158, rgba32uint:160, rgba32sint:162, rgba32float:164, asm:168, bf16:170, do:172, enum:174, f64:176, handle:178, i8:180, i16:182, i64:184, mat:186, premerge:188, regardless:190, typedef:192, u8:194, u16:196, u64:198, unless:200, using:202, vec:204, void:206, while:208, var:222, true:232, false:234, const:238, override:240, bitcast:246, type:298, struct:302, fn:312, return:324, if:326, else:328, switch:330, case:332, fallthrough:334, default:336, loop:338, continuing:342, for:344, let:346, break:372, continue:374, discard:376, import:380, use:388}
export const parser = LRParser.deserialize({
  version: 14,
  states: "!%xO!QQSOOP!XOSOOO!aQSO'#G}O!hQSO'#ElOOQO'#Gj'#GjO!mQSO'#EkO&eQSO'#EjO&yQSO'#EiOOQO'#Ei'#EiOOQO'#Ha'#HaOOQO'#Gi'#GiO'OQSO'#G}QOQSOOO'VQSO'#C^OOQO'#Gg'#GgO+yQSO'#GaO,RQSO'#GaP,WQTO'#GzP,]QUO'#GzPOOO)CBn)CBnOOQO-E:e-E:eO,bQSO,5=iO,iQSO,5;WOOQO-E:h-E:hO0dQSO,5;UO0lQSO,5<WO1dQSO'#EnO1lQSO,5;bO1lQSO,5;bO1qQSO,5<QO1vQSO,5<SO1{QSO'#FmOOQO,5;T,5;TOOQO-E:g-E:gOOQO'#HX'#HXO2QQSO'#HXO2VQSO'#HXOOQO'#Cb'#CbOOQO'#Ca'#CaO3fQSO'#CbOOQO'#HY'#HYOOQO'#HZ'#HZOOQO'#H['#H[OOQO'#H]'#H]O3mQSO'#CbO3tQSO'#CbO2QQSO'#CbOOQO'#ER'#ERO3yQSO,58xO4RQSO'#GcOOQO,5<{,5<{O4WQWO,5<{O4]QSO,5<{POOO,5=f,5=fO5TQSO1G0rO5cQSO1G0pO:XQSO'#FrOOQO1G1r1G1rO:`QSO'#HfOOQO'#Ep'#EpO:qQWO'#EqOOQO,5;Y,5;YO1lQSO,5;YO:|QSO1G0|O;RQSO1G0|O;ZQSO1G1lO;cQSO1G1nO<ZQSO,5<XO<`QSO'#HOOOQO,5=s,5=sO?qQSO'#H^O<`QSO,5=qOOQO,58|,58|O:`QSO'#HRO@uQSO1G.dO@|QSO1G.dOOQO1G.d1G.dOAUQWO'#GdOAaQSO,5<}O4RQSO,5<}OAiQSO1G2gO+|QSO1G2gOOQO'#Hd'#HdOAnQSO7+&^O5TQSO7+&^OOQO'#Hi'#HiOAvQSO'#HhOOQO'#Hh'#HhOOQO'#Es'#EsOOQO7+&[7+&[OA{QWO'#EzOOQO'#Gs'#GsOCPQSO'#I]OCPQSO'#I^OC_QWO'#I]OEWQWO'#I[OOQO'#Fs'#FsOEbQSO'#FsOOQO'#Gp'#GpOEgQSO,5<^OOQO,5<^,5<^OKWQSO'#IOOEnQSO'#IPOEnQSO'#IROK_QSO'#IVO1dQSO'#IZO1lQSO'#IZOKdQSO'#IWOOQO'#Ia'#IaOKiQSO'#FsOKnQSO,5>QOOQO'#HS'#HSO<`QSO,5;]OOQO1G0t1G0tO5cQSO7+&hOEnQSO7+&hO<`QSO7+'WOKvQSO'#FjOOQO7+'Y7+'YOLRQSO1G1sOL^QSO,5=jOLcQSO,5=xOOQO'#H_'#H_OLhQSO1G3]OLpQSO,5=mOOQO,5=S,5=SOOQO7+$O7+$OOLuQSO7+$OOOQO-E:f-E:fOL|QSO,5=OOMRQSO1G2iOOQO1G2i1G2iOMZQSO1G2iOOQO-E:r-E:rOOQO7+(R7+(ROOQO,5=V,5=VOOQO<<Ix<<IxOMcQSO<<IxOOQO-E:i-E:iOMkQSO,5>SOOQO-E:q-E:qOOQO'#I^'#I^OMrQWO,5>wONvQSO,5>xON{QSO'#FOOEnQSO'#HtO! lQWO'#HtOOQO,5>w,5>wOOQO'#I_'#I_OEnQSO,5>vO!!lQSO,5<_OOQO,5<_,5<_OOQO-E:n-E:nOOQO1G1x1G1xO!#fQ`O'#CbOEnQSO'#HsOOQO'#Hq'#HqOKiQSO'#HqO!%WQ`O'#HpOOQO'#Ho'#HoOEnQSO'#HoO!'qQ`O'#HnO!(vQ`O'#HmO!)uQ`O'#HlO!*cQ`O'#HkO!+^QSO'#HvO!+uQSO'#HjO!+zQSO'#HjO!,PQSO'#HjO!,UQSO'#HjO!,ZQSO'#HjO2QQSO'#HqOOQO,5>j,5>jO:SQSO,5>kO!,`QSO,5>mO!,eQSO,5>qO!,oQSO,5>uO1lQSO,5>uO!,wQSO,5>uO!-bQSO,5>rO!-iQSO'#HrOOQO1G3l1G3lO!-pQSO1G3lOOQO1G0w1G0wOOQO<<JS<<JSOOQO'#Ey'#EyOOQO<<Jr<<JrON{QSO'#FkO!-{QSO,5<UO!.TQSO,5<UOOQO,5<U,5<UO!.]QSO'#FpO!.bQSO'#FoO!.TQSO'#FoO!.jQSO7+'_OOQO1G3U1G3UO!-pQSO1G3dOOQO7+(w7+(wO!.oQSO7+(wO<`QSO1G3XOOQO<<Gj<<GjP'VQSO'#GhOOQO1G2j1G2jOOQO7+(T7+(TO!.zQSO7+(TP!/SQSO'#GtOOQOAN?dAN?dP!/XQSO'#GkO!/^QSO1G3nO5cQSO1G3nOOQO1G3n1G3nOOQO1G4c1G4cOOQO1G4d1G4dOOQO'#FP'#FPOOQO,5;j,5;jO!/fQSO,5>`OOQO,5>`,5>`OOQO1G4b1G4bOOQO1G1y1G1yO!/kQSO,5>_OOQO,5>],5>]O!/pQ`O'#HtOOQO,5>[,5>[OOQO,5>Z,5>ZOEnQSO,5>WOEnQSO,5>YOEnQSO,5>XOEnQSO,5>VOEnQSO,5>bOEnQSO,5>cOEnQSO,5>dOEnQSO,5>eOEnQSO,5>fOKRQSO,5>]O!0yQSO1G4VO!2ZQSO1G4XO!2cQSO1G4]O:SQSO'#F|OOQO1G4]1G4]O!2mQSO1G4]OEnQSO1G4aO!2rQSO1G4aODcQWO'#I[OOQO'#IY'#IYO!2zQSO'#IXO!3RQSO'#IXOKiQSO'#IYO!3WQSO1G4^O!3]QSO,5>^OEnQSO,5>^OOQO,5>^,5>^O!3eQSO7+)WOOQO'#HU'#HUO!3jQWO,5<VO!3oQSO1G1pOOQO1G1p1G1pO!3zQSO1G1pOOQO-E:l-E:lO!4SQWO,5<[O!4XQSO,5=ZO!4dQSO,5<ZOOQO-E:m-E:mO!4lQpO<<JyO!5gQSO7+)OOOQO'#HW'#HWO!5lQSO<<LcO!5qQSO7+(sOOQO<<Ko<<KoPOQO,5=`,5=`O!9kQSO7+)YOOQO7+)Y7+)YO!9rQSO7+)YOOQO-E:j-E:jO!:fQWO1G3zOOQO1G3y1G3yOOQO1G3r1G3rOOQO1G3t1G3tOOQO'#Hn'#HnO!<^Q`O1G3sO!=lQ`O'#HnO!(OQSO'#HmO!=vQSO'#HlOOQO1G3q1G3qO!>cQSO1G3|O!>jQSO1G3}O!>qQSO1G4OO!>xQSO1G4PO!?PQSO1G4QOOQO1G3w1G3wO!?WQSO7+)qOOQO'#Gq'#GqO!?`QSO7+)sO!?kQSO'#ISO!?|QWO'#ISOOQO7+)w7+)wO!@RQSO7+)wOOQO,5<h,5<hOOQO7+){7+){OEnQSO7+){O!@WQSO,5>sO!@iQSO,5>sO!@nQSO,5>sOOQO,5>t,5>tO:SQSO7+)xO!F_QSO1G3xOOQO1G3x1G3xO!FfQSO1G3xOOQO-E:k-E:kOOQO<<Lr<<LrO<`QSO1G1qOOQO7+'[7+'[O!FnQSO7+'[P!FyQSO'#GnO<`QSO1G1vO!GOQSO1G1uP!GZQSO'#GoO!G`QSO'#FqOOQOAN@eAN@eOOQO<<Lj<<LjOOQOANA}ANA}OOQO<<L_<<L_O!-pQSO<<L_OOQO<<Lt<<LtO!JtQSO<<LtP!J{QSO'#GlOOQO7+)f7+)fO!KQQ`O1G3zOOQO'#IQ'#IQOOQO<<M]<<M]OOQO-E:o-E:oOOQO<<M_<<M_O!LZQWO'#ITO!?kQSO'#ITO!LcQWO,5>nO!LhQSO,5>nOOQO<<Mc<<McOOQO<<Mg<<MgO!LmQWO'#I`OOQO'#I`'#I`OOQO1G4_1G4_OKiQSO'#I`O!LwQSO1G4_O!MYQSO1G4_OOQO<<Md<<MdOOQO7+)d7+)dO!M_QSO7+)dP!MfQSO'#GmOOQO7+']7+']OOQO<<Jv<<JvPOQO,5=Y,5=YOOQO7+'b7+'bPOQO,5=Z,5=ZO<`QSO,5<]O!MkQSOANAyOOQOANB`ANB`POQO,5=W,5=WO!!qQWO'#CbO!MpQWO'#HpO!;fQSO1G3sO!NYQpO,5=^O!NaQWO,5>oOOQO-E:p-E:pO!NiQSO1G4YO!NnQSO1G4YOOQO,5>z,5>zOOQO7+)y7+)yO!NxQSO7+)yOOQO<<MO<<MOPOQO,5=X,5=XOOQO1G1w1G1wOOQOG27eG27eO# ZQpO1G4ZP# bQSO'#GrO# gQSO7+)tO# qQSO'#IUO# {QSO'#IUOOQO7+)t7+)tO#!QQSO7+)tOOQO<<Me<<MePOQO,5=^,5=^OOQO<<M`<<M`O#!VQSO<<M`OOQO,5>p,5>pOOQOANBzANBzO#![QSO'#HoO#'gQSO,5>`O#![QSO,5>WOEnQSO,5>XO!&aQ`O'#HnOEnQSO'#Ht",
  stateData: "#'u~O%mOS%oPQ%pPQ~OS]O%U_O%Y`O&SXO&URO#c#_P#k#_P#l#_P$Z#_P$]#_P$b#_P~O%i%qP~P]O%oaO%pbO~O%i%qX~P]ORfO~O&URO#c#_X#k#_X#l#_X$Z#_X$]#_X$b#_XR#_XV#_XW#_XX#_XY#_XZ#_X[#_X]#_X^#_X_#_X`#_Xa#_Xb#_Xc#_Xd#_Xe#_Xf#_Xg#_Xh#_Xi#_Xj#_Xk#_Xl#_Xw#_Xx#_Xy#_Xz#_X{#_X|#_X}#_X!O#_X!P#_X!Q#_X!R#_X!S#_X!T#_X!U#_X!V#_X!W#_X!X#_X!Y#_X!Z#_X![#_X!]#_X!^#_X!_#_X!`#_X!a#_X!b#_X!c#_X!d#_X~O#cjO#kkO#llO$ZmO$]nO$boO~O&SpO~O%i%qX~P`ORuOVwOWuOXuOYuOZuO[uO]|O^|O_|O`uOauObuOcuOduOeuOfuOguOhuOiuOjuOkuOl}Ow|Ox|Oy|Oz|O{|O||O}|O!O|O!P|O!Q!OO!RxO!SxO!TyO!UyO!VyO!WyO!XyO!YzO!ZzO![zO!]zO!^zO!_zO!`sO!a{O!b{O!c{O!d{O!v!PO!w!PO!x!PO!y!PO!z!PO!{!PO!|!PO!}!PO#O!PO#P!PO#Q!PO#R!PO#S!PO#T!PO#U!PO#V!PO#W!PO#X!PO#Y!PO#Z!PO#[!PO~O%X!SO&o!RO~O%X!UO~O%j!VO~O%k!VO~O%i%qa~P`O&V!WO#c#`a#k#`a#l#`a$Z#`a$]#`a$b#`a&U#`aR#`aV#`aW#`aX#`aY#`aZ#`a[#`a]#`a^#`a_#`a`#`aa#`ab#`ac#`ad#`ae#`af#`ag#`ah#`ai#`aj#`ak#`al#`aw#`ax#`ay#`az#`a{#`a|#`a}#`a!O#`a!P#`a!Q#`a!R#`a!S#`a!T#`a!U#`a!V#`a!W#`a!X#`a!Y#`a!Z#`a![#`a!]#`a!^#`a!_#`a!`#`a!a#`a!b#`a!c#`a!d#`a~O#f!XO&S#^a~O&o!YO#c$`a#k$`a#l$`a$Z$`a$]$`a$b$`a%U$`a%Y$`a%i$`a&S$`a&U$`a~OR!^O%s![O~OR!^O~OR!cO~OR!dO~OR!eO~O%s!fO~O%s!hO~O%wUX&SUX&VUX%tUX#fUX&pUX&XUX#cUX#kUX#lUX$ZUX$]UX$bUX%UUX%YUX%iUX&UUX&oUX~O%s!iO~P2[O%s!fO~P2[O%s!kO~O%w!lO&S!nO~OR!oO~O'V!rO~O'W!sO#c%Ta#k%Ta#l%Ta$Z%Ta$]%Ta$b%Ta%U%Ta%Y%Ta%i%Ta&S%Ta&U%Ta~OR!tOu!tOv!tO#a!tO~ORuOVwOWuOXuOYuOZuO[uO]|O^|O_|O`uOauObuOcuOduOeuOfuOguOhuOiuOjuOkuOl}Ou!wOv!wOw|Ox|Oy|Oz|O{|O||O}|O!O|O!P|O!Q!OO!RxO!SxO!TyO!UyO!VyO!WyO!XyO!YzO!ZzO![zO!]zO!^zO!_zO!`sO!a{O!b{O!c{O!d{O#a!wO#h!wO#i!wO~OR!|O#c#]O#w!}O#x!}O$h#XO$i#YO$k#ZO$o#[O$r#_O$s#^O%Q#`O%R#`O%S#`O&S#SO&V#PO&o!YO~O&p#WO~P9TOm#cOn#cOo#cOp#cOq#cO~O&Z#dO#f#eX&S#eX~O#f#fO~O#f#gO&S#ji~O#f#hO&S$Yi~O&o#iO#c$[i#k$[i#l$[i$Z$[i$]$[i$b$[i%U$[i%Y$[i%i$[i&S$[i&U$[i~O&V#kO~ORuOVwOWuOXuOYuOZuO[uO]|O^|O_|O`uOauObuOcuOduOeuOfuOguOhuOiuOjuOkuOl}Ow|Ox|Oy|Oz|O{|O||O}|O!O|O!P|O!Q!OO!RxO!SxO!TyO!UyO!VyO!WyO!XyO!YzO!ZzO![zO!]zO!^zO!_zO!`sO!a{O!b{O!c{O!d{O~O!e#nO!f#nO!g#nO!h#nO!i#nO!j#nO!k#nO!l#nO!m#nO!n#nO!o#nO!p#nO!q#nO!r#nO!s#nO!t#nO~O&S#rO~P'VO%w#sO&S#rO~O'U#uO%w%WX&p%WX~O%w#vO&p#wO~O%X#zO~O%w#{O&X#|O~O&V$PO~O#f'QX#p'QX$t'QX$u'QX$v'QX$w'QX$x'QX$y'QX$z'QX${'QX$|'QX$}'QX%O'QX%P'QX&V#nX&i'QX~OR$RO#w!}O#x!}O&V#PO~O#p$VO&i$UO#f'PX$t'PX$u'PX$v'PX$w'PX$x'PX$y'PX$z'PX${'PX$|'PX$}'PX%O'PX%P'PX&X'PX~O#f$ZO$t$YO$u$YO$v$YO$w$YO$x$YO$y$YO$z$YO${$YO$|$YO$}$YO~O%O$[O%P$[O~PDcO&S$]O~O&p$_O~P9TOR$`OVwOWuOXuOYuOZuO[uO]|O^|O_|O`uOauObuOcuOduOeuOfuOguOhuOiuOjuOkuOl}Ou!wOv!wOw|Ox|Oy|Oz|O{|O||O}|O!O|O!P|O!Q!OO!RxO!SxO!TyO!UyO!VyO!WyO!XyO!YzO!ZzO![zO!]zO!^zO!_zO!`sO!a{O!b{O!c{O!d{O!v!PO!w!PO!x!PO!y!PO!z!PO!{!PO!|!PO!}!PO#O!PO#P!PO#Q!PO#R!PO#S!PO#T!PO#U!PO#V!PO#W!PO#X!PO#Y!PO#Z!PO#[!PO#a!wO#h!wO#i!wO#o$qO#t$fO#u$fO#v$fO#w$fO#x$fO&V$aO~O&S&rX~PEnO&o$uO~O&V$yO~O&V$zO~O%t${O%w$|O~O&URO&p%UOR#_P~O&UROR#_P&X$cP~O%t%ZO~O%w%[O~O%t%]O%w%^O~O%w%_O~O&S%`O~P'VOR%bO~O&p%cOR%ha~O%w%dO&p%cO~O%w#{O&X%fO~O&X%jO~P5cO#p$VO&i$UO#f'Pa$t'Pa$u'Pa$v'Pa$w'Pa$x'Pa$y'Pa$z'Pa${'Pa$|'Pa$}'Pa%O'Pa%P'Pa&X'Pa~O&X%lO~OR%mO~O&i$UO&X&hX$U&hX$V&hX&S&hX&o&hX#q&hX%w&hX~O#p$VO#f&hX$t&hX$u&hX$v&hX$w&hX$x&hX$y&hX$z&hX${&hX$|&hX$}&hX%O&hX%P&hX~P! QO&S%rO~O#p&eX$U&eX$V&eX&S&eX&VUX&V#nX&i&eX&o&eX#q&eX&X&eX%w&eX~O#t&eX#w&eX#x&eX#y&eX#z&eX#{&eX#|&eX#}&eX$O&eX$P&eX$Q&eX$R&eX$S&eX$T&eX$W&eX$X&eX~P!!qO&i$UO$U&dX$V&dX&S&dX&o&dX#q&dX&X&dX%w&dX~O#p)eO#t&dX#w&dX#x&dX#y&dX#z&dX#{&dX#|&dX#}&dX$O&dX$P&dX$Q&dX$R&dX$S&dX$T&dX$W&dX$X&dX~P!$lO#|%xO#}%xO#t&bX#w&bX#y&bX#z&bX#{&bX$O&bX$P&bX$Q&bX$R&bX$S&bX$T&bX$U&bX$V&bX&S&bX&o&bX#q&bX&X&bX%w&bX~O#x&lX$W&mX$X&nX~P!&aO#w%yO#y%yO#z%yO#t&aX#{&aX$U&aX$V&aX&S&aX&o&aX#q&aX&X&aX%w&aX~O$O&aX$P&aX$Q&aX$R&aX$S&aX$T&aX~P!(OO$U&`X$V&`X&S&`X&o&`X#q&`X&X&`X%w&`X~O#t%zO#{%zO$O&`X$P&`X$Q&`X$R&`X$S&`X$T&`X~P!)^O$O%{O$P%{O$Q%{O$R%{O$S%{O$T%{O$U&_X$V&_X&S&_X&o&_X#q&_X&X&_X%w&_X~O$U&jX$V&kX&S&^X&o&^X#q&^X&X&^X%w&^X~O$U%|O~O$V%}O~O#x&OO~O$W&PO~O$X&QO~O&o&TO~O$q&VO&p&WO~P9TO#f&YO&S&}a~O#f&YO~OR!|O#c#]O#w!}O#x!}O$s#^O&V#PO~O&S&^O~P!,|O&X&dO~PEnOr&fOs&fOt&fO~O%w&hO&p&iO~O&UROR#_P~OR&lO~O%w&mO&X$cX~O&X&pO~OR&rOu&rOv&rO~O&p&uOR%ha~O%w&vO~O%w#{O~O%w&wO&X&xO~O#q&{O~O&X&|O~O#p)eO#t&hX#w&hX#x&hX#y&hX#z&hX#{&hX#|&hX#}&hX$O&hX$P&hX$Q&hX$R&hX$S&hX$T&hX$W&hX$X&hX~P! QO$j']OR&si#c&si#w&si#x&si$h&si$i&si$k&si$o&si$r&si$s&si%Q&si%R&si%S&si&S&si&V&si&o&si&p&si$q&si$m&si~O$l'`O$n'aO~O$q&VO&p'bO~P9TO&p'bO~O#f'fO&S&}i~O&S'gO~PEnO&S'iO~O&X'kO~O%w'lO&X'mO~O%t'pO~O&Z'qO~O&p'rOR%ba&U%ba~O%w'sO&p'rO~O&Z'uO~OR%ca&U%ca&X$ca~O%w'vO&X$ca~O&q'xO#c$eP#k$eP#l$eP$Z$eP$]$eP$b$eP%U$eP%Y$eP%i$eP&S$eP&U$eP&o$eP~O%t'zO~O%t'{O~O%t'|O%w'}O~OR%`aV%`aW%`aX%`aY%`aZ%`a[%`a]%`a^%`a_%`a`%`aa%`ab%`ac%`ad%`ae%`af%`ag%`ah%`ai%`aj%`ak%`al%`au%`av%`aw%`ax%`ay%`az%`a{%`a|%`a}%`a!O%`a!P%`a!Q%`a!R%`a!S%`a!T%`a!U%`a!V%`a!W%`a!X%`a!Y%`a!Z%`a![%`a!]%`a!^%`a!_%`a!`%`a!a%`a!b%`a!c%`a!d%`a#a%`a#h%`a#i%`a~O&X(OO~P!5yO%w(PO&X(OO~O&i$UO&X&hi$U&hi$V&hi&S&hi&o&hi#q&hi%w&hi~O#p$VO#f&hi$t&hi$u&hi$v&hi$w&hi$x&hi$y&hi$z&hi${&hi$|&hi$}&hi%O&hi%P&hi~P!9zO#w%yO#y%yO#z%yO#t&ai#{&ai$U&ai$V&ai&S&ai&o&ai#q&ai&X&ai%w&ai~O$O&ai$P&ai$Q&ai$R&ai$S&ai$T&ai~P!;fO#t&bX#w&bX#y&bX#z&bX#{&bX$U&bX$V&bX&S&bX&o&bX#q&bX&X&bX%w&bX~O#|)bO#})bO~P!<tO#t)cO#{)cO~P!)^O&S&^i&o&^i#q&^i&X&^i%w&^i~O$U&ji~P!>QO$V&ki~P!>QO#x&li~P!>QO$W&mi~P!>QO$X&ni~P!>QO$i#YO&o!YO~O$l'`O$n'aO&p(WO~Ou!wOv!wO#a!wO#h!wO#i!wO~O&Z([O~O&p(]O~OR!|O#w!}O#x!}O&V#PO&X&{a~O&S(cO~O&S(cO~PEnOR%aaV%aaW%aaX%aaY%aaZ%aa[%aa]%aa^%aa_%aa`%aaa%aab%aac%aad%aae%aaf%aag%aah%aai%aaj%aak%aal%aau%aav%aaw%aax%aay%aaz%aa{%aa|%aa}%aa!O%aa!P%aa!Q%aa!R%aa!S%aa!T%aa!U%aa!V%aa!W%aa!X%aa!Y%aa!Z%aa![%aa!]%aa!^%aa!_%aa!`%aa!a%aa!b%aa!c%aa!d%aa!v%aa!w%aa!x%aa!y%aa!z%aa!{%aa!|%aa!}%aa#O%aa#P%aa#Q%aa#R%aa#S%aa#T%aa#U%aa#V%aa#W%aa#X%aa#Y%aa#Z%aa#[%aa#a%aa#h%aa#i%aa#o%aa#t%aa#u%aa#v%aa#w%aa#x%aa&V%aa~O&X(fO~P!@uO%w(gO&X(fO~O&p(jOR%ba&U%ba~O%w(kO~OR%ca&U%ca&X$ci~O%w(mO~O&UROR#_PV#_PW#_PX#_PY#_PZ#_P[#_P]#_P^#_P_#_P`#_Pa#_Pb#_Pc#_Pd#_Pe#_Pf#_Pg#_Ph#_Pi#_Pj#_Pk#_Pl#_Pw#_Px#_Py#_Pz#_P{#_P|#_P}#_P!O#_P!P#_P!Q#_P!R#_P!S#_P!T#_P!U#_P!V#_P!W#_P!X#_P!Y#_P!Z#_P![#_P!]#_P!^#_P!_#_P!`#_P!a#_P!b#_P!c#_P!d#_P~O&X(pO~P!5yO%w(qO~O#p)eO#t&hi#w&hi#x&hi#y&hi#z&hi#{&hi#|&hi#}&hi$O&hi$P&hi$Q&hi$R&hi$S&hi$T&hi$W&hi$X&hi~P!9zO%w(uO&Z&wX~O&Z(xO~O&o(yO~O%O(zO%P(zO~PDcOR!|O#w!}O#x!}O&V#PO&X&{i~O&S(|O~O&X(}O~P!@uO%w)OO~O%t)QO~O#p$VO~P!$lOu%fav%fa#a%fa#h%fa#i%fa~O&Z&wa~P!MwO%w)RO&Z&wa~O&o)TO~O$m)VO&p)WO~P9TOR!|O#w!}O#x!}O&V#PO&X&{q~O&Z&wi~P!MwO%w)ZO~O$m)VO&p)[O~P9TO$m)VO&p&xX~P9TO&S)^O~O&p)[O~O&p)_O~OR(rOVwOWuOXuOYuOZuO[uO]|O^|O_|O`uOauObuOcuOduOeuOfuOguOhuOiuOjuOkuOl}Ow|Ox|Oy|Oz|O{|O||O}|O!O|O!P|O!Q!OO!RxO!SxO!TyO!UyO!VyO!WyO!XyO!YzO!ZzO![zO!]zO!^zO!_zO!`sO!a{O!b{O!c{O!d{O!v!PO!w!PO!x!PO!y!PO!z!PO!{!PO!|!PO!}!PO#O!PO#P!PO#Q!PO#R!PO#S!PO#T!PO#U!PO#V!PO#W!PO#X!PO#Y!PO#Z!PO#[!PO#o$qO#t)`O#u)`O#v)`O#w)`O#x)`O&V$aO~P!?kO#q(SO~O%o#y#avu#tRv~",
  goto: "Bh'UPP'VPP'Z'cPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP(vPPPPPPPPPPPPPPPPPPPPP)k)q)w*YP*fP*i*oP+UPP)qPP+[+ePPP,e,qPPPPPPPPPPPPPPPPPPPP)qP,wP,}-Q,w-WP-Z-^-d-g.PPPPPPPPP.[PPPPPPPPPPPPPPPPPP)kP.b.hPP.n.t.z/U/d/j/p/v/|0S0^0d0j0{PPPPP1RPP1U1XPP1c1fP1l1u2t1u2w2w3v4u5t5wP5zPP6QP6WP6[6f7a8X8o9U9k:W;X;v<g<s=eP=w>X>i>y?ZPPP?k?t@Q@T@^@b@e@T@T@n@q@tAQAcAwBYB_?kT^OQQ!Q]V#q!l#s%aWv]!l#s%aW!x!X#f$P%iQ#l!fQ#o!i!W$c#X#Y#Z#g$V$Z$a$f$z%x%y%z%{%|%}&O&P&Q&Y&^&c'f'i)`)b)c)eQ$}#dQ%Q#hQ&t%_Q(i'qQ(l'uR)P(nWv]!l#s%a!X$b#X#Y#Z#g$V$Z$a$f$z%x%y%z%{%|%}&O&P&Q&Y&^&c'f'i)`)b)c)eXXOQZeXVOQZeWUOQZeS%R#i%TS%V#k%XR(n'xeSOQTZe#i#k%T%X'xRhUQ!`jR$w#]Q!_jQ!akQ!blQ#e!`Q$v#]Q$x#^R&Z$wQ!{!XR%O#fQ%O#gQ'e&YR(^'f^#a!Y#V$u&U(y)T)U!W$c#X#Y#Z#g$V$Z$a$f$z%x%y%z%{%|%}&O&P&Q&Y&^&c'f'i)`)b)c)eQ&`$yV(b'g(c(|Y$W#Q$S$W&{(sV%u$d%u(SQ%n$UR&g%RXWOQZeR#j!dQ%S#iR&j%TRiUR%Y#kQ%W#kR&n%XR'y&pQ!Zi^#S!Y#V$u&U(y)T)UQ&S$sQ'd&VQ(T']R(e'kW#U!Y#V$u&UV)U(y)T)UQ&X$uR'c&UQ!T_R#z!sQ!p!RR#x!qQQORdQQ!m!QR#t!mQZOQeQTqZebTOQZe#i#k%T%X'xRgTQ!v!WR$O!vQ%i$PR&z%iQ&c$zR'o&cQ%T#iR&k%TQ%X#kR&o%XQ#V!YS$^#V&UR&U$uQ'_&TR(V'_Q(Y'`R(w(Yh#O!Y#P#V$u$y&U'g(c(y(|)T)UR$Q#OQ!q!RR#y!qRcPR[OQ!gsS!j|!OR&R$qR!j}Q#b![R#p!kQ&e$|Q&q%[R(o'}!yu]!X!f!i!l#X#Y#Z#d#f#g#h#s$P$V$Z$a$f$z%_%a%i%x%y%z%{%|%}&O&P&Q&Y&^&c'f'i'q'u(n)`)b)c)eR&s%^!yr]!X!f!i!l#X#Y#Z#d#f#g#h#s$P$V$Z$a$f$z%_%a%i%x%y%z%{%|%}&O&P&Q&Y&^&c'f'i'q'u(n)`)b)c)e!ys]!X!f!i!l#X#Y#Z#d#f#g#h#s$P$V$Z$a$f$z%_%a%i%x%y%z%{%|%}&O&P&Q&Y&^&c'f'i'q'u(n)`)b)c)e!yt]!X!f!i!l#X#Y#Z#d#f#g#h#s$P$V$Z$a$f$z%_%a%i%x%y%z%{%|%}&O&P&Q&Y&^&c'f'i'q'u(n)`)b)c)eR!gtR#m!hXYOQZeQ!u!WR#}!vT!]j#]S!z!X#fQ%h$PR&y%iW!y!X#f$P%i!W$b#X#Y#Z#g$V$Z$a$f$z%x%y%z%{%|%}&O&P&Q&Y&^&c'f'i)`)b)c)eQ(X'`R(v(YQ$r#XQ$s#YQ$t#ZU%P#g&Y'fQ%o$VQ%q$ZQ%s$aQ&b$zQ'h&^Q'n&cQ(d'iR)a)el$k#X#Y#Z#g$V$Z$a$z&Y&^&c'f'i)eQ'V%|R'W%}p$j#X#Y#Z#g$V$Z$a$z%|%}&Y&^&c'f'i)eR'U%{p$i#X#Y#Z#g$V$Z$a$z%|%}&Y&^&c'f'i)eR'T%{p$h#X#Y#Z#g$V$Z$a$z%|%}&Y&^&c'f'i)eQ'Q%zQ'S%{R(t)cl$g#X#Y#Z#g$V$Z$a$z&Y&^&c'f'i)eS%w$f)`S&}%x)bQ'O%yS'P%z)cQ'R%{Q'X&OQ'Y&PQ'Z&QT)d%|%}!X$e#X#Y#Z#g$V$Z$a$f$z%x%y%z%{%|%}&O&P&Q&Y&^&c'f'i)`)b)c)e!S$d#X#Y#Z#g$V$Z$a$f$z%x%y%z%{%|%}&O&P&Q&Y&^&c'f'i)c)eT(s)`)bQ$[#aQ%t$cQ'j&`R(z(b!W$b#X#Y#Z#g$V$Z$a$f$z%x%y%z%{%|%}&O&P&Q&Y&^&c'f'i)`)b)c)eR'[&RQ$X#QQ%k$SS%p$W%uS%v$d(sT(R&{(Sm$l#X#Y#Z#g$V$Z$a$z&Y&^&c'f'i)em$m#X#Y#Z#g$V$Z$a$z&Y&^&c'f'i)em$n#X#Y#Z#g$V$Z$a$z&Y&^&c'f'i)em$o#X#Y#Z#g$V$Z$a$z&Y&^&c'f'i)em$p#X#Y#Z#g$V$Z$a$z&Y&^&c'f'i)e_#T!Y#V$u&U(y)T)U^#S!Y#V$u&U(y)T)UR(T']R(U']_#S!Y#V$u&U(y)T)UT'^&T'_R(Z'`Q)X(yQ)])TR)^)UR&a$yR&_$y^#T!Y#V$u&U(y)T)UR&]$y^#T!Y#V$u&U(y)T)UQ&]$yV(`'g(c(|^#R!Y#V$u&U(y)T)UQ$T#PQ&[$yV(_'g(c(|h#Q!Y#P#V$u$y&U'g(c(y(|)T)UR$S#OV$Z#R&[(_Q(a'gQ({(cR)Y(|",
  nodeNames: "⚠ Program EnableDirective Identifier Directive EnableExtension TypeDeclaration Type Type Type Type Type Type Type Type Type Type Type Type Type Type Type Type Type Type Type Type Type Type Keyword Keyword Keyword Keyword Keyword Keyword Keyword Keyword IntLiteral UintLiteral Type Type Type Type Type Type Type Type Type Type Type Type Keyword Keyword Keyword Keyword Keyword Type Type Type Type Type Type Keyword Type Type Type Type Type Type Type Type Type Type Type Type Type Type Type Type Type Type Type Type Reserved Reserved Reserved Reserved Reserved Reserved Reserved Reserved Reserved Reserved Reserved Reserved Reserved Reserved Reserved Reserved Reserved Reserved Reserved Reserved Reserved Reserved LocalDeclaration GlobalVariableDeclaration AttributeList Attribute FloatLiteral GlobalVariable Keyword VariableQualifier VariableIdentifier Assign Value Boolean Boolean GlobalConstantDeclaration Keyword Keyword Value FunctionCall Keyword LeftBracket RightBracket FieldAccess PrivateIdentifier Sub Bang Tilde Mul And Div Mod Add Left Right Lt Gt Lte Gte Eq Neq OrOr AndAnd Or Xor TypeAliasDeclaration Keyword StructDeclaration Keyword StructBodyDeclaration StructMember FunctionDeclaration FunctionHeader Keyword ParamList Param ReturnType CompoundStatement Statement Keyword Keyword Keyword Keyword Keyword Keyword Keyword Keyword ContinuingStatement Keyword Keyword Keyword AddAssign SubAssign MulAssign DivAssign ModAssign AndAssign XorAssign OrAssign LeftAssign RightAssign Inc Dec Keyword Keyword Keyword ImportDeclaration Keyword ImportDeclarationList ImportDeclarationIdentifier String Keyword",
  maxTerm: 284,
  skippedNodes: [0],
  repeatNodeCount: 14,
  tokenData: "7k~R|X^#{pq#{qr$prs$}uv&vvw'Twx'jxy)^yz)cz{)h{|)u|}*[}!O*a!O!P/W!P!Q/`!Q!R/}!R![0i![!]0}!]!^1[!^!_1a!_!`2Q!`!a2_!b!c3O!c!}3T!}#O3f#P#Q3k#Q#R3p#R#S3T#T#U3}#U#Y3T#Y#Z4y#Z#o3T#o#p6u#p#q6z#q#r7a#r#s7f#y#z#{$f$g#{#BY#BZ#{$IS$I_#{$I|$JO#{$JT$JU#{$KV$KW#{&FU&FV#{~$QY%m~X^#{pq#{#y#z#{$f$g#{#BY#BZ#{$IS$I_#{$I|$JO#{$JT$JU#{$KV$KW#{&FU&FV#{T$uP#uP!_!`$xS$}O$TS~%QVOr$}rs%gs#O$}#O#P%l#P;'S$};'S;=`&p<%lO$}~%lO%X~~%oVOr$}rs&Us#O$}#O#P%l#P;'S$};'S;=`&p<%lO$}~&ZV%X~Or$}rs%gs#O$}#O#P%l#P;'S$};'S;=`&p<%lO$}~&sP;=`<%l$}V&{P#zT!_!`'OQ'TO$xQ~'YQ#xTvw'`!_!`'e~'eO$V~Q'jO$yQ~'mVOw'jwx%gx#O'j#O#P(S#P;'S'j;'S;=`)W<%lO'j~(VVOw'jwx(lx#O'j#O#P(S#P;'S'j;'S;=`)W<%lO'j~(qV%X~Ow'jwx%gx#O'j#O#P(S#P;'S'j;'S;=`)W<%lO'j~)ZP;=`<%l'j~)cO&V~~)hO&X~V)mP#wT!_!`)pQ)uO$vQV)zQ#{T{|*Q!_!`*VQ*VO%OQQ*[O$tQ~*aO%w~~*fU#tT}!O*x!O!P,`!Q!R,f!R![,{!_!`.|!`!a/RZ*}P%PQ!Q![+QX+TQ!O!P+Z!Q![+QX+`S#aX!Q![+Z!g!h+l#X#Y+l#Y#Z,ZX+oR{|+x}!O+x!Q![,OX+{P!Q![,OX,TQ#aX!Q![,O#Y#Z,ZX,`O#aXX,cP!Q![+Z~,iU!O!P+Z!Q![,{!g!h+l!z!{-[#X#Y+l#l#m-[X-OS!O!P+Z!Q![,{!g!h+l#X#Y+l~-_S!O!P-k!Q![.]!c!i.]#T#Z.]X-nR!Q![-w!c!i-w#T#Z-wX-|T#aX!Q![-w!c!i-w!r!s+l#T#Z-w#d#e+l~.bVu~!O!P-w!Q![.]!c!i.]!r!s+l#T#Z.]#d#e+l#i#j.w~.|Ov~Q/RO$uQW/WO&qW_/]P&iU!Q![+Z~/eR#yTz{/n!P!Q/s!_!`/x~/sO%p~~/xO%o~Q/}O$wQ~0SVu~!O!P+Z!Q![,{!g!h+l!z!{-[#X#Y+l#i#j.w#l#m-[~0nTu~!O!P+Z!Q![0i!g!h+l#X#Y+l#i#j.wZ1SP&ZY![!]1VP1[O'WP~1aO&S~V1hQ%sP$OS!^!_1n!_!`1{U1sP#|S!_!`1vQ1{O$|QS2QO$QSV2VP#fR!_!`2YS2_O$SSV2fQ%tP$PS!_!`2l!`!a2qS2qO$RSU2vP#}S!_!`2yQ3OO$}Q~3TO&U~X3YSRX!Q![3T!c!}3T#R#S3T#T#o3T~3kO#p~~3pO#q~V3uP$XT!_!`3xQ3}O$zQZ4SURX!Q![3T!c!}3T#R#S3T#T#g3T#g#h4f#h#o3TZ4mS'UQRX!Q![3T!c!}3T#R#S3T#T#o3TZ5OURX!Q![3T!c!}3T#R#S3T#T#f3T#f#g5b#g#o3TZ5gURX!Q![3T!c!}3T#R#S3T#T#c3T#c#d5y#d#o3TZ6OURX!Q![3T!c!}3T#R#S3T#T#a3T#a#b6b#b#o3TZ6iS'VQRX!Q![3T!c!}3T#R#S3T#T#o3T~6zO&o~~7PQ$WT!_!`7V#p#q7[Q7[O${Q~7aO$U~~7fO&p~~7kO#v~",
  tokenizers: [untilEOLToken, untilCommentCloseToken, 0, 1, 2, 3],
  topRules: {"Program":[0,1]},
  specialized: [{term: 3, get: value => spec_Identifier[value] || -1}],
  tokenPrec: 4536
})
