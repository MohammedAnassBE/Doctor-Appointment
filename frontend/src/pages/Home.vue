<template>
  <div class="max-w-full h-[1000px] bg-purple-200">
    <div class="p-[100px] w-[1830px] rounded">
      <div class="max-w-full h-auto pb-10 bg-blue-200 shadow-2xl shadow-md rounded "> 
        <div class="max-w-full h-20 shadow-xl flex flex-row bg-white rounded-t-lg">
          <div class="w-[200px] h-20 bg-blue-600 flex items-center rounded-tl-lg justify-center">
            <h1 class="font-bold text-white text-[30px]" :class="{ 'blur': check }">Med Co</h1>
          </div>
          <div class="w-[1000px] h-20 flex items-center">
            <div class="custom-dropdown">
              <div class="selected-option" @click="toggleDropdown()">
                <div class="selected-info">
                  <div class="logo">
                    <img :src="selectedDoctor.poster" alt="selectedDoctor.name" v-if="selectedDoctor.poster">
                  </div>
                  <span class="doctor-name">{{ selectedDoctor.name }}</span>
                </div>
              </div>
              <div class="options" v-if="isOpen">
                <div v-for="doctor in doctorsList.data" :key="doctor.name" @click="selectDoctor(doctor)">
                  <div class="logo">
                    <img :src="doctor.poster" alt="">
                  </div>
                  <span class="doctor-name">{{ doctor.name }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="w-[150px] flex items-center justify-center">
            <router-link :to="{ name: 'AppointmentsPage' ,params:{todayDate : 'today'} }">
              <button class="shadow-2xl rounded h-10 w-40">Appointments</button>
            </router-link>
          </div>
          <div class="w-[150px] flex items-center justify-center">
            <button class="shadow-2xl rounded h-10 w-20">Walk-In</button>
          </div>
          <div class="w-[150px] flex items-center justify-center">
            <div class="logo">
              <img src="../assets/settings-svgrepo-com.svg" alt="">
            </div>
          </div>
        </div>
        <div class="max-w-full bg-blue-200" @click="selectedPeriod=null,selectedTime=null">
          <div class="flex flex-row">
            <div class="pl-20 p-4 mt-7">
              <h1 class="font-bold text-black text-[30px]">Appointments | </h1>
            </div>
            <div class="p-5 mt-9 flex flex-row">
              <div>
                <h1 class="text-blue text-[15px] text-blue-900" style="cursor: pointer;text-decoration: underline;">Home</h1>
              </div>
              <div>
                <h1 class="text-black text-[15px]" style="cursor: pointer;"> >>> Appointments</h1>
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-row">
          <div class="pl-20">
            <VDatePicker style="width: 430px; height: 250px;" v-model="dates" :color="selectedColor"/>
          </div>
          <div class="p-5 w-[1000px] h-auto shadow-2xl bg-white rounded ml-10">
            <div class="relative">
              <div class="absolute top-0 right-0 p-2" style="cursor: pointer;">
                <router-link :to="{ name: 'NewSlot', params: { periodTime: 'Morning' }, 
                  query: { sendDate: `${dates.getDate()}-${dates.getMonth()+1}-${dates.getFullYear()}`, sendDoctor:selectedDoctor.name } }">
                  <h1 class="text-blue-900">+ Add Slots</h1>
                </router-link>
              </div>
              <div class="logo-container">
                <div class="logo">
                  <img src="../assets/sunrise-morning-svgrepo-com.svg" alt="">
                </div>
                <div class="text-container">
                  <h1>Morning</h1>
                  <p>9.00 AM to 12.00 PM</p>
                </div>
              </div>
              <div class="flex flex-wrap mt-4">
                <template v-for="time in times.data" :key="time">
                  <div v-if="time.period === 'Morning'" :class="{'booked':getClass(time.time, time.period,selectedDoctor.name,dates)}"
                    class="shadow-2xl flex flex-col items-center justify-center mr-4 mb-4 w-[120px] h-12 rounded">
                    <label class="flex items-center" :for="time.time" >
                      <input type="radio" :id="time.time" @click="toggleConfirmation(time.time, time.period)" v-model="selectedTimeAfternoon" :value="time.time">
                      <span class="ml-2">{{ time.time }}</span>
                    </label>
                    <div v-if="selectedTime === time.time && selectedPeriod === time.period && !confirmationTime" class="flex mt-2">
                      <button class="w-20 bg-blue-300 rounded mr-2" @click="confirmSelection(time.period,time.time)">Confirm</button>
                      <button class="w-20 bg-red-300 rounded" @click="cancelSelection">Cancel</button>
                    </div>
                  </div>
                </template>
                <template v-for="time in addSlots.data" :key="time">
                  <div v-if="time.period === 'Morning' && time.doctor_name === selectedDoctor.name && time.day === `${dates.getDate()}-${dates.getMonth()+1}-${dates.getFullYear()}`" :class="{'booked':getClass(time.time, time.period,selectedDoctor.name,dates)}"
                    class="shadow-2xl flex flex-col items-center justify-center mr-4 mb-4 w-[120px] h-12 rounded">
                    <label class="flex items-center" :for="time.time" >
                      <input type="radio" :id="time.time" @click="toggleConfirmation(time.time, time.period)" v-model="selectedTimeAfternoon" :value="time.time">
                      <span class="ml-2">{{ time.time }}</span>
                    </label>
                    <div v-if="selectedTime === time.time && selectedPeriod === time.period && !confirmationTime" class="flex mt-2">
                      <button class="w-20 bg-blue-300 rounded mr-2" @click="confirmSelection(time.period,time.time)">Confirm</button>
                      <button class="w-20 bg-red-300 rounded" @click="cancelSelection">Cancel</button>
                    </div>
                  </div>
                </template>
              </div>
            </div>
            <div class="relative">  
              <div class="absolute top-0 right-0 p-2" style="cursor: pointer;">
                <router-link :to="{ name: 'NewSlot', params: { periodTime: 'Afternoon' }, 
                  query: { sendDate: `${dates.getDate()}-${dates.getMonth()+1}-${dates.getFullYear()}`, sendDoctor:selectedDoctor.name } }">
                  <h1 class="text-blue-900">+ Add Slots</h1>
                </router-link>
              </div>
              <div class="logo-container">
                <div class="logo">
                  <img src="../assets/sunrise-morning-svgrepo-com.svg" alt="">
                </div>
                <div class="text-container">
                  <h1>Afternoon</h1>
                  <p>05.00 PM to 09.00 PM</p>
                </div>
              </div>
              <div class="flex flex-wrap mt-4">
                <template v-for="time in times.data" :key="time">
                  <div v-if="time.period === 'Afternoon'" class="shadow-2xl flex flex-col items-center justify-center mr-4 mb-4 w-[120px] h-12 rounded" 
                    :class="{'booked':getClass(time.time, time.period,selectedDoctor.name,dates)}">
                    <label class="flex items-center" :for="time.time">
                      <input type="radio" :id="time.time" @click="toggleConfirmation(time.time, time.period)" v-model="selectedTimeAfternoon" :value="time.time">
                      <span class="ml-2">{{ time.time }}</span>
                    </label>
                    <div v-if="selectedTime === time.time && selectedPeriod === time.period && !confirmationTime" class="flex mt-2">
                      <button class="w-20 bg-blue-300 rounded mr-2" @click="confirmSelection(time.period,time.time)">Confirm</button>
                      <button class="w-20 bg-red-300 rounded" @click="cancelSelection(time.period,time.time)">Cancel</button>
                    </div>
                  </div>
                </template>
                <template v-for="time in addSlots.data" :key="time">
                  <div v-if="time.period === 'Afternoon' && time.doctor_name === selectedDoctor.name && time.day === `${dates.getDate()}-${dates.getMonth()+1}-${dates.getFullYear()}`" :class="{'booked':getClass(time.time, time.period,selectedDoctor.name,dates)}"
                    class="shadow-2xl flex flex-col items-center justify-center mr-4 mb-4 w-[120px] h-12 rounded">
                    <label class="flex items-center" :for="time.time" >
                      <input type="radio" :id="time.time" @click="toggleConfirmation(time.time, time.period)" v-model="selectedTimeAfternoon" :value="time.time">
                      <span class="ml-2">{{ time.time }}</span>
                    </label>
                    <div v-if="selectedTime === time.time && selectedPeriod === time.period && !confirmationTime" class="flex mt-2">
                      <button class="w-20 bg-blue-300 rounded mr-2" @click="confirmSelection(time.period,time.time)">Confirm</button>
                      <button class="w-20 bg-red-300 rounded" @click="cancelSelection">Cancel</button>
                    </div>
                  </div>
                </template>
              </div>
            </div>
            <div class="relative">
              <div class="absolute top-0 right-0 p-2" style="cursor: pointer;">
                <h1 class="text-blue-900">+ Add Slots</h1>
              </div>  
              <div class="logo-container">
                <div class="logo">
                  <img src="../assets/clock-svgrepo-com.svg" alt="">
                </div>
                <div class="text-container">
                  <h1>Waiting List</h1>
                </div>
              </div>
            </div>  
          </div>  
        </div>  
      </div>
    </div>
  </div>
  
</template>

<script setup>
import { createListResource } from 'frappe-ui';
import {ref, computed} from 'vue';

const check=ref(false);
const selectedColor = ref('green')
const dates = ref(new Date());
const currentDate = ref(new Date());
// const today=`${currentDate.getDate()}-${currentDate.getMonth()+1}-${currentDate.getFullYear()}`;
const addSlots = createListResource({
    doctype:'Additional Appointments',
    fields: ['name','doctor_name','day','time','period'],
    auto: true,
})
const doctorsList = createListResource({
  doctype: 'Doctors',
  fields:['name','doctor_name','poster'],
  auto:true,
});
const times = createListResource({
  doctype: 'Apoointments',
  fields: ['name', 'period', 'time'],
  auto: true,
});
const appointmentList = createListResource({
  doctype: 'Appointment List',
  fields: ['doctor_name','day','time','period'],
  insert:{},
  auto: true,
})
const isOpen=ref(false);
const selectedDoctor=ref({name:'Mohammed Anas',poster:''});

function toggleDropdown() {
  this.isOpen = !this.isOpen;
}
function selectDoctor(doctorName) {
  this.selectedDoctor = doctorName;
  this.isOpen = false;
}
const selectedTimeMorning = ref(null);
const selectedTimeAfternoon = ref(null);
const confirmationTime = ref(null);
const confirmationPeriod = ref(null);
const selectedPeriod=ref(null);
const selectedTime=ref(null);

function toggleConfirmation(time, period) {
  selectedTime.value=time;
  selectedPeriod.value = period;
}
function getClass(confirmTime, confirmPeriod,doctor,day) {
  day=`${day.getDate()}-${day.getMonth()+1}-${day.getFullYear()}`;
  return appointmentList.data.some(appointment =>{
    return appointment.day === day && appointment.doctor_name === doctor && appointment.time === confirmTime && appointment.period === confirmPeriod;
  });
}
function confirmSelection(period,time) {
  if(period==='Morning'){
    selectedTimeAfternoon.value=null;
  }
  else{
    selectedTimeMorning.value=null;
  }
  if(confirmationTime.value !== null && confirmationPeriod.value !== null){
    return;
  }
  if(selectedDoctor.value.name === ''){
    alert("Select The Doctor");
  }
  else if((currentDate.value.getMonth()+1) >= (dates.value.getMonth()+1) && currentDate.value.getDate() > dates.value.getDate()){
    alert("Select valid date");
  }
  else{
    confirmationTime.value = time;
    confirmationPeriod.value = period;
    
    appointmentList.insert.submit({
      doctor_name:selectedDoctor.value.name,
      day:`${dates.value.getDate()}-${dates.value.getMonth()+1}-${dates.value.getFullYear()}`,
      time:confirmationTime.value,
      period:confirmationPeriod.value,
    })
  }
}
function cancelSelection(period,time) {
  if(selectedPeriod.value === confirmationPeriod.value && selectedTime.value === confirmationTime.value){
    selectedTimeMorning.value = null;
    selectedTimeAfternoon.value = null;
    confirmationTime.value = null;
    confirmationPeriod.value =null;
    selectedPeriod.value=null;
    selectedTime.value=null;
  }
}
</script>
<style scoped>
.blur {
  filter: blur(3px); /* Adjust the blur amount as needed */
}
input[type="radio"] {
  display: none;
}
.booked{
  background-color: blue;
  color: white;
  pointer-events: none;
}
.logo-container {
  display: flex;
  align-items: center;
  margin-top: 20px; /* Adjust margin as needed */
}
.logo {
  width: 50px; /* Adjust the size of the logo as needed */
  height: 50px;
  border-radius: 50%; /* Make it a circle */
  overflow: hidden; 
  margin-right: 10px; 
}
.logo img {
  width: 100%; 
  height: auto;
}
.text-container {
  display: flex;
  flex-direction: column;
}
.text-container h1 {
  font-weight: bold;
  color: black;
  font-size: 25px; /* Adjust font size as needed */
  margin: 0; /* Remove default margin */
}
.text-container p {
  color: black;
  font-size: 10px; /* Adjust font size as needed */
  margin: 0; /* Remove default margin */
}
.custom-dropdown {
  position: relative;
  width: 200px; /* Set the width of the dropdown */
}
.selected-option {
  padding: 10px;
  cursor: pointer;
}
.selected-info {
  display: flex;
  align-items: center;
}
.doctor-name {
  margin-right: 10px; /* Add space between doctor name and image */
}
.logo img {
  width: 40px; /* Adjust the size of the image */
  height: 40px;
  border-radius: 50%; /* Make the image round */
}
.options {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  background-color: #fff;
  border: 1px solid #ccc;
  border-top: none;
  max-height: 200px; /* Set max height for options to enable scrolling */
  overflow-y: auto;
}
.options div {
  padding: 10px;
  cursor: pointer;
  display: flex;
  align-items: center; /* Center image and text vertically */
}
.options div img {
  margin-right: 10px; /* Add space between image and text */
}
.options div:hover {
  background-color: #f0f0f0;
}
</style>