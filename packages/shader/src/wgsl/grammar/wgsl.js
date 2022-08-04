// This file was generated by lezer-generator. You probably shouldn't edit it.
import {LRParser} from "@lezer/lr"
import {untilEOLToken, untilCommentCloseToken} from "./tokens"
const spec_Identifier = {__proto__:null,enable:8, var:26, function:30, private:32, workgroup:34, uniform:36, storage:38, read:40, write:42, read_write:44, bool:50, f32:52, i32:54, u32:56, vec2:58, vec3:60, vec4:62, ptr:64, array:66, mat2x2:68, mat2x3:70, mat2x4:72, mat3x2:74, mat3x3:76, mat3x4:78, mat4x2:80, mat4x3:82, mat4x4:84, atomic:86, sampler:88, sampler_comparison:90, texture_depth_2d:92, texture_depth_2d_array:94, texture_depth_cube:96, texture_depth_cube_array:98, texture_depth_multisampled_2d:100, texture_1d:102, texture_2d:104, texture_2d_array:106, texture_3d:108, texture_cube:110, texture_cube_array:112, texture_multisampled_2d:114, texture_storage_1d:116, texture_storage_2d:118, texture_storage_2d_array:120, texture_storage_3d:122, rgba8unorm:124, rgba8snorm:126, rgba8uint:128, rgba8sint:130, rgba16uint:132, rgba16sint:134, rgba16float:136, r32uint:138, r32sint:140, r32float:142, rg32uint:144, rg32sint:146, rg32float:148, rgba32uint:150, rgba32sint:152, rgba32float:154, true:158, false:160, const:166, override:168, asm:174, bf16:176, do:178, enum:180, f16:182, f64:184, handle:186, i8:188, i16:190, i64:192, mat:194, premerge:196, regardless:198, typedef:200, u8:202, u16:204, u64:206, unless:208, using:210, vec:212, void:214, while:216, bitcast:218, type:266, struct:270, fn:280, return:292, if:294, else:296, switch:298, case:300, fallthrough:302, default:304, loop:306, continuing:310, for:312, let:314, break:342, continue:344, discard:346, import:350, use:358}
export const parser = LRParser.deserialize({
  version: 13,
  states: "!#zO!QQSOOP!XOSOOO!aQSO'#GmO!hQSO'#CdOOQO'#GY'#GYO!mQSO'#CcO%iQSO'#CbO%zQSO'#CaOOQO'#Ca'#CaOOQO'#Go'#GoOOQO'#GX'#GXO&PQSO'#GmQOQSOOO&WQSO'#C^OOQO'#GW'#GWO&]QSO'#EPO&bQSO'#GQO&jQSO'#GQP&oQTO'#GjP&tQUO'#GjPOOO)CB^)CB^OOQO-E:U-E:UO&yQSO,5=XO'QQSO,59OOOQO-E:W-E:WO*PQSO,58|O*XQSO,5;vO*^QSO'#ChO*fQSO,5:kO*kQSO,5;pO*pQSO,5;rO*uQSO'#F]OOQO,58{,58{OOQO-E:V-E:VO*zQSO,58xO*fQSO,5:kO+PQSO'#GSOOQO,5<l,5<lO+UQWO,5<lO+ZQSO,5<lPOOO,5=U,5=UO,RQSO1G.jO,aQSO1G.hO0aQSO'#FbOOQO1G1b1G1bO0hQSO'#GuOOQO'#Cj'#CjO0yQWO'#CsOOQO'#Cs'#CsOOQO,59S,59SO*fQSO,59SO1UQSO1G0VO1^QSO1G1[O1fQSO1G1^O1kQSO,5;wOOQO1G.d1G.dO1pQSO1G0VO1uQWO'#GTO2QQSO,5<nO+PQSO,5<nO2YQSO1G2WO&eQSO1G2WOOQO'#Gr'#GrO2_QSO7+$UO,RQSO7+$UOOQO'#HQ'#HQO2gQSO'#HQO2lQSO'#HQOOQO'#Ct'#CtOOQO'#HZ'#HZO2qQSO'#HYOOQO'#HY'#HYOOQO'#D|'#D|OOQO7+$S7+$SO2vQSO'#HOOOQO'#HR'#HROOQO'#HS'#HSOOQO'#HT'#HTOOQO'#HU'#HUO2gQSO'#CtO2{QSO'#CtO3QQSO'#H{OOQO'#Gc'#GcO3YQSO'#H}O3hQWO'#IOO3YQSO'#IOO4lQWO'#H}O6eQWO'#H|O6`QSO'#H|OOQO'#Fc'#FcO6oQSO'#FcOOQO'#G`'#G`O6tQSO,5;|OOQO,5;|,5;|O;rQSO'#HpO;mQSO'#HqO;mQSO'#HsO;yQSO'#HwO*fQSO'#H{O<OQSO'#HxOOQO'#IR'#IRO<TQSO,5=aOOQO'#Gw'#GwO<]QSO,5=fOOQO1G.n1G.nO6{QSO7+%qO<]QSO7+&vO>uQSO'#FYOOQO7+&x7+&xO?QQSO1G1cO,aQSO7+%qO?]QSO,5<oO?bQSO1G2YOOQO1G2Y1G2YO?jQSO1G2YOOQO-E:b-E:bOOQO7+'r7+'rOOQO,5<u,5<uOOQO<<Gp<<GpO?rQSO<<GpOOQO-E:X-E:XO<]QSO'#G|OOQO,5=l,5=lO?zQSO'#HVOAOQSO,5=tO<]QSO,5=jOOQO,59`,59`O0hQSO'#G}O6{QSO,5>gOOQO-E:a-E:aOOQO'#IO'#IOOAVQWO,5>iOBZQSO'#HdOBbQSO,5;}OBgQSO,5>jO6{QSO'#HfOBlQSO'#HfOOQO,5>i,5>iOOQO'#IP'#IPO6{QSO,5>hOOQO,5;},5;}OOQO-E:^-E:^OOQO1G1h1G1hOCfQ`O'#CtO6{QSO'#HeOOQO'#Hc'#HcODlQSO'#HcOEYQ`O'#HbOOQO'#Ha'#HaO6{QSO'#HaOGvQ`O'#H`OH{Q`O'#H_OIzQ`O'#H^OJhQ`O'#H]OKcQSO'#HhOKzQSO'#H[OLPQSO'#H[OLUQSO'#H[OLZQSO'#H[OL`QSO'#H[OOQO'#EU'#EUO2gQSO'#HcOOQO,5>[,5>[O*XQSO,5>]OLeQSO,5>_OLjQSO,5>cOLtQSO,5>gOM_QSO,5>dOOQO1G2{1G2{OMiQSO1G2{OOQO1G3Q1G3QOOQO'#ET'#ETOOQO<<I]<<I]OOQO<<Jb<<JbOMtQSO'#FZOMyQSO,5;tONRQSO,5;tOOQO,5;t,5;tOMtQSO'#F`ONZQSO'#F_ONRQSO'#F_ONcQSO7+&}OOQO1G2Z1G2ZOOQO7+'t7+'tONhQSO7+'tPNpQSO'#GdOOQOAN=[AN=[PNuQSO'#GZONzQSO,5=hO! PQSO,5=qOOQO'#HW'#HWO! UQSO1G3`O,aQSO1G3`OOQO1G3`1G3`O! ^QSO1G3UO! fQSO,5=iOOQO1G4R1G4ROOQO1G4T1G4TO! kQSO,5>OO6{QSO,5>OOOQO,5>O,5>OOOQO1G1i1G1iOOQO1G4U1G4UO! sQSO,5>QO!!aQWO,5>QOOQO1G4S1G4SOOQO,5=},5=}O!#dQSO,5>POOQO,5=|,5=|OOQO,5={,5={O6{QSO,5=xO6{QSO,5=zO6{QSO,5=yO6{QSO,5=wO6{QSO,5>SO6{QSO,5>TO6{QSO,5>UO6{QSO,5>VO6{QSO,5>WO;mQSO,5=}O!#iQSO1G3wO!$|QSO1G3yO!%UQSO1G3}O*XQSO'#FlOOQO1G3}1G3}O!%`QSO1G3}O6{QSO1G4RO!%eQWO'#IOO5pQWO'#H|OOQO'#Hz'#HzO!&cQSO'#HyO!&jQSO'#HyO!&oQSO1G4OO!&tQSO7+(gOOQO'#Gx'#GxO!&yQWO'#GzOOQO,5;u,5;uO!'OQSO1G1`OOQO1G1`1G1`O!'ZQSO1G1`OOQO-E:[-E:[OOQO,5;z,5;zO!'cQSO,5<yO!'nQSO,5;yOOQO-E:]-E:]O!'vQWO<<JiOOQO<<K`<<K`POQO,5=O,5=OOOQO1G3S1G3SOMiQSO1G3]O!*wQSO7+(zOOQO7+(z7+(zO!+OQSO7+(zOOQO-E:Y-E:YOOQO7+(p7+(pO!+WQSO7+(pO<]QSO1G3TO!0YQSO1G3jOOQO1G3j1G3jO!0aQSO1G3jOOQO-E:Z-E:ZO!1QQWO1G3lOOQO1G3l1G3lOOQO1G3k1G3kO!2TQ`O,5>QOOQO1G3d1G3dOOQO1G3f1G3fOOQO'#H`'#H`O!4XQ`O1G3eO!5gQ`O'#H`OHTQSO'#H_O!5qQSO'#H^OOQO1G3c1G3cO!6^QSO1G3nO!6eQSO1G3oO!6lQSO1G3pO!6sQSO1G3qO!6zQSO1G3rOOQO1G3i1G3iO!7RQSO7+)cOOQO'#Ga'#GaO!7ZQSO7+)eO!7fQSO'#HtO!7wQWO'#HtOOQO7+)i7+)iO!7|QSO7+)iOOQO,5<W,5<WOOQO7+)m7+)mOOQO,5>f,5>fO!8dQSO,5>eO!8kQSO,5>eO!8pQSO,5>eO*XQSO7+)jOOQO<<LR<<LROOQO7+&z7+&zO!8wQSO7+&zP!9SQSO'#G^O!9XQSO1G1eP!9dQSO'#G_O!9iQSO'#FaOOQOAN@TAN@TO!<UQSO7+(wOOQO<<Lf<<LfO!<ZQSO<<LfP!<bQSO'#G[OOQO'#HP'#HPO!<gQSO<<L[O!<lQSO7+(oOOQO7+)U7+)UO!<tQSO7+)UP!<{QSO'#G]OOQO7+)W7+)WO!=QQ`O1G3lOOQO'#Hr'#HrOOQO<<L}<<L}OOQO-E:_-E:_OOQO<<MP<<MPO!>^QWO'#HuO!7fQSO'#HuO!>fQWO,5>`O!>kQSO,5>`OOQO<<MT<<MTO3hQWO'#IOO!>pQWO'#IQOOQO'#IQ'#IQOOQO1G4P1G4PO!>zQSO1G4PO!?RQSO1G4POOQO<<MU<<MUOOQO<<Jf<<JfPOQO,5<x,5<xPOQO,5<y,5<yO<]QSO,5;{OOQO<<Lc<<LcOOQOANBQANBQPOQO,5<v,5<vOOQOANAvANAvOOQO<<LZ<<LZOMiQSO<<LZOOQO<<Lp<<LpPOQO,5<w,5<wOBqQWO'#CtO!?WQWO'#HbO!3aQSO1G3eO!?sQpO,5<|O!?zQWO,5>aOOQO-E:`-E:`O!@SQSO1G3zO!@XQSO1G3zOOQO,5>l,5>lOOQO7+)k7+)kO!@cQSO7+)kOOQO1G1g1G1gO!@jQSOANAuO!@oQpO1G3{P!@vQSO'#GbO!@{QSO7+)fO!AVQSO'#HvO!AaQSO'#HvOOQO7+)f7+)fO!AfQSO7+)fOOQO<<MV<<MVOOQOG27aG27aPOQO,5<|,5<|OOQO<<MQ<<MQO!AkQSO<<MQOOQO,5>b,5>bOOQOANBlANBlO!ApQSO'#HfO!AuQSO'#HaO!F_QSO,5>QO!AuQSO,5=xO6{QSO,5=yOFfQ`O'#H`O6{QSO'#Hf",
  stateData: "!Fi~O%]OS%_PQ%`PQ~OS]O$u`O$yaO%bXO%dRO]VP!u!tP!vVP#yVP#{VP$QVP~O%X%aP~P]O%_bO%`cO~O%X%aX~P]ORgO~O%dRO]VX!vVX#yVX#{VX$QVXRVXiVXjVXkVXlVXmVXnVXoVXpVXqVXrVXsVXtVXuVXvVXwVXxVXyVXzVX{VX|VX}VX!OVX!PVX!QVX!RVX!SVX!TVX!UVX!VVX!WVX!XVX!YVX!ZVX![VX!]VX!^VX!_VX~O]kO!vlO#ymO#{nO$QoO~O%bpO~O%X%aX~P`ORrO~O!usO~O$xuO&atO~O$xwO~O%YxO~O%ZxO~O%X%aa~P`O%eyO]Wa!vWa#yWa#{Wa$QWa%dWaRWaiWajWakWalWamWanWaoWapWaqWarWasWatWauWavWawWaxWayWazWa{Wa|Wa}Wa!OWa!PWa!QWa!RWa!SWa!TWa!UWa!VWa!WWa!XWa!YWa!ZWa![Wa!]Wa!^Wa!_Wa~O%{zO%bUa~O&a{O~OR!PO%j}O~OR!PO~OR!UO~OR!VO~OR!WO~O%b!XO~OR!ZO~O&w!^O~O&x!_O]$ta!u$ta!v$ta#y$ta#{$ta$Q$ta$u$ta$y$ta%X$ta%b$ta%d$ta~OR!`OX!`OY!`OZ!`O~OR!fOX!gOY!gOZ!gOi!fOj!fOk!fOl!fOm!qOn!qOo!qOp!rOq!lOr!qOs!qOt!qOu!qOv!qOw!qOx!qOy!qOz!qO{!qO|!mO}!mO!O!nO!P!nO!Q!nO!R!nO!S!nO!T!oO!U!oO!V!oO!W!oO!X!oO!Y!oO!Z!dO![!pO!]!pO!^!pO!_!pO!q!gO!r!gO~OR!vO]kO#g!tO#h!tO$W#QO$X#RO$Z#SO$_#TO$b#VO$c#UO$n!zO$q#WO$r#WO$s#WO%b!{O%e!wO&a{O~O&b#PO~P/YO_#YO`#YOa#YOb#YOc#YO~O%o#ZO%bgX%{gX~O%{#]O%b!si~O%{#^O%b#xi~O&a#_O~O%e#aO~O%{#bO~O&v#cO%g$wX&b$wX~O%g#dO&b#eO~O$x#hO~O%g#iO%h#jO~O%j#mO~O%j#oO~O%e#pO~O%j#qO~O%j#sO~O%{#tO%b&oX~OR#vO#g!tO#h!tO%e!wO~O%e#xO#b&rX$d&rX$e&rX$f&rX$g&rX$h&rX$i&rX$j&rX$k&rX$l&rX$m&rX$o&rX$p&rX%{&rX&Z&rX~O#b#{O&Z#|O$d&qX$e&qX$f&qX$g&qX$h&qX$i&qX$j&qX$k&qX$l&qX$m&qX$o&qX$p&qX%{&qX%h&qX~O$d$OO$e$OO$f$OO$g$OO$h$OO$i$OO$j$OO$k$OO$l$OO$m$OO%{$PO~O$o#yO$p#yO~P5pO%b$QO~O&b$SO~P/YOR$TOX!gOY!gOZ!gOi!fOj!fOk!fOl!fOm!qOn!qOo!qOp!rOq!lOr!qOs!qOt!qOu!qOv!qOw!qOx!qOy!qOz!qO{!qO|!mO}!mO!O!nO!P!nO!Q!nO!R!nO!S!nO!T!oO!U!oO!V!oO!W!oO!X!oO!Y!oO!Z!dO![!pO!]!pO!^!pO!_!pO!q!gO!r!gO!u$fO!y$fO!z$fO!{$fO!|$fO!}$fO#O$fO#P$fO#Q$fO#R$fO#S$fO#T$fO#U$fO#V$fO#W$fO#X$fO#Y$fO#Z$fO#[$fO#]$fO#^$fO#_$fO#`$fO#a$gO#d$ZO#e$ZO#f$ZO#g$ZO#h$ZO%e$UO~O%b&dX~P6{O&a$kO~O%e$mO~O%g$oO%m$nO~OR!fOi!fOj!fOk!fOl!fOm!qOn!qOo!qOp!rOq!lOr!qOs!qOt!qOu!qOv!qOw!qOx!qOy!qOz!qO{!qO|!mO}!mO!O!nO!P!nO!Q!nO!R!nO!S!nO!T!oO!U!oO!V!oO!W!oO!X!oO!Y!oO!Z!dO![!pO!]!pO!^!pO!_!pO~O%dRO&b$wORVP~O%dRORVP%h$RP~OR$|O~O&b$}OR%Wa~O%g%OO&b$}O~O%g#iO%h%QO~O!`%UO!a%UO!b%UO!c%UO!d%UO!e%UO!f%UO!g%UO!h%UO!i%UO!j%UO!k%UO!l%UO!m%UO!n%UO!o%UO~O%h%XO~P,aO#b#{O&Z#|O$d&qa$e&qa$f&qa$g&qa$h&qa$i&qa$j&qa$k&qa$l&qa$m&qa$o&qa$p&qa%{&qa%h&qa~O%h%`O~P6{O%b%aO~O%h%bO~OR%dO~O%e#xO#b&VX#t&VX#u&VX%b&VX%ehX&Z&VX%g&VX%h&VX#c&VX&b&VX~O#d&VX#g&VX#h&VX#i&VX#j&VX#k&VX#l&VX#m&VX#n&VX#o&VX#p&VX#q&VX#r&VX#s&VX#v&VX#w&VX~PBqO%e#xO~O#t&UX#u&UX%b&UX%g&UX%h&UX#c&UX&b&UX~O#b)UO&Z)OO#d&UX#g&UX#h&UX#i&UX#j&UX#k&UX#l&UX#m&UX#n&UX#o&UX#p&UX#q&UX#r&UX#s&UX#v&UX#w&UX~PDqO#l%jO#m%jO#d&SX#g&SX#i&SX#j&SX#k&SX#n&SX#o&SX#p&SX#q&SX#r&SX#s&SX#t&SX#u&SX%b&SX%g&SX%h&SX#c&SX&b&SX~O#h&^X#v&_X#w&`X~PFfO#g%kO#i%kO#j%kO#d&RX#k&RX#t&RX#u&RX%b&RX%g&RX%h&RX#c&RX&b&RX~O#n&RX#o&RX#p&RX#q&RX#r&RX#s&RX~PHTO#t&QX#u&QX%b&QX%g&QX%h&QX#c&QX&b&QX~O#d%lO#k%lO#n&QX#o&QX#p&QX#q&QX#r&QX#s&QX~PIcO#n%mO#o%mO#p%mO#q%mO#r%mO#s%mO#t&PX#u&PX%b&PX%g&PX%h&PX#c&PX&b&PX~O#t&[X#u&]X%b&OX%g&OX%h&OX#c&OX&b&OX~O#t%nO~O#u%oO~O#h%pO~O#v%qO~O#w%rO~O&a%uO~O$a%wO&b%xO~P/YO%{%zO~O]kO#g!tO#h!tO$c#UO$n!zO%e!wO~OR%{O%b&OO~PLyOd&SOe&SOf&SO~OR&TO~O%g&VO&b&WO~O%dRORVP~O%g&[O%h$RX~O%h&_O~O&b&`OR%Wa~O%g&aO~O%g#iO~O%m&bO~O%g&cO~O%g&dO%h&eO~O%g&iO%m&hO~O%g&jO~O%g&kO%h&lO~O#c&oO~O%h&Ya#t&Ya#u&Ya%b&Ya%g&Ya#c&Ya&b&Ya~O#b#{O&Z#|O$d&Ya$e&Ya$f&Ya$g&Ya$h&Ya$i&Ya$j&Ya$k&Ya$l&Ya$m&Ya$o&Ya$p&Ya%{&Ya~P! xO%h&qO~O$Y'ROR&ei]&ei#g&ei#h&ei$W&ei$X&ei$Z&ei$_&ei$b&ei$c&ei$n&ei$q&ei$r&ei$s&ei%b&ei%e&ei&a&ei&b&ei$a&ei$]&ei~O$['UO$^'VO~O$a%wO&b'WO~P/YO&b'WO~O%e#xO#b&rX$d&rX$e&rX$f&rX$g&rX$h&rX$i&rX$j&rX$k&rX$l&rX$m&rX%{&rX&Z&rX~O%b']O~P6{O%b'_O~O&b'`O~O%m'aO~O%o#ZO~O&b'bOR%Qa%d%Qa~O%g'cO&b'bO~OR%Ra%d%Ra%h$Ra~O%g'eO%h$Ra~O&c'gO&a$TP~OR%OaX%OaY%OaZ%Oai%Oaj%Oak%Oal%Oam%Oan%Oao%Oap%Oaq%Oar%Oas%Oat%Oau%Oav%Oaw%Oax%Oay%Oaz%Oa{%Oa|%Oa}%Oa!O%Oa!P%Oa!Q%Oa!R%Oa!S%Oa!T%Oa!U%Oa!V%Oa!W%Oa!X%Oa!Y%Oa!Z%Oa![%Oa!]%Oa!^%Oa!_%Oa!q%Oa!r%Oa~O%h'jO~P!(OO%g'kO%h'jO~OR'mOX'mOY'mO~OR%PaX%PaY%PaZ%Pai%Paj%Pak%Pal%Pam%Pan%Pao%Pap%Paq%Par%Pas%Pat%Pau%Pav%Paw%Pax%Pay%Paz%Pa{%Pa|%Pa}%Pa!O%Pa!P%Pa!Q%Pa!R%Pa!S%Pa!T%Pa!U%Pa!V%Pa!W%Pa!X%Pa!Y%Pa!Z%Pa![%Pa!]%Pa!^%Pa!_%Pa!q%Pa!r%Pa!u%Pa!y%Pa!z%Pa!{%Pa!|%Pa!}%Pa#O%Pa#P%Pa#Q%Pa#R%Pa#S%Pa#T%Pa#U%Pa#V%Pa#W%Pa#X%Pa#Y%Pa#Z%Pa#[%Pa#]%Pa#^%Pa#_%Pa#`%Pa#a%Pa#d%Pa#e%Pa#f%Pa#g%Pa#h%Pa%e%Pa~O%h'pO~P!+cO%g'qO%h'pO~O%h&Yi#t&Yi#u&Yi%b&Yi%g&Yi#c&Yi&b&Yi~O#b#{O&Z#|O$d&Yi$e&Yi$f&Yi$g&Yi$h&Yi$i&Yi$j&Yi$k&Yi$l&Yi$m&Yi$o&Yi$p&Yi%{&Yi~P!0iO#b)UO&Z)OO#d&Ya#g&Ya#h&Ya#i&Ya#j&Ya#k&Ya#l&Ya#m&Ya#n&Ya#o&Ya#p&Ya#q&Ya#r&Ya#s&Ya#v&Ya#w&Ya~P! xO#g%kO#i%kO#j%kO#d&Ri#k&Ri#t&Ri#u&Ri%b&Ri%g&Ri%h&Ri#c&Ri&b&Ri~O#n&Ri#o&Ri#p&Ri#q&Ri#r&Ri#s&Ri~P!3aO#d&SX#g&SX#i&SX#j&SX#k&SX#t&SX#u&SX%b&SX%g&SX%h&SX#c&SX&b&SX~O#l)RO#m)RO~P!4oO#d)SO#k)SO~PIcO%b&Oi%g&Oi%h&Oi#c&Oi&b&Oi~O#t&[i~P!5{O#u&]i~P!5{O#h&^i~P!5{O#v&_i~P!5{O#w&`i~P!5{O$X#RO&a{O~O$['UO$^'VO&b'xO~OX!gOY!gOZ!gO!q!gO!r!gO~O%o'|O~O&b'}O~OR(OO#g!tO#h!tO$n!zO%e!wO~O&b&ma~P!8RO%b(SO~O%b(SO~P6{O&b(VOR%Qa%d%Qa~O%g(WO~OR%Ra%d%Ra%h$Ri~O%g(XO~O%dRORVPiVPjVPkVPlVPmVPnVPoVPpVPqVPrVPsVPtVPuVPvVPwVPxVPyVPzVP{VP|VP}VP!OVP!PVP!QVP!RVP!SVP!TVP!UVP!VVP!WVP!XVP!YVP!ZVP![VP!]VP!^VP!_VP~O%m(ZO~O%h([O~P!(OO%g(]O~O%m(^O~O%g(`O%m(_O~O%h(aO~P!+cO%g(bO~O#b)UO&Z)OO#d&Yi#g&Yi#h&Yi#i&Yi#j&Yi#k&Yi#l&Yi#m&Yi#n&Yi#o&Yi#p&Yi#q&Yi#r&Yi#s&Yi#v&Yi#w&Yi~P!0iO%g(fO%o&iX~O%o(iO~O&a(jO~O$o(kO$p(kO~P5pO&b&mi~P!8RO%b(mO~O#b#{O&Z#|O~PDqOX%UaY%UaZ%Ua!q%Ua!r%Ua~O%o&ia~P!?bO%g(pO%o&ia~O&a(rO~O$](tO&b(uO~P/YO&b&mq~P!8RO%m(xO~O%o&ii~P!?bO%g(yO~O$](tO&b(zO~P/YO$](tO&b&jX~P/YO%b(|O~O&b(zO~O&b(}O~OR&rO~OR(cOi!fOj!fOk!fOl!fOm!qOn!qOo!qOp!rOq!lOr!qOs!qOt!qOu!qOv!qOw!qOx!qOy!qOz!qO{!qO|!mO}!mO!O!nO!P!nO!Q!nO!R!nO!S!nO!T!oO!U!oO!V!oO!W!oO!X!oO!Y!oO!Z!dO![!pO!]!pO!^!pO!_!pO!u$fO!y$fO!z$fO!{$fO!|$fO!}$fO#O$fO#P$fO#Q$fO#R$fO#S$fO#T$fO#U$fO#V$fO#W$fO#X$fO#Y$fO#Z$fO#[$fO#]$fO#^$fO#_$fO#`$fO#a$gO#d)PO#e)PO#f)PO#g)PO#h)PO%e$UO~P!7fO#c'tO~O#iZ#dR~",
  goto: "?W&vPP&wPP&{'R'X'jPPP'vP(TPPPPPPPP(W(gPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP)lPP'R)rPP)x*RPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP'RP*nP*t*w*n*}P+Q+T+Z+^+vPPPPPPPP,RPPPPPPPPPPPPPPPPPPP&{P,X,_PP,e,k,u-T-Z-a-g-m-s-}.T.Z.lPPPPP.rPP.uP.xPP/OPP/UP/X/_P/hP/u0O0R0x0R0{0{1r2i3`3cP3f3p4i5Z5o6S6g7Q8P8l9Z9i:_P:q;P;_;m;{PPP<Z<d<p<s<|=Q=T<s<s=^=a=d=p>R>g>x>}<ZT^OQXXOQZfXVOQZfWUOQZfS$t#_$vS$x#a$zR(Y'geSOQTZf#_#a$v$z'gQiUa!s{#O$k$m%v(j(r(sR!SkQ!RkQ!TlQ!YsQ#[!SR$l#UW!hz#b#p%W!S$W#Q#]#t#x#{$P$U$Z%_%j%k%l%m%n%o%p%q%r%z&O'_)P)R)S)UQ$p#ZQ$s#^Q%S#mQ%Y#qQ'o&jR(n(YQ!kzR$r#bX_OQZfQ$r#]Q%[#tR'Z%z!T$V#Q#]#t#x#{$P$U$Z%_%j%k%l%m%n%o%p%q%r%z&O'_)P)R)S)UXWOQZfR#`!VQ$u#_R&X$vRjUR${#aQ$y#aR&]$zR'h&_Q|j^!{{#O$k%v(j(r(sQ%t$iQ'Y%wQ'u'RR(U'`W!}{#O$k%vV(s(j(r(sQ%y$kR'X%vQv`R#h!_Q![tR#f!]QQOReQQZOQfQTqZfbTOQZf#_#a$v$z'gRhTQ!byR#l!bQ%W#pR&g%WQ%_#xR&n%_Q$v#_R&Y$vQ$z#aR&^$zQ#O{S$R#O%vR%v$kQ'T%uR'w'TQ'z'UR(h'zh!u{!w#O$k$m%v'](S(j(m(r(sR#u!uQ!]tR#g!]RdPR[OXYOQZfQ!ayR#k!bR!OkQ#X}R%Z#sQ&R$oQ'i&cR(o(`Y!Qkls!S#UQ&U$tR&Z$xQ#n!dQ#r!qR%s$gR#r!r!i!fz#Q#Z#]#^#b#m#p#q#t#x#{$P$U$Z%W%_%j%k%l%m%n%o%p%q%r%z&O&j'_(Y)P)R)S)UR'n&i!i!cz#Q#Z#]#^#b#m#p#q#t#x#{$P$U$Z%W%_%j%k%l%m%n%o%p%q%r%z&O&j'_(Y)P)R)S)U!i!dz#Q#Z#]#^#b#m#p#q#t#x#{$P$U$Z%W%_%j%k%l%m%n%o%p%q%r%z&O&j'_(Y)P)R)S)U!i!ez#Q#Z#]#^#b#m#p#q#t#x#{$P$U$Z%W%_%j%k%l%m%n%o%p%q%r%z&O&j'_(Y)P)R)S)UR#n!eR%T#oS!jz#bQ%V#pR&f%WW!iz#b#p%W!S$V#Q#]#t#x#{$P$U$Z%_%j%k%l%m%n%o%p%q%r%z&O'_)P)R)S)UQ'y'UR(g'zQ$h#QU$q#]#t%zQ%^#xQ%c#{Q%e$PQ%g$UQ&m%_Q'^&OQ(T'_R)Q)Uh$`#Q#]#t#x#{$P$U%_%z&O'_)UQ&{%nR&|%ol$_#Q#]#t#x#{$P$U%_%n%o%z&O'_)UR&z%ml$^#Q#]#t#x#{$P$U%_%n%o%z&O'_)UR&y%ml$]#Q#]#t#x#{$P$U%_%n%o%z&O'_)UQ&v%lQ&x%mR(e)Sh$[#Q#]#t#x#{$P$U%_%z&O'_)US%i$Z)PS&s%j)RQ&t%kS&u%l)SQ&w%mQ&}%pQ'O%qQ'P%rT)T%n%o!T$Y#Q#]#t#x#{$P$U$Z%_%j%k%l%m%n%o%p%q%r%z&O'_)P)R)S)U!O$X#Q#]#t#x#{$P$U$Z%_%j%k%l%m%n%o%p%q%r%z&O'_)S)UT(d)P)RQ#y!vU%f$T$W(cQ'[%{R(k(O!S$V#Q#]#t#x#{$P$U$Z%_%j%k%l%m%n%o%p%q%r%z&O'_)P)R)S)UQ$i#RQ$j#SR'Q%sQ#}!xQ%]#wS%h$X(dS&p%d&rT's&o'ti$a#Q#]#t#x#{$P$U%_%z&O'_)Ui$b#Q#]#t#x#{$P$U%_%z&O'_)Ui$c#Q#]#t#x#{$P$U%_%z&O'_)Ui$d#Q#]#t#x#{$P$U%_%z&O'_)Ui$e#Q#]#t#x#{$P$U%_%z&O'_)U_!|{#O$k%v(j(r(s^!{{#O$k%v(j(r(sR'u'RR'v'R_!{{#O$k%v(j(r(sT'S%u'TR'{'UQ(v(jQ({(rR(|(sR&Q$mR&P$m^!|{#O$k%v(j(r(sR%}$m^!|{#O$k%v(j(r(sQ%}$mV(Q'](S(m^!y{#O$k%v(j(r(sQ#z!wQ%|$mV(P'](S(mh!x{!w#O$k$m%v'](S(j(m(r(sR#w!uV$P!y%|(PQ(R']Q(l(SR(w(m",
  nodeNames: "⚠ Program EnableDirective Identifier enable LocalDeclaration GlobalVariableDeclaration AttributeList Attribute IntLiteral UintLiteral FloatLiteral VariableDeclaration var VariableQualifier function private workgroup uniform storage read write read_write VariableIdentifier TypeDeclaration bool f32 i32 u32 vec2 vec3 vec4 ptr array mat2x2 mat2x3 mat2x4 mat3x2 mat3x3 mat3x4 mat4x2 mat4x3 mat4x4 atomic sampler sampler_comparison texture_depth_2d texture_depth_2d_array texture_depth_cube texture_depth_cube_array texture_depth_multisampled_2d texture_1d texture_2d texture_2d_array texture_3d texture_cube texture_cube_array texture_multisampled_2d texture_storage_1d texture_storage_2d texture_storage_2d_array texture_storage_3d rgba8unorm rgba8snorm rgba8uint rgba8sint rgba16uint rgba16sint rgba16float r32uint r32sint r32float rg32uint rg32sint rg32float rgba32uint rgba32sint rgba32float Value true false GlobalConstantDeclaration EmptyToken const override Value Reserved asm bf16 do enum f16 f64 handle i8 i16 i64 mat premerge regardless typedef u8 u16 u64 unless using vec void while bitcast LeftBracket RightBracket Sub Bang Tilde Mul And Div Mod Add Left Right Lt Gt Lte Gte Eq Neq OrOr AndAnd Or Xor TypeAliasDeclaration type StructDeclaration struct StructBodyDeclaration StructMember FunctionDeclaration FunctionHeader fn ParamList Param ReturnType CompoundStatement Statement return if else switch case fallthrough default loop ContinuingStatement continuing for let AddAssign SubAssign MulAssign DivAssign ModAssign AndAssign XorAssign OrAssign LeftAssign RightAssign Underscore Inc Dec break continue discard ImportDeclaration import ImportDeclarationList ImportDeclarationIdentifier String use",
  maxTerm: 270,
  skippedNodes: [0],
  repeatNodeCount: 13,
  tokenData: "7t~R|X^#{pq#{qr$prs$}uv&^vw&kwx'Qxy([yz(az{(f{|(s|})Y}!O)_!O!P.R!P!Q.Z!Q!R.x!R![0d![!]0x!]!^1V!^!_1[!_!`1{!`!a2Y!b!c2y!c!}3O!}#O3a#P#Q3f#Q#R3k#R#S3x#T#U4W#U#Y3O#Y#Z5S#Z#o3O#o#p7O#p#q7T#q#r7j#r#s7o#y#z#{$f$g#{#BY#BZ#{$IS$I_#{$I|$JO#{$JT$JU#{$KV$KW#{&FU&FV#{~$QY%]~X^#{pq#{#y#z#{$f$g#{#BY#BZ#{$IS$I_#{$I|$JO#{$JT$JU#{$KV$KW#{&FU&FV#{T$uP#eP!_!`$xS$}O#sS~%QTOr$}rs%as#O$}#O#P%f#P~$}~%fO$x~~%iTOr$}rs%xs#O$}#O#P%f#P~$}~%}T$x~Or$}rs%as#O$}#O#P%f#P~$}V&cP#jT!_!`&fQ&kO$hQ~&pQ#hTvw&v!_!`&{~&{O#u~Q'QO$iQ~'TTOw'Qwx%ax#O'Q#O#P'd#P~'Q~'gTOw'Qwx'vx#O'Q#O#P'd#P~'Q~'{T$x~Ow'Qwx%ax#O'Q#O#P'd#P~'Q~(aO%e~~(fO%h~V(kP#gT!_!`(nQ(sO$fQV(xQ#kT{|)O!_!`)TQ)TO$oQQ)YO$dQ~)_O%g~~)dU#dT}!O)v!O!P){!Q!R+W!R![-f!_!`-w!`!a-|Q){O$pQX*OP!Q![*RX*WSZX!Q![*R!g!h*d#X#Y*d#Y#Z+RX*gR{|*p}!O*p!Q![*vX*sP!Q![*vX*{QZX!Q![*v#Y#Z+RX+WOZX~+ZU!O!P*R!Q![+m!g!h*d!z!{+|#X#Y*d#l#m+|X+pS!O!P*R!Q![+m!g!h*d#X#Y*d~,PS!O!P,]!Q![,}!c!i,}#T#Z,}X,`R!Q![,i!c!i,i#T#Z,iX,nTZX!Q![,i!c!i,i!r!s*d#T#Z,i#d#e*d~-SUX~!O!P,i!Q![,}!c!i,}!r!s*d#T#Z,}#d#e*d~-kSX~!O!P*R!Q![-f!g!h*d#X#Y*dQ-|O$eQQ.RO&cQ_.WP&ZU!Q![*R~.`R#iTz{.i!P!Q.n!_!`.s~.nO%`~~.sO%_~Q.xO$gQ~.}VX~!O!P*R!Q![+m!g!h*d!z!{/d#X#Y*d#i#j0_#l#m/d~/gS!O!P,]!Q![/s!c!i/s#T#Z/s~/xVX~!O!P,i!Q![/s!c!i/s!r!s*d#T#Z/s#d#e*d#i#j0_~0dOY~~0iTX~!O!P*R!Q![0d!g!h*d#X#Y*d#i#j0_Z0}P%oY![!]1QP1VO&xP~1[O%b~V1cQ%jP#nS!^!_1i!_!`1vU1nP#lS!_!`1qQ1vO$lQS1{O#pSV2QP%{R!_!`2TS2YO#rSV2aQ%mP#oS!_!`2g!`!a2lS2lO#qSU2qP#mS!_!`2tQ2yO$mQ~3OO%d~X3TSRX!Q![3O!c!}3O#R#S3O#T#o3O~3fO#b~~3kO#c~V3pP#wT!_!`3sQ3xO$jQ~3}R$n~!Q![3O!c!}3O#T#o3OZ4]URX!Q![3O!c!}3O#R#S3O#T#g3O#g#h4o#h#o3OZ4vS&vQRX!Q![3O!c!}3O#R#S3O#T#o3OZ5XURX!Q![3O!c!}3O#R#S3O#T#f3O#f#g5k#g#o3OZ5pURX!Q![3O!c!}3O#R#S3O#T#c3O#c#d6S#d#o3OZ6XURX!Q![3O!c!}3O#R#S3O#T#a3O#a#b6k#b#o3OZ6rS&wQRX!Q![3O!c!}3O#R#S3O#T#o3O~7TO&a~~7YQ#vT!_!`7`#p#q7eQ7eO$kQ~7jO#t~~7oO&b~~7tO#f~",
  tokenizers: [untilEOLToken, untilCommentCloseToken, 0, 1, 2, 3],
  topRules: {"Program":[0,1]},
  specialized: [{term: 3, get: value => spec_Identifier[value] || -1}],
  tokenPrec: 3838
})
