<script setup>
import { ref, nextTick, computed } from "vue";
import "animate.css";
import axios from "axios";

const inputText = ref("");
const fileInput = ref(null);
const previewImage = ref(null);
const selectedFile = ref(null);
const inConversation = ref(true);
const messages = ref([]);

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.value = e.target.result;
      selectedFile.value = file;
    };
    reader.readAsDataURL(file);
  }
};

const clearFile = () => {
  selectedFile.value = null;
  previewImage.value = null;
  if (fileInput.value) fileInput.value.value = "";
};

// const handleEnter = async () => {
//   if (inputText.value.trim()) {
//     messages.value.push({
//       label: "text",
//       author: "user",
//       text: inputText.value.trim(),
//       image: previewImage.value,
//     });
//     console.log(messages.value)
//     messages.value.push({
//       label: "text",
//       author: "ai",
//       text: "chat測試",
//     });
//     inputText.value = "";
//     clearFile();
//     if (!inConversation.value) inConversation.value = true;
//     await nextTick();
//     scrollToBottom();
//   }
// };

let messageinput

const handleEnter = async () => {
  if (!inputText.value.trim()) return;
  conversations.value[activeConversationIndex.value].messages.push({
    author: "user",
    label: "text",
    text: inputText.value
  });
  messageinput = inputText.value;
  inputText.value = "";
  // 可以在這裡模擬一個 bot 回覆
  let url = `https://cmm.ai:8066/ask?question=${messageinput}`;
  try {
    const response = await axios.post(url);
    if (response.status === 200) {
      console.log(response.data)
      setTimeout(() => {
        conversations.value[activeConversationIndex.value].messages.push({
          author: "bot",
          label: "text",
          answer:response.data.answer,
          table:response.data.table
        });
      }, 500);
    }
  } catch (error) {
    console.error("❌ 發生錯誤：", error);
  }

  if (!inConversation.value) inConversation.value = true;
  await nextTick();
  scrollToBottom();
}

const scrollToBottom = () => {
  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
};




const conversations = ref([
  {
    title: "請問電瓶多久要更換(汽油車)?",
    messages: []
  },
  {
    title: "經典款和豪華款差在哪裡",
    messages: [
      {
        author: "user",
        label: "text",
        text: "經典款和豪華款差在哪裡??"
      },
      {
        author: "bot",
        label: "text",
        answer: "TOYOTA ALTIS 經典款與豪華款的主要差異",
        table: `
              <h2>價格</h2>
              <table>
                <thead>
                  <tr>
                    <th>項目</th>
                    <th>經典款</th>
                    <th>豪華款</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>價格</td>
                    <td>72.5萬</td>
                    <td>79.5萬</td>
                  </tr>
                </tbody>
              </table>

              <h2>尺寸</h2>
              <table>
                <thead>
                  <tr>
                    <th>項目</th>
                    <th>經典款</th>
                    <th>豪華款</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>全長</td>
                    <td colspan="2">4630 mm</td>
                  </tr>
                  <tr>
                    <td>全寬</td>
                    <td colspan="2">1780 mm</td>
                  </tr>
                  <tr>
                    <td>全高</td>
                    <td colspan="2">1435 mm</td>
                  </tr>
                  <tr>
                    <td>軸距</td>
                    <td colspan="2">2700 mm</td>
                  </tr>
                  <tr>
                    <td>車重</td>
                    <td>1275 kg</td>
                    <td>1280 kg</td>
                  </tr>
                  <tr>
                    <td>最小迴轉半徑</td>
                    <td colspan="2">5.2 m</td>
                  </tr>
                </tbody>
              </table>

              <h2>引擎</h2>
              <table>
                <thead>
                  <tr>
                    <th>項目</th>
                    <th>經典款</th>
                    <th>豪華款</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>引擎型式</td>
                    <td colspan="2">2ZR-FE 直列四汽缸</td>
                  </tr>
                  <tr>
                    <td>最大馬力 (ps/rpm)</td>
                    <td colspan="2">140 / 6,400</td>
                  </tr>
                  <tr>
                    <td>最大扭力 (kg-m/rpm)</td>
                    <td colspan="2">17.5 / 4,000</td>
                  </tr>
                  <tr>
                    <td>排氣量 (c.c.)</td>
                    <td colspan="2">1798</td>
                  </tr>
                  <tr>
                    <td>油箱容量 (l)</td>
                    <td colspan="2">47</td>
                  </tr>
                </tbody>
              </table>

              <h2>外觀</h2>
              <table>
                <thead>
                  <tr>
                    <th>項目</th>
                    <th>經典款</th>
                    <th>豪華款</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>輪圈</td>
                    <td>15吋高強度鋼圈</td>
                    <td>16吋十幅式鋁圈</td>
                  </tr>
                  <tr>
                    <td>前霧燈</td>
                    <td>無</td>
                    <td>有 (LED)</td>
                  </tr>
                </tbody>
              </table>

              <h2>內裝</h2>
              <table>
                <thead>
                  <tr>
                    <th>項目</th>
                    <th>經典款</th>
                    <th>豪華款</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>方向盤型式</td>
                    <td>三幅式軟質</td>
                    <td>三幅式真皮</td>
                  </tr>
                  <tr>
                    <td>前座音響主機</td>
                    <td>CD主機</td>
                    <td>Drive+Link 9吋 Wi-Fi 觸控式</td>
                  </tr>
                </tbody>
              </table>

              <h2>安全配備</h2>
              <table>
                <thead>
                  <tr>
                    <th>項目</th>
                    <th>經典款</th>
                    <th>豪華款</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>主動安全系統</td>
                    <td colspan="2">皆配備 TSS 2.0</td>
                  </tr>
                  <tr>
                    <td>盲點偵測</td>
                    <td>無</td>
                    <td>有</td>
                  </tr>
                </tbody>
              </table>

              <p class="mt-3">
                總結來說，雖然經典款與豪華款在引擎與基本車體結構上大致相同，但豪華款在外觀、內裝與安全配備上有較多升級，對於重視配備與質感的使用者來說，豪華款是一個更完整的選擇。
              </p>`
      }
    ]
  },
  {
    title: "TOYOTA車款的規格、標準配備及售價，要從哪裡查詢?",
    messages: [
      {
        author: "user",
        label: "text",
        text: "112 年和113年全台迷路案件"
      },
      {
        author: "bot",
        label: "text",
        answer: "112年和113年全台迷路案件數量分別為170件，兩年案件數量相同。",
        table: `<table border="1" class="dataframe">
          <thead><tr><th>year</th><th>total_cases</th></tr></thead>
          <tbody>
            <tr><td>112</td><td>170</td></tr>
            <tr><td>113</td><td>170</td></tr>
          </tbody>
        </table>`
      }
    ]
  },
  {
    title: "如何預約保養?",
    messages: [
      {
        author: "user",
        label: "text",
        text: "2024年救災前五大原因"
      },
      {
        author: "bot",
        label: "text",
        answer: "2024年救災的前五大原因依序為：迷路（170件）、創傷（63件）、墜谷（40件）、疾病（31件）及疲勞（25件）。",
        table: `<table border="1" class="dataframe">
          <thead><tr><th>reason</th><th>total_cases</th></tr></thead>
          <tbody>
            <tr><td>迷路</td><td>170</td></tr>
            <tr><td>創傷</td><td>63</td></tr>
            <tr><td>墜谷</td><td>40</td></tr>
            <tr><td>疾病</td><td>31</td></tr>
            <tr><td>疲勞</td><td>25</td></tr>
          </tbody>
        </table>`
      }
    ]
  },
]);





const currentMessages = computed(() =>
  conversations.value[activeConversationIndex.value].messages
);

const activeConversationIndex = ref(0);
function selectConversation(index) {
  activeConversationIndex.value = index;
  console.log(activeConversationIndex.value)
}

function startNewConversation() {
  conversations.value.push({
    title: "New Chat",
    messages: []
  });
  activeConversationIndex.value = conversations.value.length - 1;
}


</script>

<template>
  <div class="h-screen flex">
    <!-- 左側側邊欄 -->
    <div class="w-64  bg-[#a52c25] text-white flex flex-col">
      <div class="p-4 text-lg font-semibold border-b border-white/20">
        歷史紀錄
      </div>
      <div class="flex-1 overflow-y-auto">
        <div v-for="(conversation, index) in conversations" :key="index" @click="selectConversation(index)"
          class="px-4 py-3 hover:bg-[#8f241f] cursor-pointer transition-colors" :class="{
            'bg-[#8f241f]': index === activeConversationIndex
          }">
          {{ conversation.title }}
        </div>
      </div>
      <div class="p-4 border-t border-white/20">
        <button class="w-full bg-white text-[#a52c25] py-2 rounded hover:bg-gray-200 transition"
          @click="startNewConversation">
          + 新視窗
        </button>
      </div>
    </div>

    <!-- 右側聊天畫面 -->
    <div class="flex-1 flex flex-col">
      <!-- 對話區塊 -->
      <div v-if="inConversation" class="flex-1 overflow-y-auto p-4 space-y-6">
        <div v-for="(msg, idx) in currentMessages" :key="idx" class="space-y-2">
          <div v-if="msg.label === 'text'" class="message animate__animated flex" :class="{
            'justify-end': msg.author === 'user',
            'message-out': msg.author === 'user',
            'message-in': msg.author !== 'user',
            'justify-start': msg.author !== 'user',
            animate__fadeInRight: msg.author === 'user',
            animate__fadeInLeft: msg.author !== 'user',
          }">
            <div class="max-w-[70%] px-5 py-3 "
              :class="{ 'bg-main2 text-white shadow-lg rounded-full': msg.author === 'user' }">

              <div v-if="msg.text">
                <p v-html="msg.text"></p>
              </div>
              <div v-if="msg.answer" class="mt-2" v-html="msg.answer"></div>
              <div v-if="msg.table" class="mt-2" v-html="msg.table"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 下方輸入區 -->
      <div v-if="inConversation" class="sticky bottom-0 bg-white p-5 flex items-end gap-2">
        <div class="relative flex-1">
          <textarea v-model="inputText" @keydown.enter.prevent="handleEnter" @keydown.shift.enter.stop rows="1"
            placeholder="輸入訊息..." class="w-full p-5 border border-gray-300 rounded-xl resize-none pr-10"></textarea>

          <button @click="handleEnter"
            class="px-4 py-3 absolute right-3 text-white bg-main2 hover:opacity-75 transition-opacity duration-300 rounded-full shadow cursor-pointer"
            style="bottom: 15px">
            ➤
          </button>
        </div>

        <input ref="fileInput" type="file" accept="image/*" @change="handleFileChange" class="hidden" />
        <button @click="triggerFileInput" class="text-gray-600 hover:text-blue-500">
          <PaperClipIcon class="w-6 h-6" />
        </button>
      </div>
    </div>
  </div>
</template>


<style lang="scss">
h2 {
  margin-top: 30px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

table,
th,
td {
  border: 1px solid #ccc;
}

th,
td {
  padding: 10px;
  text-align: left;
}

th {
  background-color: #f0f0f0;
}

.message-out {
  margin-left: auto;
  // background: #D61718;
  // color: white;
}

.message-in {
  margin-right: auto;
  // background: #fff;
  // color: black;
}
</style>
