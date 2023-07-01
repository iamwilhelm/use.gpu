// This file was generated by lezer-generator. You probably shouldn't edit it.
import {LRParser} from "@lezer/lr"
import {untilEOLToken, untilCommentCloseToken} from "./tokens"
const spec_Identifier = {__proto__:null,enable:8, var:26, function:30, private:32, workgroup:34, uniform:36, storage:38, read:40, write:42, read_write:44, bool:50, f32:52, i32:54, u32:56, vec2:58, vec3:60, vec4:62, ptr:64, array:66, mat2x2:68, mat2x3:70, mat2x4:72, mat3x2:74, mat3x3:76, mat3x4:78, mat4x2:80, mat4x3:82, mat4x4:84, atomic:86, sampler:88, sampler_comparison:90, texture_depth_2d:92, texture_depth_2d_array:94, texture_depth_cube:96, texture_depth_cube_array:98, texture_depth_multisampled_2d:100, texture_1d:102, texture_2d:104, texture_2d_array:106, texture_3d:108, texture_cube:110, texture_cube_array:112, texture_multisampled_2d:114, texture_storage_1d:116, texture_storage_2d:118, texture_storage_2d_array:120, texture_storage_3d:122, rgba8unorm:124, rgba8snorm:126, rgba8uint:128, rgba8sint:130, rgba16uint:132, rgba16sint:134, rgba16float:136, r32uint:138, r32sint:140, r32float:142, rg32uint:144, rg32sint:146, rg32float:148, rgba32uint:150, rgba32sint:152, rgba32float:154, true:160, false:162, const:166, override:168, asm:174, bf16:176, do:178, enum:180, f16:182, f64:184, handle:186, i8:188, i16:190, i64:192, mat:194, premerge:196, regardless:198, typedef:200, u8:202, u16:204, u64:206, unless:208, using:210, vec:212, void:214, while:216, bitcast:220, type:270, struct:274, fn:284, return:296, if:298, else:300, switch:302, case:304, fallthrough:306, default:308, loop:310, continuing:314, for:316, let:318, break:344, continue:346, discard:348, import:352, use:360}
export const parser = LRParser.deserialize({
  version: 14,
  states: "!#tO!QQSOOP!XOSOOO!aQSO'#GnO!hQSO'#CdOOQO'#GZ'#GZO!mQSO'#CcO%lQSO'#CbO&QQSO'#CaOOQO'#Ca'#CaOOQO'#Gp'#GpOOQO'#GY'#GYO&VQSO'#GnQOQSOOO&^QSO'#C^OOQO'#GX'#GXO&cQSO'#GRO&kQSO'#GRP&pQTO'#GkP&uQUO'#GkPOOO)CB_)CB_OOQO-E:V-E:VO&zQSO,5=YO'RQSO,59OOOQO-E:X-E:XO*TQSO,58|O*]QSO,5;xO+TQSO'#ChO+]QSO,5:lO+]QSO,5:lO+bQSO,5;rO+gQSO,5;tO+lQSO'#F_OOQO,58{,58{OOQO-E:W-E:WO+qQSO,58xO+vQSO'#GTOOQO,5<m,5<mO+{QWO,5<mO,QQSO,5<mPOOO,5=V,5=VO,xQSO1G.jO-WQSO1G.hO1TQSO'#FdOOQO1G1d1G1dO1[QSO'#GvOOQO'#Cj'#CjO1mQWO'#CsOOQO'#Cs'#CsOOQO,59S,59SO+]QSO,59SO1xQSO1G0WO1}QSO1G0WO2VQSO1G1^O2_QSO1G1`O2dQSO,5;yOOQO1G.d1G.dO2iQWO'#GUO2tQSO,5<oO+vQSO,5<oO2|QSO1G2XO&fQSO1G2XOOQO'#Gs'#GsO3RQSO7+$UO,xQSO7+$UOOQO'#HR'#HRO3ZQSO'#HRO3`QSO'#HROOQO'#Ct'#CtOOQO'#HZ'#HZO3eQSO'#HYOOQO'#HY'#HYOOQO'#D}'#D}OOQO7+$S7+$SO3jQSO'#HPOOQO'#HS'#HSOOQO'#HT'#HTOOQO'#HU'#HUOOQO'#HV'#HVO3oQSO'#CtO4|QSO'#CtO3ZQSO'#CtO5RQSO'#H{OOQO'#Gd'#GdO5ZQSO'#H}O5iQWO'#IOO5ZQSO'#IOO6mQWO'#H}O8fQWO'#H|OOQO'#Fe'#FeO8pQSO'#FeOOQO'#Ga'#GaO8uQSO,5<OOOQO,5<O,5<OO=pQSO'#HpO8|QSO'#HqO8|QSO'#HsO=wQSO'#HwO+]QSO'#H{O=|QSO'#HxOOQO'#IR'#IRO>RQSO,5=bOOQO'#Gx'#GxO>ZQSO,5=gOOQO1G.n1G.nO-WQSO7+%rO8|QSO7+%rO>ZQSO7+&xO@sQSO'#F[OOQO7+&z7+&zOAOQSO1G1eOAZQSO,5<pOA`QSO1G2ZOOQO1G2Z1G2ZOAhQSO1G2ZOOQO-E:c-E:cOOQO7+'s7+'sOOQO,5<v,5<vOOQO<<Gp<<GpOApQSO<<GpOOQO-E:Y-E:YO>ZQSO'#G}OOQO,5=m,5=mOAxQSO'#HWOB|QSO,5=tO>ZQSO,5=kOOQO,59`,59`O1[QSO'#HOO8|QSO,5>gOOQO-E:b-E:bOOQO'#IO'#IOOCTQWO,5>iODXQSO'#HdOD`QSO,5<PODeQSO,5>jODjQSO'#EqO8|QSO'#HfOEZQWO'#HfOOQO,5>i,5>iOOQO'#IP'#IPO8|QSO,5>hOOQO,5<P,5<POOQO-E:_-E:_OOQO1G1j1G1jOGOQ`O'#CtO8|QSO'#HeOOQO'#Hc'#HcOHUQSO'#HcOHuQ`O'#HbOOQO'#Ha'#HaO8|QSO'#HaOK`Q`O'#H`OLeQ`O'#H_OMdQ`O'#H^ONQQ`O'#H]ON{QSO'#HhO! dQSO'#H[O! iQSO'#H[O! nQSO'#H[O! sQSO'#H[O! xQSO'#H[OOQO'#EU'#EUO3ZQSO'#HcOOQO,5>[,5>[O1OQSO,5>]O! }QSO,5>_O!!SQSO,5>cO!!^QSO,5>gO!!tQSO,5>dOOQO1G2|1G2|O!#OQSO1G2|OOQO1G3R1G3ROOQO<<I^<<I^OOQO'#ET'#ETOOQO<<Jd<<JdO!#ZQSO'#F]O!#`QSO,5;vO!#hQSO,5;vOOQO,5;v,5;vO!#ZQSO'#FbO!#pQSO'#FaO!#hQSO'#FaO!#xQSO7+'POOQO1G2[1G2[OOQO7+'u7+'uO!#}QSO7+'uP!$VQSO'#GeOOQOAN=[AN=[P!$[QSO'#G[O!$aQSO,5=iO!$fQSO,5=rOOQO'#HX'#HXO!$kQSO1G3`O-WQSO1G3`OOQO1G3`1G3`O!$sQSO1G3VO!${QSO,5=jOOQO1G4R1G4ROOQO1G4T1G4TO!%QQSO,5>OO8|QSO,5>OOOQO,5>O,5>OOOQO1G1k1G1kOOQO1G4U1G4UOOQO,5;],5;]O!%YQSO,5>QOOQO,5>Q,5>QOOQO1G4S1G4SO!%_QSO,5>POOQO,5=},5=}O!%dQ`O'#HfOOQO,5=|,5=|OOQO,5={,5={O8|QSO,5=xO8|QSO,5=zO8|QSO,5=yO8|QSO,5=wO8|QSO,5>SO8|QSO,5>TO8|QSO,5>UO8|QSO,5>VO8|QSO,5>WO=kQSO,5=}O!&mQSO1G3wO!'}QSO1G3yO!(VQSO1G3}O1OQSO'#FnOOQO1G3}1G3}O!(aQSO1G3}O8|QSO1G4RO!(fQWO'#IOO7qQWO'#H|OOQO'#Hz'#HzO!)dQSO'#HyO!)kQSO'#HyO!)pQSO1G4OO!)uQSO7+(hOOQO'#Gy'#GyO!)zQWO'#G{OOQO,5;w,5;wO!*PQSO1G1bOOQO1G1b1G1bO!*[QSO1G1bOOQO-E:]-E:]OOQO,5;|,5;|O!*dQSO,5<zO!*oQSO,5;{OOQO-E:^-E:^O!*wQpO<<JkOOQO<<Ka<<KaPOQO,5=P,5=POOQO1G3T1G3TO!#OQSO1G3^O!.kQSO7+(zOOQO7+(z7+(zO!.rQSO7+(zOOQO-E:Z-E:ZOOQO7+(q7+(qO!.zQSO7+(qO>ZQSO1G3UO!3yQSO1G3jOOQO1G3j1G3jO!4QQSO1G3jOOQO-E:[-E:[O!4tQWO1G3lOOQO1G3k1G3kOOQO1G3d1G3dOOQO1G3f1G3fOOQO'#H`'#H`O!6lQ`O1G3eO!7zQ`O'#H`OKmQSO'#H_O!8UQSO'#H^OOQO1G3c1G3cO!8qQSO1G3nO!8xQSO1G3oO!9PQSO1G3pO!9WQSO1G3qO!9_QSO1G3rOOQO1G3i1G3iO!9fQSO7+)cOOQO'#Gb'#GbO!9nQSO7+)eO!9yQSO'#HtO!:[QWO'#HtOOQO7+)i7+)iO!:aQSO7+)iOOQO,5<Y,5<YOOQO7+)m7+)mOOQO,5>f,5>fO!:fQSO,5>eO!:wQSO,5>eO!:|QSO,5>eO1OQSO7+)jOOQO<<LS<<LSOOQO7+&|7+&|O!;TQSO7+&|P!;`QSO'#G_O!;eQSO1G1gP!;pQSO'#G`O!;uQSO'#FcOOQOAN@VAN@VO!>bQSO7+(xOOQO<<Lf<<LfO!>gQSO<<LfP!>nQSO'#G]OOQO'#HQ'#HQO!>sQSO<<L]O!>xQSO7+(pOOQO7+)U7+)UO!?QQSO7+)UP!?XQSO'#G^OOQO7+)W7+)WO!?^Q`O1G3lOOQO'#Hr'#HrOOQO<<L}<<L}OOQO-E:`-E:`OOQO<<MP<<MPO!@gQWO'#HuO!9yQSO'#HuO!@oQWO,5>`O!@tQSO,5>`OOQO<<MT<<MTO5iQWO'#IOO!@yQWO'#IQOOQO'#IQ'#IQOOQO1G4P1G4PO!ATQSO1G4PO!AfQSO1G4POOQO<<MU<<MUOOQO<<Jh<<JhPOQO,5<y,5<yPOQO,5<z,5<zO>ZQSO,5;}OOQO<<Ld<<LdOOQOANBQANBQPOQO,5<w,5<wOOQOANAwANAwOOQO<<L[<<L[O!#OQSO<<L[OOQO<<Lp<<LpPOQO,5<x,5<xOFZQWO'#CtO!AkQWO'#HbO!5tQSO1G3eO!BTQpO,5<}O!B[QWO,5>aOOQO-E:a-E:aO!BdQSO1G3zO!BiQSO1G3zOOQO,5>l,5>lOOQO7+)k7+)kO!BsQSO7+)kOOQO1G1i1G1iO!CUQSOANAvO!CZQpO1G3{P!CbQSO'#GcO!CgQSO7+)fO!CqQSO'#HvO!C{QSO'#HvOOQO7+)f7+)fO!DQQSO7+)fOOQO<<MV<<MVOOQOG27bG27bPOQO,5<},5<}OOQO<<MQ<<MQO!DVQSO<<MQOOQO,5>b,5>bOOQOANBlANBlO!D[QSO'#HaO!HqQSO,5>QO!D[QSO,5=xO8|QSO,5=yOJOQ`O'#H`O8|QSO'#Hf",
  stateData: "!IP~O%^OS%`PQ%aPQ~OS]O$v_O$z`O%cXO%eRO]VP!uVP!vVP#{VP#}VP$SVP~O%Y%bP~P]O%`aO%abO~O%Y%bX~P]ORfO~O%eRO]VX!uVX!vVX#{VX#}VX$SVXRVXiVXjVXkVXlVXmVXnVXoVXpVXqVXrVXsVXtVXuVXvVXwVXxVXyVXzVX{VX|VX}VX!OVX!PVX!QVX!RVX!SVX!TVX!UVX!VVX!WVX!XVX!YVX!ZVX![VX!]VX!^VX!_VX~O]jO!ukO!vlO#{mO#}nO$SoO~O%cpO~O%Y%bX~P`ORrO~O$ytO&asO~O$yvO~O%ZwO~O%[wO~O%Y%ba~P`O%fxO]Wa!uWa!vWa#{Wa#}Wa$SWa%eWaRWaiWajWakWalWamWanWaoWapWaqWarWasWatWauWavWawWaxWayWazWa{Wa|Wa}Wa!OWa!PWa!QWa!RWa!SWa!TWa!UWa!VWa!WWa!XWa!YWa!ZWa![Wa!]Wa!^Wa!_Wa~O!pyO%cUa~O&azO]$Qa!u$Qa!v$Qa#{$Qa#}$Qa$S$Qa$v$Qa$z$Qa%Y$Qa%c$Qa%e$Qa~OR!OO%k|O~OR!OO~OR!UO~OR!VO~OR!WO~O%c!XO~OR!YO~O&w!]O~O&x!^O]$ua!u$ua!v$ua#{$ua#}$ua$S$ua$v$ua$z$ua%Y$ua%c$ua%e$ua~OR!_OX!_OY!_OZ!_O~OR!eOX!fOY!fOZ!fOi!eOj!eOk!eOl!eOm!pOn!pOo!pOp!qOq!kOr!pOs!pOt!pOu!pOv!pOw!pOx!pOy!pOz!pO{!rO|!lO}!lO!O!mO!P!mO!Q!mO!R!mO!S!mO!T!nO!U!nO!V!nO!W!nO!X!nO!Y!nO!Z!cO![!oO!]!oO!^!oO!_!oO!r!fO!s!fO~OR!vO]jO#i!tO#j!tO$Y#PO$Z#QO$]#RO$a#SO$d#UO$e#TO$r#VO$s#VO$t#VO%c!zO%f!wO&azO~O&b#OO~P0PO_#XO`#XOa#XOb#XOc#XO~O%p#YO!pgX%cgX~O!p#[O~O!p#]O%c!ti~O!p#^O%c#zi~O&a#_O~O%f#aO~O&v#bO%h$xX&b$xX~O%h#cO&b#dO~O$y#gO~O%h#hO%i#iO~O%k#lO~O%k#nO~O%f#oO~O%k#pO~O%k#lO%fhX!phX%chX%nhX%hhX&bhX%ihX]hX!uhX!vhX#{hX#}hX$ShX$vhX$zhX%YhX%ehX&ahX~O%k#rO~O!p#sO%c&oX~OR#uO#i!tO#j!tO%f!wO~O%f#wO!p&rX#c&rX$f&rX$g&rX$h&rX$i&rX$j&rX$k&rX$l&rX$m&rX$n&rX$o&rX$p&rX$q&rX&Z&rX~O#c#{O&Z#zO!p&qX$f&qX$g&qX$h&qX$i&qX$j&qX$k&qX$l&qX$m&qX$n&qX$o&qX$p&qX$q&qX%i&qX~O!p$PO$f$OO$g$OO$h$OO$i$OO$j$OO$k$OO$l$OO$m$OO$n$OO$o$OO~O$p#xO$q#xO~P7qO%c$QO~O&b$SO~P0POR$TOX!fOY!fOZ!fOi!eOj!eOk!eOl!eOm!pOn!pOo!pOp!qOq!kOr!pOs!pOt!pOu!pOv!pOw!pOx!pOy!pOz!pO{!rO|!lO}!lO!O!mO!P!mO!Q!mO!R!mO!S!mO!T!nO!U!nO!V!nO!W!nO!X!nO!Y!nO!Z!cO![!oO!]!oO!^!oO!_!oO!r!fO!s!fO!y$fO!z$fO!{$fO!|$fO!}$fO#O$fO#P$fO#Q$fO#R$fO#S$fO#T$fO#U$fO#V$fO#W$fO#X$fO#Y$fO#Z$fO#[$fO#]$fO#^$fO#_$fO#`$fO#b$gO#f$ZO#g$ZO#h$ZO#i$ZO#j$ZO%f$UO~O%c&dX~P8|O&a$kO~O%f$mO~O%h$oO%n$nO~OR!eOi!eOj!eOk!eOl!eOm!pOn!pOo!pOp!qOq!kOr!pOs!pOt!pOu!pOv!pOw!pOx!pOy!pOz!pO{!rO|!lO}!lO!O!mO!P!mO!Q!mO!R!mO!S!mO!T!nO!U!nO!V!nO!W!nO!X!nO!Y!nO!Z!cO![!oO!]!oO!^!oO!_!oO~O%eRO&b$wORVP~O%eRORVP%i$TP~OR$|O~O&b$}OR%Xa~O%h%OO&b$}O~O%h#hO%i%QO~O!`%UO!a%UO!b%UO!c%UO!d%UO!e%UO!f%UO!g%UO!h%UO!i%UO!j%UO!k%UO!l%UO!m%UO!n%UO!o%UO~O%i%XO~P-WO#c#{O&Z#zO!p&qa$f&qa$g&qa$h&qa$i&qa$j&qa$k&qa$l&qa$m&qa$n&qa$o&qa$p&qa$q&qa%i&qa~O%i%`O~P8|O%c%aO~O%i%bO~OR%cO~O&Z#zO%i&YX#v&YX#w&YX%c&YX&a&YX%h&YX#d&YX~O#c#{O!p&YX$f&YX$g&YX$h&YX$i&YX$j&YX$k&YX$l&YX$m&YX$n&YX$o&YX$p&YX$q&YX~PDoO#c&VX#v&VX#w&VX%c&VX%fhX%f#aX&Z&VX&a&VX%h&VX%i&VX#d&VX~O#f&VX#i&VX#j&VX#k&VX#l&VX#m&VX#n&VX#o&VX#p&VX#q&VX#r&VX#s&VX#t&VX#u&VX#x&VX#y&VX~PFZO%f#wO~O&Z#zO#v&UX#w&UX%c&UX&a&UX%h&UX%i&UX#d&UX~O#c)TO#f&UX#i&UX#j&UX#k&UX#l&UX#m&UX#n&UX#o&UX#p&UX#q&UX#r&UX#s&UX#t&UX#u&UX#x&UX#y&UX~PHZO#n%lO#o%lO#f&SX#i&SX#k&SX#l&SX#m&SX#p&SX#q&SX#r&SX#s&SX#t&SX#u&SX#v&SX#w&SX%c&SX&a&SX%h&SX%i&SX#d&SX~O#j&^X#x&_X#y&`X~PJOO#i%mO#k%mO#l%mO#f&RX#m&RX#v&RX#w&RX%c&RX&a&RX%h&RX%i&RX#d&RX~O#p&RX#q&RX#r&RX#s&RX#t&RX#u&RX~PKmO#v&QX#w&QX%c&QX&a&QX%h&QX%i&QX#d&QX~O#f%nO#m%nO#p&QX#q&QX#r&QX#s&QX#t&QX#u&QX~PL{O#p%oO#q%oO#r%oO#s%oO#t%oO#u%oO#v&PX#w&PX%c&PX&a&PX%h&PX%i&PX#d&PX~O#v&[X#w&]X%c&OX&a&OX%h&OX%i&OX#d&OX~O#v%pO~O#w%qO~O#j%rO~O#x%sO~O#y%tO~O&a%wO~O$c%yO&b%zO~P0PO!p%|O~O]jO#i!tO#j!tO$e#TO%f!wO~OR%}O%c&QO~P!!cOd&UOe&UOf&UO~OR&VO~O%h&XO&b&YO~O%eRORVP~O%h&^O%i$TX~O%i&aO~O&b&bOR%Xa~O%h&cO~O%h#hO~O%n&dO~O%h&eO~O%h&fO%i&gO~O%h&kO%n&jO~O%h&lO~O%h&mO%i&nO~O#d&qO~O%i&rO~O#c)TO#f&YX#i&YX#j&YX#k&YX#l&YX#m&YX#n&YX#o&YX#p&YX#q&YX#r&YX#s&YX#t&YX#u&YX#x&YX#y&YX~PDoO$['ROR&ei]&ei#i&ei#j&ei$Y&ei$Z&ei$]&ei$a&ei$d&ei$e&ei$r&ei$s&ei$t&ei%c&ei%f&ei&a&ei&b&ei$c&ei$_&ei~O$^'UO$`'VO~O$c%yO&b'WO~P0PO&b'WO~O%f#wO!p&rX#c&rX$f&rX$g&rX$h&rX$i&rX$j&rX$k&rX$l&rX$m&rX$n&rX$o&rX&Z&rX~O%c']O~P8|O%c'_O~O%i'`O~O%n'aO~O%p#YO~O&b'bOR%Ra%e%Ra~O%h'cO&b'bO~OR%Sa%e%Sa%i$Ta~O%h'eO%i$Ta~O&c'gO]$VP!u$VP!v$VP#{$VP#}$VP$S$VP$v$VP$z$VP%Y$VP%c$VP%e$VP&a$VP~OR%PaX%PaY%PaZ%Pai%Paj%Pak%Pal%Pam%Pan%Pao%Pap%Paq%Par%Pas%Pat%Pau%Pav%Paw%Pax%Pay%Paz%Pa{%Pa|%Pa}%Pa!O%Pa!P%Pa!Q%Pa!R%Pa!S%Pa!T%Pa!U%Pa!V%Pa!W%Pa!X%Pa!Y%Pa!Z%Pa![%Pa!]%Pa!^%Pa!_%Pa!r%Pa!s%Pa~O%i'jO~P!+rO%h'kO%i'jO~OR'mOX'mOY'mO~OR%QaX%QaY%QaZ%Qai%Qaj%Qak%Qal%Qam%Qan%Qao%Qap%Qaq%Qar%Qas%Qat%Qau%Qav%Qaw%Qax%Qay%Qaz%Qa{%Qa|%Qa}%Qa!O%Qa!P%Qa!Q%Qa!R%Qa!S%Qa!T%Qa!U%Qa!V%Qa!W%Qa!X%Qa!Y%Qa!Z%Qa![%Qa!]%Qa!^%Qa!_%Qa!r%Qa!s%Qa!y%Qa!z%Qa!{%Qa!|%Qa!}%Qa#O%Qa#P%Qa#Q%Qa#R%Qa#S%Qa#T%Qa#U%Qa#V%Qa#W%Qa#X%Qa#Y%Qa#Z%Qa#[%Qa#]%Qa#^%Qa#_%Qa#`%Qa#b%Qa#f%Qa#g%Qa#h%Qa#i%Qa#j%Qa%f%Qa~O%i'pO~P!/VO%h'qO%i'pO~O&Z#zO%i&Yi#v&Yi#w&Yi%c&Yi&a&Yi%h&Yi#d&Yi~O#c#{O!p&Yi$f&Yi$g&Yi$h&Yi$i&Yi$j&Yi$k&Yi$l&Yi$m&Yi$n&Yi$o&Yi$p&Yi$q&Yi~P!4YO#i%mO#k%mO#l%mO#f&Ri#m&Ri#v&Ri#w&Ri%c&Ri&a&Ri%h&Ri%i&Ri#d&Ri~O#p&Ri#q&Ri#r&Ri#s&Ri#t&Ri#u&Ri~P!5tO#f&SX#i&SX#k&SX#l&SX#m&SX#v&SX#w&SX%c&SX&a&SX%h&SX%i&SX#d&SX~O#n)QO#o)QO~P!7SO#f)RO#m)RO~PL{O%c&Oi&a&Oi%h&Oi%i&Oi#d&Oi~O#v&[i~P!8`O#w&]i~P!8`O#j&^i~P!8`O#x&_i~P!8`O#y&`i~P!8`O$Z#QO&azO~O$^'UO$`'VO&b'xO~OX!fOY!fOZ!fO!r!fO!s!fO~O%p'|O~O&b'}O~OR(OO#i!tO#j!tO%f!wO%i&ma~O%c(SO~O%c(SO~P8|O&b(VOR%Ra%e%Ra~O%h(WO~OR%Sa%e%Sa%i$Ti~O%h(XO~O%eRORVPiVPjVPkVPlVPmVPnVPoVPpVPqVPrVPsVPtVPuVPvVPwVPxVPyVPzVP{VP|VP}VP!OVP!PVP!QVP!RVP!SVP!TVP!UVP!VVP!WVP!XVP!YVP!ZVP![VP!]VP!^VP!_VP~O%n(ZO~O%i([O~P!+rO%h(]O~O%n(^O~O%h(`O%n(_O~O%i(aO~P!/VO%h(bO~O#c)TO#f&Yi#i&Yi#j&Yi#k&Yi#l&Yi#m&Yi#n&Yi#o&Yi#p&Yi#q&Yi#r&Yi#s&Yi#t&Yi#u&Yi#x&Yi#y&Yi~P!4YO%h(fO%p&iX~O%p(iO~O&a(jO~O$p(kO$q(kO~P7qOR(OO#i!tO#j!tO%f!wO%i&mi~O%c(mO~O#c#{O~PHZOX%VaY%VaZ%Va!r%Va!s%Va~O%p&ia~P!ArO%h(pO%p&ia~O&a(rO~O$_(tO&b(uO~P0POR(OO#i!tO#j!tO%f!wO%i&mq~O%n(xO~O%p&ii~P!ArO%h(yO~O$_(tO&b(zO~P0PO$_(tO&b&jX~P0PO%c(|O~O&b(zO~O&b(}O~OR(cOi!eOj!eOk!eOl!eOm!pOn!pOo!pOp!qOq!kOr!pOs!pOt!pOu!pOv!pOw!pOx!pOy!pOz!pO{!rO|!lO}!lO!O!mO!P!mO!Q!mO!R!mO!S!mO!T!nO!U!nO!V!nO!W!nO!X!nO!Y!nO!Z!cO![!oO!]!oO!^!oO!_!oO!y$fO!z$fO!{$fO!|$fO!}$fO#O$fO#P$fO#Q$fO#R$fO#S$fO#T$fO#U$fO#V$fO#W$fO#X$fO#Y$fO#Z$fO#[$fO#]$fO#^$fO#_$fO#`$fO#b$gO#f)OO#g)OO#h)OO#i)OO#j)OO%f$UO~P!9yO#d'tO~O%`#kZYX#fRY~",
  goto: "@t&vPP&wPP&{'R'X'jPPP'vP(TPPPPPPPP(W(gPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP)nPP'RPP)t)}PPPPPPPPPPPPPPPPPPPPPP*lPPP+ZPPPPPPPPPPPPPPPPPPPP'RP+gP+m+p+g+vP+y+|,S,V,oPPPPPPPP,zPPPPPPPPPPPPPPPPPP&{P-Q-WPP-^-d-n-|.S.Y.`.f.l.v.|/S/ePPPPP/kPP/nP/qPP/wPP/}P0Q0WP0aP0n0x0{1t0{1w1w2p3i4b4e4h4r5m6e6{7b7w8d9e:S:s;P;qP<T<e<u=V=gPPP=w>Q>^>a>j>n>q>a>a>z>}?Q?^?o@T@f@k=wT^OQXXOQZeXVOQZeWUOQZeS$t#_$vS$x#a$zR(Y'geSOQTZe#_#a$v$z'gQhUa!sz!}$k$m%x(j(r(sR!RjQ!QjQ!SkQ!TlQ#Z!RR$l#TW!gy#[#o%W!W$W#P#Q#R#]#s#w#{$P$U$Z%_%l%m%n%o%p%q%r%s%t%|&Q'_)O)Q)R)TQ$p#YQ$s#^Q%S#lQ%Y#pQ'o&lR(n(YQ!jyR$q#[Q$q#]Q%[#sR'Z%|!X$V#P#Q#R#]#s#w#{$P$U$Z%_%l%m%n%o%p%q%r%s%t%|&Q'_)O)Q)R)T!X$W#P#Q#R#]#s#w#{$P$U$Z%_%l%m%n%o%p%q%r%s%t%|&Q'_)O)Q)R)TY#|!x#v#|&q(dV%i$X%i'tXWOQZeR#`!VQ$u#_R&Z$vRiUR${#aQ$y#aR&_$zR'h&aQ{i^!zz!}$k%x(j(r(sQ%v$iQ'Y%yQ'u'RR(U'`W!|z!}$k%xV(s(j(r(sQ%{$kR'X%xQu_R#g!^Q!ZsR#e![QQORdQQZOQeQTqZebTOQZe#_#a$v$z'gRgTQ!axR#k!aQ%W#oR&i%WQ%_#wR&p%_Q$v#_R&[$vQ$z#aR&`$zQ!}zS$R!}%xR%x$kQ'T%wR'w'TQ'z'UR(h'zh!uz!w!}$k$m%x'](S(j(m(r(sR#t!uQ![sR#f![RcPR[OXYOQZeQ!`xR#j!aR}jQ#W|R%Z#rQ&T$oQ'i&eR(o(`Y!Pjkl!R#TQ&W$tR&]$xQ#m!cS#q!p!rR%u$gR#q!q!m!ey#P#Q#R#Y#[#]#^#l#o#p#s#w#{$P$U$Z%W%_%l%m%n%o%p%q%r%s%t%|&Q&l'_(Y)O)Q)R)TR'n&k!m!by#P#Q#R#Y#[#]#^#l#o#p#s#w#{$P$U$Z%W%_%l%m%n%o%p%q%r%s%t%|&Q&l'_(Y)O)Q)R)T!m!cy#P#Q#R#Y#[#]#^#l#o#p#s#w#{$P$U$Z%W%_%l%m%n%o%p%q%r%s%t%|&Q&l'_(Y)O)Q)R)T!m!dy#P#Q#R#Y#[#]#^#l#o#p#s#w#{$P$U$Z%W%_%l%m%n%o%p%q%r%s%t%|&Q&l'_(Y)O)Q)R)TR#m!dR%T#nS!iy#[Q%V#oR&h%WW!hy#[#o%W!W$V#P#Q#R#]#s#w#{$P$U$Z%_%l%m%n%o%p%q%r%s%t%|&Q'_)O)Q)R)TQ'y'UR(g'zQ$h#PQ$i#QQ$j#RU$r#]#s%|Q%^#wQ%d#{Q%f$PQ%g$UQ&o%_Q'^&QQ(T'_R)P)Tl$`#P#Q#R#]#s#w#{$P$U%_%|&Q'_)TQ&{%pR&|%qp$_#P#Q#R#]#s#w#{$P$U%_%p%q%|&Q'_)TR&z%op$^#P#Q#R#]#s#w#{$P$U%_%p%q%|&Q'_)TR&y%op$]#P#Q#R#]#s#w#{$P$U%_%p%q%|&Q'_)TQ&v%nQ&x%oR(e)Rl$[#P#Q#R#]#s#w#{$P$U%_%|&Q'_)TS%k$Z)OS&s%l)QQ&t%mS&u%n)RQ&w%oQ&}%rQ'O%sQ'P%tT)S%p%q!X$Y#P#Q#R#]#s#w#{$P$U$Z%_%l%m%n%o%p%q%r%s%t%|&Q'_)O)Q)R)T!S$X#P#Q#R#]#s#w#{$P$U$Z%_%l%m%n%o%p%q%r%s%t%|&Q'_)R)TT(d)O)QQ#x!vQ%h$WQ'[%}R(k(O!W$V#P#Q#R#]#s#w#{$P$U$Z%_%l%m%n%o%p%q%r%s%t%|&Q'_)O)Q)R)TR'Q%uQ#}!xQ%]#vS%e#|%iS%j$X(dT's&q'tm$a#P#Q#R#]#s#w#{$P$U%_%|&Q'_)Tm$b#P#Q#R#]#s#w#{$P$U%_%|&Q'_)Tm$c#P#Q#R#]#s#w#{$P$U%_%|&Q'_)Tm$d#P#Q#R#]#s#w#{$P$U%_%|&Q'_)Tm$e#P#Q#R#]#s#w#{$P$U%_%|&Q'_)T_!{z!}$k%x(j(r(s^!zz!}$k%x(j(r(sR'u'RR'v'R_!zz!}$k%x(j(r(sT'S%w'TR'{'UQ(v(jQ({(rR(|(sR&S$mR&R$m^!{z!}$k%x(j(r(sR&P$m^!{z!}$k%x(j(r(sQ&P$mV(Q'](S(m^!yz!}$k%x(j(r(sQ#y!wQ&O$mV(P'](S(mh!xz!w!}$k$m%x'](S(j(m(r(sR#v!uV$P!y&O(PQ(R']Q(l(SR(w(m",
  nodeNames: "⚠ Program EnableDirective Identifier Directive LocalDeclaration GlobalVariableDeclaration AttributeList Attribute IntLiteral UintLiteral FloatLiteral VariableDeclaration Keyword VariableQualifier Keyword Keyword Keyword Keyword Keyword Keyword Keyword Keyword VariableIdentifier TypeDeclaration Type Type Type Type Type Type Type Type Type Type Type Type Type Type Type Type Type Type Type Type Type Keyword Keyword Keyword Keyword Keyword Type Type Type Type Type Type Keyword Type Type Type Type Type Type Type Type Type Type Type Type Type Type Type Type Type Type Type Type Assign Value Boolean Boolean GlobalConstantDeclaration Keyword Keyword Value Reserved Reserved Reserved Reserved Reserved Reserved Reserved Reserved Reserved Reserved Reserved Reserved Reserved Reserved Reserved Reserved Reserved Reserved Reserved Reserved Reserved Reserved Reserved FunctionCall Keyword LeftBracket RightBracket FieldAccess Sub Bang Tilde Mul And Div Mod Add Left Right Lt Gt Lte Gte Eq Neq OrOr AndAnd Or Xor TypeAliasDeclaration Keyword StructDeclaration Keyword StructBodyDeclaration StructMember FunctionDeclaration FunctionHeader Keyword ParamList Param ReturnType CompoundStatement Statement Keyword Keyword Keyword Keyword Keyword Keyword Keyword Keyword ContinuingStatement Keyword Keyword Keyword AddAssign SubAssign MulAssign DivAssign ModAssign AndAssign XorAssign OrAssign LeftAssign RightAssign Inc Dec Keyword Keyword Keyword ImportDeclaration Keyword ImportDeclarationList ImportDeclarationIdentifier String Keyword",
  maxTerm: 270,
  skippedNodes: [0],
  repeatNodeCount: 13,
  tokenData: "6u~R|X^#{pq#{qr$prs$}uv&vvw'Twx'jxy)^yz)cz{)h{|)u|}*[}!O*a!O!P,a!P!Q,i!Q!R-W!R![/s![!]0X!]!^0f!^!_0k!_!`1[!`!a1i!b!c2Y!c!}2_!}#O2p#P#Q2u#Q#R2z#R#S2_#T#U3X#U#Y2_#Y#Z4T#Z#o2_#o#p6P#p#q6U#q#r6k#r#s6p#y#z#{$f$g#{#BY#BZ#{$IS$I_#{$I|$JO#{$JT$JU#{$KV$KW#{&FU&FV#{~$QY%^~X^#{pq#{#y#z#{$f$g#{#BY#BZ#{$IS$I_#{$I|$JO#{$JT$JU#{$KV$KW#{&FU&FV#{T$uP#gP!_!`$xS$}O#uS~%QVOr$}rs%gs#O$}#O#P%l#P;'S$};'S;=`&p<%lO$}~%lO$y~~%oVOr$}rs&Us#O$}#O#P%l#P;'S$};'S;=`&p<%lO$}~&ZV$y~Or$}rs%gs#O$}#O#P%l#P;'S$};'S;=`&p<%lO$}~&sP;=`<%l$}V&{P#lT!_!`'OQ'TO$jQ~'YQ#jTvw'`!_!`'e~'eO#w~Q'jO$kQ~'mVOw'jwx%gx#O'j#O#P(S#P;'S'j;'S;=`)W<%lO'j~(VVOw'jwx(lx#O'j#O#P(S#P;'S'j;'S;=`)W<%lO'j~(qV$y~Ow'jwx%gx#O'j#O#P(S#P;'S'j;'S;=`)W<%lO'j~)ZP;=`<%l'j~)cO%f~~)hO%i~V)mP#iT!_!`)pQ)uO$hQV)zQ#mT{|*Q!_!`*VQ*VO$pQQ*[O$fQ~*aO%h~_*fS#fT}!O*r!Q![*w!_!`,V!`!a,[Q*wO$qQX*zQ!O!P+Q!Q![*wX+VSZX!Q![+Q!g!h+c#X#Y+c#Y#Z,QX+fR{|+o}!O+o!Q![+uX+rP!Q![+uX+zQZX!Q![+u#Y#Z,QX,VOZXQ,[O$gQW,aO&cW_,fP&ZU!Q![+Q~,nR#kTz{,w!P!Q,|!_!`-R~,|O%a~~-RO%`~Q-WO$iQ~-]VX~!O!P+Q!Q![-r!g!h+c!z!{.R#X#Y+c#i#j/n#l#m.RX-uS!O!P+Q!Q![-r!g!h+c#X#Y+c~.US!O!P.b!Q![/S!c!i/S#T#Z/SX.eR!Q![.n!c!i.n#T#Z.nX.sTZX!Q![.n!c!i.n!r!s+c#T#Z.n#d#e+c~/XVX~!O!P.n!Q![/S!c!i/S!r!s+c#T#Z/S#d#e+c#i#j/n~/sOY~~/xTX~!O!P+Q!Q![/s!g!h+c#X#Y+c#i#j/nZ0^P%pY![!]0aP0fO&xP~0kO%c~V0rQ%kP#pS!^!_0x!_!`1VU0}P#nS!_!`1QQ1VO$nQS1[O#rSV1aP!pR!_!`1dS1iO#tSV1pQ%nP#qS!_!`1v!`!a1{S1{O#sSU2QP#oS!_!`2TQ2YO$oQ~2_O%e~X2dSRX!Q![2_!c!}2_#R#S2_#T#o2_~2uO#c~~2zO#d~V3PP#yT!_!`3SQ3XO$lQZ3^URX!Q![2_!c!}2_#R#S2_#T#g2_#g#h3p#h#o2_Z3wS&vQRX!Q![2_!c!}2_#R#S2_#T#o2_Z4YURX!Q![2_!c!}2_#R#S2_#T#f2_#f#g4l#g#o2_Z4qURX!Q![2_!c!}2_#R#S2_#T#c2_#c#d5T#d#o2_Z5YURX!Q![2_!c!}2_#R#S2_#T#a2_#a#b5l#b#o2_Z5sS&wQRX!Q![2_!c!}2_#R#S2_#T#o2_~6UO&a~~6ZQ#xT!_!`6a#p#q6fQ6fO$mQ~6kO#v~~6pO&b~~6uO#h~",
  tokenizers: [untilEOLToken, untilCommentCloseToken, 0, 1, 2, 3],
  topRules: {"Program":[0,1]},
  specialized: [{term: 3, get: value => spec_Identifier[value] || -1}],
  tokenPrec: 3948
})
