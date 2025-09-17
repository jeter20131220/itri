<script setup>
import { ref, nextTick } from "vue";

const inputText = ref("經典款和豪華款差在哪裡??");
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

const handleEnter = async () => {
  if (inputText.value.trim()) {
    messages.value.push({
      text: inputText.value.trim(),
      image: previewImage.value,
    });
    inputText.value = "";
    clearFile();
    if (!inConversation.value) inConversation.value = true;
    await nextTick();
    scrollToBottom();
  }
};

const scrollToBottom = () => {
  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
};
// const conversations = [
//   { title: "Chat with GPT" },
//   { title: "Project Ideas" },
//   { title: "Learning Korean" },
// ];
// const activeConversation = ref(0);
// const conversations = ref([
//   {
//     title: "Chat with GPT",
//     messages: [
//       { author: "user", label: "text", text: "Hi GPT, can you help me write a poem?" },
//       { author: "bot", label: "text", text: "Of course! What topic would you like the poem to be about?" },
//       { author: "user", label: "text", text: "About the sea and stars." },
//       { author: "bot", label: "text", text: "Here's a short one: 'Beneath the stars, the sea whispers tales only the moon understands.'" }
//     ]
//   },
//   {
//     title: "Project Ideas",
//     messages: [
//       { author: "user", label: "text", text: "I want to build a new side project. Any ideas?" },
//       { author: "bot", label: "text", text: "How about an AI-powered journaling app that gives insights from your entries?" },
//       { author: "user", label: "text", text: "That sounds interesting, tell me more." },
//       { author: "bot", label: "text", text: "It could analyze your mood trends and suggest activities to improve your day." }
//     ]
//   },
//   {
//     title: "Learning Korean",
//     messages: [
//       { author: "user", label: "text", text: "Teach me a simple Korean greeting." },
//       { author: "bot", label: "text", text: "You can say '안녕하세요' (Annyeonghaseyo), which means 'Hello'." },
//       { author: "user", label: "text", text: "How do I say 'thank you'?" },
//       { author: "bot", label: "text", text: "You can say '감사합니다' (Gamsahamnida)." }
//     ]
//   },
//   {
//     title: "Business Questions",
//     messages: [
//       { author: "user", label: "text", text: "What's a good strategy to price SaaS products?" },
//       { author: "bot", label: "text", text: "Consider value-based pricing. Understand what your users gain and set your price accordingly." },
//       { author: "user", label: "text", text: "Is tiered pricing better?" },
//       { author: "bot", label: "text", text: "Often yes, it lets you capture different customer segments and maximize revenue." }
//     ]
//   },
//   {
//     title: "Daily Reflections",
//     messages: [
//       { author: "user", label: "text", text: "I feel unmotivated today." },
//       { author: "bot", label: "text", text: "That's okay. Everyone has days like this. Try doing one small thing to build momentum." },
//       { author: "user", label: "text", text: "Maybe I'll go for a walk." },
//       { author: "bot", label: "text", text: "Perfect choice. Fresh air and movement often help clear the mind." }
//     ]
//   }
// ]);
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- 對話區塊 -->
    <div v-if="inConversation" class="flex-1 overflow-y-auto p-4 space-y-6">
      <div v-for="(msg, idx) in messages" :key="idx" class="space-y-2">
        <!-- 使用者 -->
        <div class="flex justify-end">
          <div class="max-w-[90%] sm:max-w-[70%] bg-main2 text-white px-5 py-3 shadow-lg rounded-full">
            <p class="whitespace-pre-wrap">{{ msg.text }}</p>
            <img v-if="msg.image" :src="msg.image" class="mt-2 rounded w-48" />
          </div>
        </div>

        <!-- AI -->
        <div class="flex justify-start">
          <div class="max-w-[100%] sm:max-w-[70%] bg-white px-5 py-3 text-gray-800 rounded-full">
            <div style="display: none;" class="space-y-4">
              <p>
                請洽服務廠預約保養時間，將由服務廠依照您車輛的保養及狀況，安排雙方可行的時間。
              </p>
              <div class="space-y-2">
                <div>
                  <a href="https://www.toyota.com.tw/owner_login.aspx" target="_blank"
                    class="inline-block bg-[#E60012] text-white px-4 py-2 rounded hover:bg-red-700 transition">
                    官網預約
                  </a>
                </div>
                <div>
                  <a href="https://www.toyota.com.tw/location.aspx" target="_blank"
                    class="inline-block bg-[#E60012] text-white px-4 py-2 rounded hover:bg-red-700 transition">
                    據點查詢
                  </a>
                </div>

                <button class="inline-block bg-[#E60012] text-white px-4 py-2 rounded cursor-default">
                  下載「My Toyota APP」
                </button>
                <p>可預約定期保養</p>
              </div>
            </div>




            <div >
              <!-- <p>這是模擬的回覆內容。</p> -->
              <h1>TOYOTA ALTIS 經典款與豪華款的主要差異</h1>

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
              </p>
            </div>

          </div>
        </div>
        <!-- 使用者 -->
        <!-- <div class="flex justify-end">
          <div class="max-w-[90%] sm:max-w-[70%] bg-main2 text-white px-5 py-3 shadow-lg rounded-full">
            <p class="whitespace-pre-wrap">TOYOTA車款的規格、標準配備及售價，要從哪裡查詢?</p>

          </div>
        </div>
        <div  class="max-w-[100%] sm:max-w-[70%] bg-white px-5 py-3 text-gray-800 rounded-full">
          <p>
            請於下方點選您有興趣的車款，以獲取更多資訊。
          </p>
          <p>
            規格、標準配備及售價請參考該車款網頁最下方的「售價規配」，點選「看完整規配」可查詢最完整資訊。
          </p>
          <div>
            <strong>轎車：</strong><br>
            <a href="#" class="text-[#E60012] block">VIOS</a>
            <a href="#" class="text-[#E60012] block">ALTIS</a>
            <a href="#" class="text-[#E60012] block">ALTIS GR SPORT</a>
            <a href="#" class="text-[#E60012] block">CAMRY</a>
          </div>

          <div>
            <strong>掀背車：</strong><br>
            <a href="#" class="text-[#E60012] block">YARIS</a>
            <a href="#" class="text-[#E60012] block">COROLLA SPORT</a>
            <a href="#" class="text-[#E60012] block">PRIUS PHV</a>
          </div>

          <div>
            <strong>油電複合車：</strong><br>
            <a href="#" class="text-[#E60012] block">ALTIS</a>
            <a href="#" class="text-[#E60012] block">ALTIS GR SPORT</a>
            <a href="#" class="text-[#E60012] block">COROLLA CROSS</a>
            <a href="#" class="text-[#E60012] block">COROLLA CROSS GR SPORT</a>
            <a href="#" class="text-[#E60012] block">CAMRY</a>
            <a href="#" class="text-[#E60012] block">RAV4</a>
            <a href="#" class="text-[#E60012] block">ALPHARD</a>
            <a href="#" class="text-[#E60012] block">SIENNA</a>
            <a href="#" class="text-[#E60012] block">CROWN</a>
          </div>

          <div>
            <strong>插電式油電複合車：</strong><br>
            <a href="#" class="text-[#E60012] block">PRIUS PHV</a>
          </div>

          <div>
            <strong>複合式電動車：</strong><br>
            <a href="#" class="text-[#E60012] block">PRIUS PHEV</a>
          </div>

          <div>
            <strong>純電休旅車：</strong><br>
            <a href="#" class="text-[#E60012] block">bZ4X</a>
          </div>

          <div>
            <strong>運動休旅車：</strong><br>
            <a href="#" class="text-[#E60012] block">COROLLA CROSS</a>
            <a href="#" class="text-[#E60012] block">COROLLA CROSS GR SPORT</a>
            <a href="#" class="text-[#E60012] block">C-HR</a>
            <a href="#" class="text-[#E60012] block">RAV4</a>
            <a href="#" class="text-[#E60012] block">HILUX</a>
            <a href="#" class="text-[#E60012] block">PRADO</a>
            <a href="#" class="text-[#E60012] block">CROWN</a>
          </div>

          <div>
            <strong>多功能休旅車：</strong><br>
            <a href="#" class="text-[#E60012] block">SIENTA</a>
            <a href="#" class="text-[#E60012] block">ALPHARD</a>
            <a href="#" class="text-[#E60012] block">SIENNA</a>
          </div>

          <div>
            <strong>跑車：</strong><br>
            <a href="#" class="text-[#E60012] block">GR SUPRA</a>
            <a href="#" class="text-[#E60012] block">GR YARIS</a>
            <a href="#" class="text-[#E60012] block">GR86</a>
          </div>

          <div>
            <strong>貨車：</strong><br>
            <a href="#" class="text-[#E60012] block">HILUX</a>
            <a href="#" class="text-[#E60012] block">HIACE</a>
          </div>

          <div>
            <strong>輕型商用車：</strong><br>
            <a href="#" class="text-[#E60012] block">TOWN ACE</a>
            <a href="#" class="text-[#E60012] block">TOWN ACE VAN</a>
          </div>

          <div>
            <strong>商旅車：</strong><br>
            <a href="#" class="text-[#E60012] block">GRANVIA</a>
          </div>
        </div> -->
      </div>
    </div>

    <!-- 初始畫面（輸入頁） -->
    <!-- <div v-else class="flex-1 flex items-center justify-center">
      <div class="w-full max-w-2xl p-6 space-y-4 text-center">
        <h2 class="text-4xl font-semibold text-gray-900 mb-10">
          What can I help you ship?
        </h2>
        <div class="flex items-end rounded-lg p-3 bg-white relative">
          
          <textarea
            v-model="inputText"
            @keydown.enter.prevent="handleEnter"
            @keydown.shift.enter.stop
            rows="4"
            placeholder="Ask anything..."
            class="w-full py-4 ps-4 pr-12 border border-gray-200 shadow-lg outline-none rounded-xl resize-none"
          ></textarea>

          <button
            @click="handleEnter"
            class="text-blue-500 hover:bg-transparent hover:text-opacity-50 absolute right-5 bottom-5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-8"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m15 11.25-3-3m0 0-3 3m3-3v7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </button>
        </div>

        <div v-if="previewImage" class="relative w-48">
          <img
            :src="previewImage"
            alt="預覽圖片"
            class="w-full h-auto rounded"
          />
          <button
            @click="clearFile"
            class="absolute top-1 right-1 bg-white rounded-full px-2 py-1 text-sm shadow"
          >
            ✕
          </button>
        </div>
      </div>
    </div>  -->

    <!-- 下方輸入區（對話模式） -->
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
</style>
