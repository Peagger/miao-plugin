import lodash from 'lodash'
import { Format } from '../../components/index.js'
import { attrNameMap, mainAttr, subAttr, attrMap } from '../../resources/meta/artifact/artis-mark.js'

let ArtisMark = {
  formatAttr (ds) {
    if (!ds) {
      return {}
    }
    if (lodash.isArray(ds) && ds[0] && ds[1]) {
      return {
        title: ds[0],
        value: ds[1]
      }
    }
    if (!ds.value) {
      return {}
    }
    return {
      title: ds.title || ds.name || ds.key || ds.id || '',
      value: ds.value || ''
    }
  },

  /**
   * 格式化圣遗物词条
   * @param ds
   * @param markCfg
   * @param isMain
   * @returns {{title: *, value: string}|*[]}
   */
  formatArti (ds, markCfg = false, isMain = false) {
    if (ds[0] && ds[0].title) {
      let ret = []
      let totalUpNum = 0
      let ltArr = []
      lodash.forEach(ds, (d) => {
        let arti = ArtisMark.formatArti(d, markCfg, isMain)
        totalUpNum += arti.upNum
        if (arti.hasLt) {
          ltArr.push(arti)
        }
        ret.push(arti)
        delete arti.hasLt
        delete arti.hasGt
      })
      ltArr = lodash.sortBy(ltArr, 'upNum').reverse()
      for (let arti of ltArr) {
        if (totalUpNum > 9) {
          arti.upNum = arti.upNum - 1
          totalUpNum--
        } else {
          break
        }
      }
      return ret
    }
    let title = ds.title || ds[0]
    let key = ''
    let val = ds.value || ds[1]
    let value = val
    let num = ds.value || ds[1]
    if (!title || title === 'undefined') {
      return {}
    }
    if (/伤害加成/.test(title) && val < 1) {
      val = Format.pct(val * 100)
      num = num * 100
    } else if (/伤害加成|大|暴|充能|治疗/.test(title)) {
      val = Format.pct(val)
    } else {
      val = Format.comma(val, 1)
    }

    if (/元素伤害加成/.test(title)) {
      title = title.replace('元素伤害', '伤')
      key = 'dmg'
    } else if (title === '物理伤害加成') {
      title = '物伤加成'
      key = 'phy'
    }

    key = key || attrNameMap[title]

    let ret = {
      title,
      value: val
    }
    if (!isMain) {
      let incRet = ArtisMark.getIncNum(title, value)
      ret.upNum = incRet.num
      ret.hasGt = incRet.hasGt
      ret.hasLt = incRet.hasLt
    }

    if (markCfg) {
      let mark = markCfg[key] * num
      if (isMain) {
        mark = mark / 4 + 0.01
      }
      ret.mark = Format.comma(mark || 0)
      ret._mark = mark || 0
    }
    return ret
  },

  getIncNum (title, value) {
    let cfg = attrNameMap[title] && attrMap[attrNameMap[title]]
    if (!value || !cfg || !cfg.value || !cfg.valueMin) {
      return { num: 0 }
    }
    let maxNum = Math.min(5, Math.floor((value / cfg.valueMin).toFixed(1) * 1))
    let minNum = Math.max(1, Math.ceil((value / cfg.value).toFixed(1) * 1))
    // 相等时直接返回
    if (maxNum === minNum) {
      return { num: minNum }
    }
    let avg = Math.round(value / (cfg.value + cfg.valueMin) * 2)
    return {
      num: avg,
      hasGt: maxNum > avg,
      hasLt: minNum < avg
    }
  },

  getMarkClass (mark) {
    let pct = mark
    let scoreMap = [['D', 10], ['C', 16.5], ['B', 23.1], ['A', 29.7], ['S', 36.3], ['SS', 42.9], ['SSS', 49.5], ['ACE', 56.1], ['ACE²', 66]]
    for (let idx = 0; idx < scoreMap.length; idx++) {
      if (pct < scoreMap[idx][1]) {
        return scoreMap[idx][0]
      }
    }
  },

  getMark (charCfg, posIdx, mainAttr, subAttr) {
    let ret = 0
    let { mark, maxMark, weight } = charCfg
    let mAttr = ArtisMark.getAttr(mainAttr)

    let fixPct = 1
    if (posIdx >= 3) {
      fixPct = Math.max(0, Math.min(1, (weight[mAttr] || 0) / (maxMark['m' + posIdx])))
      ret += ArtisMark.getAttrMark(mark, mainAttr) / 4
    }

    lodash.forEach(subAttr, (ds) => {
      ret += ArtisMark.getAttrMark(mark, ds)
    })

    return ret * (1 + fixPct) / 2 / maxMark[posIdx] * 66
  },
  getAttr (ds) {
    let title = ds.title || ds[0] || ''
    let attr = attrNameMap[title]
    if (/元素伤害/.test(title)) {
      attr = 'dmg'
    } else if (/物理|物伤/.test(title)) {
      attr = 'phy'
    }
    return attr
  },
  getAttrMark (attrMark, ds) {
    if (!ds) {
      return 0
    }
    let attr = ArtisMark.getAttr(ds)
    if (!attr) {
      return 0
    }
    let val = ds.value || ds[1]
    return (attrMark[attr] || 0) * val
  },
  getMaxMark (attrs) {
    let ret = {}
    for (let idx = 1; idx <= 5; idx++) {
      let totalMark = 0
      let mMark = 0
      let mAttr = ''
      if (idx === 1) {
        mAttr = 'hpPlus'
      } else if (idx === 2) {
        mAttr = 'atkPlus'
      } else if (idx >= 3) {
        mAttr = ArtisMark.getMaxAttr(attrs, mainAttr[idx])[0]
        mMark = attrs[mAttr].fixWeight
        totalMark += attrs[mAttr].fixWeight * 2
      }

      let sAttr = ArtisMark.getMaxAttr(attrs, subAttr, 4, mAttr)
      lodash.forEach(sAttr, (attr, aIdx) => {
        totalMark += attrs[attr].fixWeight * (aIdx === 0 ? 6 : 1)
      })
      ret[idx] = totalMark
      ret['m' + idx] = mMark
    }
    return ret
  },
  getMaxAttr (attrs = {}, list2 = [], maxLen = 1, banAttr = '') {
    let tmp = []
    lodash.forEach(list2, (attr) => {
      if (attr === banAttr) return
      if (!attrs[attr]) return
      tmp.push({ attr, mark: attrs[attr].fixWeight })
    })
    tmp = lodash.sortBy(tmp, 'mark')
    tmp = tmp.reverse()
    let ret = []
    lodash.forEach(tmp, (ds) => ret.push(ds.attr))
    return ret.slice(0, maxLen)
  }
}

export default ArtisMark
