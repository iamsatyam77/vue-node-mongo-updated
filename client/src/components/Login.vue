<template>
    <div id='login' class='row'>
        <div class='col-md-4'></div>
        <div class='col-md-4'>
            <form @submit="login">
              <p v-if="errors.length">
                <b>Please correct the following error(s):</b>
                <ul>
                  <li class="alert alert-danger" v-for="(error, index) in errors" :key='index'>{{ error }}</li>
                </ul>
              </p>
              <span>
                <b>EMPLOYEE LOGIN FORM</b>
              </span>
              <hr>
                <input
                  class='form-control'
                  style='margin-bottom: 20px'
                  name='email'
                  v-model.trim ='email'
                  placeholder='Employee Email'
                >
                <div class=form-group>
                  <input
                    :type='type'
                    class='form-control'
                    style='margin-bottom: 20px'
                    name='password'
                    v-model.trim ='password'
                    placeholder='Employee Password'
                  >
                  <span title="Show/Hide password" class="fa fa-fw fa-eye eyeicon" @click='seeHidePassword'></span>
                </div>
              <div style="float:left;">
                <label><input type="checkbox" name="rememberMe" v-model="isRememberMe"><b> Keep me logged in</b></label>
              </div><br><br>
              <button class='btn btn-outline-primary' type="submit" value="Submit">LOGIN</button><br><br>
              <button class='btn btn-outline-warning' v-on:click='navigateToRegister'>REGISTER EMPLOYEE</button>
            </form>
        </div>
        <div class='col-md-4'></div>
    </div>
</template>

<script>
export default {
  name: 'Login',
  data: function () {
    return {
      email: '',
      password: '',
      isRememberMe: false,
      type: 'password',
      errors: []
    }
  },
  methods: {
    login (e) {
      e.preventDefault()
      
      if (!this.validateForm()) {
        return
      }
      var obj = {
        email: this.email,
        password: this.password
      }

      this.$store.dispatch('login', obj)
      .then(response => {
        this.rememberMe()
        this.resetForm()
        this.flashMessage.success({
          title: '',
          message: response.message,
          time: 3000,
          flashMessageStyle: {backgroundColor: 'linear-gradient(#e66465, #9198e5)'}
        })
        this.$router.push('/employees')
      })
      .catch((err) => {
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
      this.email = this.email.trim()
      if (!this.email) {
        this.errors.push('Employee email required.')
      } else if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.email)) {
        this.errors.push('Employee email should be in proper format.')
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
      this.email = ''
      this.password = ''
      this.errors = []
    },
    navigateToRegister () {
      this.resetForm()
      this.$router.push('/register')
    },
    rememberMe () {
      if(this.isRememberMe) {
        localStorage.setItem('loggedInUser', JSON.stringify({email: this.email, password: this.password}));
      } else {
        localStorage.removeItem('loggedInUser')
      }
    },
    seeHidePassword () {
      if(this.type == 'password') {
        this.type = 'text'
      } else {
        this.type = 'password'
      }
    }
  },
  created() {
    if(localStorage.getItem('loggedInUser')) {
      this.isRememberMe = true
      let remeberMeObject = JSON.parse(localStorage.getItem('loggedInUser'))
      this.email = remeberMeObject.email
      this.password = remeberMeObject.password
    }
  }
}
</script>
<style scoped>
  .eyeicon {
        float: right;
        margin-right: 6px;
        margin-top: -46px;
        position: relative;
        z-index: 2;
        cursor: pointer;
    }
</style>