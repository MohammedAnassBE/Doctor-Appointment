<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <div class="overflow-x-auto">
      <div class="p-5 flex items-center justify-center">  
        <h1 class="text-[30px] font-bold">Today Appointments</h1>  
      </div>
      <table class="table-auto border-collapse border border-gray-200">
        <thead>
          <tr class="bg-gray-100">
            <th class="p-2 border border-gray-200">Doctor Name</th>
            <th class="p-2 border border-gray-200">Appointment Timing</th>
            <th class="p-2 border border-gray-200">Period</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="doctor in doctors.data" :key="doctor.doctor_name">
            <template v-for="appointment in appointmentList.data" :key="appointment">
              <tr v-if="appointment.day === `${dates.getDate()}-${dates.getMonth() + 1}-${dates.getFullYear()}` && doctor.doctor_name === appointment.doctor_name" class="border-b border-gray-200">
                <td class="p-2 border border-gray-200">{{ appointment.doctor_name }}</td>
                <td class="p-2 border border-gray-200">{{ appointment.time }}</td>
                <td class="p-2 border border-gray-200">{{ appointment.period }}</td>
              </tr>
            </template>
          </template>
        </tbody>
      </table>
    </div>
    <router-link :to="'/'">
      <button class="bg-blue-500 w-[80px] h-10 mt-5 rounded">Back</button>
    </router-link>
  </div>      
</template>

<script setup>
import { createListResource } from 'frappe-ui';
import { ref, computed } from 'vue';

const dates = ref(new Date());
const appointmentList = createListResource({
  doctype: 'Appointment List',
  fields: ['doctor_name', 'day', 'time', 'period'],
  auto: true,
});
const doctors = createListResource({
  doctype: 'Doctors',
  fields: ['name', 'doctor_name'],
  auto: true,
});

const filteredAppointments = (doctorName) => {
  return computed(() => {
    return appointmentList.data.filter(appointment => appointment.doctor_name === doctorName);
  });
};
</script>
