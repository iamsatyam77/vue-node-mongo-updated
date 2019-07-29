<template>
  <div id='employees'>
    <div class="row">
      <div class="col-md-3"></div>
      <div class="col-md-3">
        <h3 style='margin-bottom: 15px;float:right;margin-right:40px;'>CRUD (Vue & Node)</h3>
      </div>
      <div class="col-md-5">
        <button class='btn btn-outline-warning' style="float:left;margin-left: 80px;" v-on:click='logout'>LOGOUT</button>
      </div>
    </div>
    <div class='container'>
      <div class='row'>
        <div class='col-md-8' style='border-right: 1px solid silver'>
          <b>EMPLOYEE DETAILS</b>
          <div>
        </div>
          <table class='table table-bordered table-striped'>
            <thead>
              <th style='text-align: center'>Name</th>
              <th style='text-align: center'>Email</th>
              <th style='text-align: center'>Domain</th>
              <th style='text-align: center'>Salary</th>
              <th style='text-align: center' colspan='3'>Actions</th>
            </thead>
              <tr v-for='item in items' :key='item._id'>
                <td>{{ item.name }}</td>
                <td>{{ item.email }}</td>
                <td>{{ item.domain }}</td>
                <td>{{ item.salary }}</td>
                <td>
                  <button type="button" class='btn btn-warning' title="Edit Employee" v-on:click='setUpdate(item)'><i class="fa fa-pencil"></i></button>
                </td>
                <td>
                  <button type="button" class='btn btn-danger' title="Delete Employee" v-on:click='remove(item)'><i class="fa fa-trash"></i></button>
                </td>
                <td>
                  <button type="button" :title="item.isVerified ? 'Employee Verifed': 'Verify Employee?'" v-bind:class="{'btn btn-primary': !item.isVerified, 'btn btn-secondary': item.verified}" v-on:click='sendVerificationToken(item, "sms")' :disabled="item.isVerified == 1"><i v-bind:class="{ 'fa fa-check': item.isVerified, 'fa fa-clock-o': !item.isVerified }"></i></button>
                </td>
              </tr>
            <tr v-if='!items.length'>
              <td style='text-align: center' colspan='5'>No Data Found</td>
            </tr>
          </table>
        </div>
        <div v-if="isUpdateUser" class='col-md-4'>
          <form v-on:submit.prevent='updateItem' class='form-group'>
            <p v-if="errors.length">
              <b>Please correct the following error(s):</b>
              <ul>
                <li class="alert alert-danger" v-for="(error, index) in errors" :key='index'>{{ error }}</li>
              </ul>
            </p>
            <span>
              <b>{{ action }}</b>
            </span>
            <hr>
            <input
              class='form-control'
              style='margin-bottom: 20px'
              name='name'
              v-model='name'
              placeholder='Employee Name'
            >
            <input
              class='form-control'
              style='margin-bottom: 20px'
              name='email'
              v-model='email'
              placeholder='Employee Email'
              :disabled='isUpdateUser'
            >
            <input
              class='form-control'
              style='margin-bottom: 20px'
              name='domain'
              v-model='domain'
              placeholder='Employee Domain e.g. Dev Ops'
            >
            <input
              class='form-control'
              style='margin-bottom: 20px'
              type='number'
              name='salary'
              v-model='salary'
              placeholder='Employee Salary'
            >
            <button class='btn btn-outline-danger' style="margin-right:10px;" v-on:click='resetForm'>CANCEL</button>
            <button class='btn btn-outline-warning' type="submit" value="submit">UPDATE</button>
          </form>
        </div>
        <div v-if="isVerifyPhone" class='col-md-4'>
          <form v-on:submit.prevent='verifyOTP' class='form-group'>
            <p v-if="errors.length">
              <b>Please correct the following error(s):</b>
              <ul>
                <li class="alert alert-danger" v-for="(error, index) in errors" :key='index'>{{ error }}</li>
              </ul>
            </p>
            <span>
              <b>{{ action }}</b>
            </span>
            <hr>
            <vue-tel-input class='form-control' style="margin-bottom:20px;" defaultCountry="IN" v-model.trim="phone" :disabled='isVerifyPhone'></vue-tel-input>
            <input
              class='form-control'
              style='margin-bottom: 20px'
              type='text'
              name='otp'
              v-model.trim='otp'
              placeholder='Enter OTP'
            >
            <div style="color:red;">OTP expires in {{timerDisplay}} minutes!</div><br><br>
            <button class='btn btn-outline-danger' style="margin-right:10px;" v-on:click='resetForm'>CANCEL</button>
            <button class='btn btn-outline-warning' type="submit" value="submit" :disabled="!otp">VERIFY</button>
          </form>
          <button class='btn btn-outline-primary' v-on:click='sendVerificationToken(phone, "call")'>CALL ME INSTEAD</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import VueTelInput from 'vue-tel-input';
import qs from 'query-string'

export default {
  name: 'Employees',
  components: {
    VueTelInput
  },
  data: function () {
    return {
      items: [],
      _id: '',
      name: '',
      email: '',
      phone: '',
      domain: '',
      salary: '',
      action: 'ADD EMPLOYEE',
      update_id: '',
      isUpdateUser: false,
      backup: {},
      errors: [],
      otp: '',
      timerDisplay: '',
      isVerifyPhone: false,
      confirmationDialogValue: ''
    }
  },
  methods: {
    getItems: function () {
      this.axios.get('api/employees/all_employees', {
        headers: {
          Accept: 'application/json',
          'Access-Control-Allow-Origin': '*',
          'x-access-token': this.getToken
        }
      })
        .then(resp => {
          this.items = resp.data.data
        }).catch(() => {
          this.flashMessage.error({
            title: '',
            message: 'Something went wrong',
            time: 5000,
            flashMessageStyle: {backgroundColor: 'linear-gradient(#e66465, #9198e5)'}
          })
        })
    },
    updateItem: function () {
      if (!this.validateForm()) {
        return
      }
      var objUpdate = {
        _id: this.update_id,
        name: this.name,
        email: this.email,
        domain: this.domain,
        salary: this.salary
      }
      var strngObj = qs.stringify(objUpdate)
      var index = this.items.indexOf(this.backup)
      this.axios
        .put('api/employees/update_employee', strngObj, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'x-access-token': this.getToken
          }
        })
        .then(resp => {
          this.items[index].name = objUpdate.name
          this.items[index].email = objUpdate.email
          this.items[index].domain = objUpdate.domain
          this.items[index].salary = objUpdate.salary
          this.resetForm()
          this.flashMessage.success({
            title: '',
            message: resp.data.message,
            time: 3000,
            flashMessageStyle: {backgroundColor: 'linear-gradient(#e66465, #9198e5)'}
          })
        }).catch(() => {
          this.flashMessage.error({
            title: '',
            message: 'Something went wrong',
            time: 3000,
            flashMessageStyle: {backgroundColor: 'linear-gradient(#e66465, #9198e5)'}
          })
        })
    },
    setUpdate: function (e) {
      this.isVerifyPhone = false
      this.errors = []
      this.action = 'UPDATE  EMPLOYEE: ' + e.name
      this.update_id = e._id
      this.name = e.name
      this.email = e.email
      this.domain = e.domain
      this.salary = e.salary
      this.backup = e
      this.isUpdateUser = true
    },
    remove: function (e) {
      this.errors = []
      this.$bvModal.msgBoxConfirm('Please confirm that you want to delete.', {
        title: 'Please Confirm',
        size: 'sm',
        buttonSize: 'sm',
        okVariant: 'danger',
        okTitle: 'YES',
        cancelTitle: 'NO',
        footerClass: 'p-2',
        hideHeaderClose: false,
        centered: true
      }).then((value) => {
        if (value) {
          this.axios.delete('api/employees/delete_employee/' + e._id,
            {headers: {'Content-Type': 'application/x-www-form-urlencoded', 'x-access-token': this.getToken}})
            .then(resp => {
              var index = this.items.indexOf(e)
              this.items.splice(index, 1)
              this.flashMessage.success({
                title: '',
                message: resp.data.message,
                time: 3000,
                flashMessageStyle: {backgroundColor: 'linear-gradient(#e66465, #9198e5)'}
              })
            }).catch(() => {
              this.flashMessage.error({
                title: '',
                message: 'Something went wrong',
                time: 3000,
                flashMessageStyle: {backgroundColor: 'linear-gradient(#e66465, #9198e5)'}
              })
            })
        }
      }).catch(() => {
      })
    },
    resetForm: function () {
      this.isUpdateUser = false
      this.isVerifyPhone = false
      this.emp_id = ''
      this.name = ''
      this.email = ''
      this.domain = ''
      this.salary = ''
      this.password = ''
      this.otp = ''
      this.timerDisplay = ''
      this.action = 'ADD EMPLOYEE'
    },
    validateForm: function () {
      this.errors = []
      this.name = this.name.trim()
      this.email = this.email.trim()
      this.domain = this.domain.trim()
      if (!this.name.trim()) {
        this.errors.push('Employee name required.')
      } else if (!/^[a-zA-Z ]+$/.test(this.name)) {
        this.errors.push('Employee name should be in correct format.')
      }
      if (!this.email) {
        this.errors.push('Employee email required.')
      } else if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.email)) {
        this.errors.push('Employee email should be in proper format.')
      }
      if (!this.domain.trim()) {
        this.errors.push('Employee domain required.')
      } else if (!/^[a-zA-Z ]+$/.test(this.domain)) {
        this.errors.push('Employee domain should be in correct format.')
      }
      if (!this.salary) {
        this.errors.push('Employee salary required.')
      } else if (this.salary < 0 || this.salary > 999999999) {
        this.errors.push('Employee salary should be in between 0 & 1000000000')
      }
      if (this.errors.length > 0) {
        return false
      } else {
        return true
      }
    },
    logout: function () {
      this.$store.dispatch('logout')
      .then(() => {
        this.$router.push('/login')
      })
    },
    sendVerificationToken (employee, via) {
      let phoneNo = typeof(employee) == 'object'? employee.phone: employee
      this.isUpdateUser = false;
      let obj = qs.stringify({phone:this.returnPhone(phoneNo), code:phoneNo.split(' ')[0], via})
      this.axios.post('api/employees/sendOTP', obj,
      {headers: {'Content-Type': 'application/x-www-form-urlencoded', 'x-access-token': this.getToken}})
      .then(resp => {
        this.flashMessage.success({
          title: '',
          message: resp.data.message,
          time: 3000,
          flashMessageStyle: {backgroundColor: 'linear-gradient(#e66465, #9198e5)'}
        })
        if(typeof(employee) == 'object') {
          this._id = employee._id
        }
        this.isVerifyPhone = true
        this.phone = phoneNo
        this.action = 'VERIFY PHONE NUMBER' 
        this.startTimer(60*10)
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
    verifyOTP () {
      if(!this.otp) {
        return this.errors.push('OTP required.')
      }
      let verifyObj = qs.stringify({phone:this.returnPhone(this.phone), code:this.phone.split(' ')[0], token: this.otp, _id: this._id})
      this.axios.post('api/employees/verifyOTP', verifyObj,
      {headers: {'Content-Type': 'application/x-www-form-urlencoded', 'x-access-token': this.getToken}})
      .then(resp => {
        this.resetForm()
        this.items.map((item) => {
          if(item._id == this._id) {
            item.isVerified = true
          }
        })
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

    returnPhone(contactNumber) {
        let phoneNumber = contactNumber.split(' ')
        return phoneNumber.slice(1,phoneNumber.length).join('')
    },
    startTimer(duration) {
      var timer = duration, minutes, seconds;
      let that = this;
      setInterval(function () {
          minutes = parseInt(timer / 60, 10);
          seconds = parseInt(timer % 60, 10);

          minutes = minutes < 10 ? "0" + minutes : minutes;
          seconds = seconds < 10 ? "0" + seconds : seconds;

          that.timerDisplay = minutes + ":" + seconds;

          if (--timer < 0) {
              timer = duration;
          }
      }, 1000);
    }
  },
  computed: {
    ...mapGetters(['getToken','isLoggedIn'])
  },
  created: function () {
    if (this.isLoggedIn) {
      this.getItems()
    } else {
      this.$router.push('/login')
    }
  }
}
</script>

<style>
</style>
