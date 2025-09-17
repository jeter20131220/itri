<script setup>
import { ref, nextTick, computed, onMounted,watch } from "vue";
import "animate.css";
import axios from "axios";

const inputText = ref("");
const fileInput = ref(null);
const previewImage = ref(null);
const selectedFile = ref(null);
const inConversation = ref(true);
const messages = ref([]);
const isListening = ref(false)
const showSidebar = ref(false);
const isDesktop = ref(false);

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



onMounted(() => {
  // 偵測是否為桌機模式
  const update = () => {
    isDesktop.value = window.innerWidth >= 768;

    if (isDesktop.value) showSidebar.value = true;
    else showSidebar.value = false;
  };
  update();
  window.addEventListener('resize', update);
});
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

  console.log(conversations.value)
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
          answer: response.data.answer,
          table: response.data.table
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

// const scrollToBottom = () => {
//   window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
// };


const chatArea = ref(null); // 對話框

// 滾動到對話框底部
const scrollToBottom = () => {
  setTimeout(() => {
    console.log("chatArea.value", chatArea.value.scrollHeight);

    chatArea.value.scrollTo({
      top: chatArea.value.scrollHeight,
      behavior: "smooth",
    });
  }, 100);
};




const conversations = ref([
  {
    title: "New Chat",
    messages: []
  },
  {
    title: "2024 年迷路的案件數量最多的三個縣市",
    messages: [
      {
        author: "user",
        label: "text",
        text: "2024 年迷路的案件數量最多的三個縣市"
      },
      {
        author: "bot",
        label: "text",
        answer: "2024 年迷路的案件數量最多的三個縣市分別是新北市（71 件）、新竹縣（25 件）和臺中市（25 件）。",
        table: `<table border="1" class="dataframe">
          <thead><tr><th>city</th><th>cases</th></tr></thead>
          <tbody>
            <tr><td>新北市</td><td>71</td></tr>
            <tr><td>新竹縣</td><td>25</td></tr>
            <tr><td>臺中市</td><td>25</td></tr>
          </tbody>
        </table>`
      }
    ]
  },
  {
    title: "112 年和113年全台迷路案件",
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
    title: "2024年救災前五大原因",
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



const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value;
};

let recognition

if ('webkitSpeechRecognition' in window) {
  const SpeechRecognition = window.webkitSpeechRecognition
  recognition = new SpeechRecognition()
  recognition.continuous = false
  recognition.lang = 'zh-TW' // 或 en-US
  recognition.interimResults = false

  recognition.onstart = () => {
    isListening.value = true
  }

  recognition.onend = () => {
    isListening.value = false
  }

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript
    inputText.value += transcript
  }
} else {
  console.warn('這個瀏覽器不支援語音辨識')
}

function startListening() {
  if (!recognition) return
  recognition.start()
}

watch(conversations.value, (val) => {
  console.log("messages", val);
  scrollToBottom();
});
</script>

<template>
  <div class="h-screen flex">
    <!-- 漢堡選單（手機版） -->
    <button class="md:hidden absolute top-4 left-4 z-50" @click="toggleSidebar">
      <svg class="w-8 h-8 text-white bg-[#345678] p-1 rounded" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
    <!-- 左側側邊欄 -->
    <div :class="['bg-[#345678] text-white flex flex-col transition-all duration-300 z-40',
      showSidebar ? 'w-64' : 'w-0',
      'fixed md:relative h-screen overflow-hidden md:w-64']">
      <div class="p-4 text-lg font-semibold border-b border-white/20"
        :class="[showSidebar && !isDesktop ? 'pl-12' : '']">
        歷史紀錄<br>(目前為測試資料)
      </div>
      <div class="flex-1 overflow-y-auto">
        <div v-for="(conversation, index) in conversations" :key="index" @click="selectConversation(index)"
          class="px-4 py-3 hover:bg-[#3e6b95] cursor-pointer transition-colors" :class="{
            'bg-[#3e6b95]': index === activeConversationIndex
          }">
          {{ conversation.title }}
        </div>
      </div>
      <div class="p-4 border-t border-white/20">
        <button class="w-full bg-white text-[#345678] py-2 rounded hover:bg-gray-200 transition"
          @click="startNewConversation">
          + 新視窗
        </button>
      </div>
    </div>

    <!-- 右側聊天畫面 -->
    <div class="flex-1 flex flex-col pt-16 md:pt-0">
      <!-- 對話區塊 -->
      <div v-if="inConversation" ref="chatArea"  class="flex-1 overflow-y-auto p-4 space-y-6">
        <div v-for="(msg, idx) in currentMessages" :key="idx" class="space-y-2">
          <div v-if="msg.label === 'text'" class="message animate__animated flex" :class="{
            'justify-end': msg.author === 'user',
            'message-out': msg.author === 'user',
            'message-in': msg.author !== 'user',
            'justify-start': msg.author !== 'user',
            animate__fadeInRight: msg.author === 'user',
            animate__fadeInLeft: msg.author !== 'user',
          }">
            <div class="max-w-[90%] sm:max-w-[70%] px-5 py-3 "
              :class="{ 'bg-main text-white shadow-lg rounded-full': msg.author === 'user' }">

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

          <button class="px-4 py-3 absolute right-15"
            :class="isListening ? 'text-red-500 animate-pulse' : 'text-gray-600'" style="bottom: 15px"
            @click="startListening">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
            </svg>

          </button>
          <button @click="handleEnter"
            class="px-4 py-3 absolute right-3 text-white bg-main hover:opacity-75 transition-opacity duration-300 rounded-full shadow cursor-pointer"
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
