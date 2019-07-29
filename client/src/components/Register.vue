<template>
    <div id='register' class='row'>
        <FlashMessage></FlashMessage>
        <div class='col-md-4'></div>
        <div class='col-md-4'>
          <form @submit="createItem" class='form-group'>
            <p v-if="errors.length">
              <b>Please correct the following error(s):</b>
              <ul>
                <li class="alert alert-danger" v-for="(error, index) in errors" :key='index'>{{ error }}</li>
              </ul>
            </p>
            <span>
              <b>EMPLOYEE REGISTRATION FORM</b>
            </span>
            <hr>
            <input
              class='form-control'
              style='margin-bottom: 20px'
              name='name'
              v-model.trim='name'
              placeholder='Employee Name'
            >
            <input
              class='form-control'
              style='margin-bottom: 20px'
              name='email'
              v-model.trim='email'
              placeholder='Employee Email'
            >
            <vue-tel-input class='form-control' style="margin-bottom:20px;" defaultCountry="IN" v-model.trim="phone"></vue-tel-input>
            <input
              class='form-control'
              style='margin-bottom: 20px'
              name='domain'
              v-model.trim='domain'
              placeholder='Employee Domain e.g. Dev Ops'
            >
            <input
              class='form-control'
              style='margin-bottom: 20px'
              type='number'
              name='salary'
              v-model.trim='salary'
              placeholder='Employee Salary'
            >
            <input
              type='password'
              class='form-control'
              style='margin-bottom: 20px'
              name='password'
              v-model.trim='password'
              placeholder='Employee Password'
            >
            <button class='btn btn-outline-primary' type="submit" value="submit">REGISTER</button><br><br>
            <button class='btn btn-outline-warning' v-on:click='redirectTologin'>GO TO LOGIN</button>
          </form>
        </div>
        <div class='col-md-4'></div>
    </div>
</template>

<script>
import VueTelInput from 'vue-tel-input';

export default {
  name: 'Register',
  components: {
    VueTelInput,
  },
  data: function () {
    return {
      name: '',
      email: '',
      domain: '',
      salary: '',
      password: '',
      phone: '',
      errors: []
    }
  },
  methods: {
    createItem: function (e) {
      e.preventDefault()
      
      if (!this.validateForm()) {
        return
      }
      var obj = {
        name: this.name,
        email: this.email,
        phone: this.phone,
        domain: this.domain,
        salary: this.salary,
        password: this.password
      }
      this.$store.dispatch('register', obj)
      .then(resp => {
          this.redirectTologin()
          this.flashMessage.success({
            title: '',
            message: resp.data.message,
            time: 3000,
            flashMessageStyle: {backgroundColor: 'linear-gradient(#e66465, #9198e5)'}
          })
      })
      .catch(err => {
          this.flashMessage.error({
            title: '',
            message: err.response.data.message,
            time: 3000,
            flashMessageStyle: {backgroundColor: 'linear-gradient(#e66465, #9198e5)'}
          })
      })
    },
    validateForm: function () {
      this.errors = []
      let phoneNumber = ''

      if (!this.name) {
        this.errors.push('Employee name required.')
      } else if (!/^[a-zA-Z ]+$/.test(this.name)) {
        this.errors.push('Employee name should be in correct format.')
      }
      if (!this.email) {
        this.errors.push('Employee email required.')
      } else if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.email)) {
        this.errors.push('Employee email should be in proper format.')
      } 
      if(!this.phone) {
        this.errors.push('Phone number required.')
      } else {
        phoneNumber = this.phone.split(' ')
        phoneNumber = phoneNumber.slice(1,phoneNumber.length).join('')
        if(!/^(\+?\d{1,4})?(?!0+\s+,?$)\d{10}\s*,?$/.test(phoneNumber)) {
          this.errors.push('Phone number should be in correct format.')
        }
      }
      if (!this.domain) {
        this.errors.push('Employee domain required.')
      } else if (!/^[a-zA-Z ]+$/.test(this.domain)) {
        this.errors.push('Employee domain should be in correct format.')
      }
      if (!this.salary) {
        this.errors.push('Employee salary required.')
      } else if (this.salary < 0 || this.salary > 999999999) {
        this.errors.push('Employee salary should be in between 0 & 1000000000')
      }
      if (!this.password) {
        this.errors.push('Employee password required.')
      }
      if (this.errors.length > 0) {
        return false
      } else {
        return true
      }
    },
    resetForm () {
      this._id = ''
      this.name = ''
      this.email = ''
      this.domain = ''
      this.salary = ''
      this.password = ''
    },
    redirectTologin () {
      this.resetForm()
      this.$router.push('/login')
    }
  }
}
</script>
