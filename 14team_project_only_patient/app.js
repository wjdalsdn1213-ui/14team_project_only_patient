const sliderImage = document.getElementById("sliderImage");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const imageUpload = document.getElementById("imageUpload");
const slideStatus = document.getElementById("slideStatus");
const noticeForm = document.getElementById("noticeForm");
const noticeInput = document.getElementById("noticeInput");
const noticeList = document.getElementById("noticeList");
const mapStatus = document.getElementById("mapStatus");
const rehabMapFrame = document.getElementById("rehabMapFrame");
const loginBtn = document.getElementById("loginBtn");
const idInput = document.getElementById("idInput");
const pwInput = document.getElementById("pwInput");

let images = [
  "https://picsum.photos/900/450?random=1",
  "https://picsum.photos/900/450?random=2",
  "https://picsum.photos/900/450?random=3",
];
let currentIndex = 0;

function renderSlide() {
  sliderImage.src = images[currentIndex];
  slideStatus.textContent = `${currentIndex + 1} / ${images.length}`;
}

function showPrevious() {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  renderSlide();
}

function showNext() {
  currentIndex = (currentIndex + 1) % images.length;
  renderSlide();
}

function addUploadedImages(event) {
  const files = Array.from(event.target.files || []);
  if (files.length === 0) return;

  const uploadedUrls = files
    .filter((file) => file.type.startsWith("image/"))
    .map((file) => URL.createObjectURL(file));

  if (uploadedUrls.length === 0) return;

  images = [...images, ...uploadedUrls];
  currentIndex = images.length - uploadedUrls.length;
  renderSlide();
}

function addNotice(event) {
  event.preventDefault();

  const text = noticeInput.value.trim();
  if (!text) return;

  const item = document.createElement("li");
  item.className = "notice-item";
  item.textContent = `[공지] ${text}`;

  noticeList.prepend(item);
  noticeInput.value = "";
}

function setMapStatus(text) {
  if (mapStatus) {
    mapStatus.textContent = text;
  }
}

async function loadNearbyRehabHospitals(latitude, longitude) {
  const query = encodeURIComponent("재활의학과");
  rehabMapFrame.src = `https://www.google.com/maps?q=${latitude},${longitude}+${query}&z=14&output=embed`;
  setMapStatus("현재 위치 기준 근처 재활의학과를 Google Maps로 표시했습니다.");
}

function initializeRehabMap() {
  if (!rehabMapFrame) return;

  if (!navigator.geolocation) {
    rehabMapFrame.src =
      "https://www.google.com/maps?q=%EC%9E%AC%ED%99%9C%EC%9D%98%ED%95%99%EA%B3%BC&output=embed";
    setMapStatus("GPS를 지원하지 않아 기본 검색 지도를 표시합니다.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      try {
        await loadNearbyRehabHospitals(latitude, longitude);
      } catch (error) {
        setMapStatus("병원 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
      }
    },
    () => {
      rehabMapFrame.src =
        "https://www.google.com/maps?q=%EC%9E%AC%ED%99%9C%EC%9D%98%ED%95%99%EA%B3%BC&output=embed";
      setMapStatus("위치 권한이 없어 기본 검색 지도를 표시합니다.");
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}

function tryLogin() {
  if (!idInput || !pwInput) return;

  const id = idInput.value.trim();
  const pw = pwInput.value;

  if (id === "admin" && pw === "1234") {
    window.location.href = "dashboard.html";
    return;
  }

  alert("ID 또는 PW가 올바르지 않습니다.");
}

prevBtn.addEventListener("click", showPrevious);
nextBtn.addEventListener("click", showNext);
imageUpload.addEventListener("change", addUploadedImages);
noticeForm.addEventListener("submit", addNotice);
loginBtn.addEventListener("click", tryLogin);
pwInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    tryLogin();
  }
});

renderSlide();
initializeRehabMap();
