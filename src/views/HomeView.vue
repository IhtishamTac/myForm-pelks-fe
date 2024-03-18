<script setup>
import NavComp from '../components/NavComp.vue'
</script>
<template>
 <NavComp />
 <main>

<div class="hero py-5 bg-light">
   <div class="container">
    <router-link class="btn btn-primary" to="/create-form">Create Form</router-link>
   </div>
</div>

<div class="list-form py-5">
   <div class="container">
      <h6 class="mb-3">List Form</h6>

      <div v-for="form in Forms" :key="form.id">
      <a href="#" @click.prevent="detailForm(form.slug)" class="card card-default mb-3">
         <div class="card-body">
            <h5 class="mb-1">{{ form.name }}</h5>
            <small class="text-muted">@{{ form.slug }} <span v-if="form.limit_one_response == true">(limit for 1 response)</span></small>
         </div>
      </a>
      </div>
   </div>
</div>

</main>

</template>

<script>
import axios from 'axios';
export default {
  data(){
    return{
      Forms:[]
    }
  },
  computed:{
    token() {
      return localStorage.getItem('token');
    },
    headers() {
      return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      };
    },
  },
  methods:{
    async getForms(){
      await axios.get('forms',{headers:this.headers}).then((res)=>{
        this.Forms = res.data.forms;
      }).catch((err)=>{
        alert(err.response.data.message);
      });
    },
    detailForm(slug){
      this.$router.push({name:'form', params:{slug:slug}});
    }
  },
  mounted(){
    this.getForms();
  }
}
</script>