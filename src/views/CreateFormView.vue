<template>
  <main>
    <div class="hero py-5 bg-light">
      <div class="container">
        <h2 class="text-center">Create Form</h2>
      </div>
    </div>

    <div class="py-5">
      <div class="container">
        <div class="row">
          <div class="col-md-6 col-lg-4 mx-auto">
            <form action="">
              <!-- s: input -->
              <div class="form-group mb-3">
                <label for="name" class="mb-1 text-muted">Form Name</label>
                <input
                  type="text"
                  id="name"
                  v-model="name"
                  class="form-control"
                  autofocus
                />
              </div>

              <!-- s: input -->
              <div class="form-group my-3">
                <label for="slug" class="mb-1 text-muted">Form Slug</label>
                <input type="text" id="slug" v-model="slug" class="form-control" />
              </div>

              <!-- s: input -->
              <div class="form-group my-3">
                <label for="description" class="mb-1 text-muted"
                  >Description</label
                >
                <textarea
                  id="description"
                  v-model="description"
                  rows="4"
                  class="form-control"
                ></textarea>
              </div>

              <!-- s: input -->
              <div class="form-group my-3">
                <label for="allowed-domains" class="mb-1 text-muted"
                  >Allowed Domains</label
                >
                <input
                  type="text"
                  id="allowed-domains"
                  v-model="allowed_domains"
                  class="form-control"
                />
                <div class="form-text">
                  Separate domains using comma ",". Ignore for public access.
                </div>
              </div>

              <!-- s: input -->
              <div class="form-check form-switch" aria-colspan="my-3">
                <input
                  type="checkbox"
                  id="limit_one_response"
                  v-model="limit_one_response"
                  class="form-check-input"
                  role="switch"
                />
                <label class="form-check-label" for="limit_one_response"
                  >Limit to 1 response</label
                >
              </div>

              <div class="mt-4">
                <button @click.prevent="createForm" type="submit" class="btn btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
        name:'',
        slug:'',
        description:'',
        allowed_domains:'',
        limit_one_response:0
    };
  },
  computed: {
    separateDomain:{
        get(){
            return this.allowed_domains.split(',').map(value=>value.trim());
        },
        set(){
            this.allowed_domains = value.join(',');
        }
    },
    token() {
      return localStorage.getItem("token");
    },
    headers() {
      return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      };
    },
  },
  methods:{
    async createForm(){
        await axios.post("forms",{
            name:this.name,
            slug:this.slug,
            description:this.description,
            allowed_domains:this.separateDomain,
            limit_one_response:this.limit_one_response,
        },{headers:this.headers}).then((res)=>{
           if(res && res.status == 200){
            this.$router.push('/');
           }
        }).catch((err)=>{
            alert(err.response.data.message);
        })
    }
  }
};
</script>
