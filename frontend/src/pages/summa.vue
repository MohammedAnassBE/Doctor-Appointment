<template>
  <div class="body">
    <div class="main">
      <div class="head">
        <img class="obj1" src="../assets/photoroom1.png" alt="heads">
        <img class="obj2" src="../assets/removebg.png" alt="upper">
        <div class="text"> 
          <h1>We focus on your Story</h1>
          <h5>Because our goal, as accountants, is to provide you with a list of services that are very reliable as you go across your business journey...</h5>
        </div>
      </div>
      <div class="text1"> 
        <h1>Select Service</h1>
      </div>
      <div class="outer"> 
        <div class="grid m-5"> 
          <template v-for="service of serviceList.data" :key="service">
            <div class="pad"
              :class="{ 'selected': bookingData.Service === service.services }"
              @mouseover="handleMouseOver($event)" @mouseleave="handleMouseLeave($event)" 
              @change="updateSelectedService(service)">
              <label class="radio-label" :for="service.id">
                <input class="inp" type="radio" :id="service.id" name="serve" :value="service">
                <span>{{ service.name }}</span>
              </label>
            </div>
          </template>
        </div>
      </div>
      <div class="text1"> 
        <h1> Select Date & Time</h1>
      </div>
      <div class="outer2 flex flex-row items-center">
        <div class="date flex-grow">
          <VDatePicker v-model='selectedDate'
            is-double-paned 
            :type="type" 
            class="custom-calendar"
          />
        </div>
        <div class="time-grid flex-grow">
          <template v-for="time in times.data" :key="time">
            <Button
              class="grid-item bg-white-500 rounded-lg p-4 m-5"
              :class="{
                'selected': bookingData.time === time.servicetime,
                'booked':isSlotBooked(time.servicetime,bookingData.date),
                'unavailable':isSlotBooked(time.servicetime, bookingData.date)
              }"
              @mouseover="handleMouseOver($event)"
              @mouseleave="handleMouseLeave($event)"
              @click="handleButtonClick(time.servicetime,time.session)"
              :disabled="isSlotBooked(time.servicetime,bookingData.date)"
            >
              {{ time.servicetime }} {{ time.session }}
            </Button>
          </template> 
        </div>
      </div>
      <div class="notification ml-[120px] mb-5">
        <div class="not"> 
            <input type="checkbox" style="background-color: green;margin-right:10px">
            <label>Booked</label>
        </div>
        <div class="not"> 
            <input type="checkbox" style="background-color: blue;margin-right:10px">
            <label>Selected</label>
        </div>
        <div class="not"> 
            <input type="checkbox" style="background-color: white;margin-right:10px">
            <label>Available</label>
        </div>
      </div>    
      <div class="text1"> 
        <h1>Add your details</h1>
      </div>
      <div class="outer1"> 
        <div class="input-container"> 
          <label for="name">Name</label>
          <input v-model="bookingData.name" type="text" id="name" placeholder="Name">
        </div>
        <div class="input-container"> 
          <label for="email">Email</label>
          <input v-model="bookingData.email" type="text" id="email" placeholder="Email">
        </div>
        <div class="input-container"> 
          <label for="phone">Phone</label>
          <input v-model="bookingData.number" type="text" id="phone" placeholder="Phone Number">
        </div>
      </div>
      <div class="button-container">
        <Button size="lg" variant="subtle" @click="dataSubmit">
          Confirm Appointmentt
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch} from "vue";
import { createListResource } from 'frappe-ui';

const currentData = ref(new Date());
const bookingData = reactive({
  Service: '',
  date : ${currentData.value.getDate()}-${currentData.value.getMonth() + 1}-${currentData.value.getFullYear()},
  time : '',
  session : '',
  name: '',
  email: '',
  number: ''
});


watch(currentData, (newValue) => {
  bookingData.date = ${newValue.getDate()}-${newValue.getMonth() + 1}-${newValue.getFullYear()};
});

const selectedDate = computed({
  get: () => new Date(bookingData.date),
  set: (value) => {
    currentData.value = value;
    console.log(currentData)
  }
});

const appointmentList = createListResource({
  doctype: 'AppointmentDetails',
  fields: ['name', 'date','slot_timing','session'],
  auto: true,
});


const serviceList = createListResource({
  doctype: 'Services',
  fields: ['name', 'services'],
  auto: true,
});

const times = createListResource({
  doctype: 'Time',
  fields: ['name', 'servicetime', 'session'],
  sort: [{ fieldname: 'session', direction: 'asc' }], // Sort by session field in ascending order
  auto: true,
});

const  Booking = createListResource({
    doctype:"AppointmentDetails",
    insert:{
        onSuccess(){
            console.log("Booking created")
        }
    }
})
function updateSelectedService(service) {
  bookingData.Service = service.name;
}
function handleButtonClick(a, b) {
  bookingData.time = a;
  bookingData.session = b;
}
function handleMouseOver(event) {
  event.currentTarget.style.backgroundColor = 'blue';
  event.currentTarget.querySelector('span').style.color = 'white';
}

function handleMouseLeave(event) {
  event.currentTarget.style.backgroundColor = ''; 
  event.currentTarget.querySelector('span').style.color = '';
}
async function dataSubmit() {
  if (
    bookingData.name !== '' &&
    bookingData.email !== '' &&
    bookingData.number !== '' &&
    bookingData.Service !== '' &&
    bookingData.date !== '' &&
    bookingData.time !== '' &&
    bookingData.session !== ''
  ) {
    try {
      await Booking.insert.submit({
        applicant_name: bookingData.name,
        applicant_email_id: bookingData.email,
        applicant_phone_number: bookingData.number,
        service: bookingData.Service,
        date: bookingData.date,
        slot_timing: bookingData.time,
        session: bookingData.session
      });
      console.log('Data submitted successfully!');
      alert('Appintment Booked');
      setTimeout(()=>{
        window.location.reload();
      },2000);
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  } else {
    console.error('Error: All fields are required');
    alert('Please fill in all fields before submitting.');
  }
}
function isSlotBooked(slotTime, date){
  return appointmentList.data.some(appointment =>{
    return appointment.date === date && appointment.slot_timing === slotTime;
  });
}

</script>


<style scoped>

.body{
}

.main {
  margin: 8% 10%;
  width: 80%;
  height: auto;
  background-color: rgb(255, 255, 255);
  border-radius: 20px;
  border: 7px solid #000;
}

.head {
  position: relative;
  margin: 2%;
  width: 96%;
  height: auto;
  border-radius: 22px;
  background-color: rgb(255, 255, 255);
  display: flex;
  align-items: center;
}

.obj1 {
  flex: 1;
  margin-right: 20px;
  display: block;
  object-fit: fill;
  width: 100%;
  height: auto;
  border-radius: 20px;
  position: relative;
}
.text {
  flex: 2;
  position: absolute;
  top: calc(35% + 50px); 
  left: calc(70% - 17.5%); 
  width: calc(35% - 10px); 
  height: calc(30% - 10px);
}

.text h1 {
  font-weight: bold;
  font-size: min(4vm,24px);
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
  margin: 0;
  max-width: 100%;
  white-space: nowrap; 
  text-overflow: ellipsis;
}

.text h5 {
  font-size: min(4vm,24px);
  margin: 0;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.obj2 {
  flex:0;
  margin-right: 20px;
  position: absolute;
  top: calc(-42% - 10px);
  left: calc(35% - 30%);
  width: 60%;
  height: auto;
}
.text1 {
  margin-left: 5%;
  width: 30%;
  height: auto;
}

.text1 h1 {
  font-size: 1.875rem;
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
  font-weight: bolder;
}
@media (max-width: 768px) {
  .text1 h1 {
    font-size: 1.5rem; /* Adjust font size for smaller screens */
  }
}

@media (max-width: 480px) {
  .text1 h1 {
    font-size: 1.25rem; /* Adjust font size for even smaller screens */
  }
}

.outer {
  margin: 2%;
  margin-left: 5%;
  padding-left: 1.75%;
  width: 90%;
  height: auto;
  background-color: rgb(255, 252, 252);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
  gap: 30px;
}

.outer1 {
  margin: 2%;
  margin-left: 9%;
  padding-left: 5%;
  border-radius: 20px;
  width: 83%;
  height: auto;
  background-color: rgb(253, 253, 253);
  display: flex;
  flex-direction: column; 
}

.input-container {
  display: flex;
  margin-top: 10px;
  margin-bottom: 10px;
  align-items: center;
}

.input-container label {
  width: 100px; 
  margin-right: 10px; 
  font-size: 20px;
  font-weight: 600;
  color: rgb(2, 0, 0);
}

.input-container input[type="text"] {
  flex: 1;
  padding: 5px;
  border-radius: 5px;
  border-color: #000;
}


.outer2 {
  margin-left: 9%;
  padding-left: 3%;
  border-radius: 20px;
  width: 83%;
  height: 400px;
  background-color: rgb(255, 255, 255);
  display: flex;
  align-items: center; 
  justify-content: space-between;
}

.pad {
  border-radius: 20px;
  height: auto;
  padding: 20px;
  border: 1px solid black; 
  box-shadow: 0 5px 10px rgba(0, 0, 10, 15); 
  text-align: center; 
  transition: background-color 0.3s;
  cursor: pointer;
}



.pad.selected {
  background-color: blue;
  color: white;
}

.radio-label {
  display: inline-block;
  margin-right: 10px; 
}

.inp {
  margin-right: 10px;
}
.date{
  flex:30%;
  flex-shrink: 0;
}
.custom-calendar {
  width: calc(50%-10%);
  height: auto;
  border-radius: 20px;
  box-shadow: 0 5px 10px rgba(0, 0, 10, 15);
}

.time-grid {
  display: flex;
  flex-grow: 1;
  flex-wrap: wrap;
}

.grid-item {
  width: calc(22.22% - 10px); 
  text-align: center;
  border-radius: 10px;
  background-color: rgb(255, 255, 255);
  box-shadow: 0 5px 10px rgba(0, 0, 10, 15);
}
.button-container {
  display: flex;
  justify-content: center;
  margin-top: 20px; 
  padding-bottom: 15px;
}
.button-container Button {
  width: 350px;
  background-color: rgb(233, 141, 30);
  transition: background-color 0.3s;
}

.button-container Button:hover {
  background-color: rgb(252, 184, 58); 
}
.selected {
  background-color: blue;
  color: white;
}
.booked{
  background-color: green;
  color: white;
}
.notification {
    display: flex;
    justify-content: space-between;
    max-width: 300px; 
}
.not {
    display: flex;
    align-items: center;
}

</style>