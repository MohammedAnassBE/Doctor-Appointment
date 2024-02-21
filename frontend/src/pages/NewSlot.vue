<template>
    <div class="flex flex-col items-center justify-center h-screen bg-blue-300">
        <div class="w-[500px] h-auto p-5 border-[10px] border-black bg-gray-200 rounded shadow-lg">
            <div class="text-3xl font-bold mb-5">
                Add Slots for {{ props.periodTime }}
            </div>
            <div class="text-lg mb-5">
                Enter Time <input type="time" v-model="time" class="ml-2">
            </div>
            <div class="flex justify-between">
                <button @click="show()" class="px-4 py-2 bg-blue-500 rounded text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50">Add Slot</button>
                <router-link :to="'/'">
                    <button class="px-4 py-2 bg-red-300 rounded text-white hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50">Back</button>
                </router-link>
            </div>
        </div>
    </div>
    
</template>
<script setup>
import {ref} from 'vue';
import { createListResource } from 'frappe-ui';

const time=ref(null);
const props=defineProps({
    periodTime:{
        type: String,
        required: true,
    },
    sendDate:{
        type: String,
    },
    sendDoctor:{
        type: String,
    }
})
const addSlots = createListResource({
    doctype:'Additional Appointments',
    fields: ['name','doctor_name','day','time','period'],
    insert: {},
    auto: true,
})
const timeSlots = createListResource({
    doctype: 'Apoointments',
    insert:{},
    fields: ['name', 'period', 'time'],
    auto: true,
})
const addition = ':00'
function check(selectedTime){
    if (selectedTime[0] === '0') {
        selectedTime = selectedTime.substring(1, 8);
    }
    return timeSlots.data.some(slots =>{
        return slots.time===selectedTime && slots.period===props.periodTime;
    });
}
function slotCheck(selectedTime){
    if (selectedTime[0] === '0') {
        selectedTime = selectedTime.substring(1, 8);
    }
    return addSlots.data.some(slots =>{
        return slots.time===selectedTime && slots.period===props.periodTime && slots.doctor_name === props.sendDoctor && slots.day === props.sendDate;
    });
}
function show(){
    const times = time.value+addition;
    const find = check(times);
    const another = slotCheck(times);
    if(find){
        alert('Slot already available');
    }
    else if(another){
        alert('Slot already available daa');
    }
    else{
        addSlots.insert.submit({
            period:props.periodTime,
            time: times,
            day:props.sendDate,
            doctor_name:props.sendDoctor,
        })
        alert('Slot Added');
    }
}
</script>