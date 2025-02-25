export default function (step) {
  return {
    翡玉法球: {
      check: ({ element }) => element === '水',
      title: '触发蒸发、感电、冰冻或水元素扩散反应后的12秒内，攻击力提高[atkPct]%',
      refine: {
        atkPct: step(20)
      }
    },
    魔导绪论: {
      check: ({ element }) => ['水', '雷'].includes(element),
      title: '对处于水元素或雷元素影响下的敌人，造成的伤害提高[dmg]%',
      refine: {
        dmg: step(12)
      }
    },
    甲级宝珏: {
      title: '击败敌人后攻击力提升[atkPct]%',
      refine: {
        atkPct: step(12, 2)
      }
    },
    黑岩绯玉: {
      title: '击败敌人后，满层攻击力提升[atkPct]%',
      buffCount: 3,
      refine: {
        atkPct: step(12)
      }
    },
    万国诸海图谱: {
      title: '触发元素反应后，满层提高[dmg]%的元素伤害',
      buffCount: 2,
      refine: {
        dmg: step(8)
      }
    },
    宗室秘法录: {
      title: '3层状态下提高暴击率[cpct]%',
      buffCount: 3,
      refine: {
        cpct: step(8)
      }
    },
    匣里日月: {
      title: '普攻提高元素战技与爆发伤害[eDmg]%，元素战技与爆发提高普攻伤害[aDmg]%',
      refine: {
        aDmg: step(20),
        eDmg: step(20),
        qDmg: step(20)
      }
    },
    流浪乐章: {
      title: '咏叹调下全元素伤害提升[dmg]%',
      refine: {
        dmg: step(48, 12)
      }
    },
    暗巷的酒与诗: {
      title: '冲刺后攻击力提升[atkPct]%',
      refine: {
        atkPct: step(20)
      }
    },
    嘟嘟可故事集: {
      title: '普攻提高重击伤害[a2Dmg]%，重击提高攻击力[atkPct]%',
      refine: {
        a2Dmg: step(16),
        atkPct: step(8)
      }
    },
    白辰之环: {
      title: '与雷元素反应后提高元素反应加成[dmg]%',
      refine: {
        dmg: step(10, 2.5)
      }
    },
    证誓之明瞳: {
      title: '施放元素战技后，元素充能效率提升[recharge]%',
      refine: {
        recharge: step(24)
      }
    },
    四风原典: {
      title: '满层获得[dmg]%的元素伤害加成',
      buffCount: 4,
      refine: {
        dmg: step(8)
      }
    },
    天空之卷: {
      title: '元素伤害加成提升[dmg]%',
      refine: {
        dmg: step(12)
      }
    },
    尘世之锁: [{
      title: '护盾强效提升[shield]%',
      refine: {
        shield: step(20)
      }
    }, {
      title: '护盾+满层情况下攻击力提高[atkPct]%',
      buffCount: 10,
      refine: {
        atkPct: step(4),
        shield: step(20)
      }
    }],
    不灭月华: {
      title: '治疗加成提高[_heal]%，普攻伤害增加[aPlus]',
      refine: {
        _heal: step(10, 2.5)
      },
      data: {
        aPlus: ({ attr, calc, refine }) => calc(attr.hp) * step(1, 0.5)[refine] / 100
      }
    },
    神乐之真意: {
      title: '满层提高元素战技伤害[eDmg]%，元素伤害提高[dmg]%',
      refine: {
        eDmg: [12 * 3, 15 * 3, 18 * 3, 21 * 3, 24 * 3],
        dmg: step(12)
      }
    },
    盈满之实: {
      title: '满层提高元素精通[mastery]，攻击力降低25%',
      refine: {
        mastery: step(24 * 5, 3 * 5),
        atkPct: -25
      }
    },
    流浪的晚星: {
      title: '基于元素精通提升攻击力[atkPlus]',
      data: {
        atkPlus: ({ attr, calc, refine }) => step(24)[refine] * calc(attr.mastery) / 100
      }
    },
    千夜浮梦: {
      title: '3个不同元素队友满层，元素伤害提高[dmg]%',
      buffCount: 3,
      refine: {
        dmg: step(10, 4)
      }
    }
  }
}
