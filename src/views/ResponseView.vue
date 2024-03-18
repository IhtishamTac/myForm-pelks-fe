<script setup>
import NavComp from "../components/NavComp.vue";
</script>
<template>
    <NavComp />
  <main>
    <div class="hero py-5 bg-light">
      <div class="container text-center">
        <h2 class="mb-2">
          {{ form.name }}
        </h2>
        <div class="text-muted mb-4">
          {{ form.description }}
        </div>
        <div>
          <div>
            <small>For user domains</small>
          </div>
          <small
            ><span
              class="text-primary"
              v-for="(domain, index) in domains"
              :key="index"
              >{{ domain.domain + ", " }}</span
            ></small
          >
        </div>
      </div>
    </div>

    <div class="py-5">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-5 col-md-6">
            <div class="input-group mb-5">
              <input
              id="linkForm"
                type="text"
                class="form-control form-link"
                readonly
                :value="'http://localhost:5173/forms/' + slug + '/response'"
              />
              <a href="#" @click.prevent="copyFormUrl" class="btn btn-primary">Copy</a>
            </div>

            <ul class="nav nav-tabs mb-2 justify-content-center">
              <li class="nav-item">
                <a
                  href="#"
                  @click.prevent="toQuestion(slug)"
                  class="nav-link"
                  >Questions</a
                >
              </li>
              <li class="nav-item">
                <a href="#" @click.prevent="toResponse(slug)" class="nav-link active"
                  >Responses</a
                >
              </li>
            </ul>
          </div>
        </div>

        <div class="row justify-content-center">
          <div class="col-lg-10">
            <table class="table mt-3">
              <caption>
                Total Responses: {{ responses.length }}
              </caption>
              <thead>
                <tr class="text-muted">
                  <th>User</th>
                  <th v-for="question in questions" :key="question.id">{{ question.name }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="response in responses" :key="response.id">
                  <td class="text-primary">{{ response.user.email }}</td>
                  <td v-for="(value, key) in response.answers" :key="key">{{ value }}</td>
                </tr>
              </tbody>
            </table>
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
      slug: "",
      form: "",
      domains: [],
      questions: [],

      responses:[],
    };
  },
  computed: {
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
  methods: {
    async getDetailForm(slug) {
      await axios
        .get("forms/" + slug, { headers: this.headers })
        .then((res) => {
          if (res && res.status == 200) {
            this.form = res.data.form;
            this.domains = res.data.form.allowed_domains;
            this.questions = res.data.form.questions;
          }
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    async getResponses(slug){
        await axios.get('forms/' + slug + '/responses',{headers:this.headers}).then((res)=>{
            this.responses = res.data.responses;
        }).catch((err)=>{
            alert(err.response.data.message);
        });
    },
    toResponse(slug) {
      this.$router.push({ name: "responses", params: { slug: slug } });
    },
    toQuestion(slug) {
      this.$router.push({ name: "form", params: { slug: slug } });
    },
    copyFormUrl(){
        const input = document.getElementById('linkForm');
        input.select();
        input.setSelectionRange(0, 99999);
        document.execCommand('copy');
    }
  },
  mounted() {
    this.slug = this.$route.params.slug;
    this.getDetailForm(this.slug);
    this.getResponses(this.slug);
  },
};
</script>
