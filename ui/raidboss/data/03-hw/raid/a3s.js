'use strict';

// TODO: need headmarker for damage down digititis

[{
  zoneRegex: {
    en: /^Alexander - The Arm Of The Father \(Savage\)$/,
    cn: /^亚历山大零式机神城 \(启动之章3\)$/,
  },
  timelineFile: 'a3s.txt',
  timelineTriggers: [
    {
      id: 'A3S Wash Away',
      regex: /Wash Away/,
      beforeSeconds: 5,
      response: Responses.knockback(),
    },
    {
      id: 'A3S Splash',
      regex: /Splash/,
      beforeSeconds: 5,
      response: Responses.aoe(),
    },
    {
      // Note: there's nothing in the log for when the hand turns into an
      // open palm or a fist, so this just warns when to move and not
      // where to go based on time.
      id: 'A3S Hand of Stuff',
      regex: /Hand of Prayer\/Parting/,
      beforeSeconds: 5,
      condition: function(data) {
        return data.role == 'tank' || data.job == 'blu';
      },
      suppressSeconds: 1,
      infoText: {
        en: 'Move Bosses',
        de: 'Bosse bewegen',
        fr: 'Déplacez les boss',
        ja: 'ボス動かして',
        ko: '보스 이동 주차',
        cn: '移动Boss',
      },
    },
  ],
  triggers: [
    {
      id: 'A3S Sluice',
      regex: Regexes.headMarker({ id: '001A' }),
      condition: Conditions.targetIsYou(),
      alertText: {
        en: 'Sluice on YOU',
        de: 'Schleusenöffnung auf DIR',
        fr: 'Eclusage sur Vous',
        cn: '蓝点名',
      },
    },
    {
      id: 'A3S Digititis Tank',
      regex: Regexes.headMarker({ id: '0025' }),
      condition: Conditions.targetIsYou(),
      infoText: {
        en: 'Tank Debuff',
        de: 'Tank Debuff',
        fr: 'Debuff vulnérabilité',
        cn: '坦克 Debuff',
      },
    },
    {
      id: 'A3S Digititis Healer',
      regex: Regexes.headMarker({ id: '0022' }),
      condition: Conditions.targetIsYou(),
      infoText: {
        en: 'Healer Debuff',
        de: 'Heiler Debuff',
        fr: 'Debuff soins',
        cn: '奶妈 Debuff',
      },
    },
    {
      id: 'A3S Digititis Damage',
      regex: Regexes.headMarker({ id: '0024' }),
      condition: Conditions.targetIsYou(),
      infoText: {
        en: 'Damage Debuff',
        de: 'DD Debuff',
        fr: 'Debuff dégats',
        cn: 'DPS Debuff',
      },
    },
    {
      id: 'A3S Equal Concentration',
      regex: Regexes.ability({ source: ['Liquid Limb', 'Living Liquid'], id: 'F09', capture: false }),
      regexDe: Regexes.ability({ source: ['Belebt(?:e|er|es|en) Hand', 'Belebt(?:e|er|es|en) Wasser'], id: 'F09', capture: false }),
      regexFr: Regexes.ability({ source: ['Membre Liquide', 'Liquide Vivant'], id: 'F09', capture: false }),
      regexJa: Regexes.ability({ source: ['リキッドハンド', 'リビングリキッド'], id: 'F09', capture: false }),
      regexCn: Regexes.ability({ source: ['活水之手', '有生命活水'], id: 'F09', capture: false }),
      regexKo: Regexes.ability({ source: ['액체 손', '살아있는 액체'], id: 'F09', capture: false }),
      infoText: {
        en: 'Burn Higher HP Hand',
        de: 'Fokusiere Hand mit mehr HP',
        fr: 'Burn sur la main au PV le plus élevée',
        cn: '转火血多手',
      },
    },
    {
      id: 'A3S Drainage You',
      regex: Regexes.tether({ id: '0005', target: 'Living Liquid' }),
      regexDe: Regexes.tether({ id: '0005', target: 'Belebt(?:e|er|es|en) Wasser' }),
      regexFr: Regexes.tether({ id: '0005', target: 'Liquide Vivant' }),
      regexJa: Regexes.tether({ id: '0005', target: 'リビングリキッド' }),
      regexCn: Regexes.tether({ id: '0005', target: '有生命活水' }),
      regexKo: Regexes.tether({ id: '0005', target: '살아있는 액체' }),
      condition: function(data, matches) {
        return data.source == data.me;
      },
      alertText: {
        en: 'Drainage on YOU',
        de: 'Entwässerung auf DIR',
        fr: 'Drainage sur VOUS',
        cn: '连线点名',
      },
    },
    {
      id: 'A3S Drainage Tank',
      regex: Regexes.tether({ id: '0005', target: 'Living Liquid', capture: false }),
      regexDe: Regexes.tether({ id: '0005', target: 'Belebt(?:e|er|es|en) Wasser', capture: false }),
      regexFr: Regexes.tether({ id: '0005', target: 'Liquide Vivant', capture: false }),
      regexJa: Regexes.tether({ id: '0005', target: 'リビングリキッド', capture: false }),
      regexCn: Regexes.tether({ id: '0005', target: '有生命活水', capture: false }),
      regexKo: Regexes.tether({ id: '0005', target: '살아있는 액체', capture: false }),
      condition: function(data) {
        return data.role == 'tank';
      },
      suppressSeconds: 1,
      infoText: {
        en: 'Get drainage tether',
        de: 'Hole die Entwässerungs-Verbindung',
        fr: 'Prenez un lien drainage',
        cn: '接线',
      },
    },
    {
      id: 'A3S Ferrofluid Tether',
      regex: Regexes.tether({ id: '0026' }),
      run: function(data, matches) {
        data.ferroTether = data.ferroTether || {};
        data.ferroTether[matches.source] = matches.target;
        data.ferroTether[matches.target] = matches.source;
      },
    },
    {
      id: 'A3S Ferrofluid Signs',
      regex: Regexes.headMarker({ id: ['0030', '0031'] }),
      run: function(data, matches) {
        data.ferroMarker = data.ferroMarker || [];
        data.ferroMarker[matches.target] = matches.id;
      },
    },
    {
      // From logs, it appears that tethers, then headmarkers, then starts casting occurs.
      id: 'A3S Ferrofluid',
      regex: Regexes.startsUsing({ source: 'Living Liquid', id: 'F01' }),
      regexDe: Regexes.startsUsing({ source: 'Belebt(?:e|er|es|en) Wasser', id: 'F01' }),
      regexFr: Regexes.startsUsing({ source: 'Liquide Vivant', id: 'F01' }),
      regexJa: Regexes.startsUsing({ source: 'リビングリキッド', id: 'F01' }),
      regexCn: Regexes.startsUsing({ source: '有生命活水', id: 'F01' }),
      regexKo: Regexes.startsUsing({ source: '살아있는 액체', id: 'F01' }),
      alertText: function(data, matches) {
        data.ferroTether = data.ferroTether || {};
        data.ferroMarker = data.ferroMarker || [];
        let partner = data.ferroTether[data.me];
        let marker1 = data.ferroMarker[data.me];
        let marker2 = data.ferroMarker[partner];

        if (!partner || !marker1 || !marker2)
          return matches.ability + ' (???)';

        if (marker1 == marker2) {
          return {
            en: 'Repel: close to ' + data.ShortName(partner),
            de: 'Abstoß: nahe bei ' + data.ShortName(partner),
            fr: 'Répulsion : Rapprochez-vous de ' + data.ShortName(partner),
            cn: '同极：靠近' + data.ShortName(partner),
          };
        }

        return {
          en: 'Attract: away from ' + data.ShortName(partner),
          de: 'Anziehung: weg von ' + data.ShortName(partner),
          fr: 'Attraction : Eloignez-vous de ' + data.ShortName(partner),
          cn: '异极：远离' + data.ShortName(partner),
        };
      },
    },
    {
      id: 'A3S Cascade',
      regex: Regexes.startsUsing({ source: 'Living Liquid', id: 'EFE', capture: false }),
      regexDe: Regexes.startsUsing({ source: 'Belebt(?:e|er|es|en) Wasser', id: 'EFE', capture: false }),
      regexFr: Regexes.startsUsing({ source: 'Liquide Vivant', id: 'EFE', capture: false }),
      regexJa: Regexes.startsUsing({ source: 'リビングリキッド', id: 'EFE', capture: false }),
      regexCn: Regexes.startsUsing({ source: '有生命活水', id: 'EFE', capture: false }),
      regexKo: Regexes.startsUsing({ source: '살아있는 액체', id: 'EFE', capture: false }),
      condition: Conditions.caresAboutAOE(),
      response: Responses.aoe(),
    },
    {
      // aka Liquid Gaol
      id: 'A3S Throttle',
      regex: Regexes.ability({ source: 'Liquid Rage', id: 'F1A' }),
      regexDe: Regexes.ability({ source: 'Levitiert(?:e|er|es|en) Rage', id: 'F1A' }),
      regexFr: Regexes.ability({ source: 'Furie Liquide', id: 'F1A' }),
      regexJa: Regexes.ability({ source: 'リキッドレイジ', id: 'F1A' }),
      regexCn: Regexes.ability({ source: '活水之怒', id: 'F1A' }),
      regexKo: Regexes.ability({ source: '분노한 액체', id: 'F1A' }),
      condition: function(data) {
        return data.CanCleanse();
      },
      alertText: function(data, matches) {
        return {
          en: 'Throttle on ' + data.ShortName(matches.target),
          de: 'Vollgas auf ' + data.ShortName(matches.target),
          fr: 'Geôle liquide sur ' + data.ShortName(matches.target),
          cn: '窒息点' + data.ShortName(matches.target),
        };
      },
    },
    {
      id: 'A3S Fluid Claw',
      regex: Regexes.headMarker({ id: '0010' }),
      alarmText: function(data, matches) {
        if (data.me == matches.target) {
          return {
            en: 'Claw on YOU',
            de: 'Klaue auf DIR',
            fr: 'Griffe sur VOUS',
            cn: '抓奶手点名',
          };
        }
      },
      infoText: function(data, matches) {
        if (data.me != matches.target) {
          return {
            en: 'Claw on ' + data.ShortName(matches.target),
            de: 'Klaue auf ' + data.ShortName(matches.target),
            fr: 'Griffe sur ' + data.ShortName(matches.target),
            cn: '抓奶手点' + data.ShortName(matches.target),
          };
        }
      },
    },
    {
      // aka Pressurize
      id: 'A3S Embolus',
      regex: Regexes.ability({ source: 'Living Liquid', id: 'F1B', capture: false }),
      regexDe: Regexes.ability({ source: 'Belebt(?:e|er|es|en) Wasser', id: 'F1B', capture: false }),
      regexFr: Regexes.ability({ source: 'Liquide Vivant', id: 'F1B', capture: false }),
      regexJa: Regexes.ability({ source: 'リビングリキッド', id: 'F1B', capture: false }),
      regexCn: Regexes.ability({ source: '有生命活水', id: 'F1B', capture: false }),
      regexKo: Regexes.ability({ source: '살아있는 액체', id: 'F1B', capture: false }),
      condition: function(data) {
        return data.role == 'tank' || data.job == 'blu';
      },
      infoText: {
        en: 'Embolus: Move Boss',
        de: 'Pfropfen: Boss bewegen',
        fr: 'Caillot : Déplacez le boss',
        cn: '水球出现：拉走BOSS',
      },
    },
  ],
  timelineReplace: [
    {
      'locale': 'de',
      'replaceSync': {
        'Condensate Demineralizer \\.9': 'Kondensatoranlage 9',
        'Hydrate Core': 'Hydratkern',
        'Liquid Limb': 'belebt(?:e|er|es|en) Hand',
        'Liquid Rage': 'levitiert(?:e|er|es|en) Rage',
        'Living Liquid': 'belebt(?:e|er|es|en) Wasser',
      },
      'replaceText': {
        'Cascade': 'Cascade',
        'Digititis': 'Digititis',
        'Drainage': 'Entwässerung',
        'Embolus': 'Pfropfen',
        'Equal Concentration': 'Isotonie',
        'Ferrofluid': 'Magnet',
        'Fluid Claw': 'Amorphe Klaue',
        'Fluid Strike': 'Flüssiger Schlag',
        'Fluid Swing': 'Flüssiger Schwung',
        'Gear Lubricant': 'Getriebeschmiermittel',
        'Hand Of Pain': 'Qualhand',
        'Hand Of Prayer': 'Betende Hand',
        'Hydromorph': 'Hydromorphose',
        'Magnetism': 'Magnetismus',
        'Piston Lubricant': 'Kolbenschmiermittel',
        'Protean Wave': 'Proteische Welle',
        'Repel': 'Abstoßung',
        'Sluice': 'Schleusenöffnung',
        'Splash': 'Schwall',
        'Throttle': 'Gas geben',
        'Wash Away': 'Wegspülen',
      },
    },
    {
      'locale': 'fr',
      'missingTranslations': true,
      'replaceSync': {
        'Condensate Demineralizer \\.9': 'Grand condensateur GC-9',
        'Hydrate Core': 'noyau d\'hydrate',
        'Liquid Limb': 'membre liquide',
        'Liquid Rage': 'furie liquide',
        'Living Liquid': 'liquide vivant',
      },
      'replaceText': {
        'Cascade': 'Cascade',
        'Digititis': 'Phalangette',
        'Drainage': 'Drainage',
        'Embolus': 'caillot',
        'Equal Concentration': 'Nivellement aqueux',
        'Ferrofluid': 'Ferrofluide',
        'Fluid Claw': 'Griffe fluide',
        'Fluid Strike': 'Frappe fluide',
        'Fluid Swing': 'Coup fluide',
        'Gear Lubricant': 'lubrifiant d\'engrenage',
        'Hand Of Pain': 'Main de douleur',
        'Hand Of Prayer': 'Main de prière',
        'Hydromorph': 'Hydromorphe',
        'Magnetism': 'Magnétisme',
        'Piston Lubricant': 'lubrifiant de piston',
        'Protean Wave': 'Vague inconstante',
        'Repel': 'Répulsion',
        'Sluice': 'Éclusage',
        'Splash': 'Éclaboussement',
        'Throttle': 'Cadence améliorée',
        'Wash Away': 'Lessivage',
      },
    },
    {
      'locale': 'ja',
      'missingTranslations': true,
      'replaceSync': {
        'Condensate Demineralizer \\.9': '第9大型復水器',
        'Hydrate Core': 'ハイドレードコア',
        'Liquid Limb': 'リキッドハンド',
        'Liquid Rage': 'リキッドレイジ',
        'Living Liquid': 'リビングリキッド',
      },
      'replaceText': {
        'Cascade': 'カスケード',
        'Digititis': 'ゆびさき',
        'Drainage': 'ドレナージ',
        'Embolus': 'エンボラス',
        'Equal Concentration': '水量均等化',
        'Ferrofluid': 'マグネット',
        'Fluid Claw': 'フルイドクロー',
        'Fluid Strike': 'フルイドストライク',
        'Fluid Swing': 'フルイドスイング',
        'Gear Lubricant': 'ギアオイル',
        'Hand Of Pain': 'ハンド・オブ・ペイン',
        'Hand Of Prayer': 'ハンド・オブ・プレイヤー',
        'Hydromorph': 'ハイドロモーフ',
        'Magnetism': '磁力',
        'Piston Lubricant': 'ピストンオイル',
        'Protean Wave': 'プロティアンウェイブ',
        'Repel': '反発',
        'Sluice': 'スルース',
        'Splash': 'スプラッシュ',
        'Throttle': 'スロットル',
        'Wash Away': 'ウォッシュアウェイ',
      },
    },
    {
      'locale': 'cn',
      'missingTranslations': true,
      'replaceSync': {
        'Condensate Demineralizer \\.9': '第9大型冷凝器',
        'Hydrate Core': '水合核心',
        'Liquid Limb': '活水之手',
        'Liquid Rage': '活水之怒',
        'Living Liquid': '有生命活水',
      },
      'replaceText': {
        'Cascade': '瀑泻',
        'Digititis': '指尖',
        'Drainage': '排水',
        'Embolus': '栓塞',
        'Equal Concentration': '水量均等化',
        'Ferrofluid': '磁铁',
        'Fluid Claw': '流体之爪',
        'Fluid Strike': '流体强袭',
        'Fluid Swing': '流体摆动',
        'Gear Lubricant': '齿轮润滑剂',
        'Hand Of Pain': '苦痛之手',
        'Hand Of Prayer': '祈祷之手',
        'Hydromorph': '水态转换',
        'Magnetism': '磁力',
        'Piston Lubricant': '活塞润滑剂',
        'Protean Wave': '万变水波',
        'Repel': '相斥',
        'Sluice': '冲洗',
        'Splash': '溅开',
        'Throttle': '轰油起步',
        'Wash Away': '冲净',
      },
    },
    {
      'locale': 'ko',
      'missingTranslations': true,
      'replaceSync': {
        'Condensate Demineralizer \\.9': '제9대형복수기',
        'Hydrate Core': '액화 핵',
        'Liquid Limb': '액체 손',
        'Liquid Rage': '분노한 액체',
        'Living Liquid': '살아있는 액체',
      },
      'replaceText': {
        'Cascade': '캐스케이드',
        'Digititis': '지목',
        'Drainage': '하수로',
        'Embolus': '응고체',
        'Equal Concentration': '수량 균등화',
        'Ferrofluid': '자석',
        'Fluid Claw': '액체 발톱',
        'Fluid Strike': '유체 강타',
        'Fluid Swing': '유체 타격',
        'Gear Lubricant': '기어 윤활유',
        'Hand Of Pain': '고통의 손길',
        'Hand Of Prayer': '기도의 손길',
        'Hydromorph': '액상 변이',
        'Magnetism': '자력',
        'Piston Lubricant': '피스톤 윤활유',
        'Protean Wave': '변화의 물결',
        'Repel': '반발',
        'Sluice': '봇물',
        'Splash': '물장구',
        'Throttle': '고속 주행',
        'Wash Away': '싹쓸이',
      },
    },
  ],
}];
