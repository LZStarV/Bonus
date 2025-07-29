<template>
  <div class="bonus-container">
    <n-flex align="center" justify="space-between">
      <h1>奖金挡位设置模拟器</h1>
      <n-button
          strong
          type="primary"
          icon-placement="right"
          @click="refresh"
          :loading="loading"
      >
        <template #icon>
          <n-icon :component="RefreshSharp" />
        </template>
        点击刷新
      </n-button>
    </n-flex>

    <div class="bonus-controls">
      <div v-if="!isEditPerPersonBonus" class="per-person-bonus">
        <div>人均奖金数：</div>
        <n-skeleton v-if="loading" :width="120" size="small" :sharp="false" />
        <div v-else>{{ perPersonBonus }}</div>
        <n-button
            size="small"
            type="primary"
            @click="isEditPerPersonBonus = true"
            :disabled="loading"
        >
          编辑
        </n-button>
      </div>

      <n-flex v-else size="medium" align="center" gap="small">
        <n-input-number
            :value="perPersonBonus"
            placeholder="人均奖金数"
            :min="1"
            :step="100"
            @update:value="handlePerPersonBonusChange"
            @enter="handlePerPersonComplete"
            :disabled="loading"
        >
          <template #prefix>￥</template>
        </n-input-number>
        <n-button
            size="small"
            type="primary"
            @click="handlePerPersonComplete"
            :loading="loading"
        >
          完成
        </n-button>
      </n-flex>

      <div class="total-bonus">
        总奖金:
        <n-skeleton v-if="loading" :width="100" :sharp="false" inline />
        <span v-else>{{ totalBonus }} 元</span>
      </div>
    </div>

    <n-scrollbar x-scrollable trigger="hover" x-placement="bottom" class="table-scrollbar">

      <n-data-table
          :columns="columns"
          :data="bonusLevels"
          :pagination="false"
          bordered
          striped
          class="bonus-table"
          :row-class-name="rowClassName"
      />
    </n-scrollbar>
  </div>
</template>

<script setup lang="ts">
// TODO: 增加与减少挡位的选项
import { ref, onMounted, h } from 'vue';
import { NDataTable, NInputNumber, NButton, useMessage, NGradientText, NFlex, NScrollbar, NIcon, NSkeleton } from 'naive-ui';
import { RefreshSharp } from '@vicons/ionicons5';
import * as bonusApi from '@/apis/bonusApi';
import type { StageBonusInterface } from '@/types/stageBonus';

const message = useMessage();

// 状态管理
const perPersonBonus = ref<number>(0); // 人均奖金数
const totalBonus = ref<number>(0); // 总金额
const bonusLevels = ref<StageBonusInterface[]>([]); // 奖金挡位数据
const isEditPerPersonBonus = ref<boolean>(false); // 人均奖金编辑状态
const editingIndex = ref<number | null>(null); // 表格行编辑索引
const tempValues = ref<{ peopleSize: number; weight: number } | null>(null); // 编辑前临时数据
const loading = ref<boolean>(false); // 加载状态

// 刷新数据
const refresh = async () => {
  try {
    loading.value = true;
    // 并行请求提升性能
    const [perPerson, total, stageBonus] = await Promise.all([
      bonusApi.getPerPersonBonus(),
      bonusApi.getTotalBonus(),
      bonusApi.getStageBonus()
    ]);
    perPersonBonus.value = perPerson;
    totalBonus.value = total;
    bonusLevels.value = Array.isArray(stageBonus) ? stageBonus : [stageBonus];
    message.success('数据更新成功！');
  } catch (error) {
    message.error(String(error || '数据加载失败'));
    console.error(error);
  } finally {
    loading.value = false;
  }
};

// 编辑行样式
const rowClassName = (row: StageBonusInterface, index: number) => {
  return editingIndex.value === index ? 'editing-row' : '';
};

// 校验正整数
const isPositiveInteger = (value: number): boolean => {
  return Number.isInteger(value) && value > 0;
};

// 校验正数（可带小数）
const isPositiveNumber = (value: number): boolean => {
  return typeof value === 'number' && !isNaN(value) && value > 0;
};

// 人均奖金数变化
const handlePerPersonBonusChange = (value: number) => {
  perPersonBonus.value = value;
};

// 完成人均奖金编辑
const handlePerPersonComplete = async () => {
  if (!isPositiveInteger(perPersonBonus.value)) {
    message.error('人均奖金数必须是正整数，请重新输入');
    return;
  }
  try {
    loading.value = true;
    const msg = await bonusApi.setPerPersonBonus(perPersonBonus.value);
    message.success(msg);
    await refresh(); // 刷新数据确保同步
  } catch (error) {
    message.error(String(error || '保存失败'));
  } finally {
    isEditPerPersonBonus.value = false;
    loading.value = false;
  }
};

// 表格列配置
const columns = [
  {
    title: '挡位',
    key: 'level',
    width: 80,
    ellipsis: { showTitle: true },
    render: (_row: StageBonusInterface, index: number) => {
      return h(NGradientText,
          { type: 'success', size: '16' },
          { default: () => `挡位 ${index + 1}` }
      );
    }
  },
  {
    title: '人数',
    key: 'peopleSize',
    width: 120,
    ellipsis: { showTitle: true },
    render: (row: StageBonusInterface, index: number) => {
      if (editingIndex.value === index) {
        return h(NInputNumber, {
          value: row.peopleSize,
          min: 1,
          step: 1,
          'onUpdate:value': (value: number) => {
            bonusLevels.value[index].peopleSize = value;
          },
          onEnter: () => handleEditComplete(index),
          disabled: loading.value
        });
      }
      return h('span', row.peopleSize);
    }
  },
  {
    title: '权重',
    key: 'weight',
    width: 120,
    ellipsis: { showTitle: true },
    render: (row: StageBonusInterface, index: number) => {
      if (editingIndex.value === index) {
        return h(NInputNumber, {
          value: row.weight,
          min: 0.1,
          step: 0.1,
          precision: 1,
          'onUpdate:value': (value: number) => {
            bonusLevels.value[index].weight = value;
          },
          onEnter: () => handleEditComplete(index),
          disabled: loading.value
        });
      }
      return h('span', row.weight);
    }
  },
  {
    title: '金额',
    key: 'bonus',
    width: 120,
    ellipsis: { showTitle: true },
    render: (row: StageBonusInterface) => {
      return h('span', `${row.bonus.toFixed(2)} 元`);
    }
  },
  {
    title: '操作',
    key: 'action',
    width: 100,
    ellipsis: { showTitle: true },
    render: (row: StageBonusInterface, index: number) => {
      const isOtherRowEditing = editingIndex.value !== null && editingIndex.value !== index;
      const isDisabled = isOtherRowEditing || loading.value;

      if (editingIndex.value === index) {
        return h(NButton, {
          size: 'small',
          type: 'primary',
          onClick: async () => handleEditComplete(index),
          loading: loading.value
        }, { default: () => '完成' });
      }

      return h(NButton, {
        size: 'small',
        type: 'primary',
        onClick: () => {
          tempValues.value = {
            peopleSize: row.peopleSize,
            weight: row.weight
          };
          editingIndex.value = index;
        },
        disabled: isDisabled
      }, { default: () => '修改' });
    }
  }
];

// 完成表格行编辑
const handleEditComplete = async (index: number) => {
  const currentRow = bonusLevels.value[index];

  // 数据校验
  if (!isPositiveInteger(currentRow.peopleSize)) {
    message.error('人数必须是正整数，请重新输入');
    return;
  }
  if (!isPositiveNumber(currentRow.weight)) {
    message.error('权重必须是正数，请重新输入');
    return;
  }

  try {
    loading.value = true;
    // 保存修改
    await Promise.all([
      bonusApi.setStagePeopleSize(index, currentRow.peopleSize),
      bonusApi.setStageWeight(index, currentRow.weight)
    ]);
    message.success('修改已保存');
    await refresh(); // 刷新数据
  } catch (error) {
    message.error(String(error || '修改失败'));
    // 回滚数据
    if (tempValues.value) {
      bonusLevels.value[index] = {
        ...bonusLevels.value[index],
        ...tempValues.value
      };
    }
  } finally {
    editingIndex.value = null;
    loading.value = false;
  }
};

// 初始化加载
onMounted(async () => {
  await refresh();
});
</script>

<style scoped lang="scss">
.bonus-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: $spacing-lg;
  width: 100%;
  box-sizing: border-box;
}

.bonus-controls {
  margin-bottom: $spacing-lg;
  display: flex;
  align-items: center;
  gap: $spacing-lg;
  flex-wrap: wrap;
  padding: $spacing-md;
  background-color: #f5f7fa;
  border-radius: 8px;
}

.per-person-bonus {
  display: flex;
  align-items: center;
  gap: $spacing-xs;
  min-height: 32px; // 防止加载时跳动
}

.total-bonus {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-left: auto;
  min-width: 160px;
  min-height: 32px; // 防止加载时跳动
  display: flex;
  align-items: center;
  gap: 4px;

  @include respond-to(sm) {
    font-size: 16px;
    min-width: auto;
    margin-left: 0;
    margin-top: $spacing-sm;
    width: 100%;
  }
}

.table-scrollbar {
  width: 100%;
  padding: 4px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.bonus-table {
  width: 100%;
  min-width: $table-min-width;

  @include table-column-widths();

  @include respond-to($breakpoint-md) {
    @include table-column-widths(50px, 80px, 80px, 80px, 70px);
  }

  @include respond-to($breakpoint-sm) {
    @include table-column-widths(40px, 70px, 70px, 70px, 60px);
  }
}

@media screen and (max-width: $breakpoint-sm) {
  .skeleton-row {
    .n-skeleton {
      &:nth-child(1) { width: 40px !important; }
      &:nth-child(2) { width: 70px !important; }
      &:nth-child(3) { width: 70px !important; }
      &:nth-child(4) { width: 70px !important; }
      &:nth-child(5) { width: 60px !important; }
    }
  }
}
// 禁用状态样式增强
:deep(.n-button.is-disabled) {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>