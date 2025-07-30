<template>
  <div class="bonus-container">
    <n-flex align="center" justify="space-between" style="margin-bottom: 15px">
      <h1>奖金挡位设置模拟器</h1>
      <n-flex gap="small">
        <n-button
            strong
            type="primary"
            @click="handleAddLevel"
            :disabled="loading || isAdding"
        >
          新增挡位
        </n-button>
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
    </n-flex>

    <div class="bonus-controls">
      <div class="per-person-bonus">
        <div>总人数：</div>
        <n-skeleton v-if="loading" :width="120" size="small" :sharp="false" />
        <n-tag v-else type="info">{{ totalPersonSize }}</n-tag>
      </div>
      <div v-if="!isEditPerPersonBonus" class="per-person-bonus">
        <div>人均奖金数：</div>
        <n-skeleton v-if="loading" :width="120" size="small" :sharp="false" />
        <n-tag v-else type="success">{{ perPersonBonus }}</n-tag>
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
        <n-tag v-else type="error">{{ totalBonus }} 元</n-tag>
      </div>
    </div>

    <n-scrollbar x-scrollable trigger="hover" x-placement="bottom" class="table-scrollbar">
      <n-data-table
          :columns="columns"
          :data="displayBonusLevels"
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
import { ref, onMounted, h, computed } from 'vue';
import { NDataTable, NInputNumber, NButton, useMessage, useDialog, NGradientText, NFlex, NScrollbar, NIcon, NSkeleton, NTag } from 'naive-ui';
import { RefreshSharp } from '@vicons/ionicons5';
import * as bonusApi from '@/apis/bonusApi';
import type { StageBonusInterface } from '@/types/stageBonus';

const message = useMessage();
const dialog = useDialog();

// 状态管理
const perPersonBonus = ref<number>(0);
const totalPersonSize = ref<number>(0);
const totalBonus = ref<number>(0);
const bonusLevels = ref<StageBonusInterface[]>([]);
const isEditPerPersonBonus = ref<boolean>(false);
const editingIndex = ref<number | null>(null);
const tempValues = ref<{ peopleSize: number; weight: number } | null>(null);
const loading = ref<boolean>(false);

// 新增挡位相关状态
const isAdding = ref<boolean>(false); // 是否处于新增状态
const newLevel = ref<Partial<StageBonusInterface>>({
  peopleSize: 1, // 默认人数1
  weight: 1.0,   // 默认权重1.0
  bonus: 0       // 临时金额（未保存时计算用）
});

const deleteDialogVisible = ref<boolean>(false); // 删除对话框显示状态
const deleteIndex = ref<number | null>(null); // 待删除的行索引

// 显示的表格数据（包含可能的新增行）
const displayBonusLevels = computed<StageBonusInterface[]>(() => {
  if (isAdding.value) {
    // 新增状态时，在现有数据后添加一行临时数据
    return [
      ...bonusLevels.value,
      {
        ...newLevel.value,
        level: bonusLevels.value.length + 1, // 挡位号为现有数量+1
        peopleSize: newLevel.value.peopleSize || 1,
        weight: newLevel.value.weight || 1.0,
        bonus: newLevel.value.bonus || 0
      } as StageBonusInterface
    ];
  }
  return bonusLevels.value;
});

// 刷新数据
const refresh = async () => {
  try {
    loading.value = true;
    const [perPerson, total, stageBonus] = await Promise.all([
      bonusApi.getPerPersonBonus(),
      bonusApi.getTotalBonus(),
      bonusApi.getStageBonus()
    ]);
    perPersonBonus.value = perPerson;
    totalBonus.value = total;
    bonusLevels.value = Array.isArray(stageBonus) ? stageBonus : [stageBonus];
    totalPersonSize.value = 0;
    bonusLevels.value.forEach((item) => {
      totalPersonSize.value += item.peopleSize;
    })
    message.success('数据更新成功！');
  } catch (error) {
    message.error(String(error || '数据加载失败'));
    console.error(error);
  } finally {
    loading.value = false;
  }
};

// 处理新增挡位
const handleAddLevel = () => {
  // 重置新增行数据
  newLevel.value = {
    peopleSize: 1,
    weight: 1.0,
    bonus: 0
  };
  // 进入新增状态（表格会显示新增行）
  isAdding.value = true;
  // 关闭其他编辑状态
  editingIndex.value = null;
  isEditPerPersonBonus.value = false;
};

// 取消新增
const cancelAdd = () => {
  isAdding.value = false;
  newLevel.value = { peopleSize: 1, weight: 1.0, bonus: 0 };
};

// 保存新增挡位
const saveNewLevel = async () => {
  // 校验数据
  if (!isPositiveInteger(newLevel.value.peopleSize || 0)) {
    message.error('人数必须是正整数，请重新输入');
    return;
  }
  if (!isPositiveNumber(newLevel.value.weight || 0)) {
    message.error('权重必须是正数，请重新输入');
    return;
  }
  try {
    loading.value = true;
    const peopleSize = newLevel.value.peopleSize || 1;
    const weight = newLevel.value.weight || 1.0;
    // 调用新增接口
    await bonusApi.createStage(peopleSize, weight);
    message.success('新增挡位成功！');
    // 关闭新增状态
    isAdding.value = false;
    // 刷新数据
    await refresh();
  } catch (error) {
    message.error(String(error || '新增失败'));
  } finally {
    loading.value = false;
  }
};

// 打开删除对话框
const openDeleteDialog = (index: number) => {
  deleteIndex.value = index;
  deleteDialogVisible.value = true;
  dialog.warning({
    title: '警告',
    content: '是否删除此挡位?',
    positiveText: '是',
    negativeText: '否',
    draggable: true,
    onPositiveClick: () => confirmDelete()
  })
};

// 确认删除
const confirmDelete = async () => {
  if (deleteIndex.value === null) return;

  try {
    loading.value = true;
    // 调用删除接口
    await bonusApi.removeStage(deleteIndex.value);
    message.success('删除成功！');
    // 关闭对话框并重置状态
    deleteDialogVisible.value = false;
    editingIndex.value = null;
    await refresh(); // 刷新数据
  } catch (error) {
    message.error(String(error || '删除失败，请稍后再试'));
  } finally {
    loading.value = false;
    deleteIndex.value = null;
  }
};

// 编辑行样式
const rowClassName = (_row: StageBonusInterface, index: number) => {
  // 新增行特殊样式
  if (isAdding.value && index === displayBonusLevels.value.length - 1) {
    return 'adding-row';
  }
  return editingIndex.value === index ? 'editing-row' : '';
};

// 校验函数
const isPositiveInteger = (value: number): boolean => {
  return Number.isInteger(value) && value > 0;
};
const isPositiveNumber = (value: number): boolean => {
  return typeof value === 'number' && !isNaN(value) && value > 0;
};

// 人均奖金编辑
const handlePerPersonBonusChange = (value: number) => {
  perPersonBonus.value = value;
};
const handlePerPersonComplete = async () => {
  if (!isPositiveInteger(perPersonBonus.value)) {
    message.error('人均奖金数必须是正整数，请重新输入');
    return;
  }
  try {
    loading.value = true;
    const msg = await bonusApi.setPerPersonBonus(perPersonBonus.value);
    message.success(msg);
    await refresh();
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
      // 新增行的人数输入框
      if (isAdding.value && index === displayBonusLevels.value.length - 1) {
        return h(NInputNumber, {
          value: newLevel.value.peopleSize,
          min: 1,
          step: 1,
          'onUpdate:value': (value: number) => {
            newLevel.value.peopleSize = value;
          },
          disabled: loading.value
        });
      }
      // 编辑中的行
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
      // 新增行的权重输入框
      if (isAdding.value && index === displayBonusLevels.value.length - 1) {
        return h(NInputNumber, {
          value: newLevel.value.weight,
          min: 0.1,
          step: 0.1,
          precision: 1,
          'onUpdate:value': (value: number) => {
            newLevel.value.weight = value;
          },
          disabled: loading.value
        });
      }
      // 编辑中的行
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
      return h('span', row.weight.toFixed(1));
    }
  },
  {
    title: '金额',
    key: 'bonus',
    width: 120,
    ellipsis: { showTitle: true },
    render: (row: StageBonusInterface, index: number) => {
      // 新增行的金额（临时计算值）
      if (isAdding.value && index === displayBonusLevels.value.length - 1) {
        return h('span', `${(newLevel.value.bonus || 0).toFixed(2)} 元`);
      }
      return h('span', `${row.bonus.toFixed(2)} 元`);
    }
  },
  {
    title: '操作',
    key: 'action',
    width: 160,
    ellipsis: { showTitle: true },
    render: (row: StageBonusInterface, index: number) => {
      const isOtherRowEditing = editingIndex.value !== null && editingIndex.value !== index;
      const isDisabled = isOtherRowEditing || loading.value;

      // 新增行的操作按钮（完成/取消）
      if (isAdding.value && index === displayBonusLevels.value.length - 1) {
        return h(NFlex, { gap: 'small' }, {
          default: () => [
            h(NButton, {
              size: 'small',
              type: 'primary',
              onClick: saveNewLevel,
              loading: loading.value
            }, {default: () => '完成'}),
            h(NButton, {
              size: 'small',
              type: 'info',
              onClick: cancelAdd,
              disabled: loading.value
            }, {default:() => '取消'})
          ]
      });
      }

      // 编辑中的行
      if (editingIndex.value === index) {
        return h(NFlex, { gap: 'small' }, {
          default: () => [
            h(NButton, {
              size: 'small',
              type: 'primary',
              onClick: async () => handleEditComplete(index),
              loading: loading.value
            }, { default: () => '完成' }),
            h(NButton, {
              size: 'small',
              type: 'error',
              onClick: () => openDeleteDialog(index),
              disabled: loading.value
            }, { default: () => '删除' })
          ]
        });
      }

      // 普通行的修改按钮
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
    await Promise.all([
      bonusApi.setStagePeopleSize(index, currentRow.peopleSize),
      bonusApi.setStageWeight(index, currentRow.weight)
    ]);
    message.success('修改已保存');
    await refresh();
  } catch (error) {
    message.error(String(error || '修改失败'));
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
  min-height: 32px;
}

.total-bonus {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-left: auto;
  min-width: 160px;
  min-height: 32px;
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
    @include table-column-widths(50px, 40px, 40px, 80px, 70px);
  }

  @include respond-to($breakpoint-sm) {
    @include table-column-widths(40px, 25px, 25px, 70px, 60px);
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