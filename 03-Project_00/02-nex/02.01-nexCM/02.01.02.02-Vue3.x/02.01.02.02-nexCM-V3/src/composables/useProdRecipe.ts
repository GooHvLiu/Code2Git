/**
 * ==========================================
 * useProdRecipe - 配方管理数据
 * ==========================================
 * 迁移自原 Vuex device 模块的 recipeList / getRecipeById。
 * 当前为前端演示数据，待后端配方接口落地后替换为 request。
 *
 * 作者：GooHv
 */
import { ref, computed } from 'vue'
import type { Recipe } from '@/types/production'

/** 演示配方列表（字段对齐灌装产线配方，详见 types/production.ts） */
const RECIPES: Recipe[] = [
  {
    id: 1,
    code: 'RCP-001',
    name: '卡式瓶3.2ml',
    productType: '卡式瓶',
    fillVolume: 3.2,
    // 轴位参数（度 / 脉冲）
    fillAngle: 45,
    suckBackAngle: 15,
    fillAxisInit: 0,
    fillAxisReach: 1200,
    fixAxisInit: 0,
    fixAxisReach: 800,
    fixAxisPreLift: 400,
    stopperAxisInit: 0,
    stopperAxisPrePress: 600,
    stopperAxisReach: 1000,
    // 速度参数（脉冲/s）
    fillAxisInitSpeed: 500,
    fillAxisReachSpeed: 800,
    fixAxisInitSpeed: 400,
    fixAxisReachSpeed: 600,
    fixAxisPreLiftSpeed: 300,
    stopperAxisInitSpeed: 450,
    stopperAxisPrePressSpeed: 350,
    stopperAxisReachSpeed: 550,
    // 延时（ms）与工艺速度（瓶/h）
    fillDelay: 50,
    vacuumDelay: 30,
    fillSpeed: 1200,
    suckBackSpeed: 600,
    // 智能分析
    usageCount: 1256,
    faultRate: 1.2,
    avgQualifiedRate: 98.8,
    lastUsedTime: '2026-08-24 14:30:00',
    isActive: true
  },
  {
    id: 2,
    code: 'RCP-002',
    name: '卡式瓶3.0ml',
    productType: '卡式瓶',
    fillVolume: 3.0,
    fillAngle: 42,
    suckBackAngle: 12,
    fillAxisInit: 0,
    fillAxisReach: 1150,
    fixAxisInit: 0,
    fixAxisReach: 780,
    fixAxisPreLift: 380,
    stopperAxisInit: 0,
    stopperAxisPrePress: 580,
    stopperAxisReach: 980,
    fillAxisInitSpeed: 480,
    fillAxisReachSpeed: 780,
    fixAxisInitSpeed: 380,
    fixAxisReachSpeed: 580,
    fixAxisPreLiftSpeed: 280,
    stopperAxisInitSpeed: 430,
    stopperAxisPrePressSpeed: 330,
    stopperAxisReachSpeed: 530,
    fillDelay: 45,
    vacuumDelay: 28,
    fillSpeed: 1300,
    suckBackSpeed: 650,
    usageCount: 892,
    faultRate: 0.8,
    avgQualifiedRate: 99.1,
    lastUsedTime: '2026-08-23 10:15:00',
    isActive: false
  },
  {
    id: 3,
    code: 'RCP-003',
    name: '预充针2.5ml',
    productType: '预充针',
    fillVolume: 2.5,
    fillAngle: 38,
    suckBackAngle: 10,
    fillAxisInit: 0,
    fillAxisReach: 1050,
    fixAxisInit: 0,
    fixAxisReach: 720,
    fixAxisPreLift: 350,
    stopperAxisInit: 0,
    stopperAxisPrePress: 520,
    stopperAxisReach: 900,
    fillAxisInitSpeed: 450,
    fillAxisReachSpeed: 750,
    fixAxisInitSpeed: 350,
    fixAxisReachSpeed: 550,
    fixAxisPreLiftSpeed: 250,
    stopperAxisInitSpeed: 400,
    stopperAxisPrePressSpeed: 300,
    stopperAxisReachSpeed: 500,
    fillDelay: 40,
    vacuumDelay: 25,
    fillSpeed: 1500,
    suckBackSpeed: 700,
    usageCount: 2341,
    faultRate: 1.5,
    avgQualifiedRate: 98.2,
    lastUsedTime: '2026-08-22 16:45:00',
    isActive: false
  }
]

export function useProdRecipe() {
  /** 配方列表 */
  const recipes = ref<Recipe[]>(RECIPES)

  /** 按 id 查询配方 */
  function getRecipeById(id: number): Recipe | undefined {
    return recipes.value.find((r) => r.id === id)
  }

  /** 当前使用中的配方（无标记时回退第一条） */
  const activeRecipe = computed<Recipe | undefined>(
    () => recipes.value.find((r) => r.isActive) || recipes.value[0]
  )

  return { recipes, activeRecipe, getRecipeById }
}
