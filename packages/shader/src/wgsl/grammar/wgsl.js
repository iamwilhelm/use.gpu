// This file was generated by lezer-generator. You probably shouldn't edit it.
import {LRParser} from "@lezer/lr"
import {untilEOLToken, untilCommentCloseToken} from "./tokens"
const spec_Identifier = {__proto__:null,enable:8, var:26, function:30, private:32, workgroup:34, uniform:36, storage:38, read:40, write:42, read_write:44, bool:50, f32:52, i32:54, u32:56, vec2:58, vec3:60, vec4:62, ptr:64, array:66, mat2x2:68, mat2x3:70, mat2x4:72, mat3x2:74, mat3x3:76, mat3x4:78, mat4x2:80, mat4x3:82, mat4x4:84, atomic:86, sampler:88, sampler_comparison:90, texture_depth_2d:92, texture_depth_2d_array:94, texture_depth_cube:96, texture_depth_cube_array:98, texture_depth_multisampled_2d:100, texture_1d:102, texture_2d:104, texture_2d_array:106, texture_3d:108, texture_cube:110, texture_cube_array:112, texture_multisampled_2d:114, texture_storage_1d:116, texture_storage_2d:118, texture_storage_2d_array:120, texture_storage_3d:122, rgba8unorm:124, rgba8snorm:126, rgba8uint:128, rgba8sint:130, rgba16uint:132, rgba16sint:134, rgba16float:136, r32uint:138, r32sint:140, r32float:142, rg32uint:144, rg32sint:146, rg32float:148, rgba32uint:150, rgba32sint:152, rgba32float:154, true:160, false:162, const:166, override:168, asm:174, bf16:176, do:178, enum:180, f16:182, f64:184, handle:186, i8:188, i16:190, i64:192, mat:194, premerge:196, regardless:198, typedef:200, u8:202, u16:204, u64:206, unless:208, using:210, vec:212, void:214, while:216, bitcast:220, type:268, struct:272, fn:282, return:294, if:296, else:298, switch:300, case:302, fallthrough:304, default:306, loop:308, continuing:312, for:314, let:316, break:342, continue:344, discard:346, import:350, use:358}
export const parser = LRParser.deserialize({
  version: 14,
  states: "!#nO!QQSOOP!XOSOOO!aQSO'#GmO!hQSO'#CdOOQO'#GY'#GYO!mQSO'#CcO%lQSO'#CbO&QQSO'#CaOOQO'#Ca'#CaOOQO'#Go'#GoOOQO'#GX'#GXO&VQSO'#GmQOQSOOO&^QSO'#C^OOQO'#GW'#GWO&cQSO'#GQO&kQSO'#GQP&pQTO'#GjP&uQUO'#GjPOOO)CB^)CB^OOQO-E:U-E:UO&zQSO,5=XO'RQSO,59OOOQO-E:W-E:WO*TQSO,58|O*]QSO,5;wO*bQSO'#ChO*jQSO,5:lO*jQSO,5:lO*oQSO,5;qO*tQSO,5;sO*yQSO'#F^OOQO,58{,58{OOQO-E:V-E:VO+OQSO,58xO+TQSO'#GSOOQO,5<l,5<lO+YQWO,5<lO+_QSO,5<lPOOO,5=U,5=UO,VQSO1G.jO,eQSO1G.hO0bQSO'#FcOOQO1G1c1G1cO0iQSO'#GuOOQO'#Cj'#CjO0zQWO'#CsOOQO'#Cs'#CsOOQO,59S,59SO*jQSO,59SO1VQSO1G0WO1[QSO1G0WO1dQSO1G1]O1lQSO1G1_O1qQSO,5;xOOQO1G.d1G.dO1vQWO'#GTO2RQSO,5<nO+TQSO,5<nO2ZQSO1G2WO&fQSO1G2WOOQO'#Gr'#GrO2`QSO7+$UO,VQSO7+$UOOQO'#HQ'#HQO2hQSO'#HQO2mQSO'#HQOOQO'#Ct'#CtOOQO'#HY'#HYO2rQSO'#HXOOQO'#HX'#HXOOQO'#D}'#D}OOQO7+$S7+$SO2wQSO'#HOOOQO'#HR'#HROOQO'#HS'#HSOOQO'#HT'#HTOOQO'#HU'#HUO2hQSO'#CtO2|QSO'#CtO3RQSO'#HzOOQO'#Gc'#GcO3ZQSO'#H|O3iQWO'#H}O3ZQSO'#H}O4mQWO'#H|O6fQWO'#H{OOQO'#Fd'#FdO6pQSO'#FdOOQO'#G`'#G`O6uQSO,5;}OOQO,5;},5;}O;pQSO'#HoO6|QSO'#HpO6|QSO'#HrO;wQSO'#HvO*jQSO'#HzO;|QSO'#HwOOQO'#IQ'#IQO<RQSO,5=aOOQO'#Gw'#GwO<ZQSO,5=fOOQO1G.n1G.nO,eQSO7+%rO6|QSO7+%rO<ZQSO7+&wO>sQSO'#FZOOQO7+&y7+&yO?OQSO1G1dO?ZQSO,5<oO?`QSO1G2YOOQO1G2Y1G2YO?hQSO1G2YOOQO-E:b-E:bOOQO7+'r7+'rOOQO,5<u,5<uOOQO<<Gp<<GpO?pQSO<<GpOOQO-E:X-E:XO<ZQSO'#G|OOQO,5=l,5=lO?xQSO'#HVO@|QSO,5=sO<ZQSO,5=jOOQO,59`,59`O0iQSO'#G}O6|QSO,5>fOOQO-E:a-E:aOOQO'#H}'#H}OATQWO,5>hOBXQSO'#HcOB`QSO,5<OOBeQSO,5>iO6|QSO'#HeOBjQSO'#HeOOQO,5>h,5>hOOQO'#IO'#IOO6|QSO,5>gOOQO,5<O,5<OOOQO-E:^-E:^OOQO1G1i1G1iOCgQ`O'#CtO6|QSO'#HdOOQO'#Hb'#HbODmQSO'#HbOE^Q`O'#HaOOQO'#H`'#H`O6|QSO'#H`OG}Q`O'#H_OIVQ`O'#H^OJXQ`O'#H]OJuQ`O'#H[OKsQSO'#HgOL_QSO'#HZOLdQSO'#HZOLiQSO'#HZOLnQSO'#HZOLsQSO'#HZOOQO'#EU'#EUO2hQSO'#HbOOQO,5>Z,5>ZO*]QSO,5>[OLxQSO,5>^OL}QSO,5>bOMXQSO,5>fOMoQSO,5>cOOQO1G2{1G2{OMyQSO1G2{OOQO1G3Q1G3QOOQO<<I^<<I^OOQO'#ET'#ETOOQO<<Jc<<JcONUQSO'#F[ONZQSO,5;uONcQSO,5;uOOQO,5;u,5;uONUQSO'#FaONkQSO'#F`ONcQSO'#F`ONsQSO7+'OOOQO1G2Z1G2ZOOQO7+'t7+'tONxQSO7+'tP! QQSO'#GdOOQOAN=[AN=[P! VQSO'#GZO! [QSO,5=hO! aQSO,5=qOOQO'#HW'#HWO! fQSO1G3_O,eQSO1G3_OOQO1G3_1G3_O! nQSO1G3UO! vQSO,5=iOOQO1G4Q1G4QOOQO1G4S1G4SO! {QSO,5=}O6|QSO,5=}OOQO,5=},5=}OOQO1G1j1G1jOOQO1G4T1G4TO!!TQSO,5>PO!!tQWO,5>POOQO1G4R1G4RO!#wQSO,5>OOOQO,5=|,5=|OOQO,5={,5={OOQO,5=z,5=zO6|QSO,5=wO6|QSO,5=yO6|QSO,5=xO6|QSO,5=vO6|QSO,5>RO6|QSO,5>SO6|QSO,5>TO6|QSO,5>UO6|QSO,5>VO;kQSO,5=|O!#|QSO1G3vO!%^QSO1G3xO!%fQSO1G3|O*]QSO'#FmOOQO1G3|1G3|O!%pQSO1G3|O6|QSO1G4QO!%uQWO'#H}O5qQWO'#H{OOQO'#Hy'#HyO!&sQSO'#HxO!&zQSO'#HxO!'PQSO1G3}O!'UQSO7+(gOOQO'#Gx'#GxO!'ZQWO'#GzOOQO,5;v,5;vO!'`QSO1G1aOOQO1G1a1G1aO!'kQSO1G1aOOQO-E:[-E:[OOQO,5;{,5;{O!'sQSO,5<yO!(OQSO,5;zOOQO-E:]-E:]O!(WQWO<<JjOOQO<<K`<<K`POQO,5=O,5=OOOQO1G3S1G3SOMyQSO1G3]O!+XQSO7+(yOOQO7+(y7+(yO!+`QSO7+(yOOQO-E:Y-E:YOOQO7+(p7+(pO!+hQSO7+(pO<ZQSO1G3TO!0gQSO1G3iOOQO1G3i1G3iO!0nQSO1G3iOOQO-E:Z-E:ZO!1bQWO1G3kOOQO1G3k1G3kOOQO1G3j1G3jO!2eQ`O,5>POOQO1G3c1G3cOOQO1G3e1G3eOOQO'#H_'#H_O!4lQ`O1G3dO!5}Q`O'#H_OH[QSO'#H^O!6XQSO'#H]OOQO1G3b1G3bO!6wQSO1G3mO!7OQSO1G3nO!7VQSO1G3oO!7^QSO1G3pO!7eQSO1G3qOOQO1G3h1G3hO!7lQSO7+)bOOQO'#Ga'#GaO!7tQSO7+)dO!8PQSO'#HsO!8bQWO'#HsOOQO7+)h7+)hO!8gQSO7+)hOOQO,5<X,5<XOOQO7+)l7+)lOOQO,5>e,5>eO!8lQSO,5>dO!8}QSO,5>dO!9SQSO,5>dO*]QSO7+)iOOQO<<LR<<LROOQO7+&{7+&{O!9ZQSO7+&{P!9fQSO'#G^O!9kQSO1G1fP!9vQSO'#G_O!9{QSO'#FbOOQOAN@UAN@UO!<hQSO7+(wOOQO<<Le<<LeO!<mQSO<<LeP!<tQSO'#G[OOQO'#HP'#HPO!<yQSO<<L[O!=OQSO7+(oOOQO7+)T7+)TO!=WQSO7+)TP!=_QSO'#G]OOQO7+)V7+)VO!=dQ`O1G3kOOQO'#Hq'#HqOOQO<<L|<<L|OOQO-E:_-E:_OOQO<<MO<<MOO!>pQWO'#HtO!8PQSO'#HtO!>xQWO,5>_O!>}QSO,5>_OOQO<<MS<<MSO3iQWO'#H}O!?SQWO'#IPOOQO'#IP'#IPOOQO1G4O1G4OO!?^QSO1G4OO!?oQSO1G4OOOQO<<MT<<MTOOQO<<Jg<<JgPOQO,5<x,5<xPOQO,5<y,5<yO<ZQSO,5;|OOQO<<Lc<<LcOOQOANBPANBPPOQO,5<v,5<vOOQOANAvANAvOOQO<<LZ<<LZOMyQSO<<LZOOQO<<Lo<<LoPOQO,5<w,5<wOBoQWO'#CtO!?tQWO'#HaO!3qQSO1G3dO!@aQpO,5<|O!@hQWO,5>`OOQO-E:`-E:`O!@pQSO1G3yO!@uQSO1G3yOOQO,5>k,5>kOOQO7+)j7+)jO!APQSO7+)jOOQO1G1h1G1hO!AbQSOANAuO!AgQpO1G3zP!AnQSO'#GbO!AsQSO7+)eO!A}QSO'#HuO!BXQSO'#HuOOQO7+)e7+)eO!B^QSO7+)eOOQO<<MU<<MUOOQOG27aG27aPOQO,5<|,5<|OOQO<<MP<<MPO!BcQSO<<MPOOQO,5>a,5>aOOQOANBkANBkO!BhQSO'#HeO!BmQSO'#H`O!GSQSO,5>PO!BmQSO,5=wO6|QSO,5=xOFjQ`O'#H_O6|QSO'#He",
  stateData: "!Gb~O%]OS%_PQ%`PQ~OS]O$u_O$y`O%bXO%dRO]VP!uVP!vVP#zVP#|VP$RVP~O%X%aP~P]O%_aO%`bO~O%X%aX~P]ORfO~O%dRO]VX!uVX!vVX#zVX#|VX$RVXRVXiVXjVXkVXlVXmVXnVXoVXpVXqVXrVXsVXtVXuVXvVXwVXxVXyVXzVX{VX|VX}VX!OVX!PVX!QVX!RVX!SVX!TVX!UVX!VVX!WVX!XVX!YVX!ZVX![VX!]VX!^VX!_VX~O]jO!ukO!vlO#zmO#|nO$RoO~O%bpO~O%X%aX~P`ORrO~O$xtO&`sO~O$xvO~O%YwO~O%ZwO~O%X%aa~P`O%exO]Wa!uWa!vWa#zWa#|Wa$RWa%dWaRWaiWajWakWalWamWanWaoWapWaqWarWasWatWauWavWawWaxWayWazWa{Wa|Wa}Wa!OWa!PWa!QWa!RWa!SWa!TWa!UWa!VWa!WWa!XWa!YWa!ZWa![Wa!]Wa!^Wa!_Wa~O!pyO%bUa~O&`zO~OR!OO%j|O~OR!OO~OR!UO~OR!VO~OR!WO~O%b!XO~OR!YO~O&v!]O~O&w!^O]$ta!u$ta!v$ta#z$ta#|$ta$R$ta$u$ta$y$ta%X$ta%b$ta%d$ta~OR!_OX!_OY!_OZ!_O~OR!eOX!fOY!fOZ!fOi!eOj!eOk!eOl!eOm!pOn!pOo!pOp!qOq!kOr!pOs!pOt!pOu!pOv!pOw!pOx!pOy!pOz!pO{!pO|!lO}!lO!O!mO!P!mO!Q!mO!R!mO!S!mO!T!nO!U!nO!V!nO!W!nO!X!nO!Y!nO!Z!cO![!oO!]!oO!^!oO!_!oO!r!fO!s!fO~OR!uO]jO#h!sO#i!sO$X#OO$Y#PO$[#QO$`#RO$c#TO$d#SO$q#UO$r#UO$s#UO%b!yO%e!vO&`zO~O&a!}O~P/^O_#WO`#WOa#WOb#WOc#WO~O%o#XO!pgX%bgX~O!p#ZO~O!p#[O%b!ti~O!p#]O%b#yi~O&`#^O~O%e#`O~O&u#aO%g$wX&a$wX~O%g#bO&a#cO~O$x#fO~O%g#gO%h#hO~O%j#kO~O%j#mO~O%e#nO~O%j#oO~O%j#qO~O!p#rO%b&nX~OR#tO#h!sO#i!sO%e!vO~O%e#vO!p&qX#c&qX$e&qX$f&qX$g&qX$h&qX$i&qX$j&qX$k&qX$l&qX$m&qX$n&qX$o&qX$p&qX&Y&qX~O#c#yO&Y#zO!p&pX$e&pX$f&pX$g&pX$h&pX$i&pX$j&pX$k&pX$l&pX$m&pX$n&pX$o&pX$p&pX%h&pX~O!p#}O$e#|O$f#|O$g#|O$h#|O$i#|O$j#|O$k#|O$l#|O$m#|O$n#|O~O$o#wO$p#wO~P5qO%b$OO~O&a$QO~P/^OR$ROX!fOY!fOZ!fOi!eOj!eOk!eOl!eOm!pOn!pOo!pOp!qOq!kOr!pOs!pOt!pOu!pOv!pOw!pOx!pOy!pOz!pO{!pO|!lO}!lO!O!mO!P!mO!Q!mO!R!mO!S!mO!T!nO!U!nO!V!nO!W!nO!X!nO!Y!nO!Z!cO![!oO!]!oO!^!oO!_!oO!r!fO!s!fO!y$dO!z$dO!{$dO!|$dO!}$dO#O$dO#P$dO#Q$dO#R$dO#S$dO#T$dO#U$dO#V$dO#W$dO#X$dO#Y$dO#Z$dO#[$dO#]$dO#^$dO#_$dO#`$dO#b$eO#e$XO#f$XO#g$XO#h$XO#i$XO%e$SO~O%b&cX~P6|O&`$iO~O%e$kO~O%g$mO%m$lO~OR!eOi!eOj!eOk!eOl!eOm!pOn!pOo!pOp!qOq!kOr!pOs!pOt!pOu!pOv!pOw!pOx!pOy!pOz!pO{!pO|!lO}!lO!O!mO!P!mO!Q!mO!R!mO!S!mO!T!nO!U!nO!V!nO!W!nO!X!nO!Y!nO!Z!cO![!oO!]!oO!^!oO!_!oO~O%dRO&a$uORVP~O%dRORVP%h$SP~OR$zO~O&a${OR%Wa~O%g$|O&a${O~O%g#gO%h%OO~O!`%SO!a%SO!b%SO!c%SO!d%SO!e%SO!f%SO!g%SO!h%SO!i%SO!j%SO!k%SO!l%SO!m%SO!n%SO!o%SO~O%h%VO~P,eO#c#yO&Y#zO!p&pa$e&pa$f&pa$g&pa$h&pa$i&pa$j&pa$k&pa$l&pa$m&pa$n&pa$o&pa$p&pa%h&pa~O%h%^O~P6|O%b%_O~O%h%`O~OR%bO~O#c&UX#u&UX#v&UX%b&UX%ehX%e#aX&Y&UX&`&UX%g&UX%h&UX#d&UX&a&UX~O#e&UX#h&UX#i&UX#j&UX#k&UX#l&UX#m&UX#n&UX#o&UX#p&UX#q&UX#r&UX#s&UX#t&UX#w&UX#x&UX~PBoO%e#vO~O#u&TX#v&TX%b&TX&`&TX%g&TX%h&TX#d&TX&a&TX~O#c)SO&Y(|O#e&TX#h&TX#i&TX#j&TX#k&TX#l&TX#m&TX#n&TX#o&TX#p&TX#q&TX#r&TX#s&TX#t&TX#w&TX#x&TX~PDrO#m%hO#n%hO#e&RX#h&RX#j&RX#k&RX#l&RX#o&RX#p&RX#q&RX#r&RX#s&RX#t&RX#u&RX#v&RX%b&RX&`&RX%g&RX%h&RX#d&RX&a&RX~O#i&]X#w&^X#x&_X~PFjO#h%iO#j%iO#k%iO#e&QX#l&QX#u&QX#v&QX%b&QX&`&QX%g&QX%h&QX#d&QX&a&QX~O#o&QX#p&QX#q&QX#r&QX#s&QX#t&QX~PH[O#u&PX#v&PX%b&PX&`&PX%g&PX%h&PX#d&PX&a&PX~O#e%jO#l%jO#o&PX#p&PX#q&PX#r&PX#s&PX#t&PX~PImO#o%kO#p%kO#q%kO#r%kO#s%kO#t%kO#u&OX#v&OX%b&OX&`&OX%g&OX%h&OX#d&OX&a&OX~O#u&ZX#v&[X%b%}X&`%}X%g%}X%h%}X#d%}X&a%}X~O#u%lO~O#v%mO~O#i%nO~O#w%oO~O#x%pO~O&`%sO~O$b%uO&a%vO~P/^O!p%xO~O]jO#h!sO#i!sO$d#SO%e!vO~OR%yO%b%|O~PM^Od&QOe&QOf&QO~OR&RO~O%g&TO&a&UO~O%dRORVP~O%g&YO%h$SX~O%h&]O~O&a&^OR%Wa~O%g&_O~O%g#gO~O%m&`O~O%g&aO~O%g&bO%h&cO~O%g&gO%m&fO~O%g&hO~O%g&iO%h&jO~O#d&mO~O%h&Xa#u&Xa#v&Xa%b&Xa&`&Xa%g&Xa#d&Xa&a&Xa~O#c#yO&Y#zO!p&Xa$e&Xa$f&Xa$g&Xa$h&Xa$i&Xa$j&Xa$k&Xa$l&Xa$m&Xa$n&Xa$o&Xa$p&Xa~P!!YO%h&oO~O$Z'POR&di]&di#h&di#i&di$X&di$Y&di$[&di$`&di$c&di$d&di$q&di$r&di$s&di%b&di%e&di&`&di&a&di$b&di$^&di~O$]'SO$_'TO~O$b%uO&a'UO~P/^O&a'UO~O%e#vO!p&qX#c&qX$e&qX$f&qX$g&qX$h&qX$i&qX$j&qX$k&qX$l&qX$m&qX$n&qX&Y&qX~O%b'ZO~P6|O%b']O~O&a'^O~O%m'_O~O%o#XO~O&a'`OR%Qa%d%Qa~O%g'aO&a'`O~OR%Ra%d%Ra%h$Sa~O%g'cO%h$Sa~O&b'eO&`$UP~OR%OaX%OaY%OaZ%Oai%Oaj%Oak%Oal%Oam%Oan%Oao%Oap%Oaq%Oar%Oas%Oat%Oau%Oav%Oaw%Oax%Oay%Oaz%Oa{%Oa|%Oa}%Oa!O%Oa!P%Oa!Q%Oa!R%Oa!S%Oa!T%Oa!U%Oa!V%Oa!W%Oa!X%Oa!Y%Oa!Z%Oa![%Oa!]%Oa!^%Oa!_%Oa!r%Oa!s%Oa~O%h'hO~P!(`O%g'iO%h'hO~OR'kOX'kOY'kO~OR%PaX%PaY%PaZ%Pai%Paj%Pak%Pal%Pam%Pan%Pao%Pap%Paq%Par%Pas%Pat%Pau%Pav%Paw%Pax%Pay%Paz%Pa{%Pa|%Pa}%Pa!O%Pa!P%Pa!Q%Pa!R%Pa!S%Pa!T%Pa!U%Pa!V%Pa!W%Pa!X%Pa!Y%Pa!Z%Pa![%Pa!]%Pa!^%Pa!_%Pa!r%Pa!s%Pa!y%Pa!z%Pa!{%Pa!|%Pa!}%Pa#O%Pa#P%Pa#Q%Pa#R%Pa#S%Pa#T%Pa#U%Pa#V%Pa#W%Pa#X%Pa#Y%Pa#Z%Pa#[%Pa#]%Pa#^%Pa#_%Pa#`%Pa#b%Pa#e%Pa#f%Pa#g%Pa#h%Pa#i%Pa%e%Pa~O%h'nO~P!+sO%g'oO%h'nO~O%h&Xi#u&Xi#v&Xi%b&Xi&`&Xi%g&Xi#d&Xi&a&Xi~O#c#yO&Y#zO!p&Xi$e&Xi$f&Xi$g&Xi$h&Xi$i&Xi$j&Xi$k&Xi$l&Xi$m&Xi$n&Xi$o&Xi$p&Xi~P!0vO#c)SO&Y(|O#e&Xa#h&Xa#i&Xa#j&Xa#k&Xa#l&Xa#m&Xa#n&Xa#o&Xa#p&Xa#q&Xa#r&Xa#s&Xa#t&Xa#w&Xa#x&Xa~P!!YO#h%iO#j%iO#k%iO#e&Qi#l&Qi#u&Qi#v&Qi%b&Qi&`&Qi%g&Qi%h&Qi#d&Qi&a&Qi~O#o&Qi#p&Qi#q&Qi#r&Qi#s&Qi#t&Qi~P!3qO#e&RX#h&RX#j&RX#k&RX#l&RX#u&RX#v&RX%b&RX&`&RX%g&RX%h&RX#d&RX&a&RX~O#m)PO#n)PO~P!5SO#e)QO#l)QO~PImO%b%}i&`%}i%g%}i%h%}i#d%}i&a%}i~O#u&Zi~P!6cO#v&[i~P!6cO#i&]i~P!6cO#w&^i~P!6cO#x&_i~P!6cO$Y#PO&`zO~O$]'SO$_'TO&a'vO~OX!fOY!fOZ!fO!r!fO!s!fO~O%o'zO~O&a'{O~OR'|O#h!sO#i!sO%e!vO&a&la~O%b(QO~O%b(QO~P6|O&a(TOR%Qa%d%Qa~O%g(UO~OR%Ra%d%Ra%h$Si~O%g(VO~O%dRORVPiVPjVPkVPlVPmVPnVPoVPpVPqVPrVPsVPtVPuVPvVPwVPxVPyVPzVP{VP|VP}VP!OVP!PVP!QVP!RVP!SVP!TVP!UVP!VVP!WVP!XVP!YVP!ZVP![VP!]VP!^VP!_VP~O%m(XO~O%h(YO~P!(`O%g(ZO~O%m([O~O%g(^O%m(]O~O%h(_O~P!+sO%g(`O~O#c)SO&Y(|O#e&Xi#h&Xi#i&Xi#j&Xi#k&Xi#l&Xi#m&Xi#n&Xi#o&Xi#p&Xi#q&Xi#r&Xi#s&Xi#t&Xi#w&Xi#x&Xi~P!0vO%g(dO%o&hX~O%o(gO~O&`(hO~O$o(iO$p(iO~P5qOR'|O#h!sO#i!sO%e!vO&a&li~O%b(kO~O#c#yO&Y#zO~PDrOX%UaY%UaZ%Ua!r%Ua!s%Ua~O%o&ha~P!@OO%g(nO%o&ha~O&`(pO~O$^(rO&a(sO~P/^OR'|O#h!sO#i!sO%e!vO&a&lq~O%m(vO~O%o&hi~P!@OO%g(wO~O$^(rO&a(xO~P/^O$^(rO&a&iX~P/^O%b(zO~O&a(xO~O&a({O~OR&pO~OR(aOi!eOj!eOk!eOl!eOm!pOn!pOo!pOp!qOq!kOr!pOs!pOt!pOu!pOv!pOw!pOx!pOy!pOz!pO{!pO|!lO}!lO!O!mO!P!mO!Q!mO!R!mO!S!mO!T!nO!U!nO!V!nO!W!nO!X!nO!Y!nO!Z!cO![!oO!]!oO!^!oO!_!oO!y$dO!z$dO!{$dO!|$dO!}$dO#O$dO#P$dO#Q$dO#R$dO#S$dO#T$dO#U$dO#V$dO#W$dO#X$dO#Y$dO#Z$dO#[$dO#]$dO#^$dO#_$dO#`$dO#b$eO#e(}O#f(}O#g(}O#h(}O#i(}O%e$SO~P!8PO#d'rO~O%_#jZYX#eRY~",
  goto: "@f&uPP&vPP&z'Q'W'iPPP'uP(SPPPPPPPP(V(fPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP)mPP'QPP)s)|PPPPPPPPPPPPPPPPPPPPPP*kPPPPPPPPPPPPPPPPPPPPPPP'QP+YP+`+c+Y+iP+l+o+u+x,bPPPPPPPP,mPPPPPPPPPPPPPPPPPP&zP,s,yPP-P-V-a-o-u-{.R.X._.i.o.u/WPPPPP/^PP/aP/dPP/jPP/pP/s/yP0SP0a0j0m1f0m1i1i2b3Z4S4V4Y4d5_6V6m7S7i8U9V9t:e:q;cP;u<V<g<w=XPPP=i=r>O>R>[>`>c>R>R>l>o>r?O?a?u@W@]=iT^OQXXOQZeXVOQZeWUOQZeS$r#^$tS$v#`$xR(W'eeSOQTZe#^#`$t$x'eQhUa!rz!|$i$k%t(h(p(qR!RjQ!QjQ!SkQ!TlQ#Y!RR$j#SW!gy#Z#n%U!W$U#O#P#Q#[#r#v#y#}$S$X%]%h%i%j%k%l%m%n%o%p%x%|'](})P)Q)SQ$n#XQ$q#]Q%Q#kQ%W#oQ'm&hR(l(WQ!jyR$o#ZQ$o#[Q%Y#rR'X%x!X$T#O#P#Q#[#r#v#y#}$S$X%]%h%i%j%k%l%m%n%o%p%x%|'](})P)Q)S!X$U#O#P#Q#[#r#v#y#}$S$X%]%h%i%j%k%l%m%n%o%p%x%|'](})P)Q)SXWOQZeR#_!VQ$s#^R&V$tRiUR$y#`Q$w#`R&Z$xR'f&]Q{i^!yz!|$i%t(h(p(qQ%r$gQ'W%uQ's'PR(S'^W!{z!|$i%tV(q(h(p(qQ%w$iR'V%tQu_R#f!^Q!ZsR#d![QQORdQQZOQeQTqZebTOQZe#^#`$t$x'eRgTQ!axR#j!aQ%U#nR&e%UQ%]#vR&l%]Q$t#^R&W$tQ$x#`R&[$xQ!|zS$P!|%tR%t$iQ'R%sR'u'RQ'x'SR(f'xh!tz!v!|$i$k%t'Z(Q(h(k(p(qR#s!tQ![sR#e![RcPR[OXYOQZeQ!`xR#i!aR}jQ#V|R%X#qQ&P$mQ'g&aR(m(^Y!Pjkl!R#SQ&S$rR&X$vQ#l!cQ#p!pR%q$eR#p!q!m!ey#O#P#Q#X#Z#[#]#k#n#o#r#v#y#}$S$X%U%]%h%i%j%k%l%m%n%o%p%x%|&h'](W(})P)Q)SR'l&g!m!by#O#P#Q#X#Z#[#]#k#n#o#r#v#y#}$S$X%U%]%h%i%j%k%l%m%n%o%p%x%|&h'](W(})P)Q)S!m!cy#O#P#Q#X#Z#[#]#k#n#o#r#v#y#}$S$X%U%]%h%i%j%k%l%m%n%o%p%x%|&h'](W(})P)Q)S!m!dy#O#P#Q#X#Z#[#]#k#n#o#r#v#y#}$S$X%U%]%h%i%j%k%l%m%n%o%p%x%|&h'](W(})P)Q)SR#l!dR%R#mS!iy#ZQ%T#nR&d%UW!hy#Z#n%U!W$T#O#P#Q#[#r#v#y#}$S$X%]%h%i%j%k%l%m%n%o%p%x%|'](})P)Q)SQ'w'SR(e'xQ$f#OQ$g#PQ$h#QU$p#[#r%xQ%[#vQ%a#yQ%c#}Q%d$SQ&k%]Q'[%|Q(R']R)O)Sl$^#O#P#Q#[#r#v#y#}$S%]%x%|'])SQ&y%lR&z%mp$]#O#P#Q#[#r#v#y#}$S%]%l%m%x%|'])SR&x%kp$[#O#P#Q#[#r#v#y#}$S%]%l%m%x%|'])SR&w%kp$Z#O#P#Q#[#r#v#y#}$S%]%l%m%x%|'])SQ&t%jQ&v%kR(c)Ql$Y#O#P#Q#[#r#v#y#}$S%]%x%|'])SS%g$X(}S&q%h)PQ&r%iS&s%j)QQ&u%kQ&{%nQ&|%oQ&}%pT)R%l%m!X$W#O#P#Q#[#r#v#y#}$S$X%]%h%i%j%k%l%m%n%o%p%x%|'](})P)Q)S!S$V#O#P#Q#[#r#v#y#}$S$X%]%h%i%j%k%l%m%n%o%p%x%|'])Q)ST(b(})PQ#w!uQ%e$UQ'Y%yR(i'|!W$T#O#P#Q#[#r#v#y#}$S$X%]%h%i%j%k%l%m%n%o%p%x%|'](})P)Q)SR'O%qQ#{!wQ%Z#uS%f$V(bS&n%b&pT'q&m'rm$_#O#P#Q#[#r#v#y#}$S%]%x%|'])Sm$`#O#P#Q#[#r#v#y#}$S%]%x%|'])Sm$a#O#P#Q#[#r#v#y#}$S%]%x%|'])Sm$b#O#P#Q#[#r#v#y#}$S%]%x%|'])Sm$c#O#P#Q#[#r#v#y#}$S%]%x%|'])S_!zz!|$i%t(h(p(q^!yz!|$i%t(h(p(qR's'PR't'P_!yz!|$i%t(h(p(qT'Q%s'RR'y'SQ(t(hQ(y(pR(z(qR&O$kR%}$k^!zz!|$i%t(h(p(qR%{$k^!zz!|$i%t(h(p(qQ%{$kV(O'Z(Q(k^!xz!|$i%t(h(p(qQ#x!vQ%z$kV'}'Z(Q(kh!wz!v!|$i$k%t'Z(Q(h(k(p(qR#u!tV#}!x%z'}Q(P'ZQ(j(QR(u(k",
  nodeNames: "⚠ Program EnableDirective Identifier Directive LocalDeclaration GlobalVariableDeclaration AttributeList Attribute IntLiteral UintLiteral FloatLiteral VariableDeclaration Keyword VariableQualifier Keyword Keyword Keyword Keyword Keyword Keyword Keyword Keyword VariableIdentifier TypeDeclaration Type Type Type Type Type Type Type Type Type Type Type Type Type Type Type Type Type Type Type Type Type Keyword Keyword Keyword Keyword Keyword Type Type Type Type Type Type Keyword Type Type Type Type Type Type Type Type Type Type Type Type Type Type Type Type Type Type Type Type Assign Value Boolean Boolean GlobalConstantDeclaration Keyword Keyword Value Reserved Reserved Reserved Reserved Reserved Reserved Reserved Reserved Reserved Reserved Reserved Reserved Reserved Reserved Reserved Reserved Reserved Reserved Reserved Reserved Reserved Reserved Reserved FunctionCall Keyword LeftBracket RightBracket Sub Bang Tilde Mul And Div Mod Add Left Right Lt Gt Lte Gte Eq Neq OrOr AndAnd Or Xor TypeAliasDeclaration Keyword StructDeclaration Keyword StructBodyDeclaration StructMember FunctionDeclaration FunctionHeader Keyword ParamList Param ReturnType CompoundStatement Statement Keyword Keyword Keyword Keyword Keyword Keyword Keyword Keyword ContinuingStatement Keyword Keyword Keyword AddAssign SubAssign MulAssign DivAssign ModAssign AndAssign XorAssign OrAssign LeftAssign RightAssign Inc Dec Keyword Keyword Keyword ImportDeclaration Keyword ImportDeclarationList ImportDeclarationIdentifier String Keyword",
  maxTerm: 269,
  skippedNodes: [0],
  repeatNodeCount: 13,
  tokenData: "8h~R|X^#{pq#{qr$prs$}uv&vvw'Twx'jxy)^yz)cz{)h{|)u|}*[}!O*a!O!P/T!P!Q/]!Q!R/z!R![1f![!]1z!]!^2X!^!_2^!_!`2}!`!a3[!b!c3{!c!}4Q!}#O4c#P#Q4h#Q#R4m#R#S4Q#T#U4z#U#Y4Q#Y#Z5v#Z#o4Q#o#p7r#p#q7w#q#r8^#r#s8c#y#z#{$f$g#{#BY#BZ#{$IS$I_#{$I|$JO#{$JT$JU#{$KV$KW#{&FU&FV#{~$QY%]~X^#{pq#{#y#z#{$f$g#{#BY#BZ#{$IS$I_#{$I|$JO#{$JT$JU#{$KV$KW#{&FU&FV#{T$uP#fP!_!`$xS$}O#tS~%QVOr$}rs%gs#O$}#O#P%l#P;'S$};'S;=`&p<%lO$}~%lO$x~~%oVOr$}rs&Us#O$}#O#P%l#P;'S$};'S;=`&p<%lO$}~&ZV$x~Or$}rs%gs#O$}#O#P%l#P;'S$};'S;=`&p<%lO$}~&sP;=`<%l$}V&{P#kT!_!`'OQ'TO$iQ~'YQ#iTvw'`!_!`'e~'eO#v~Q'jO$jQ~'mVOw'jwx%gx#O'j#O#P(S#P;'S'j;'S;=`)W<%lO'j~(VVOw'jwx(lx#O'j#O#P(S#P;'S'j;'S;=`)W<%lO'j~(qV$x~Ow'jwx%gx#O'j#O#P(S#P;'S'j;'S;=`)W<%lO'j~)ZP;=`<%l'j~)cO%e~~)hO%h~V)mP#hT!_!`)pQ)uO$gQV)zQ#lT{|*Q!_!`*VQ*VO$oQQ*[O$eQ~*aO%g~~*fU#eT}!O*x!O!P*}!Q!R,Y!R![.h!_!`.y!`!a/OQ*}O$pQX+QP!Q![+TX+YSZX!Q![+T!g!h+f#X#Y+f#Y#Z,TX+iR{|+r}!O+r!Q![+xX+uP!Q![+xX+}QZX!Q![+x#Y#Z,TX,YOZX~,]U!O!P+T!Q![,o!g!h+f!z!{-O#X#Y+f#l#m-OX,rS!O!P+T!Q![,o!g!h+f#X#Y+f~-RS!O!P-_!Q![.P!c!i.P#T#Z.PX-bR!Q![-k!c!i-k#T#Z-kX-pTZX!Q![-k!c!i-k!r!s+f#T#Z-k#d#e+f~.UUX~!O!P-k!Q![.P!c!i.P!r!s+f#T#Z.P#d#e+f~.mSX~!O!P+T!Q![.h!g!h+f#X#Y+fQ/OO$fQQ/TO&bQ_/YP&YU!Q![+T~/bR#jTz{/k!P!Q/p!_!`/u~/pO%`~~/uO%_~Q/zO$hQ~0PVX~!O!P+T!Q![,o!g!h+f!z!{0f#X#Y+f#i#j1a#l#m0f~0iS!O!P-_!Q![0u!c!i0u#T#Z0u~0zVX~!O!P-k!Q![0u!c!i0u!r!s+f#T#Z0u#d#e+f#i#j1a~1fOY~~1kTX~!O!P+T!Q![1f!g!h+f#X#Y+f#i#j1aZ2PP%oY![!]2SP2XO&wP~2^O%b~V2eQ%jP#oS!^!_2k!_!`2xU2pP#mS!_!`2sQ2xO$mQS2}O#qSV3SP!pR!_!`3VS3[O#sSV3cQ%mP#pS!_!`3i!`!a3nS3nO#rSU3sP#nS!_!`3vQ3{O$nQ~4QO%d~X4VSRX!Q![4Q!c!}4Q#R#S4Q#T#o4Q~4hO#c~~4mO#d~V4rP#xT!_!`4uQ4zO$kQZ5PURX!Q![4Q!c!}4Q#R#S4Q#T#g4Q#g#h5c#h#o4QZ5jS&uQRX!Q![4Q!c!}4Q#R#S4Q#T#o4QZ5{URX!Q![4Q!c!}4Q#R#S4Q#T#f4Q#f#g6_#g#o4QZ6dURX!Q![4Q!c!}4Q#R#S4Q#T#c4Q#c#d6v#d#o4QZ6{URX!Q![4Q!c!}4Q#R#S4Q#T#a4Q#a#b7_#b#o4QZ7fS&vQRX!Q![4Q!c!}4Q#R#S4Q#T#o4Q~7wO&`~~7|Q#wT!_!`8S#p#q8XQ8XO$lQ~8^O#u~~8cO&a~~8hO#g~",
  tokenizers: [untilEOLToken, untilCommentCloseToken, 0, 1, 2, 3],
  topRules: {"Program":[0,1]},
  specialized: [{term: 3, get: value => spec_Identifier[value] || -1}],
  tokenPrec: 3873
})
