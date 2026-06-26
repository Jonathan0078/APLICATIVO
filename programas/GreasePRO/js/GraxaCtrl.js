'use strict';

// ============================================================
// BANCO DE DADOS DE GRAXAS INDUSTRIAIS
// ============================================================
var GREASE_DATABASE = [
    // ════════════════════════════════════════════════════════════════
    // SHELL
    // ════════════════════════════════════════════════════════════════
    { id:1,  brand:'Shell', product:'Alvania EP (LF) 2',            thickener:'Li',    nlgi:2, viscBase:95,   tempMin:-30, tempMax:120, synthetic:false, features:['EP','multi_purpose'],                                color:'#CC0000', desc:'Lítio EP uso geral. Excelente custo-benefício.' },
    { id:2,  brand:'Shell', product:'Alvania EP (LF) 3',            thickener:'Li',    nlgi:3, viscBase:95,   tempMin:-25, tempMax:120, synthetic:false, features:['EP','vertical','high_speed'],                         color:'#CC0000', desc:'Lítio NLGI 3 para eixos verticais e alta rotação.' },
    { id:3,  brand:'Shell', product:'Alvania EP (LF) 1',            thickener:'Li',    nlgi:1, viscBase:95,   tempMin:-30, tempMax:120, synthetic:false, features:['EP','centralized'],                                   color:'#CC0000', desc:'Lítio NLGI 1 para sistemas centralizados.' },
    { id:4,  brand:'Shell', product:'Gadus S2 V100 2',              thickener:'LiX',   nlgi:2, viscBase:100,  tempMin:-20, tempMax:130, synthetic:false, features:['EP','multi_purpose'],                                color:'#CC0000', desc:'Lítio complexo polivalente industrial e automotivo.' },
    { id:5,  brand:'Shell', product:'Gadus S2 V220 2',              thickener:'LiX',   nlgi:2, viscBase:220,  tempMin:-20, tempMax:130, synthetic:false, features:['EP','heavy_load','water_resistant'],                  color:'#CC0000', desc:'Cargas pesadas, construção e agricultura.' },
    { id:6,  brand:'Shell', product:'Gadus S2 V100 3',              thickener:'LiX',   nlgi:3, viscBase:100,  tempMin:-20, tempMax:130, synthetic:false, features:['EP','vertical','high_speed'],                         color:'#CC0000', desc:'Lítio complexo NLGI 3 para altas velocidades.' },
    { id:7,  brand:'Shell', product:'Gadus S2 U1000 2',             thickener:'LiX',   nlgi:2, viscBase:1000, tempMin:-10, tempMax:130, synthetic:false, features:['EP','very_heavy_load'],                               color:'#CC0000', desc:'Cargas extremamente pesadas, baixíssima velocidade.' },
    { id:8,  brand:'Shell', product:'Gadus S2 V220 1',              thickener:'LiX',   nlgi:1, viscBase:220,  tempMin:-20, tempMax:130, synthetic:false, features:['EP','heavy_load','centralized'],                      color:'#CC0000', desc:'NLGI 1 para sistemas centralizados de lubrificação.' },
    { id:9,  brand:'Shell', product:'Gadus S3 V220C 2',             thickener:'CaSulf',nlgi:2, viscBase:220,  tempMin:-20, tempMax:150, synthetic:false, features:['EP','water_resistant','corrosion'],                   color:'#CC0000', desc:'Alta resistência à água. Indicada para ambiente marítimo.' },
    { id:10, brand:'Shell', product:'Gadus S3 V460 2',              thickener:'LiX',   nlgi:2, viscBase:460,  tempMin:-15, tempMax:160, synthetic:false, features:['EP','high_temp','heavy_load','water_resistant'],      color:'#CC0000', desc:'Alta temperatura e carga para siderurgia e mineração.' },
    { id:11, brand:'Shell', product:'Gadus S4 V460 2',              thickener:'CaSulf',nlgi:2, viscBase:460,  tempMin:-15, tempMax:170, synthetic:false, features:['EP','high_temp','very_heavy_load','water_resistant'],  color:'#CC0000', desc:'Sulfonato de cálcio para extrema severidade.' },
    { id:12, brand:'Shell', product:'Gadus S5 U320 2',              thickener:'PU',    nlgi:2, viscBase:100,  tempMin:-30, tempMax:150, synthetic:true,  features:['high_speed','electric_motor','long_life'],             color:'#CC0000', desc:'Polureia sintética para motores elétricos e alta velocidade.' },
    { id:13, brand:'Shell', product:'Gadus S5 V100 2',              thickener:'PU',    nlgi:2, viscBase:100,  tempMin:-40, tempMax:160, synthetic:true,  features:['wide_temp','synthetic','long_life'],                   color:'#CC0000', desc:'Sintética de ampla faixa térmica para aplicações críticas.' },
    { id:14, brand:'Shell', product:'Gadus S5 T100 2',              thickener:'PTFE',  nlgi:2, viscBase:100,  tempMin:-30, tempMax:200, synthetic:true,  features:['high_temp','extreme_temp','synthetic','long_life'],    color:'#CC0000', desc:'Semi-sintética para temperaturas até 200°C.' },
    // ════════════════════════════════════════════════════════════════
    // MOBIL
    // ════════════════════════════════════════════════════════════════
    { id:15, brand:'Mobil', product:'Mobilgrease Special',          thickener:'Li',    nlgi:2, viscBase:100,  tempMin:-30, tempMax:120, synthetic:false, features:['multi_purpose'],                                     color:'#C8102E', desc:'Lítio multipropósito para rolamentos e mancais gerais.' },
    { id:16, brand:'Mobil', product:'Mobilgrease Special 3',        thickener:'Li',    nlgi:3, viscBase:100,  tempMin:-25, tempMax:120, synthetic:false, features:['multi_purpose','vertical','high_speed'],                color:'#C8102E', desc:'Lítio NLGI 3 para alta rotação e eixos verticais.' },
    { id:17, brand:'Mobil', product:'Mobilux EP 2',                 thickener:'Ca',    nlgi:2, viscBase:130,  tempMin:-20, tempMax:90,  synthetic:false, features:['EP','water_resistant'],                               color:'#C8102E', desc:'Cálcio com EP, resistência à água até 90°C.' },
    { id:18, brand:'Mobil', product:'Mobilux EP 1',                 thickener:'Ca',    nlgi:1, viscBase:130,  tempMin:-20, tempMax:90,  synthetic:false, features:['EP','water_resistant','centralized'],                   color:'#C8102E', desc:'NLGI 1 para sistemas centralizados com resistência à água.' },
    { id:19, brand:'Mobil', product:'Mobilux EP 3',                 thickener:'Ca',    nlgi:3, viscBase:130,  tempMin:-20, tempMax:90,  synthetic:false, features:['EP','water_resistant','vertical'],                      color:'#C8102E', desc:'Cálcio NLGI 3 com EP para ambientes úmidos.' },
    { id:20, brand:'Mobil', product:'Mobilgrease XHP 222',          thickener:'LiX',   nlgi:2, viscBase:220,  tempMin:-25, tempMax:150, synthetic:false, features:['EP','water_resistant','anti_wear'],                   color:'#C8102E', desc:'Alta performance geral. Excelente proteção EP e à água.' },
    { id:21, brand:'Mobil', product:'Mobilgrease XHP 222 Special',  thickener:'LiX',   nlgi:2, viscBase:220,  tempMin:-25, tempMax:160, synthetic:false, features:['EP','water_resistant','shock_load'],                  color:'#C8102E', desc:'Cargas de choque e impacto severo. Mineração e construção.' },
    { id:22, brand:'Mobil', product:'Mobilgrease XHP 220',          thickener:'LiX',   nlgi:2, viscBase:220,  tempMin:-25, tempMax:150, synthetic:false, features:['EP','water_resistant','heavy_load'],                    color:'#C8102E', desc:'Versão padrão XHP para cargas pesadas.' },
    { id:23, brand:'Mobil', product:'Mobilgrease XHP 461',          thickener:'LiX',   nlgi:2, viscBase:460,  tempMin:-15, tempMax:170, synthetic:false, features:['EP','high_temp','very_heavy_load','water_resistant'],  color:'#C8102E', desc:'Extrema pressão e temperatura para condições severas.' },
    { id:24, brand:'Mobil', product:'Mobilith SHC 220',             thickener:'LiX',   nlgi:2, viscBase:220,  tempMin:-40, tempMax:177, synthetic:true,  features:['EP','wide_temp','synthetic'],                         color:'#C8102E', desc:'Sintética PAO para temperaturas extremas, -40°C a 177°C.' },
    { id:25, brand:'Mobil', product:'Mobilith SHC 100',             thickener:'LiX',   nlgi:2, viscBase:100,  tempMin:-45, tempMax:160, synthetic:true,  features:['wide_temp','synthetic','long_life'],                   color:'#C8102E', desc:'Sintética PAO de viscosidade média para ampla faixa.' },
    { id:26, brand:'Mobil', product:'Mobilith SHC 460',             thickener:'LiX',   nlgi:2, viscBase:460,  tempMin:-35, tempMax:180, synthetic:true,  features:['EP','high_temp','synthetic','very_heavy_load'],        color:'#C8102E', desc:'Sintética PAO para cargas extremas e alta temperatura.' },
    { id:27, brand:'Mobil', product:'Mobil SHC Polyrex 102 EM',    thickener:'PU',    nlgi:2, viscBase:46,   tempMin:-30, tempMax:180, synthetic:true,  features:['high_speed','electric_motor','long_life'],             color:'#C8102E', desc:'Polureia sintética, referência mundial para motores elétricos.' },
    { id:28, brand:'Mobil', product:'Mobil SHC Polyrex 222 EM',    thickener:'PU',    nlgi:2, viscBase:220,  tempMin:-25, tempMax:180, synthetic:true,  features:['EP','electric_motor','high_temp','long_life'],         color:'#C8102E', desc:'Polureia com EP para motores de alta temperatura.' },
    { id:29, brand:'Mobil', product:'Mobilgrease HP 222',           thickener:'LiX',   nlgi:2, viscBase:320,  tempMin:-20, tempMax:160, synthetic:false, features:['EP','high_temp','heavy_load'],                        color:'#C8102E', desc:'Alta temperatura e carga. Excelente para siderurgia e papel.' },
    { id:30, brand:'Mobil', product:'Mobilgrease FM 222',           thickener:'LiX',   nlgi:2, viscBase:220,  tempMin:-20, tempMax:140, synthetic:false, features:['multi_purpose','corrosion'],                          color:'#C8102E', desc:'Graxa alimentar NSF H1 para indústria alimentícia.' },
    { id:157, brand:'Mobil', product:'Mobilgrease XHP 622',          thickener:'LiX',   nlgi:2, viscBase:220,  tempMin:-20, tempMax:140, synthetic:false, features:['EP','water_resistant','heavy_load'],                   color:'#C8102E', desc:'Graxa de lítio complexo para uso geral, resistência à água e cargas pesadas.' },
    // ════════════════════════════════════════════════════════════════
    // SKF
    // ════════════════════════════════════════════════════════════════
    { id:31, brand:'SKF', product:'LGMT 2',                        thickener:'Li',    nlgi:2, viscBase:100,  tempMin:-30, tempMax:120, synthetic:false, features:['multi_purpose'],                                     color:'#005B99', desc:'Lítio padrão para rolamentos industriais gerais.' },
    { id:32, brand:'SKF', product:'LGMT 3',                        thickener:'Li',    nlgi:3, viscBase:100,  tempMin:-25, tempMax:120, synthetic:false, features:['multi_purpose','vertical'],                           color:'#005B99', desc:'NLGI 3 para eixos verticais e alta velocidade.' },
    { id:33, brand:'SKF', product:'LGMT 2/1',                      thickener:'Li',    nlgi:1, viscBase:100,  tempMin:-30, tempMax:120, synthetic:false, features:['multi_purpose','centralized'],                         color:'#005B99', desc:'NLGI 1 para sistemas centralizados.' },
    { id:34, brand:'SKF', product:'LGEP 2',                        thickener:'LiX',   nlgi:2, viscBase:200,  tempMin:-20, tempMax:140, synthetic:false, features:['EP','heavy_load','shock_load'],                       color:'#005B99', desc:'Alta proteção EP para cargas pesadas e choques.' },
    { id:35, brand:'SKF', product:'LGHB 2',                        thickener:'LiX',   nlgi:2, viscBase:200,  tempMin:-20, tempMax:160, synthetic:false, features:['high_temp','EP'],                                     color:'#005B99', desc:'Alta temperatura contínua até 160°C com proteção EP.' },
    { id:36, brand:'SKF', product:'LGHP 2',                        thickener:'PU',    nlgi:2, viscBase:30,   tempMin:-40, tempMax:150, synthetic:true,  features:['high_speed','electric_motor','long_life','precision'],   color:'#005B99', desc:'Polureia sintética para motores elétricos de alta velocidade.' },
    { id:37, brand:'SKF', product:'LGEM 2',                        thickener:'LiX',   nlgi:2, viscBase:460,  tempMin:-20, tempMax:140, synthetic:false, features:['EP','very_heavy_load','mos2'],                        color:'#005B99', desc:'Com MoS2 para cargas extremas e baixíssima velocidade.' },
    { id:38, brand:'SKF', product:'LGET 2',                        thickener:'PU',    nlgi:2, viscBase:22,   tempMin:-40, tempMax:160, synthetic:true,  features:['high_speed','high_temp','electric_motor'],             color:'#005B99', desc:'Polureia sintética para motores elétricos de alta performance.' },
    { id:39, brand:'SKF', product:'LGLT 2',                        thickener:'Li',    nlgi:2, viscBase:25,   tempMin:-55, tempMax:90,  synthetic:true,  features:['low_temp','synthetic','high_speed'],                   color:'#005B99', desc:'Para operações em temperaturas muito baixas (até -55°C).' },
    { id:40, brand:'SKF', product:'LGWA 2',                        thickener:'LiX',   nlgi:2, viscBase:220,  tempMin:-25, tempMax:180, synthetic:false, features:['EP','high_temp','water_resistant'],                    color:'#005B99', desc:'Alta temperatura e resistência à água. Indicada para aciaria.' },
    { id:41, brand:'SKF', product:'LCES 2',                        thickener:'CaSulf',nlgi:2, viscBase:320,  tempMin:-20, tempMax:160, synthetic:false, features:['EP','water_resistant','shock_load','corrosion'],       color:'#005B99', desc:'Sulfonato para ambientes severos com água e choque.' },
    { id:42, brand:'SKF', product:'LGFB 2',                        thickener:'LiX',   nlgi:2, viscBase:100,  tempMin:-20, tempMax:130, synthetic:false, features:['multi_purpose','corrosion'],                           color:'#005B99', desc:'Graxa alimentar NSF H1 para indústria alimentícia.' },
    { id:43, brand:'SKF', product:'LGHC 2',                        thickener:'LiX',   nlgi:2, viscBase:320,  tempMin:-20, tempMax:180, synthetic:false, features:['high_temp','EP','heavy_load'],                         color:'#005B99', desc:'Alta temperatura contínua até 180°C para fornos.' },
    { id:44, brand:'SKF', product:'LGRT 2',                        thickener:'CaSulf',nlgi:2, viscBase:460,  tempMin:-15, tempMax:170, synthetic:false, features:['EP','water_resistant','very_heavy_load','corrosion'],   color:'#005B99', desc:'Sulfonato para alta carga em condições de umidade severa.' },
    { id:155, brand:'SKF', product:'LGWG 3',                        thickener:'LiX',   nlgi:3, viscBase:300,  tempMin:-20, tempMax:170, synthetic:false, features:['EP', 'high_temp', 'heavy_load'],                   color:'#005B99', desc:'Graxa de lítio complexo para altas cargas e temperaturas em aplicações automotivas e industriais.' },
    // ════════════════════════════════════════════════════════════════
    // CASTROL
    // ════════════════════════════════════════════════════════════════
    { id:45, brand:'Castrol', product:'Molub-Alloy 777',           thickener:'Li',    nlgi:2, viscBase:150,  tempMin:-20, tempMax:130, synthetic:false, features:['multi_purpose','EP'],                                 color:'#00743A', desc:'Lítio para equipamentos industriais gerais.' },
    { id:46, brand:'Castrol', product:'Molub-Alloy 777-1',         thickener:'Li',    nlgi:1, viscBase:150,  tempMin:-20, tempMax:130, synthetic:false, features:['EP','centralized'],                                   color:'#00743A', desc:'NLGI 1 para sistemas centralizados de lubrificação.' },
    { id:47, brand:'Castrol', product:'Molub-Alloy 777 ES',        thickener:'Li',    nlgi:2, viscBase:150,  tempMin:-20, tempMax:130, synthetic:false, features:['EP','shock_load','anti_wear'],                         color:'#00743A', desc:'Lítio com aditivos extras para cargas de choque.' },
    { id:48, brand:'Castrol', product:'Optitemp LG 2',             thickener:'LiX',   nlgi:2, viscBase:100,  tempMin:-30, tempMax:140, synthetic:false, features:['multi_purpose','anti_wear'],                          color:'#00743A', desc:'Lítio complexo premium para uso geral industrial.' },
    { id:49, brand:'Castrol', product:'Optitemp LG 3',             thickener:'LiX',   nlgi:3, viscBase:100,  tempMin:-25, tempMax:140, synthetic:false, features:['multi_purpose','vertical','anti_wear'],                color:'#00743A', desc:'Lítio complexo NLGI 3 para eixos verticais.' },
    { id:50, brand:'Castrol', product:'Optitemp HT 2',             thickener:'LiX',   nlgi:2, viscBase:220,  tempMin:-20, tempMax:170, synthetic:false, features:['EP','high_temp','heavy_load'],                        color:'#00743A', desc:'Alta temperatura (170°C) para estufas e fornos.' },
    { id:51, brand:'Castrol', product:'Optitemp 2 LN 584',         thickener:'LiX',   nlgi:2, viscBase:100,  tempMin:-40, tempMax:150, synthetic:true,  features:['wide_temp','synthetic','long_life'],                   color:'#00743A', desc:'Sintética de ampla faixa para temperaturas extremas.' },
    { id:52, brand:'Castrol', product:'Molub-Alloy 860/220-2 ES',  thickener:'CaSulf',nlgi:2, viscBase:220,  tempMin:-20, tempMax:150, synthetic:false, features:['EP','water_resistant','corrosion','heavy_load'],       color:'#00743A', desc:'Sulfonato de cálcio com alto desempenho EP em ambiente aquoso.' },
    // ════════════════════════════════════════════════════════════════
    // KLÜBER
    // ════════════════════════════════════════════════════════════════
    { id:53, brand:'Klüber', product:'Klüberplex BEM 41-141',      thickener:'LiX',   nlgi:2, viscBase:30,   tempMin:-40, tempMax:140, synthetic:true,  features:['electric_motor','high_speed','long_life','precision'],   color:'#003D99', desc:'Referência para motores elétricos. Vida útil muito longa.' },
    { id:54, brand:'Klüber', product:'Klüberplex BEM 41-132',      thickener:'LiX',   nlgi:1, viscBase:30,   tempMin:-40, tempMax:140, synthetic:true,  features:['electric_motor','high_speed','centralized'],            color:'#003D99', desc:'Versão NLGI 1 para sistemas centralizados.' },
    { id:55, brand:'Klüber', product:'Klübersynth GH 6-220',       thickener:'LiX',   nlgi:2, viscBase:220,  tempMin:-30, tempMax:140, synthetic:true,  features:['EP','synthetic','wide_temp'],                         color:'#003D99', desc:'Sintética EP para cargas pesadas e ampla faixa térmica.' },
    { id:56, brand:'Klüber', product:'Klübersynth GH 6-460',       thickener:'LiX',   nlgi:2, viscBase:460,  tempMin:-25, tempMax:150, synthetic:true,  features:['EP','synthetic','heavy_load','wide_temp'],             color:'#003D99', desc:'Sintética EP de alta viscosidade para cargas extremas.' },
    { id:57, brand:'Klüber', product:'Isoflex NBU 15',             thickener:'Li',    nlgi:1, viscBase:25,   tempMin:-50, tempMax:120, synthetic:true,  features:['high_speed','precision','low_noise'],                  color:'#003D99', desc:'Rolamentos de alta velocidade e precisão. Baixo ruído.' },
    { id:58, brand:'Klüber', product:'Isoflex LDS 18',             thickener:'Li',    nlgi:2, viscBase:18,   tempMin:-50, tempMax:110, synthetic:true,  features:['high_speed','precision','low_noise','synthetic'],      color:'#003D99', desc:'Sintética de baixíssima viscosidade para altíssima rotação.' },
    { id:59, brand:'Klüber', product:'Staburags NBU 8 EP',         thickener:'LiX',   nlgi:2, viscBase:150,  tempMin:-30, tempMax:140, synthetic:true,  features:['EP','vibration','shock_load'],                        color:'#003D99', desc:'Sintética EP para vibrações severas e cargas de choque.' },
    { id:60, brand:'Klüber', product:'Staburags NBU 12',           thickener:'LiX',   nlgi:2, viscBase:150,  tempMin:-25, tempMax:150, synthetic:true,  features:['EP','vibration','high_temp'],                          color:'#003D99', desc:'Sintética para vibração com alta temperatura.' },
    { id:61, brand:'Klüber', product:'Barrierta L 55/2',           thickener:'PTFE',  nlgi:2, viscBase:90,   tempMin:-40, tempMax:260, synthetic:true,  features:['extreme_temp','chemical_resistant','long_life'],       color:'#003D99', desc:'PFPE/PTFE para temperaturas extremas até 260°C.' },
    { id:62, brand:'Klüber', product:'Barrierta L 55/1',           thickener:'PTFE',  nlgi:1, viscBase:90,   tempMin:-40, tempMax:260, synthetic:true,  features:['extreme_temp','chemical_resistant','long_life'],       color:'#003D99', desc:'PFPE NLGI 1 para centralizados em altíssima temperatura.' },
    { id:63, brand:'Klüber', product:'Klüberspeed BF 72-22',       thickener:'Bent',  nlgi:2, viscBase:50,   tempMin:-30, tempMax:220, synthetic:false, features:['high_temp','very_high_temp'],                          color:'#003D99', desc:'Bentonita para temperaturas muito elevadas (até 220°C).' },
    { id:64, brand:'Klüber', product:'Klüberfood NH1 64-2',        thickener:'LiX',   nlgi:2, viscBase:64,   tempMin:-20, tempMax:120, synthetic:false, features:['multi_purpose','corrosion'],                           color:'#003D99', desc:'Graxa alimentar NSF H1 para indústria de alimentos.' },
    { id:65, brand:'Klüber', product:'Unisilk PK 2',               thickener:'Li',    nlgi:2, viscBase:100,  tempMin:-30, tempMax:130, synthetic:true,  features:['high_speed','precision','low_noise','synthetic'],      color:'#003D99', desc:'Sintética de baixo ruído para rolamentos de precisão.' },
    // ════════════════════════════════════════════════════════════════
    // FUCHS
    // ════════════════════════════════════════════════════════════════
    { id:66, brand:'Fuchs', product:'Renolit CX-TF 2',             thickener:'LiX',   nlgi:2, viscBase:180,  tempMin:-25, tempMax:140, synthetic:false, features:['EP','multi_purpose'],                                color:'#EE7203', desc:'Lítio complexo industrial para uso geral e construção.' },
    { id:67, brand:'Fuchs', product:'Renolit CX-TF 1',             thickener:'LiX',   nlgi:1, viscBase:180,  tempMin:-25, tempMax:140, synthetic:false, features:['EP','centralized'],                                   color:'#EE7203', desc:'NLGI 1 para sistemas centralizados de lubrificação.' },
    { id:68, brand:'Fuchs', product:'Renolit CX-TF 3',             thickener:'LiX',   nlgi:3, viscBase:180,  tempMin:-20, tempMax:140, synthetic:false, features:['EP','vertical','high_speed'],                          color:'#EE7203', desc:'Lítio complexo NLGI 3 para altas velocidades.' },
    { id:69, brand:'Fuchs', product:'Renolit FEP 2',               thickener:'PU',    nlgi:2, viscBase:60,   tempMin:-30, tempMax:150, synthetic:true,  features:['electric_motor','high_speed','long_life'],             color:'#EE7203', desc:'Polureia sintética para motores elétricos.' },
    { id:70, brand:'Fuchs', product:'Renolit Duraplex EP 2',       thickener:'LiX',   nlgi:2, viscBase:220,  tempMin:-20, tempMax:160, synthetic:false, features:['EP','high_temp','heavy_load'],                        color:'#EE7203', desc:'Lítio complexo para alta temperatura e carga pesada.' },
    { id:71, brand:'Fuchs', product:'Renolit Duraplex EP 1',       thickener:'LiX',   nlgi:1, viscBase:220,  tempMin:-20, tempMax:160, synthetic:false, features:['EP','high_temp','centralized'],                        color:'#EE7203', desc:'NLGI 1 para centralizados de alta temperatura.' },
    { id:72, brand:'Fuchs', product:'Renolit HMP 2',               thickener:'LiX',   nlgi:2, viscBase:320,  tempMin:-15, tempMax:180, synthetic:false, features:['EP','high_temp','very_heavy_load'],                    color:'#EE7203', desc:'Alta temperatura e carga extrema para siderurgia.' },
    { id:73, brand:'Fuchs', product:'Urethyn EP/2',                thickener:'PU',    nlgi:2, viscBase:100,  tempMin:-30, tempMax:150, synthetic:false, features:['EP','high_speed','long_life'],                         color:'#EE7203', desc:'Polureia com EP para uso geral e alta velocidade.' },
    { id:74, brand:'Fuchs', product:'Urethyn FT/2',                thickener:'PU',    nlgi:2, viscBase:32,   tempMin:-40, tempMax:150, synthetic:true,  features:['high_speed','electric_motor','long_life','precision'],  color:'#EE7203', desc:'Polureia sintética de baixa viscosidade para altíssima rotação.' },
    { id:75, brand:'Fuchs', product:'Renolit Aqua 2',              thickener:'AlX',   nlgi:2, viscBase:150,  tempMin:-20, tempMax:150, synthetic:false, features:['water_resistant','corrosion','EP'],                    color:'#EE7203', desc:'Alumínio complexo com excelente resistência à água.' },
    { id:76, brand:'Fuchs', product:'Renolit UN 2',                thickener:'CaSulf',nlgi:2, viscBase:220,  tempMin:-20, tempMax:160, synthetic:false, features:['EP','water_resistant','corrosion'],                    color:'#EE7203', desc:'Sulfonato de cálcio universal para ambientes úmidos.' },
    // ════════════════════════════════════════════════════════════════
    // TOTALENERGIES
    // ════════════════════════════════════════════════════════════════
    { id:77, brand:'TotalEnergies', product:'Multis EP 2',          thickener:'LiX',   nlgi:2, viscBase:150,  tempMin:-20, tempMax:140, synthetic:false, features:['EP','multi_purpose'],                                color:'#DA1F26', desc:'Lítio complexo polivalente para uso industrial geral.' },
    { id:78, brand:'TotalEnergies', product:'Multis EP 1',          thickener:'LiX',   nlgi:1, viscBase:150,  tempMin:-20, tempMax:140, synthetic:false, features:['EP','centralized'],                                   color:'#DA1F26', desc:'NLGI 1 para sistemas centralizados de lubrificação.' },
    { id:79, brand:'TotalEnergies', product:'Multis EP 3',          thickener:'LiX',   nlgi:3, viscBase:150,  tempMin:-20, tempMax:140, synthetic:false, features:['EP','vertical','high_speed'],                          color:'#DA1F26', desc:'NLGI 3 para alta velocidade com proteção EP.' },
    { id:80, brand:'TotalEnergies', product:'Multis Complex EP 2',  thickener:'LiX',   nlgi:2, viscBase:220,  tempMin:-20, tempMax:160, synthetic:false, features:['EP','high_temp','heavy_load'],                        color:'#DA1F26', desc:'Alta temperatura e proteção EP aprimorada.' },
    { id:81, brand:'TotalEnergies', product:'Multis Complex EP 1',  thickener:'LiX',   nlgi:1, viscBase:220,  tempMin:-20, tempMax:160, synthetic:false, features:['EP','high_temp','centralized'],                        color:'#DA1F26', desc:'NLGI 1 do Complex para centralizados de alta temperatura.' },
    { id:82, brand:'TotalEnergies', product:'Ceran WR 2',           thickener:'CaSulf',nlgi:2, viscBase:460,  tempMin:-15, tempMax:150, synthetic:false, features:['EP','water_resistant','heavy_load'],                  color:'#DA1F26', desc:'Sulfonato de cálcio para alta carga e presença de água.' },
    { id:83, brand:'TotalEnergies', product:'Ceran XM 220',         thickener:'LiX',   nlgi:2, viscBase:220,  tempMin:-25, tempMax:170, synthetic:false, features:['EP','high_temp','long_life'],                          color:'#DA1F26', desc:'Alta temperatura contínua até 170°C para estufas.' },
    { id:84, brand:'TotalEnergies', product:'Ceran COL 2',          thickener:'LiX',   nlgi:2, viscBase:100,  tempMin:-20, tempMax:130, synthetic:false, features:['multi_purpose','corrosion'],                          color:'#DA1F26', desc:'Graxa alimentar NSF H1 para contato incidental.' },
    { id:85, brand:'TotalEnergies', product:'Altis MDS 2',          thickener:'LiX',   nlgi:2, viscBase:220,  tempMin:-20, tempMax:130, synthetic:false, features:['EP','mos2','very_heavy_load'],                        color:'#DA1F26', desc:'Com MoS2 para cargas extremas e baixas velocidades.' },
    { id:86, brand:'TotalEnergies', product:'Altis SH 2',           thickener:'LiX',   nlgi:2, viscBase:320,  tempMin:-15, tempMax:150, synthetic:false, features:['EP','shock_load','very_heavy_load'],                   color:'#DA1F26', desc:'Lítio complexo para choque e cargas muito pesadas.' },
    // ════════════════════════════════════════════════════════════════
    // TEXACO
    // ════════════════════════════════════════════════════════════════
    { id:158, brand:'Texaco', product:'Multifak EP 2',             thickener:'Li',    nlgi:2, viscBase:100,  tempMin:-29, tempMax:121, synthetic:false, features:['EP','multi_purpose'],                                color:'#E4002B', desc:'Graxa de lítio EP para múltiplas aplicações industriais e automotivas.' },
    // ════════════════════════════════════════════════════════════════
    // PETROBRAS
    // ════════════════════════════════════════════════════════════════
    { id:87, brand:'Petrobras', product:'Lubrax Grax EP 0',         thickener:'Li',    nlgi:0, viscBase:100,  tempMin:-20, tempMax:120, synthetic:false, features:['EP','centralized'],                                  color:'#009B3A', desc:'NLGI 0 semissólida para sistemas centralizados.' },
    { id:88, brand:'Petrobras', product:'Lubrax Grax EP 1',         thickener:'Li',    nlgi:1, viscBase:100,  tempMin:-20, tempMax:120, synthetic:false, features:['EP','centralized'],                                  color:'#009B3A', desc:'NLGI 1 para sistemas centralizados de lubrificação.' },
    { id:89, brand:'Petrobras', product:'Lubrax Grax EP 2',         thickener:'Li',    nlgi:2, viscBase:100,  tempMin:-20, tempMax:120, synthetic:false, features:['EP','multi_purpose'],                                color:'#009B3A', desc:'Lítio uso geral com EP. Ampla disponibilidade no Brasil.' },
    { id:90, brand:'Petrobras', product:'Lubrax Grax EP 3',         thickener:'Li',    nlgi:3, viscBase:100,  tempMin:-20, tempMax:120, synthetic:false, features:['EP','vertical','high_speed'],                         color:'#009B3A', desc:'NLGI 3 para rolamentos de alta velocidade e eixos verticais.' },
    { id:91, brand:'Petrobras', product:'Lubrax Platinum Grease X 2', thickener:'LiX', nlgi:2, viscBase:150,  tempMin:-25, tempMax:150, synthetic:false, features:['EP','multi_purpose','high_temp'],                     color:'#009B3A', desc:'Lítio complexo premium para uso industrial exigente.' },
    { id:92, brand:'Petrobras', product:'Lubrax Platinum Grease X 1', thickener:'LiX', nlgi:1, viscBase:150,  tempMin:-25, tempMax:150, synthetic:false, features:['EP','high_temp','centralized'],                        color:'#009B3A', desc:'NLGI 1 do Platinum para centralizados de alta temperatura.' },
    { id:93, brand:'Petrobras', product:'Lubrax Premium Grease PU 2', thickener:'PU',  nlgi:2, viscBase:46,   tempMin:-30, tempMax:150, synthetic:true,  features:['electric_motor','high_speed','long_life'],            color:'#009B3A', desc:'Polureia sintética para motores elétricos.' },
    // ════════════════════════════════════════════════════════════════
    // IPIRANGA
    // ════════════════════════════════════════════════════════════════
    { id:94, brand:'Ipiranga', product:'Ipirax EP 2',               thickener:'Li',    nlgi:2, viscBase:95,   tempMin:-20, tempMax:120, synthetic:false, features:['EP','multi_purpose'],                                color:'#FF6B00', desc:'Lítio EP para rolamentos e mancais gerais.' },
    { id:95, brand:'Ipiranga', product:'Ipirax EP 3',               thickener:'Li',    nlgi:3, viscBase:95,   tempMin:-20, tempMax:120, synthetic:false, features:['EP','vertical','high_speed'],                         color:'#FF6B00', desc:'NLGI 3 para alta velocidade com proteção EP.' },
    { id:96, brand:'Ipiranga', product:'Ipirax EP 1',               thickener:'Li',    nlgi:1, viscBase:95,   tempMin:-20, tempMax:120, synthetic:false, features:['EP','centralized'],                                   color:'#FF6B00', desc:'NLGI 1 para sistemas centralizados.' },
    { id:97, brand:'Ipiranga', product:'Ipirax MP GR-2',            thickener:'Li',    nlgi:2, viscBase:100,  tempMin:-25, tempMax:120, synthetic:false, features:['multi_purpose'],                                     color:'#FF6B00', desc:'Multipropósito de lítio para uso automotivo e industrial.' },
    { id:98, brand:'Ipiranga', product:'Ipirax PU 2',               thickener:'PU',    nlgi:2, viscBase:68,   tempMin:-30, tempMax:150, synthetic:true,  features:['electric_motor','high_speed','long_life'],            color:'#FF6B00', desc:'Polureia sintética para motores elétricos.' },
    { id:99, brand:'Ipiranga', product:'Ipirax Ca 2',               thickener:'Ca',    nlgi:2, viscBase:130,  tempMin:-15, tempMax:90,  synthetic:false, features:['water_resistant','EP'],                                color:'#FF6B00', desc:'Cálcio com resistência à água para ambientes úmidos.' },
    // ════════════════════════════════════════════════════════════════
    // CHEVRON
    // ════════════════════════════════════════════════════════════════
    { id:100, brand:'Chevron', product:'Multifak EP 2',             thickener:'Li',    nlgi:2, viscBase:100,  tempMin:-29, tempMax:121, synthetic:false, features:['EP','multi_purpose'],                                color:'#A01F35', desc:'Lítio EP para uso geral em equipamentos industriais.' },
    { id:101, brand:'Chevron', product:'Multifak EP 1',             thickener:'Li',    nlgi:1, viscBase:100,  tempMin:-29, tempMax:121, synthetic:false, features:['EP','centralized'],                                   color:'#A01F35', desc:'NLGI 1 para sistemas centralizados.' },
    { id:102, brand:'Chevron', product:'Multifak EP 3',             thickener:'Li',    nlgi:3, viscBase:100,  tempMin:-25, tempMax:121, synthetic:false, features:['EP','vertical','high_speed'],                          color:'#A01F35', desc:'NLGI 3 para altas velocidades com EP.' },
    { id:103, brand:'Chevron', product:'SRI NLGI 2',                thickener:'PU',    nlgi:2, viscBase:30,   tempMin:-30, tempMax:150, synthetic:false, features:['electric_motor','high_speed'],                        color:'#A01F35', desc:'Polureia para motores elétricos e alta velocidade.' },
    { id:104, brand:'Chevron', product:'Chevron Black Pearl EP 2',  thickener:'LiX',   nlgi:2, viscBase:220,  tempMin:-20, tempMax:150, synthetic:false, features:['EP','heavy_load','shock_load'],                        color:'#A01F35', desc:'Graxa com grafite para cargas de choque e vibração.' },
    { id:105, brand:'Chevron', product:'Chevron Ultra-Duty EP 2',   thickener:'LiX',   nlgi:2, viscBase:320,  tempMin:-20, tempMax:160, synthetic:false, features:['EP','high_temp','heavy_load','water_resistant'],      color:'#A01F35', desc:'Serviço pesado para condições extremas de carga e temperatura.' },
    // ════════════════════════════════════════════════════════════════
    // NSK
    // ════════════════════════════════════════════════════════════════
    { id:106, brand:'NSK', product:'Grease NS7',                    thickener:'Li',    nlgi:2, viscBase:80,   tempMin:-40, tempMax:120, synthetic:false, features:['multi_purpose','low_noise'],                          color:'#003087', desc:'Lítio para rolamentos NSK, baixo ruído, uso geral.' },
    { id:107, brand:'NSK', product:'Grease NSL',                    thickener:'Li',    nlgi:2, viscBase:100,  tempMin:-30, tempMax:120, synthetic:false, features:['multi_purpose','long_life'],                          color:'#003087', desc:'Lítio de longa vida para rolamentos de médio porte.' },
    { id:108, brand:'NSK', product:'Grease LR3',                    thickener:'LiX',   nlgi:3, viscBase:100,  tempMin:-30, tempMax:150, synthetic:false, features:['high_speed','high_temp','precision'],                  color:'#003087', desc:'Alta velocidade e temperatura, baixo torque de partida.' },
    { id:109, brand:'NSK', product:'Grease PS2',                    thickener:'LiX',   nlgi:2, viscBase:100,  tempMin:-30, tempMax:140, synthetic:false, features:['precision','low_noise','anti_wear'],                    color:'#003087', desc:'Precisão e baixo ruído para rolamentos de alta exatidão.' },
    { id:110, brand:'NSK', product:'Grease LGU',                    thickener:'PU',    nlgi:2, viscBase:30,   tempMin:-40, tempMax:160, synthetic:true,  features:['high_speed','electric_motor','long_life','precision'],  color:'#003087', desc:'Polureia para alta velocidade com lubrificação de longa vida.' },
    { id:111, brand:'NSK', product:'Grease LFS',                    thickener:'CaSulf',nlgi:2, viscBase:220,  tempMin:-20, tempMax:150, synthetic:false, features:['EP','water_resistant','corrosion'],                    color:'#003087', desc:'Sulfonato para ambientes com água e corrosão.' },
    // ════════════════════════════════════════════════════════════════
    // MOLYKOTE
    // ════════════════════════════════════════════════════════════════
    { id:112, brand:'Molykote', product:'Longterm 2 Plus',          thickener:'Li',    nlgi:2, viscBase:80,   tempMin:-45, tempMax:130, synthetic:true,  features:['high_speed','precision','low_noise','synthetic'],       color:'#0055A4', desc:'Sintética de lítio, longa vida, baixo ruído. Alta velocidade.' },
    { id:113, brand:'Molykote', product:'Longterm W2',              thickener:'Li',    nlgi:2, viscBase:80,   tempMin:-40, tempMax:150, synthetic:true,  features:['high_speed','precision','long_life','synthetic'],       color:'#0055A4', desc:'Sintética para altas rotações com estabilidade térmica.' },
    { id:114, brand:'Molykote', product:'BR-2 Plus',                thickener:'Li',    nlgi:2, viscBase:150,  tempMin:-40, tempMax:125, synthetic:true,  features:['multi_purpose','synthetic','EP'],                     color:'#0055A4', desc:'Lítio sintética multipropósito para alta exigência.' },
    { id:115, brand:'Molykote', product:'Paste White P-1000',       thickener:'PTFE',  nlgi:3, viscBase:220,  tempMin:-30, tempMax:260, synthetic:true,  features:['extreme_temp','chemical_resistant','anti_seize'],       color:'#0055A4', desc:'PTFE/pasta para alta temperatura e prevenir gripagem.' },
    { id:116, brand:'Molykote', product:'G-n Plus',                 thickener:'LiX',   nlgi:2, viscBase:220,  tempMin:-30, tempMax:150, synthetic:true,  features:['EP','high_temp','synthetic','long_life'],              color:'#0055A4', desc:'Sintética de alta temperatura para fornos e secadores.' },
    { id:117, brand:'Molykote', product:'Molykote 55',              thickener:'Bent',  nlgi:2, viscBase:150,  tempMin:-20, tempMax:200, synthetic:false, features:['high_temp','very_high_temp','EP'],                     color:'#0055A4', desc:'Bentonita para temperaturas até 200°C em ambientes secos.' },
    { id:118, brand:'Molykote', product:'Molykote 44',              thickener:'LiX',   nlgi:2, viscBase:100,  tempMin:-40, tempMax:150, synthetic:true,  features:['wide_temp','synthetic','long_life'],                   color:'#0055A4', desc:'Sintética de ampla faixa para aplicações de baixa temperatura.' },
    { id:119, brand:'Molykote', product:'Molykote 33',              thickener:'LiX',   nlgi:2, viscBase:30,   tempMin:-50, tempMax:120, synthetic:true,  features:['low_temp','high_speed','synthetic'],                   color:'#0055A4', desc:'Sintética para temperaturas muito baixas e altas velocidades.' },
    // ════════════════════════════════════════════════════════════════
    // ELGIN
    // ════════════════════════════════════════════════════════════════
    { id:120, brand:'Elgin', product:'Graxa Azul EP GR-2',          thickener:'Li',    nlgi:2, viscBase:100,  tempMin:-20, tempMax:120, synthetic:false, features:['EP','multi_purpose'],                                color:'#C41E3A', desc:'Lítio azul EP para uso automotivo e industrial leve.' },
    { id:121, brand:'Elgin', product:'Graxa Azul EP GR-3',          thickener:'Li',    nlgi:3, viscBase:100,  tempMin:-20, tempMax:120, synthetic:false, features:['EP','vertical','high_speed'],                          color:'#C41E3A', desc:'Lítio azul NLGI 3 para altas velocidades.' },
    { id:122, brand:'Elgin', product:'Graxa EP Preta GR-2',         thickener:'Li',    nlgi:2, viscBase:150,  tempMin:-15, tempMax:120, synthetic:false, features:['EP','heavy_load'],                                   color:'#C41E3A', desc:'Graxa EP com aditivos de extrema pressão, uso geral.' },
    { id:123, brand:'Elgin', product:'Graxa Marítima EP 2',         thickener:'AlX',   nlgi:2, viscBase:220,  tempMin:-15, tempMax:150, synthetic:false, features:['EP','water_resistant','corrosion'],                    color:'#C41E3A', desc:'Alumínio complexo com alta resistência à água salgada.' },
    { id:124, brand:'Elgin', product:'Graxa PU 2',                  thickener:'PU',    nlgi:2, viscBase:46,   tempMin:-30, tempMax:150, synthetic:true,  features:['electric_motor','high_speed','long_life'],             color:'#C41E3A', desc:'Polureia sintética para motores elétricos.' },
    { id:125, brand:'Elgin', product:'Graxa LIX 2',                 thickener:'LiX',   nlgi:2, viscBase:220,  tempMin:-20, tempMax:150, synthetic:false, features:['EP','high_temp','heavy_load'],                         color:'#C41E3A', desc:'Lítio complexo para altas temperaturas e cargas pesadas.' },
    // ════════════════════════════════════════════════════════════════
    // ROCCOL
    // ════════════════════════════════════════════════════════════════
    { id:135, brand:'Roccol', product:'Roccol EP 2',               thickener:'Li',    nlgi:2, viscBase:100,  tempMin:-25, tempMax:120, synthetic:false, features:['EP','multi_purpose'],                                color:'#E30613', desc:'Lítio EP multipropósito para rolamentos e mancais.' },
    { id:136, brand:'Roccol', product:'Roccol EP 3',               thickener:'Li',    nlgi:3, viscBase:100,  tempMin:-25, tempMax:120, synthetic:false, features:['EP','vertical','high_speed'],                          color:'#E30613', desc:'Lítio NLGI 3 para alta rotação com EP.' },
    { id:137, brand:'Roccol', product:'Roccol EP 1',               thickener:'Li',    nlgi:1, viscBase:100,  tempMin:-25, tempMax:120, synthetic:false, features:['EP','centralized'],                                   color:'#E30613', desc:'NLGI 1 para sistemas centralizados com EP.' },
    { id:138, brand:'Roccol', product:'Roccol LIX 2',              thickener:'LiX',   nlgi:2, viscBase:220,  tempMin:-20, tempMax:160, synthetic:false, features:['EP','high_temp','heavy_load'],                        color:'#E30613', desc:'Lítio complexo para altas temperaturas e cargas pesadas.' },
    { id:139, brand:'Roccol', product:'Roccol PU 2',               thickener:'PU',    nlgi:2, viscBase:68,   tempMin:-30, tempMax:150, synthetic:true,  features:['electric_motor','high_speed','long_life'],             color:'#E30613', desc:'Polureia sintética para motores elétricos.' },
    { id:140, brand:'Roccol', product:'Roccol CaSulf 2',           thickener:'CaSulf',nlgi:2, viscBase:320,  tempMin:-15, tempMax:160, synthetic:false, features:['EP','water_resistant','corrosion','heavy_load'],       color:'#E30613', desc:'Sulfonato de cálcio para ambientes severos com água.' },
    { id:141, brand:'Roccol', product:'Roccol Ca 2',               thickener:'Ca',    nlgi:2, viscBase:130,  tempMin:-15, tempMax:90,  synthetic:false, features:['water_resistant','EP'],                                color:'#E30613', desc:'Cálcio com EP para ambientes úmidos.' },
    { id:142, brand:'Roccol', product:'Roccol HT 2',               thickener:'Bent',  nlgi:2, viscBase:150,  tempMin:-20, tempMax:220, synthetic:false, features:['high_temp','very_high_temp'],                          color:'#E30613', desc:'Bentonita para temperaturas muito elevadas até 220°C.' },
    { id:143, brand:'Roccol', product:'Roccol Sapphire HT 2',      thickener:'LiX',   nlgi:2, viscBase:220,  tempMin:-20, tempMax:180, synthetic:true,  features:['EP','high_temp','synthetic','long_life'],              color:'#E30613', desc:'Sapphire sintética alta temperatura, referência para altas rotações.' },
    { id:144, brand:'Roccol', product:'Roccol Sapphire EP 2',      thickener:'LiX',   nlgi:2, viscBase:150,  tempMin:-30, tempMax:160, synthetic:true,  features:['EP','synthetic','wide_temp','long_life'],              color:'#E30613', desc:'Sapphire sintética premium com EP para uso geral e precisão.' },
    { id:145, brand:'Roccol', product:'Roccol Sapphire Speed 2',   thickener:'PU',    nlgi:2, viscBase:30,   tempMin:-40, tempMax:150, synthetic:true,  features:['high_speed','electric_motor','long_life','precision'],  color:'#E30613', desc:'Sapphire polureia para motores elétricos de alta velocidade.' },
    { id:146, brand:'Roccol', product:'Roccol MoS2 2',             thickener:'Li',    nlgi:2, viscBase:150,  tempMin:-20, tempMax:120, synthetic:false, features:['EP','mos2','heavy_load'],                             color:'#E30613', desc:'Com MoS2 para cargas extremas e baixas velocidades.' },
    { id:156, brand:'Roccol', product:'Roccol Multi EP 0',         thickener:'LiX',   nlgi:0, viscBase:150,  tempMin:-30, tempMax:140, synthetic:false, features:['EP','centralized','low_temp'],                         color:'#E30613', desc:'Graxa de lítio complexo NLGI 0 para sistemas centralizados e baixas temperaturas.' },
    // ════════════════════════════════════════════════════════════════
    // INTERFLON
    // ════════════════════════════════════════════════════════════════
    { id:147, brand:'Interflon', product:'Interflon Grease MP 2',    thickener:'Li',    nlgi:2, viscBase:100,  tempMin:-30, tempMax:130, synthetic:false, features:['multi_purpose','EP','long_life'],                     color:'#00843D', desc:'Multipropósito com tecnologia MicPol® para lubrificação prolongada.' },
    { id:148, brand:'Interflon', product:'Interflon Grease EP 2',    thickener:'LiX',   nlgi:2, viscBase:220,  tempMin:-25, tempMax:150, synthetic:false, features:['EP','heavy_load','water_resistant'],                  color:'#00843D', desc:'Extrema pressão com MicPol® para cargas pesadas e vibração.' },
    { id:149, brand:'Interflon', product:'Interflon Grease HT 2',    thickener:'PU',    nlgi:2, viscBase:100,  tempMin:-30, tempMax:180, synthetic:true,  features:['high_temp','long_life','electric_motor'],             color:'#00843D', desc:'Alta temperatura com MicPol® para estufas e motores.' },
    { id:150, brand:'Interflon', product:'Interflon Grease HTC 2',   thickener:'CaSulf',nlgi:2, viscBase:460,  tempMin:-15, tempMax:170, synthetic:false, features:['EP','high_temp','water_resistant','heavy_load'],      color:'#00843D', desc:'Alta temperatura e carga com MicPol® para condições severas.' },
    { id:151, brand:'Interflon', product:'Interflon Grease V 2',     thickener:'LiX',   nlgi:2, viscBase:100,  tempMin:-30, tempMax:140, synthetic:true,  features:['vibration','shock_load','EP','synthetic'],            color:'#00843D', desc:'MicPol® sintética para vibração severa e cargas de choque.' },
    { id:152, brand:'Interflon', product:'Interflon Grease L 2',     thickener:'Li',    nlgi:2, viscBase:30,   tempMin:-40, tempMax:130, synthetic:true,  features:['low_temp','high_speed','synthetic','long_life'],      color:'#00843D', desc:'MicPol® sintética de baixa viscosidade para baixas temperaturas.' },
    { id:153, brand:'Interflon', product:'Interflon Food Grease FG 2', thickener:'LiX', nlgi:2, viscBase:100,  tempMin:-20, tempMax:140, synthetic:false, features:['multi_purpose','EP','corrosion'],                     color:'#00843D', desc:'Graxa alimentar NSF H1 com MicPol® para indústria alimentícia.' },
    { id:154, brand:'Interflon', product:'Interflon Grease CF 2',    thickener:'Ca',    nlgi:2, viscBase:130,  tempMin:-15, tempMax:90,  synthetic:false, features:['EP','water_resistant','corrosion'],                     color:'#00843D', desc:'MicPol® com cálcio para ambientes com água e corrosão.' },
];

// ============================================================
// INFORMAÇÕES DOS ESPESSANTES
// ============================================================
var THICKENER_DATA = {
    'Li':     { name:i18n.t('greasepro.thickener.li.name'),                dropPoint:'175–185°C', tempMax:120, water:'Boa',       ep:true,  color:'#2196F3', icon:'fa-solid fa-circle', descr:i18n.t('greasepro.thickener.li.descr') },
    'LiX':    { name:i18n.t('greasepro.thickener.lix.name'),    dropPoint:'>260°C',    tempMax:170, water:'Boa',       ep:true,  color:'#1565C0', icon:'fa-solid fa-diamond', descr:i18n.t('greasepro.thickener.lix.descr') },
    'Ca':     { name:i18n.t('greasepro.thickener.ca.name'),               dropPoint:'85–100°C',  tempMax:80,  water:'Excelente', ep:false, color:'#4CAF50', icon:'fa-solid fa-circle', descr:i18n.t('greasepro.thickener.ca.descr') },
    'CaX':    { name:i18n.t('greasepro.thickener.cax.name'),   dropPoint:'>260°C',    tempMax:150, water:'Excelente', ep:true,  color:'#388E3C', icon:'fa-solid fa-square', descr:i18n.t('greasepro.thickener.cax.descr') },
    'CaSulf': { name:i18n.t('greasepro.thickener.casulf.name'),       dropPoint:'>315°C',    tempMax:160, water:'Superior',  ep:true,  color:'#00796B', icon:'fa-solid fa-square', descr:i18n.t('greasepro.thickener.casulf.descr') },
    'PU':     { name:i18n.t('greasepro.thickener.pu.name'),             dropPoint:'>260°C',    tempMax:160, water:'Boa',       ep:false, color:'#7B1FA2', icon:'fa-solid fa-circle', descr:i18n.t('greasepro.thickener.pu.descr') },
    'AlX':    { name:i18n.t('greasepro.thickener.alx.name'), dropPoint:'>250°C',    tempMax:160, water:'Muito Boa', ep:true,  color:'#F57C00', icon:'fa-solid fa-circle', descr:i18n.t('greasepro.thickener.alx.descr') },
    'Bent':   { name:i18n.t('greasepro.thickener.bent.name'),         dropPoint:'Sem p.g.',  tempMax:250, water:'Moderada',  ep:true,  color:'#795548', icon:'fa-solid fa-circle', descr:i18n.t('greasepro.thickener.bent.descr') },
    'PTFE':   { name:i18n.t('greasepro.thickener.ptfe.name'),             dropPoint:'Sem p.g.',  tempMax:260, water:'Excelente', ep:false, color:'#607D8B', icon:'fa-regular fa-circle', descr:i18n.t('greasepro.thickener.ptfe.descr') },
};

// ============================================================
// MOTOR DE RECOMENDAÇÃO
// ============================================================
function calcularSeletorGraxa() {
    var tempMaxEl  = document.getElementById('sg-tempMax');
    var tempMinEl  = document.getElementById('sg-tempMin');
    var velEl      = document.getElementById('sg-velocidade');
    var cargaEl    = document.getElementById('sg-carga');
    var ambEl      = document.getElementById('sg-ambiente');
    var rolEl      = document.getElementById('sg-rolamento');
    var motorEl    = document.getElementById('sg-motor');
    var centrEl    = document.getElementById('sg-centralizador');
    var precisEl   = document.getElementById('sg-precisao');

    // Novos seletores DN
    var rpmExatoEl = document.getElementById('sg-rpmExato');
    var dEl        = document.getElementById('sg-d');
    var Del        = document.getElementById('sg-D');

    var tempMax = parseFloat(tempMaxEl.value);
    var tempMin = parseFloat(tempMinEl.value);

    if (isNaN(tempMax) || isNaN(tempMin)) {
        alert(i18n.t('grease.graxa.err_temp'));
        return;
    }
    if (tempMax < tempMin) {
        alert(i18n.t('grease.graxa.err_temp_range'));
        return;
    }

    var params = {
        tempMax:    tempMax,
        tempMin:    tempMin,
        velocidade: velEl.value,
        rpmExato:   parseFloat(rpmExatoEl ? rpmExatoEl.value : NaN),
        d:          parseFloat(dEl ? dEl.value : NaN),
        D:          parseFloat(Del ? Del.value : NaN),
        carga:      cargaEl.value,
        ambiente:   ambEl.value,
        rolamento:  rolEl.value,
        motor:      motorEl.checked,
        centralizador: centrEl.checked,
        precisao:   precisEl.checked
    };

    var rec    = gerarRecomendacao(params);
    var graxas = buscarGraxas(rec, params);
    renderizarResultadoSeletor(rec, graxas);
}

function gerarRecomendacao(p) {
    var espessante  = '';
    var espessante2 = '';
    var nlgi        = 2;
    var viscBase    = 100;
    var sintetico   = false;
    var features    = [];
    var just        = [];
    var alertas     = [];

    // ── 1. Espessante por temperatura ──
    if (p.tempMax > 180) {
        espessante  = 'PTFE';
        espessante2 = 'Bent';
        sintetico   = true;
        just.push('Temperatura ' + p.tempMax + '°C: apenas PTFE ou Bentonita resistem a esta faixa. Ponto de gota dos espessantes convencionais é excedido.');
    } else if (p.tempMax > 150) {
        espessante  = 'LiX';
        espessante2 = 'CaSulf';
        just.push('Temperatura ' + p.tempMax + '°C: requer espessante com ponto de gota >260°C. Lítio Complexo ou Sulfonato de Cálcio são os indicados.');
    } else if (p.tempMax > 120) {
        espessante  = 'LiX';
        espessante2 = 'PU';
        just.push('Temperatura ' + p.tempMax + '°C: acima do limite seguro do lítio padrão (120°C). Lítio Complexo ou Poliureia são recomendados.');
    } else {
        espessante  = 'Li';
        espessante2 = 'LiX';
        just.push('Temperatura ' + p.tempMax + '°C dentro da faixa do lítio padrão. Lítio ou Lítio Complexo são adequados.');
    }

    // ── 2. Sobrescrever por condições especiais ──
    if (p.motor) {
        espessante  = 'PU';
        espessante2 = 'LiX';
        features.push('electric_motor');
        features.push('long_life');
        just.push('Motor elétrico: Poliureia é o padrão da indústria por sua longa vida, resistência térmica e baixa segregação de óleo.');
        alertas.push(i18n.t('greasepro.selector.motor_warning'));
    }

    if (p.ambiente === 'agua' || p.ambiente === 'marinho') {
        if (!p.motor) {
            espessante  = 'CaSulf';
            espessante2 = 'AlX';
        }
        features.push('water_resistant');
        features.push('corrosion');
        just.push('Contato intenso com água/ambiente marítimo: Sulfonato de Cálcio oferece resistência superior à lavagem e ótima proteção anticorrosiva.');
    } else if (p.ambiente === 'umido') {
        features.push('water_resistant');
        just.push('Ambiente úmido: priorizar graxa com bons inibidores de corrosão e resistência à água.');
    } else if (p.ambiente === 'quimico') {
        espessante  = 'PTFE';
        espessante2 = 'PU';
        sintetico   = true;
        features.push('chemical_resistant');
        just.push('Ambiente químico agressivo: PTFE é quimicamente inerte e resiste a solventes, ácidos e vapores corrosivos.');
    }

    // Temperatura mínima muito baixa
    if (p.tempMin < -30) {
        sintetico = true;
        just.push('Temperatura mínima ' + p.tempMin + '°C: obrigatório óleo base sintético (PAO ou éster) para manter fluidez e evitar enrijecimento excessivo na partida.');
    }

    // ── 2.5 Salvaguarda por Fator DN (n * dm) ──
    var fatorDN = null;
    if (!isNaN(p.rpmExato) && !isNaN(p.d) && !isNaN(p.D) && p.rpmExato > 0 && p.D > p.d) {
        var dm = (p.d + p.D) / 2;
        fatorDN = Math.round(p.rpmExato * dm);

        if (fatorDN > 500000) {
            sintetico = true;
            if (espessante === 'Li' || espessante === 'Ca') {
                espessante  = 'PU';
                espessante2 = 'LiX';
            }
            just.push('Fator DN Crítico (' + fatorDN.toLocaleString('pt-BR') + ' mm/min): velocidade tangencial extrema. Exige espessante de Poliureia ou Lítio Complexo Sintético para evitar centrifugação e colapso estrutural.');
        } else if (fatorDN > 300000 && espessante === 'Li') {
            espessante  = 'LiX';
            just.push('Fator DN Elevado (' + fatorDN.toLocaleString('pt-BR') + ' mm/min): excede o limite de cisalhamento seguro do sabão de Lítio convencional (~300k). Upgrade automático para Lítio Complexo.');
        } else {
            just.push('Fator DN calculado em ' + fatorDN.toLocaleString('pt-BR') + ' mm/min (dentro da zona de estabilidade mecânica do espessante).');
        }
    }

    // ── 3. Grau NLGI ──
    if (p.centralizador) {
        nlgi = 1;
        just.push('Sistema centralizador de lubrificação: NLGI 1 (ou 00) para garantir fluxo adequado pela tubulação.');
        alertas.push(i18n.t('greasepro.selector.central_warning'));
    } else if (p.velocidade === 'muito_alta') {
        nlgi = 3;
        just.push('Velocidade muito alta (>5000 RPM): NLGI 3 reduz o churning (agitação da graxa) e minimiza o calor gerado no mancal.');
    } else if (p.velocidade === 'alta' && (p.carga === 'pesada' || p.carga === 'choque')) {
        nlgi = 2;
    } else {
        nlgi = 2;
    }

    if (p.ambiente === 'empoeirado' && nlgi < 3) {
        nlgi = Math.min(nlgi + 1, 3);
        just.push('Ambiente empoeirado: grau NLGI mais alto (graxa mais consistente) para melhor vedação contra contaminantes sólidos.');
    }

    if (p.precisao) {
        features.push('precision');
        features.push('low_noise');
        just.push('Rolamento de precisão: selecionar graxa com óleo base homogêneo, baixo ruído e torque de partida reduzido.');
    }

    // ── 4. Viscosidade da base ──
    if (p.velocidade === 'muito_alta') {
        viscBase = p.precisao ? 15 : 32;
        just.push('Altíssima velocidade: viscosidade base baixa (15–46 cSt) reduz calor de agitação e melhora o filme lubrificante em altas rotações.');
    } else if (p.velocidade === 'alta') {
        viscBase = (p.carga === 'pesada' || p.carga === 'choque') ? 68 : 46;
    } else if (p.velocidade === 'media') {
        if (p.carga === 'pesada' || p.carga === 'choque') {
            viscBase = 220;
        } else {
            viscBase = 100;
        }
    } else {
        viscBase = (p.carga === 'pesada' || p.carga === 'choque') ? 460 : 220;
    }

    // Correção por temperatura alta
    if (p.tempMax > 100 && p.velocidade !== 'muito_alta') {
        var corr = Math.round(viscBase * (1 + (p.tempMax - 100) / 100));
        if (corr > viscBase) {
            viscBase = Math.min(corr, 680);
        }
    }

    // ── 5. Features por carga ──
    if (p.carga === 'pesada' || p.carga === 'choque') {
        features.push('EP');
        just.push('Carga pesada/choque: aditivos de Extrema Pressão (EP) são indispensáveis para proteger as superfícies de contato rolante e evitar gripagem.');
    }
    if (p.carga === 'choque') {
        features.push('shock_load');
        just.push('Carga de choque: considerar graxas com MoS2 ou aditivos antidesgaste para proteção adicional nas partidas e impactos.');
    }
    if (p.carga === 'vibracao') {
        features.push('vibration');
        just.push('Vibração severa: selecionar graxa com alta estabilidade mecânica (resistente ao amolecimento) e boa adesividade.');
    }

    // Base sintética por alta temperatura ou alta velocidade
    if (p.tempMax > 150 || p.tempMin < -25 || p.velocidade === 'muito_alta' || p.motor) {
        sintetico = true;
    }

    var viscRange = getViscRange(viscBase);

    return {
        espessante:  espessante,
        espessante2: espessante2,
        nlgi:        nlgi,
        viscBase:    viscBase,
        viscRange:   viscRange,
        sintetico:   sintetico,
        fatorDN:     fatorDN,
        features:    features,
        just:        just,
        alertas:     alertas,
        params:      p
    };
}

function getViscRange(v) {
    if (v <= 22)  return 'ISO 22 (~15–22 cSt a 40°C)';
    if (v <= 32)  return 'ISO 32 (~28–35 cSt a 40°C)';
    if (v <= 46)  return 'ISO 46 (~41–51 cSt a 40°C)';
    if (v <= 68)  return 'ISO 68 (~61–75 cSt a 40°C)';
    if (v <= 100) return 'ISO 100 (~90–110 cSt a 40°C)';
    if (v <= 150) return 'ISO 150 (~135–165 cSt a 40°C)';
    if (v <= 220) return 'ISO 220 (~198–242 cSt a 40°C)';
    if (v <= 320) return 'ISO 320 (~288–352 cSt a 40°C)';
    if (v <= 460) return 'ISO 460 (~414–506 cSt a 40°C)';
    return 'ISO 680+ (>506 cSt a 40°C)';
}

function buscarGraxas(rec, params) {
    var scored = GREASE_DATABASE.map(function(g) {
        var score = 0;

        // Temperatura: crítico — desqualifica se não suportar
        if (params.tempMax > g.tempMax)  score -= 200;
        if (params.tempMin < g.tempMin)  score -= 60;

        // Espessante principal
        if (g.thickener === rec.espessante)  score += 20;
        else if (g.thickener === rec.espessante2) score += 12;
        else score -= 5;

        // NLGI
        if (g.nlgi === rec.nlgi) score += 10;
        else if (Math.abs(g.nlgi - rec.nlgi) === 1) score += 4;
        else score -= 4;

        // Viscosidade (razão)
        var ratio = Math.max(g.viscBase, rec.viscBase) / Math.min(g.viscBase, rec.viscBase);
        if (ratio <= 1.5)  score += 8;
        else if (ratio <= 2.5) score += 3;
        else if (ratio > 4)    score -= 6;

        // Sintético
        if (rec.sintetico && g.synthetic)  score += 6;
        if (!rec.sintetico && !g.synthetic) score += 2;

        // Features
        rec.features.forEach(function(f) {
            if (g.features.indexOf(f) !== -1) score += 4;
        });

        return Object.assign({}, g, { score: score });
    });

    // Filtrar desqualificados
    var valid = scored.filter(function(g) { return g.score > -100; });
    valid.sort(function(a, b) { return b.score - a.score; });

    var primary   = valid.filter(function(g) { return g.thickener === rec.espessante; }).slice(0, 5);
    var secondary = valid.filter(function(g) { return g.thickener === rec.espessante2 && g.thickener !== rec.espessante; }).slice(0, 3);

    return { primary: primary, secondary: secondary };
}

// ============================================================
// RENDERIZAÇÃO DOS RESULTADOS
// ============================================================
function renderizarResultadoSeletor(rec, graxas) {
    var placeholder = document.getElementById('sg-placeholder');
    var result      = document.getElementById('sg-result');
    if (placeholder) placeholder.style.display = 'none';
    if (!result) return;
    result.style.display = 'block';

    var th  = THICKENER_DATA[rec.espessante]  || {};
    var th2 = THICKENER_DATA[rec.espessante2] || {};
    var p   = rec.params;

    // ── Label helpers ──
    var velLabels  = { baixa:i18n.t('greasepro.selector.speed_opt_baixa'), media:i18n.t('greasepro.selector.speed_opt_media'), alta:i18n.t('greasepro.selector.speed_opt_alta'), muito_alta:i18n.t('greasepro.selector.speed_opt_muito_alta') };
    var cargaLbls  = { normal:i18n.t('greasepro.selector.load_opt_normal'), pesada:i18n.t('greasepro.selector.load_opt_pesada'), choque:i18n.t('greasepro.selector.load_opt_choque'), vibracao:i18n.t('greasepro.selector.load_opt_vibracao') };
    var ambLabels  = { normal:i18n.t('greasepro.selector.env_opt_normal'), umido:i18n.t('greasepro.selector.env_opt_umido'), agua:i18n.t('greasepro.selector.env_opt_agua'), empoeirado:i18n.t('greasepro.selector.env_opt_empoeirado'), quimico:i18n.t('greasepro.selector.env_opt_quimico'), marinho:i18n.t('greasepro.selector.env_opt_marinho') };
    var rolLabels  = { esferas:i18n.t('greasepro.selector.bearing_opt_esferas'), cilindrico:i18n.t('greasepro.selector.bearing_opt_cilindrico'), conico:i18n.t('greasepro.selector.bearing_opt_conico'), esferico:i18n.t('greasepro.selector.bearing_opt_esferico'), deslizamento:i18n.t('greasepro.selector.bearing_opt_deslizamento') };

    // ── HTML ──
    var html = '';

    // ─ Alertas ─
    if (rec.alertas.length > 0) {
        html += '<div class="sg-alertas">';
        rec.alertas.forEach(function(a) {
            html += '<div class="sg-alerta">' + a + '</div>';
        });
        html += '</div>';
    }

    // ─ Espessante principal ─
    html += '<div class="sg-section-title"><i class="fa-solid fa-medal"></i> ' + i18n.t('greasepro.selector.espessante_principal') + '</div>';
    html += '<div class="sg-thickener-card" style="border-left:5px solid ' + (th.color||'#666') + '">';
    html += '<div class="sg-th-header">';
    html += '<span class="sg-th-icon" style="color:' + (th.color||'#666') + '"><i class="' + (th.icon||'fa-solid fa-circle') + '"></i></span>';
    html += '<span class="sg-th-name">' + (th.name||rec.espessante) + '</span>';
    html += '<span class="sg-th-badge" style="background:' + (th.color||'#666') + '">' + i18n.t('greasepro.selector.opcao_1') + '</span>';
    html += '</div>';
    html += '<p class="sg-th-desc">' + (th.descr||'') + '</p>';
    html += '<div class="sg-th-specs">';
    html += '<span><strong>' + i18n.t('greasepro.selector.ponto_gota') + ':</strong> ' + (th.dropPoint||'—') + '</span>';
    html += '<span><strong>' + i18n.t('greasepro.selector.temp_max_spec') + ':</strong> ' + (th.tempMax||'—') + '°C</span>';
    html += '<span><strong>' + i18n.t('greasepro.selector.res_agua') + ':</strong> ' + (th.water||'—') + '</span>';
    html += '<span><strong>' + i18n.t('greasepro.selector.compativel_ep') + ':</strong> ' + (th.ep ? i18n.t('greasepro.selector.sim') : i18n.t('greasepro.selector.nao')) + '</span>';
    html += '</div></div>';

    // ─ Alternativo ─
    if (rec.espessante2 && th2.name) {
        html += '<div class="sg-section-title" style="margin-top:10px"><i class="fa-solid fa-repeat"></i> ' + i18n.t('greasepro.selector.espessante_alternativo') + '</div>';
        html += '<div class="sg-thickener-card sg-thickener-alt" style="border-left:5px solid ' + (th2.color||'#aaa') + '">';
        html += '<div class="sg-th-header">';
        html += '<span class="sg-th-icon" style="color:' + (th2.color||'#aaa') + '"><i class="' + (th2.icon||'fa-solid fa-circle') + '"></i></span>';
        html += '<span class="sg-th-name" style="font-size:1em">' + (th2.name||rec.espessante2) + '</span>';
        html += '<span class="sg-th-badge sg-th-badge-alt" style="background:' + (th2.color||'#aaa') + '">' + i18n.t('greasepro.selector.opcao_2') + '</span>';
        html += '</div>';
        html += '<p class="sg-th-desc" style="font-size:0.85em">' + (th2.descr||'') + '</p>';
        html += '</div>';
    }

    // ─ Parâmetros técnicos ─
    html += '<div class="sg-section-title" style="margin-top:14px"><i class="fa-solid fa-table-cells"></i> ' + i18n.t('greasepro.selector.params_tecnicos') + '</div>';
    html += '<div class="sg-result-grid">';
    html += sgItem(i18n.t('greasepro.selector.nlgi'), 'NLGI ' + rec.nlgi);
    html += sgItem(i18n.t('greasepro.selector.visc_base'), rec.viscRange);
    html += sgItem(i18n.t('greasepro.selector.oleo_base'), rec.sintetico ? i18n.t('greasepro.selector.sintetico') : i18n.t('greasepro.selector.mineral'));
    html += sgItem(i18n.t('greasepro.selector.temp_operacao'), p.tempMin + '°C a ' + p.tempMax + '°C');
    if (rec.fatorDN) {
        html += sgItem('Fator DN Real', rec.fatorDN.toLocaleString('pt-BR') + ' mm/min');
    } else {
        html += sgItem(i18n.t('greasepro.selector.velocidade'), velLabels[p.velocidade] || p.velocidade);
    }
    html += sgItem(i18n.t('greasepro.selector.carga'), cargaLbls[p.carga] || p.carga);
    html += sgItem(i18n.t('greasepro.selector.ambiente'), ambLabels[p.ambiente] || p.ambiente);
    html += sgItem(i18n.t('greasepro.selector.rolamento'), rolLabels[p.rolamento] || p.rolamento);
    html += '</div>';

    // ─ Justificativa técnica ─
    html += '<div class="sg-section-title" style="margin-top:14px"><i class="fa-solid fa-lightbulb"></i> ' + i18n.t('greasepro.selector.justificativa') + '</div>';
    html += '<div class="sg-just-box">';
    rec.just.forEach(function(j, i) {
        html += '<div class="sg-just-item"><span class="sg-just-num">' + (i+1) + '</span><span>' + j + '</span></div>';
    });
    html += '</div>';

    // ─ Graxas do banco de dados ─
    html += '<div class="sg-section-title" style="margin-top:14px"><i class="fa-solid fa-industry"></i> ' + i18n.t('greasepro.selector.graxas_indicadas') + '</div>';

    if (graxas.primary.length === 0 && graxas.secondary.length === 0) {
        html += '<p style="color:var(--color-muted);font-style:italic">' + i18n.t('greasepro.selector.nenhuma_graxa') + '</p>';
    } else {
        if (graxas.primary.length > 0) {
            html += '<div class="sg-brand-label"><span class="sg-brand-dot" style="background:' + (th.color||'#666') + '"></span> ' + i18n.t('greasepro.selector.espessante_principal_label') + ' — ' + (th.name||rec.espessante) + '</div>';
            html += '<div class="sg-grease-grid">';
            graxas.primary.forEach(function(g) {
                html += buildGreaseCard(g);
            });
            html += '</div>';
        }
        if (graxas.secondary.length > 0) {
            html += '<div class="sg-brand-label" style="margin-top:12px"><span class="sg-brand-dot" style="background:' + (th2.color||'#aaa') + '"></span> ' + i18n.t('greasepro.selector.alternativo_label') + ' — ' + (th2.name||rec.espessante2) + '</div>';
            html += '<div class="sg-grease-grid">';
            graxas.secondary.forEach(function(g) {
                html += buildGreaseCard(g);
            });
            html += '</div>';
        }
    }

    result.innerHTML = html;
}

function sgItem(label, value) {
    return '<div class="sg-result-item"><span class="sg-label">' + label + '</span><span class="sg-value">' + value + '</span></div>';
}

function buildGreaseCard(g) {
    var tags = '';
    var tagMap = { EP:i18n.t('greasepro.selector.tag_ep'), multi_purpose:i18n.t('greasepro.selector.tag_multiuso'), water_resistant:i18n.t('greasepro.selector.tag_res_agua'), high_temp:i18n.t('greasepro.selector.tag_alta_temp'), high_speed:i18n.t('greasepro.selector.tag_alta_vel'), electric_motor:i18n.t('greasepro.selector.tag_motor_el'), long_life:i18n.t('greasepro.selector.tag_longa_vida'), heavy_load:i18n.t('greasepro.selector.tag_carga_pes'), shock_load:i18n.t('greasepro.selector.tag_choque'), very_heavy_load:i18n.t('greasepro.selector.tag_c_extrema'), synthetic:i18n.t('greasepro.selector.tag_sintetica'), mos2:i18n.t('greasepro.selector.tag_mos2'), vibration:i18n.t('greasepro.selector.tag_vibracao'), precision:i18n.t('greasepro.selector.tag_precisao'), low_noise:i18n.t('greasepro.selector.tag_baixo_ruido'), corrosion:i18n.t('greasepro.selector.tag_anticor'), centralized:i18n.t('greasepro.selector.tag_centr'), wide_temp:i18n.t('greasepro.selector.tag_amp_temp'), chemical_resistant:i18n.t('greasepro.selector.tag_res_quim'), extreme_temp:i18n.t('greasepro.selector.tag_t_extrema'), very_high_temp:i18n.t('greasepro.selector.tag_mui_alta_t') };
    g.features.slice(0, 4).forEach(function(f) {
        if (tagMap[f]) tags += '<span class="sg-tag">' + tagMap[f] + '</span>';
    });

    return '<div class="sg-grease-card">' +
        '<div class="sg-grease-header">' +
            '<span class="sg-brand-badge" style="background:' + (g.color||'#555') + '">' + g.brand + '</span>' +
            '<span class="sg-th-pill">' + (THICKENER_DATA[g.thickener] ? '<i class="' + THICKENER_DATA[g.thickener].icon + '" style="font-size:0.75em"></i>' : '') + ' ' + g.thickener + ' · NLGI ' + g.nlgi + '</span>' +
        '</div>' +
        '<div class="sg-product-name">' + g.product + '</div>' +
        '<div class="sg-product-desc">' + (g.desc||g.description||'') + '</div>' +
        '<div class="sg-specs-row">' +
            '<span><i class="fa-solid fa-temperature-half"></i> ' + g.tempMin + '°C a ' + g.tempMax + '°C</span>' +
            '<span><i class="fa-solid fa-droplet"></i> ' + g.viscBase + ' cSt</span>' +
            (g.synthetic ? '<span><i class="fa-solid fa-flask"></i> ' + i18n.t('greasepro.selector.sintetica') + '</span>' : '') +
        '</div>' +
        '<div class="sg-tags">' + tags + '</div>' +
    '</div>';
}

function limparSeletorGraxa() {
    var fields = ['sg-tempMax','sg-tempMin','sg-rpmExato','sg-d','sg-D'];
    fields.forEach(function(id) {
        var el = document.getElementById(id);
        if (el) el.value = '';
    });
    var selects = ['sg-velocidade','sg-carga','sg-ambiente','sg-rolamento'];
    selects.forEach(function(id) {
        var el = document.getElementById(id);
        if (el) el.selectedIndex = 0;
    });
    var checks = ['sg-motor','sg-centralizador','sg-precisao'];
    checks.forEach(function(id) {
        var el = document.getElementById(id);
        if (el) el.checked = false;
    });
    var placeholder = document.getElementById('sg-placeholder');
    var result      = document.getElementById('sg-result');
    if (placeholder) placeholder.style.display = 'flex';
    if (result) { result.style.display = 'none'; result.innerHTML = ''; }
}

// ============================================================
// CATÁLOGO DE GRAXAS
// ============================================================
function openGreaseCatalog() {
    var modal = document.getElementById('catalog-modal');
    var body = document.getElementById('catalog-body');
    if (modal && body) {
        body.innerHTML = '<div class="catalog-search"><i class="fas fa-search"></i><input type="text" id="catalog-search-input" placeholder="Pesquisar por nome, marca, espessante, NLGI..." oninput="filterCatalog(this.value)"></div><div id="catalog-grid">' + buildCatalogHTML() + '</div>';
        modal.style.display = 'flex';
        setTimeout(function() {
            var inp = document.getElementById('catalog-search-input');
            if (inp) inp.focus();
        }, 200);
    }
}

function filterCatalog(value) {
    var grid = document.getElementById('catalog-grid');
    if (grid) grid.innerHTML = buildCatalogHTML(value);
}

function toggleBrand(el) {
    var grid = el.nextElementSibling;
    var icon = el.querySelector('.fa-chevron-down');
    if (grid) {
        var isHidden = grid.style.display === 'none';
        grid.style.display = isHidden ? 'grid' : 'none';
        if (icon) icon.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
    }
}

function closeGreaseCatalog() {
    var modal = document.getElementById('catalog-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function buildCatalogHTML(searchTerm) {
    var brands = {};
    var term = searchTerm ? searchTerm.toLowerCase().trim() : '';
    GREASE_DATABASE.forEach(function(g) {
        if (term) {
            var match = g.product.toLowerCase().indexOf(term) !== -1 ||
                        g.brand.toLowerCase().indexOf(term) !== -1 ||
                        (g.desc && g.desc.toLowerCase().indexOf(term) !== -1) ||
                        (g.thickener && g.thickener.toLowerCase().indexOf(term) !== -1) ||
                        String(g.nlgi).indexOf(term) !== -1;
            if (!match) return;
        }
        if (!brands[g.brand]) {
            brands[g.brand] = [];
        }
        brands[g.brand].push(g);
    });

    var sortedBrands = Object.keys(brands).sort();

    var html = '';
    sortedBrands.forEach(function(brandName) {
        var brandGreases = brands[brandName];
        html += '<div class="sg-section-title" onclick="toggleBrand(this)" style="margin-top:14px;cursor:pointer"><span class="sg-brand-dot" style="background:' + (brandGreases[0].color || '#666') + '"></span>' + brandName + ' <i class="fas fa-chevron-down" style="margin-left:auto;transition:transform 0.2s"></i></div>';
        html += '<div class="sg-grease-grid" style="display:' + (term ? 'grid' : 'none') + '">';
        brandGreases.forEach(function(g) {
            html += buildGreaseCard(g);
        });
        html += '</div>';
    });

    return html;
}
