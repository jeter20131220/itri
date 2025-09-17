<script setup>
import { ref, nextTick, computed, onMounted, watch } from "vue";
import "animate.css";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid'

function generateChatId() {
  console.log(`chat_${Date.now()}_${uuidv4()}`)
  return `chat_${Date.now()}_${uuidv4()}`
}

// generateChatId();

const chatId = ref(localStorage.getItem('chat_id') || generateChatId())


const inputText = ref("");
const fileInput = ref(null);
const previewImage = ref(null);
const selectedFile = ref(null);
const inConversation = ref(true);
const messages = ref([]);
const isListening = ref(false)
const showSidebar = ref(false);
const isDesktop = ref(false);
const isVideoMode = ref(true) // ← 你可以用 route 或畫面切換來控制
const activeConversationIndex = ref(0);
let isVideoPause = ref(true);
let videoLoading = ref(false);
let isAudioPlaying = ref(false); // 音訊播放狀態

const isReversed = ref(false)

watch(chatId, (newVal) => {
  localStorage.setItem('chat_id', newVal)
})

function toggleLayout() {
  isReversed.value = !isReversed.value
}

const chatData = ref([]);

const cohatDataTitle = ref([]);

const hisMessages = []

const fetchChatHistory = async () => {
  try {
    const res = await axios.get('https://cmm.ai:8066/history?chat_id=all')
    console.log('取得歷史紀錄：', res.data.data)
    chatData.value = res.data;
    console.log('取得歷史紀錄陣列：', chatData.value)


    const transformedChats = chatData.value.map(chat => {
      const chatId = chat.chat_id
      const title = chat.title
      const messages = []

      chat.data.forEach(item => {
        messages.push({
          author: "user",
          label: "text",
          text: item.question
        })

        messages.push({
          author: "bot",
          label: "text",
          answer: item.answer,
          table: item.table
        })
      })

      return {
        chat_id: chatId,
        title: title,
        messages: messages
      }
    })

    console.log(transformedChats)

    conversations.value=transformedChats;

  } catch (err) {
    console.error('錯誤：', err)
  }
}

const currentMessages = computed(() =>
  conversations.value[activeConversationIndex.value].messages
);

function selectConversation(index) {



  activeConversationIndex.value = index;
  console.log('chatid',chatId.value,conversations.value[activeConversationIndex.value])
  chatId.value=conversations.value[activeConversationIndex.value].chat_id;


  console.log(activeConversationIndex.value)
}

function startNewConversation() {
  chatId.value = generateChatId()
  conversations.value.push({
    title: "New Chat",
    messages: []
  });
  activeConversationIndex.value = conversations.value.length - 1;
}

let video = ref(null);

const videoSpeakSources = ref([]); // 動嘴型影片
const videoSources = ref([]); // 開場白影片(中)

const loadVideoSources = async () => {
  videoSources.value = ["https://cmm.ai/itri_rescue/cache_Q/mute.mp4"];
  videoSpeakSources.value = ["https://cmm.ai/itri_rescue/cache_Q/speak_s.mp4"];

};



videoSpeakSources.value = [
  new URL("@/assets/img/speak_s.mp4", import.meta.url).href,
];

const videoSrc = ref('');



const conversations = ref([
  {
    title: "New Chat假資料",
    messages: []
  },
  {
    title: "2024 年迷路的案件數量最多的三個縣市假資料",
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
    title: "112 年和113年全台迷路案件假資料",
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
    title: "2024年救災前五大原因假資料",
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

const isMuted = ref(true) // 一開始是靜音

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
  fetchChatHistory()
  loadVideoSources();
  videoSrc.value = videoSources.value;
  videoPlay();
  // 偵測是否為桌機模式
  const update = () => {
    isDesktop.value = window.innerWidth >= 768;

    // if (isDesktop.value) showSidebar.value = true;
    // else showSidebar.value = false;
  };

  console.log(conversations.value, activeConversationIndex.value)

  setTimeout(() => {
    conversations.value[activeConversationIndex.value].messages.push({
      author: "bot",
      label: "text",
      answer: "您好，這裡是消防署災害統計小助手，您可以詢問例如：「2023年哪個月份高山症最多？」或「近兩年哪個縣市迷路最多？」請問您想查詢什麼呢？",

    });
  }, 500);

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
  console.log(chatId.value);

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
  let url = `https://cmm.ai:8066/ask?question=${messageinput}&chat_id=${chatId.value}`;
  console.log(url)
  try {
    const response = await axios.post(url);
    if (response.status === 200) {
      console.log(response.data)
      console.log(response.data.mp4_url)
      if (response?.data?.mp4_url) {
        if (currentAudio.value) {
          currentAudio.value.pause();
          currentAudio.value.currentTime = 0;
          currentAudio.value = null;
        }
        video.loop = false;
        isMuted.value = false;
        console.log('有cache')
        videoSrc.value = response.data.mp4_url;
        videoPlay();


      } else {
        const audioUrl = response.data.mp3_url;
        audioPlay(audioUrl);
        videoSrc.value = videoSpeakSources.value;
        videoPlay();

      }


      console.log(videoSrc.value)
      // videoPlay();
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




const audioURL = ref(null);

let currentAudio = ref(null); // 當前音訊

// 影片播放結束觸發
const onVideoEnded = () => {
  console.log("播放點頭影片");
  console.log("當前影片", currentAudio.value);
  // 清空音訊
  if (currentAudio.value) {
    currentAudio.value.pause();
    currentAudio.value.currentTime = 0;
    currentAudio.value = null;
  }
  video.loop = true
  // 播放點頭影片
  videoSrc.value = videoSources.value;
  // video.value.loop = true; // 設置循環播放
  videoPlay();
  isVideoPause.value = true;
};

function audioPlay(audioUrl) {
  if (currentAudio.value) {
    currentAudio.value.pause();
    currentAudio.value.currentTime = 0;
  }
  // 播放音檔
  currentAudio.value = new Audio(audioUrl);
  setTimeout(() => {
    currentAudio.value.play(); // 播放音訊
    isVideoPause.value = true;
  }, 1000);

  // 監聽音訊播放結束
  currentAudio.value.addEventListener("ended", onAudioEnded);
  // 監聽音訊播放狀態
  currentAudio.value.addEventListener("play", onAudioPlay);
  currentAudio.value.addEventListener("pause", onAudioPause);


}

// 音訊結束後暫停影片播放
const onAudioEnded = () => {
  // 清空音訊
  if (currentAudio.value) {
    currentAudio.value.pause();
    currentAudio.value.currentTime = 0;
    currentAudio.value = null;
  }

  // 播放點頭影片
  videoSrc.value = videoSources.value;
  // video.value.loop = true; // 設置循環播放
  videoPlay();


};

// 判斷音訊是否為播放狀態
const onAudioPlay = () => {
  isAudioPlaying.value = true;
  console.log("isAudioPlaying.value", isAudioPlaying.value);
};

const onAudioPause = () => {
  isAudioPlaying.value = false;
  isVideoPause.value = false;
  console.log("isAudioPlaying.value", isAudioPlaying.value);


};

function videoPlay() {
  if (video.value) {
    video.value.load();
    video.value.play();
  }
}
</script>

<template>
  <!-- 漢堡按鈕（僅在 video 模式顯示） -->
  <button v-if="isVideoMode" :class="[
    'absolute top-4 z-50 transition-all duration-300',
    showSidebar ? 'left-52' : 'left-4'
  ]" @click="toggleSidebar">
    <svg class="w-8 h-8 text-white bg-[#345678] p-1 rounded" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  </button>
  <button @click="toggleLayout"
    class="absolute top-4 right-4 z-50 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded shadow">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
      class="size-6">
      <path stroke-linecap="round" stroke-linejoin="round"
        d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
    </svg>

  </button>
  <audio v-if="audioURL" :src="audioURL" controls></audio>
  <!-- 外層容器，左右分欄 -->
  <div class="flex h-screen">
    <div v-if="!isVideoMode || showSidebar"
      class="fixed top-0 left-0 h-screen w-64 bg-[#345678] flex flex-col text-white z-40 transition-transform duration-300"
      :style="{ display: isVideoMode && !showSidebar ? 'none' : 'flex' }">
      <div class="p-4 text-lg font-semibold border-b border-white/20">
        歷史紀錄<br>
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
    <div :class="['flex w-full flex-col md:flex-row h-screen', isReversed ? 'md:flex-row-reverse' : 'md:flex-row']">
      <!-- 左側：虛擬人影片區 -->
      <div class="w-full md:w-1/2 h-1/2 md:h-full flex items-center justify-center bg-[#F5F5F5]">
        <!-- 可放 iframe / video tag / canvas -->
        <!-- <video src="" autoplay muted loop class="w-full h-full object-cover"></video> -->
        <video ref="video" preload playsinline autoplay :muted="isMuted" @ended="onVideoEnded"
          class="w-[65%] h-[100%] mx-auto object-cover">
          <source :src="videoSrc" type="video/mp4" />
        </video>
      </div>

      <!-- 右側：表格與對話區 -->
      <div class="w-full md:w-1/2 h-1/2 md:h-full flex flex-col  md:pt-0 bg-white min-h-0"
        :class="{ 'md:ml-8': isReversed }">
        <!-- 對話與表格內容 -->
        <div v-if="inConversation" ref="chatArea" class="flex-1 overflow-y-auto p-4 space-y-6 h-auto">
          <div v-for="(msg, idx) in currentMessages" :key="idx" class="space-y-2">
            <div v-if="msg.label === 'text'" class="message animate__animated flex" :class="{
              'justify-end': msg.author === 'user',
              'justify-start': msg.author !== 'user',
              animate__fadeInRight: msg.author === 'user',
              animate__fadeInLeft: msg.author !== 'user'
            }">
              <div class="max-w-[90%] sm:max-w-[70%] px-5 py-3"
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

            <!-- 語音輸入按鈕 -->
            <button class="px-4 py-3 absolute right-14"
              :class="isListening ? 'text-red-500 animate-pulse' : 'text-gray-600'" style="bottom: 15px"
              @click="startListening">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
              </svg>
            </button>

            <!-- 送出按鈕 -->
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
  max-width: 90%;
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
