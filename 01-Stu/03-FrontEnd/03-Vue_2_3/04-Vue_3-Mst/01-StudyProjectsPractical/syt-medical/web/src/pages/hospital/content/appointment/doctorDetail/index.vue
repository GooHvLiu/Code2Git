<template>
  <div class="page-wrap">
    <div class="top-content">
      <div class="hspInfo">
        <p class="hspName">北京人民医院</p>
        <svg
          t="1790926337417"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="5986"
          width="16"
          height="16"
        >
          <path
            d="M512 85.333c23.573 0 42.667 20.118 42.667 44.907v763.52c0 24.79-19.094 44.907-42.667 44.907s-42.667-20.118-42.667-44.907V130.24c0-24.79 19.094-44.907 42.667-44.907z"
            p-id="5987"
            fill="#515151"
          ></path>
        </svg>
        <p class="dptName">专科</p>
        <svg
          t="1790926255554"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="4876"
          width="16"
          height="16"
        >
          <path
            d="M516.266667 430.933333c-46.634667 0-85.333333 38.698667-85.333334 85.333334 0 46.592 38.698667 85.333333 85.333334 85.333333 46.592 0 85.333333-38.741333 85.333333-85.333333 0-46.634667-38.741333-85.333333-85.333333-85.333334z"
            p-id="4877"
            fill="#515151"
          ></path>
        </svg>
        <p class="spcName">多发性硬化专科门诊</p>
      </div>
    </div>
    <div class="middle-content">
      <div class="currentDate">2026年10月</div>
      <div class="card-wrap">
        <div class="dataCard" v-for="(items, index) in 5" :key="index">
          <div class="itemData">2026-10-07 周六</div>
          <div class="itemNote">停止挂号</div>
        </div>
      </div>
      <div class="pagination-block">
        <el-pagination layout="prev, pager, next" :total="50" />
      </div>
    </div>
    <div class="bottom-content">
      <div class="morning-tickets">
        <div class="time-tickets">
          <svg
            t="1790928595007"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="9613"
            width="20"
            height="20"
          >
            <path
              d="M512 423.253333c17.749333 0 32.085333-15.701333 32.085333-34.816V240.981333l-4.096-59.392 29.354667 33.450667 49.834667 49.834667c6.144 5.461333 13.653333 8.874667 21.845333 8.874666 15.701333 0 27.306667-10.922667 27.306667-26.624 0-8.192-2.730667-14.336-9.557334-21.162666L533.845333 112.64c-8.192-7.509333-14.336-10.24-21.845333-10.24-7.509333 0-12.970667 2.730667-21.845333 10.24L365.909333 226.645333c-6.826667 6.144-9.557333 12.288-9.557333 20.48 0 15.701333 10.922667 26.624 27.306667 26.624 7.509333 0 15.701333-3.413333 21.162666-8.874666l53.930667-53.248 25.258667-29.354667-4.778667 58.709333v146.773334c0 19.797333 15.701333 35.498667 32.768 35.498666z m206.165333 107.178667c12.970667 12.288 34.133333 12.288 48.469334-2.048l69.632-68.266667c15.018667-14.336 14.336-34.816 1.365333-47.104a33.655467 33.655467 0 0 0-47.786667 1.365334l-69.632 68.266666c-14.336 15.018667-14.336 36.181333-2.048 47.786667z m-412.330666 0c12.288-12.288 12.288-32.768-2.730667-47.786667l-69.632-68.266666c-15.018667-14.336-35.498667-13.653333-47.786667-1.365334-12.288 12.288-12.288 32.768 2.730667 47.104l69.632 68.266667c14.336 14.336 35.498667 15.018667 47.786667 2.048zM34.816 921.6h954.368c19.114667 0 34.816-14.336 34.816-32.085333 0-17.066667-15.701333-31.402667-34.816-31.402667h-300.373333c27.306667-36.181333 41.642667-79.872 41.642666-124.928 0-118.101333-99.669333-215.722667-218.453333-215.722667-119.466667 0-218.453333 97.621333-218.453333 215.722667 0 47.104 15.018667 89.429333 41.642666 124.928H34.816c-19.114667 0-34.816 14.336-34.816 31.402667 0 17.749333 15.701333 32.085333 34.816 32.085333z m322.901333-187.733333c0-83.285333 69.632-151.552 154.282667-151.552s154.282667 68.266667 154.282667 151.552c0 50.517333-25.941333 96.938667-68.266667 124.928H425.984c-42.325333-28.672-68.266667-75.093333-68.266667-124.928z m-271.018666 21.845333h98.304c20.48 0 36.181333-14.336 36.181333-32.085333-0.682667-17.749333-15.018667-32.085333-36.181333-32.085334H86.698667c-20.48 0-35.498667 14.336-35.498667 32.085334s15.018667 32.085333 35.498667 32.085333z m752.981333 0h98.304c20.48 0 35.498667-14.336 35.498667-32.085333s-15.018667-32.085333-35.498667-32.085334H839.68c-20.48 0-36.181333 14.336-36.181333 32.085334 0.682667 17.749333 15.018667 32.085333 36.181333 32.085333z"
              fill="#FF7F50"
              p-id="9614"
            ></path>
          </svg>
          <p>上午号源</p>
        </div>
        <div class="tickets-doctors">
          <div class="tickets-info" v-for="(items, index) in 2" :key="index">
            <div class="content">
              <div class="left">
                <div class="doctor">
                  <div class="title">副主任医师</div>
                  <svg
                    t="1790926337417"
                    class="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="5986"
                    width="16"
                    height="16"
                  >
                    <path
                      d="M512 85.333c23.573 0 42.667 20.118 42.667 44.907v763.52c0 24.79-19.094 44.907-42.667 44.907s-42.667-20.118-42.667-44.907V130.24c0-24.79 19.094-44.907 42.667-44.907z"
                      p-id="5987"
                      fill="#515151"
                    ></path>
                  </svg>
                  <div class="name">裴育</div>
                </div>
                <div class="info">
                  <p class="price">骨质疏松和骨代谢疾病、糖尿病、甲状腺疾病。</p>
                </div>
              </div>
              <div class="right">
                <div class="left">
                  <p class="price">￥ 100</p>
                </div>
                <div class="right">
                  <el-button type="primary">剩余6</el-button>
                </div>
              </div>
            </div>
            <div class="divider">
              <el-divider />
            </div>
          </div>
        </div>
      </div>
      <div class="afternoon-tickets">
        <div class="time-tickets">
          <svg
            t="1790928615849"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="10784"
            width="20"
            height="20"
          >
            <path
              d="M981.333333 896a42.666667 42.666667 0 0 1 0 85.333333H42.666667a42.666667 42.666667 0 0 1 0-85.333333h938.666666z m-469.333333-384a256 256 0 0 1 255.829333 246.4L768 768a42.666667 42.666667 0 0 1-85.333333 0 170.112 170.112 0 0 0-50.005334-120.661333A170.112 170.112 0 0 0 512 597.333333a170.112 170.112 0 0 0-120.661333 50.005334 170.112 170.112 0 0 0-49.706667 110.634666L341.333333 768a42.666667 42.666667 0 0 1-85.333333 0 256 256 0 0 1 256-256z m-384 213.333333a42.666667 42.666667 0 0 1 0 85.333334H42.666667a42.666667 42.666667 0 0 1 0-85.333334h85.333333z m853.333333 0a42.666667 42.666667 0 0 1 0 85.333334h-85.333333a42.666667 42.666667 0 0 1 0-85.333334h85.333333zM210.304 405.973333l60.330667 60.330667a42.666667 42.666667 0 0 1-60.330667 60.330667L149.973333 466.346667a42.666667 42.666667 0 1 1 60.330667-60.330667z m663.722667 0a42.666667 42.666667 0 0 1 0 60.330667l-60.330667 60.330667a42.666667 42.666667 0 0 1-60.330667-60.330667l60.330667-60.330667a42.666667 42.666667 0 0 1 60.330667 0zM512 42.666667a42.666667 42.666667 0 0 1 42.666667 42.666666v195.669334l108.202666-108.202667a42.666667 42.666667 0 0 1 60.330667 60.330667l-181.034667 181.034666-3.498666 3.114667-0.256 0.213333a42.624 42.624 0 0 1-1.92 1.450667l-1.621334 1.066667-0.512 0.341333a38.997333 38.997333 0 0 1-8.746666 4.096 42.538667 42.538667 0 0 1-1.152 0.384l-1.365334 0.384-1.194666 0.298667-1.28 0.256a42.752 42.752 0 0 1-1.109334 0.213333l-1.450666 0.256-1.066667 0.128-0.981333 0.128a42.88 42.88 0 0 1-1.493334 0.085333l-1.706666 0.085334h-1.664l-1.664-0.085334-1.493334-0.085333-0.981333-0.128a42.666667 42.666667 0 0 1-1.152-0.128l-1.365333-0.256a70.656 70.656 0 0 1-3.498667-0.768 42.581333 42.581333 0 0 1-2.602667-0.768l-0.768-0.256a40.362667 40.362667 0 0 1-6.4-2.944l-1.024-0.554667a42.368 42.368 0 0 1-0.554666-0.341333l-0.512-0.341333a46.08 46.08 0 0 1-1.962667-1.28l-1.792-1.408-0.042667-0.042667v0.042667l-0.341333-0.298667-0.554667-0.426667-2.602666-2.432L300.8 233.130667A42.666667 42.666667 0 0 1 361.130667 172.8L469.333333 281.002667 469.333333 85.333333a42.666667 42.666667 0 0 1 42.666667-42.666666z"
              fill="#FF7F50"
              p-id="10785"
            ></path>
          </svg>
          <p>下午号源</p>
        </div>
        <div class="tickets-doctors">
          <div class="tickets-info" v-for="(items, index) in 2" :key="index">
            <div class="content">
              <div class="left">
                <div class="doctor">
                  <div class="title">副主任医师</div>
                  <svg
                    t="1790926337417"
                    class="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="5986"
                    width="16"
                    height="16"
                  >
                    <path
                      d="M512 85.333c23.573 0 42.667 20.118 42.667 44.907v763.52c0 24.79-19.094 44.907-42.667 44.907s-42.667-20.118-42.667-44.907V130.24c0-24.79 19.094-44.907 42.667-44.907z"
                      p-id="5987"
                      fill="#515151"
                    ></path>
                  </svg>
                  <div class="name">裴育</div>
                </div>
                <div class="info">
                  <p class="price">骨质疏松和骨代谢疾病、糖尿病、甲状腺疾病。</p>
                </div>
              </div>
              <div class="right">
                <div class="left">
                  <p class="price">￥ 100</p>
                </div>
                <div class="right">
                  <el-button type="primary">剩余6</el-button>
                </div>
              </div>
            </div>
            <div class="divider">
              <el-divider />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 定义组件名字
defineOptions({ name: "DoctorDetail" });

// import { ref, reactive, computed, watch, onMounted } from 'vue'

// import { useRouter } from 'vue-router'

// Props定义示例
// const props = defineProps<{}>()
// const emit = defineEmits<{}>()

// 响应式数据
// const count = ref(0)
// const state = reactive({})

// 计算属性
// const computedVal = computed(() => {})

// 监听
// watch(count, (newVal) => {})

// 生命周期
// onMounted(() => {})
</script>

<style scoped lang="less">
.page-wrap {
  color: @color-text-regular;
  display: flex;
  flex-direction: column;
  .top-content {
    .hspInfo {
      display: flex;
      flex-direction: row;
      margin: 10px 0;
      svg {
        margin: 0 5px;
      }
      p:hover,
      svg:hover {
        cursor: pointer;
        color: @color-text-hoverMainColor;
      }
    }
  }
  .middle-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    .currentDate {
      font-weight: 800;
      margin: 10px 0;
    }
    .card-wrap {
      display: flex;
      flex-direction: row;
      gap: 15px;
      width: 100%;
      .dataCard {
        /* 过渡：0.3秒完成变换，缓动曲线 */
        transition: transform 0.3s ease;
        transform-origin: center;
        flex: 1;
        border: 1px solid @color-text-placeholder;
        .itemData {
          text-align: center;
          font-weight: 800;
          background-color: @color-text-placeholder;
          padding: 8px;
          transition: background-color 0.3s ease;
        }
        .itemNote {
          padding: 15px 0;
          text-align: center;
        }
        &:hover {
          /* 放大5%，改成1.1就是放大10% */
          transform: scale(1.1);
          .itemData {
            background: @color-bg-cardhover;
          }
        }
      }
    }
    .pagination-block {
      margin: 10px 0;
    }
  }
  .bottom-content {
    .morning-tickets,
    .afternoon-tickets {
      display: flex;
      flex-direction: column;
      .time-tickets {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-bottom: 15px;
        font-weight: 800;
        svg {
          margin-right: 6px;
        }
      }
      .tickets-doctors {
        display: flex;
        flex-direction: column;
        .tickets-info {
          display: flex;
          flex-direction: column;
          .content {
            display: flex;
            flex-direction: row;
            .left {
              flex: 10;
              display: flex;
              flex-direction: column;
              .doctor {
                flex: 10;
                display: flex;
                flex-direction: row;
                .title {
                  color: @color-important;
                  font-weight: 800;
                  margin-bottom: 10px;
                }
                svg {
                  margin: 0 6px;
                }
              }
            }
            .right {
              flex: 2;
              display: flex;
              flex-direction: row;
              align-items: center;
            }
          }
        }
      }
    }
  }
}
</style>
