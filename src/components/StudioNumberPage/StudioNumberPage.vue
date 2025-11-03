<template>
  <MainPage>
    <!-- Tab Navigation -->
    <HomePageTab v-model:activeTab="activeTab" />

    <!-- Header -->
    <div
      class="sticky top-0 z-10 bg-white bg-opacity-90 backdrop-blur rounded-xl shadow-md p-4 space-y-3"
    >
      <h2 class="text-xl font-bold text-black">{{ studioName.toUpperCase() }}</h2>
    </div>

    <!-- Studio Cards -->
    <div
      v-for="studio in studioNumbersData"
      :key="studio.studio_number_id"
      class="bg-gradient-to-br hover:ring-2 hover:ring-blue-400 from-white via-gray-50 to-gray-100 rounded-2xl shadow-md border-2 border-black hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      <img
        :src="studio.studio_number_pictures"
        alt="venue"
        class="w-full h-48 object-cover rounded-t-2xl"
      />

      <div class="p-4 space-y-4">
        <h3 class="font-bold text-gray-900 text-lg">
          🎵 Studio {{ studio.studio_number }}
        </h3>

        <hr class="border-t border-black" />

        <div class="text-sm text-gray-700 space-y-1">
          <div
            v-for="equipment in studio.studio_equipments"
            :key="equipment.name"
            class="flex items-center gap-2"
          >
            <span class="text-base">{{ getEquipmentIcon(equipment.name) }}</span>
            <span>{{ equipment.name }}: {{ equipment.quantity }}</span>
          </div>
        </div>

        <hr class="border-t border-black" />

        <div class="space-y-1">
          <div
            v-for="price in studio.studio_prices"
            :key="price.day_type"
            class="text-sm text-gray-800"
          >
            <span class="font-medium">
              {{ price.day_type === 'weekday' ? '📅 Weekday' : '🗓️ Weekend' }}:
            </span>
            <span class="text-primary font-semibold">
              Rp {{ Number(price.price).toLocaleString('id-ID') }}
            </span>
          </div>
        </div>

        <div class="pt-4">
          <router-link
            :to="`/list-studio/${studio.studio_uuid}/books/${studio.studio_number_uuid}`"
          >
            <button
              class="w-full !bg-blue-600 hover:!bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 cursor-pointer"
            >
              Book Now!
            </button>
          </router-link>
        </div>
      </div>
    </div>
  </MainPage>
</template>

<script>
import { fetchStudioNumbers } from "./StudioNumberPage.js";
import MainPage from "../MainPage/MainPage.vue";
import HomePageTab from "../HomePageTab/HomePageTab.vue";

export default {
  components: { MainPage, HomePageTab },

  data() {
    return {
      studioNumbers: [],
      studioName: "",
      activeTab: "", // Default tab
    };
  },

  computed: {
    studioNumbersData() {
      return this.studioNumbers;
    },
  },

  async mounted() {
    const studioId = this.$route.params.studioId;
    const { studios, studio_name } = await fetchStudioNumbers(studioId);
    this.studioNumbers = studios;
    this.studioName = studio_name;
  },

  watch: {
    activeTab(newValue) {
      this.$router.push({path : `/list-studio`, query: { tab: newValue }});
    },
  },

  methods: {
    getEquipmentIcon(name) {
      const lower = name.toLowerCase();
      if (lower.includes("microphone")) return "🎤";
      if (lower.includes("drum")) return "🥁";
      if (lower.includes("guitar")) return "🎸";
      if (lower.includes("bass")) return "🪕";
      if (lower.includes("keyboard") || lower.includes("piano")) return "🎹";
      if (lower.includes("ampli") || lower.includes("amplifier")) return "🔊";
      if (lower.includes("cable") || lower.includes("kabel")) return "🔌";
      return "🎚️";
    },
  },
};
</script>
