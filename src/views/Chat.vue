<script setup>
import { ref, nextTick, computed, onMounted, watch, onBeforeUnmount, onUnmounted } from "vue";
import { useRoute } from 'vue-router'
import "animate.css";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid'
import Swal from "sweetalert2"

const route = useRoute()

function generateChatId() {
  console.log(`chat_${Date.now()}_${uuidv4()}`)
  return `chat_${Date.now()}_${uuidv4()}`
}

// generateChatId();

const chatId = ref(localStorage.getItem('chat_id') || generateChatId())

const isMobileLandscape = ref(false)

const isDesktopPortrait = ref(false)

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

const isPortrait = computed(() => route.query.o === 'p')

const selectedCharacter = ref('人物1');

function isMobileDevice() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
}

const checkOrientation = () => {
  const isLandscape = window.innerWidth > window.innerHeight
  const isPortrait = !isLandscape

  // 解析網址參數（支援 #/? 格式）
  const hashParams = new URLSearchParams(window.location.hash.split("?")[1])
  const oParam = hashParams.get("o")
  const userId = hashParams.get("userid") || "default1"

  // 判斷是否為手機
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
  const isMobileLandscapeNow = isMobile && isLandscape
  const isMobilePortraitNow = isMobile && isPortrait

  console.log("🧭 狀態偵測：", {
    oParam,
    isMobile,
    isLandscape,
    isMobileLandscapeNow,
    isMobilePortraitNow,
  })

  // 桌機 or 筆電 + o=p 時提醒使用橫版連結
  if (!isMobile && oParam === "p") {
    isDesktopPortrait.value = !isMobile && oParam === 'p'
    // Swal.fire({
    //   title: "💻 建議使用橫向版頁面",
    //   html: `
    //     <p style="font-size:15px; color:#444; line-height:1.6; text-align:left;">
    //       您目前正在使用 <b>桌機或筆電</b> 版本瀏覽。<br><br>
    //       為了獲得更佳的畫面與互動體驗，<br>
    //       建議您使用以下連結開啟橫向版頁面：<br><br>
    //       <a href="https://cmm.ai/nfachat/#/?userid=${userId}&o=l"
    //         style="color:#2563eb; text-decoration:underline; font-weight:500;">
    //         👉 點我前往橫版頁面
    //       </a>
    //     </p>
    //   `,
    //   icon: "info",
    //   confirmButtonText: "我知道了",
    //   confirmButtonColor: "#2563eb",
    //   allowOutsideClick: false,
    //   allowEscapeKey: false,
    //   backdrop: true,
    // })
    // return
  }

  // 手機直向 + o=l 時提醒橫放
  if (isMobile && oParam === "l" && isPortrait) {
    Swal.fire({
      title: "📱 請橫放手機",
      html: `
        <p style="font-size:15px; color:#444; line-height:1.6;">
          為了更好的觀看體驗，請將手機旋轉成橫向模式。<br>
          若您的手機開啟了 <b>直向鎖定</b>，請先將其關閉。
        </p>
      `,
      icon: "info",
      confirmButtonText: "我知道了",
      confirmButtonColor: "#2563eb",
      allowOutsideClick: false,
      allowEscapeKey: false,
      backdrop: true,
    })
    return
  }

  // 其他情況不顯示彈窗
  Swal.close()
}

const userId = computed(() => route.query.userid)

console.log(userId.value);


// onMounted(() => {
//   checkOrientation()
//   window.addEventListener('resize', checkOrientation)
// })

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkOrientation)
})

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
    const res = await axios.get(`https://cmm.ai:8066/history?user_id=${userId.value}&chat_id=all`)
    console.log('取得歷史紀錄：', res.data)
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

    conversations.value = transformedChats;

    conversations.value.unshift({
      chat_id: generateChatId(),
      title: "New Chat",
      messages: [
        {
          author: "bot",
          label: "text",
          answer: "您好，這裡是消防署災害統計小助手，您可以詢問例如：「2023年哪個月份高山症最多？」或「近兩年哪個縣市迷路最多？」請問您想查詢什麼呢？",
        }

      ]
    });

  } catch (err) {
    console.error('錯誤：', err)
  }
}

const currentMessages = computed(() =>
  conversations.value[activeConversationIndex.value].messages
);

function selectConversation(index) {



  activeConversationIndex.value = index;
  console.log('chatid', chatId.value, conversations.value[activeConversationIndex.value])
  chatId.value = conversations.value[activeConversationIndex.value].chat_id;


  console.log(activeConversationIndex.value)
}

function startNewConversation() {
  chatId.value = generateChatId()
  conversations.value.push({
    title: "New Chat",
    messages: []
  });
  activeConversationIndex.value = conversations.value.length - 1;

  console.log('載入完', conversations.values)
}

let video = ref(null);

const videoSpeakSources = ref([]); // 動嘴型影片
const videoSources = ref([]); // 開場白影片(中)

// videoSources.value = ["https://cmm.ai/itri_rescue/Q2/mute.mp4"];

// videoSpeakSources.value = ["https://cmm.ai/itri_rescue/Q2/speak_s.mp4"];



const loadVideoSources = async () => {
  videoSources.value = ["https://cmm.ai/itri_rescue/cache_Q/mute.mp4"];

  videoSpeakSources.value = ["https://cmm.ai/itri_rescue/cache_Q/speak_s.mp4"];

};


// 🔁 當人物切換時，更新 videoSources & videoSpeakSources
watch(selectedCharacter, (newVal) => {
  if (newVal === '人物1') {
    videoSources.value = ["https://cmm.ai/itri_rescue/cache_Q/mute.mp4"];
    videoSpeakSources.value = ["https://cmm.ai/itri_rescue/cache_Q/speak_s.mp4"];
    videoSrc.value = videoSources.value;
    console.log(videoSrc.value)
    videoPlay();

  } else if (newVal === '人物2') {
    videoSources.value = ["https://cmm.ai/itri_rescue/Q2/mute.mp4"];
    videoSpeakSources.value = ["https://cmm.ai/itri_rescue/Q2/speak_s.mp4"];
    videoSrc.value = videoSources.value;

    console.log(newVal)
    console.log(videoSrc.value)

    videoPlay();


  }
});


videoSpeakSources.value = [
  new URL("@/assets/img/speak_s.mp4", import.meta.url).href,
];

const videoSrc = ref('');



const conversations = ref([
  {
    title: "New Chat",
    messages: []
  }
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
  checkOrientation()
  window.addEventListener('resize', checkOrientation)
  videoSrc.value = videoSources.value;
  videoPlay();
  // 偵測是否為桌機模式
  const update = () => {
    isDesktop.value = window.innerWidth >= 768;

    // if (isDesktop.value) showSidebar.value = true;
    // else showSidebar.value = false;
  };

  console.log('當前對話', conversations.value,)
  console.log(' activeConversationIndex.value', conversations.value)


  // setTimeout(() => {
  //   conversations.value[activeConversationIndex.value].messages.push({
  //     author: "bot",
  //     label: "text",
  //     answer: "您好，這裡是消防署災害統計小助手，您可以詢問例如：「2023年哪個月份高山症最多？」或「近兩年哪個縣市迷路最多？」請問您想查詢什麼呢？",

  //   });
  // }, 500);

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
  let url = `https://cmm.ai:8066/ask?question=${messageinput}&chat_id=${chatId.value}&user_id=${userId.value}`;
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
        // 根據目前人物切換來源，決定用 mp4_url 還是 mp4_url2
        if (selectedCharacter.value === '人物1') {
          videoSrc.value = response.data.mp4_url;
        } else if (selectedCharacter.value === '人物2') {
          console.log(selectedCharacter.value)
          videoSrc.value = `https://cmm.ai/itri_rescue/Q2/` + response.data.mp4_url2;
        }
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

// let recognition

// if ('webkitSpeechRecognition' in window) {
//   const SpeechRecognition = window.webkitSpeechRecognition
//   recognition = new SpeechRecognition()
//   recognition.continuous = false
//   recognition.lang = 'zh-TW' // 或 en-US
//   recognition.interimResults = false

//   recognition.onstart = () => {
//     isListening.value = true
//   }

//   recognition.onend = () => {
//     isListening.value = false
//   }

//   recognition.onresult = (event) => {
//     const transcript = event.results[0][0].transcript
//     inputText.value += transcript
//     handleEnter()
//   }
// } else {
//   console.warn('這個瀏覽器不支援語音辨識')
// }

// function startListening() {
//   if (!recognition) return
//   recognition.start()
// }
let recognition

if ('webkitSpeechRecognition' in window) {
  const SpeechRecognition = window.webkitSpeechRecognition
  recognition = new SpeechRecognition()
  recognition.continuous = false
  recognition.lang = 'zh-TW'
  recognition.interimResults = true // ✅ 開啟即時辨識

  recognition.onstart = () => {
    isListening.value = true
  }

  recognition.onend = () => {
    isListening.value = false
  }

  recognition.onresult = (event) => {
    let interimTranscript = ''
    let finalTranscript = ''

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const transcript = event.results[i][0].transcript
      if (event.results[i].isFinal) {
        finalTranscript += transcript
      } else {
        interimTranscript += transcript
      }
    }

    // 顯示暫時文字（即時顯示辨識中內容）
    inputText.value = finalTranscript + interimTranscript

    // 如果已經是最終結果 → 呼叫 handleEnter()
    if (finalTranscript) {
      handleEnter()
    }
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



onMounted(() => {
  window.addEventListener("resize", checkOrientation)
})

onUnmounted(() => {
  window.removeEventListener("resize", checkOrientation)
})

function videoPlay() {
  if (video.value) {
    video.value.load();
    video.value.play();
  }
}

// AI 主播影片播放 & 暫停
function togglePause(val) {
  if (val === "pause") {
    // video.value.pause();
    isVideoPause.value = false;

    if (video.value) {
      video.value.pause();
    }
    if (currentAudio.value) {
      currentAudio.value.pause(); // 暫停音訊
    }
  } else {
    isVideoPause.value = true;

    if (video.value) {
      video.value.play();
    }

    if (currentAudio.value) {
      currentAudio.value.play(); // 播放音訊
      currentAudio.value.addEventListener("ended", onAudioEnded);
    }
  }
}

const playbackSpeed = ref('1')

function updatePlaybackRate() {
  if (video.value) {
    const rate = parseFloat(playbackSpeed.value)
    video.value.pause()            // 先暫停
    video.value.currentTime = 0    // 回到開頭（如果你希望從頭開始播）
    video.value.playbackRate = rate
    video.value.play()             // 重新播放
  }
}

function bindVideoEvents() {
  if (video.value) {
    video.value.addEventListener("loadedmetadata", () => {
      updatePlaybackRate()
    })
  }
}

// 偵測 video 元素變化（切換影片 src 後 video 會 reload）
watch(video, () => {
  bindVideoEvents()
})


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
  <button @click="toggleLayout" v-if="!isPortrait"
    class="hidden md:flex fixed top-10 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded shadow">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
      class="size-6">
      <path stroke-linecap="round" stroke-linejoin="round"
        d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
    </svg>
  </button>
  <audio v-if="audioURL" :src="audioURL" controls></audio>
  <!-- 外層容器，左右分欄 -->
  <div class="flex h-screen transition-all duration-300" :class="{
    'w-full': !isDesktopPortrait,    // 其他情況維持滿版
    'w-2/5 mx-auto': isDesktopPortrait, // 桌機 + o=p 時 50% 並置中
  }">
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
    <div :class="[
      'flex w-full h-screen',
      isPortrait ? 'flex-col' : (isReversed ? 'flex-row-reverse' : 'flex-row')
    ]">
      <!-- 左側：虛擬人影片區 -->
      <div :class="[
        isPortrait ? 'h-1/2 w-full' : 'h-full w-1/2',
        'bg-gray-100 flex items-center justify-center bg-[#F5F5F5] relative'
      ]">
        <!-- 可放 iframe / video tag / canvas -->
        <!-- <video src="" autoplay muted loop class="w-full h-full object-cover"></video> -->
        <video ref="video" preload playsinline autoplay :muted="isMuted" @ended="onVideoEnded" :class="[
          'mx-auto object-cover transition-all duration-300',
          isMobileLandscape ? 'h-[90%]' : 'h-[100%]',
          isDesktopPortrait ? 'w-[40%]' : 'w-[65%]'
        ]">
          <source :src="videoSrc" type="video/mp4" />
        </video>
        <button v-if="isVideoPause" @click="togglePause('pause')" class="control-btn bg-[#345678]"
          :class="isDesktopPortrait ? 'right-[50px]' : 'right-[150px]'">
          <img src="../assets/img/pause-button.png" alt="" />
        </button>

        <button v-else @click="togglePause('play')" class="control-btn bg-[#345678]"
          :class="isDesktopPortrait ? 'right-[50px]' : 'right-[150px]'">
          <img src="../assets/img/play-button.png" alt="" />
        </button>
        <div class="absolute left-4 bottom-4 bg-[#345678] text-white rounded px-2 py-1 text-sm z-10">
          <select v-model="playbackSpeed" @change="updatePlaybackRate" class="bg-transparent text-white border-none outline-none appearance-none
           [&>option]:text-black [&>option]:bg-white">
            <!-- <option value="0.6">更慢</option> -->
            <option value="0.75">慢</option>
            <option value="1">一般</option>
            <option value="1.25">快</option>
          </select>
        </div>
        <div class="absolute right-4 bottom-4 bg-[#345678] text-white rounded px-2 py-1 text-sm z-10">
          <select v-model="selectedCharacter" class="bg-transparent text-white border-none outline-none appearance-none
           [&>option]:text-black [&>option]:bg-white">
            <option value="人物1">人物1</option>
            <option value="人物2">人物2</option>
          </select>
        </div>
      </div>

      <!-- 右側：表格與對話區 -->
      <div
        :class="[isReversed ? 'md:ml-8' : '', isPortrait ? 'h-1/2 w-full' : 'h-full w-1/2', 'flex flex-col  md:pt-0 bg-white min-h-0']">
        <!-- 對話與表格內容 -->
        <div v-if="inConversation" ref="chatArea" class="flex-1 overflow-y-auto p-4 space-y-6 h-auto">
          <div v-for="(msg, idx) in currentMessages" :key="idx" class="space-y-2">
            <div v-if="msg.label === 'text'" class="message animate__animated flex" :class="{
              'justify-end': msg.author === 'user',
              'justify-start': msg.author !== 'user',
              animate__fadeInRight: msg.author === 'user',
              animate__fadeInLeft: msg.author !== 'user'
            }">
              <div class="px-5 py-3 transition-all duration-300" :class="[
                msg.author === 'user' && 'bg-main text-white shadow-lg rounded-full',
                isMobileLandscape ? 'max-w-[100%]' : 'max-w-[90%] sm:max-w-[70%]'
              ]">
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
            <!-- <PaperClipIcon class="w-6 h-6" /> -->
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

.control-btn {
  width: 33px;
  height: 33px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  z-index: 50;
  top: 23px;
  // right: 150px;
  cursor: pointer;
  border: none;
  border-radius: 100px;

  img {
    width: 25px;
    filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(93deg) brightness(103%) contrast(103%);
  }

  @media (max-width: 768px) {
    top: 16px;
    right: 16px;
  }

  @media (max-width: 1080px) and (aspect-ratio: 9/16) {
    width: 66px;
    height: 66px;
    top: 23px;
    right: 50px;

    img {
      width: 50px;
    }
  }
}

@media screen and (max-aspect-ratio: 1/1) {
  .portrait-stack {
    flex-direction: column !important;
  }
}
</style>
