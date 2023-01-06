import axios from 'axios'

const deafultHttpOptions = {
  'Content-Type': 'application/json'
}

const {REACT_APP_GATE_API_BASE_URL} = process.env

export const createGateUser = async (name) => {
  const body = {
    "object": "users",
    "values": [
      {
        "name": name,
        "registration": "",
        "password": "",
        "salt": ""
      }
    ]
  }
  let response;
  
  try {
    const { session } = await loginAPI()
    
    const {data} = await axios.post(`${REACT_APP_GATE_API_BASE_URL}/create_objects.fcgi?session=${session}`, body, {
      headers: deafultHttpOptions
    });
    
    response = data
  } catch (e) {
    console.log(e)
    
    response = null
  }
  
  return response
}

export const loginAPI = async () => {
  const body = {
    "login": "admin",
    "password": "admin"
  }
  
  let response;
  
  try {
    const {data} = await axios.post(`${REACT_APP_GATE_API_BASE_URL}/login.fcgi`, body, {
      headers: deafultHttpOptions
    })
    
    response = data
  } catch (e) {
    console.log(e)
    
    response = null
  }
  
  return response
}

export const addToGroup = async (id) => {
  const body = {
    "object": "user_groups",
    "fields": ["user_id", "group_id"],
    "values": [
      {
        "user_id": id,
        "group_id": 1
      }
    ]
  }
  let response;
  
  try {
    const { session } = await loginAPI()
    
    const {data} = await axios.post(`${REACT_APP_GATE_API_BASE_URL}/create_objects.fcgi?session=${session}`, body, {
      headers: deafultHttpOptions
    })
    response = data
  } catch (e) {
    console.log(e)
    
    response = null
  }
  
  return response
}

export const lockGate = async (lock = false) => {
  
  const gateState = lock ? "lock_down" : ""
  
  let response;
  
  try {
    const { session } = await loginAPI()
    
    const {data} = await axios.post(`${REACT_APP_GATE_API_BASE_URL}/set_configuration.fcgi?session=${session}`, {
      "general": {
        "exception_mode": ""
      }
    }, {
      headers: deafultHttpOptions
    })
    
    response = data
  } catch (e) {
    console.log(e)
    
    response = null
  }
  
  return response
}

export const addBiometry = async (id) => {
  
  const body = {
    "type": "biometry",
    "save": true,
    "user_id": id,
    "panic_finger": 0
  }
  
  let response;
  
  try {
    const { session } = await loginAPI()

    const {data} = await axios.post(`${REACT_APP_GATE_API_BASE_URL}/remote_enroll.fcgi?session=${session}`, body, {headers: deafultHttpOptions})
    
    response = data
  } catch (e) {
    console.log(e)
    
    response = null
  }
  
  return response
}
