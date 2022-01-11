import localStorageUtil from "../../utils/storageUtil"
export default  {
    namespaced: true,
    state: {
        auth:false,
        user:{},
        token:''
    },
    mutations: {
       
    },

    actions: {
      initWindows({state},sizes){
        state.windowS = sizes
      },
      login({state},response){
          if(response.data.status == 'success'){
            state.auth = true;
            state.user = response.data.user;
            state.token = response.data.token;
            localStorageUtil.setSecure(state.token,'token')
            localStorageUtil.setSecure(state.user,'user')
          }
      },
      logout({state}){
        state.auth = false;
        state.user = null;
        localStorageUtil.clear('user');
        localStorageUtil.clear('token');
      },
      initApp({state}){
          let user = localStorageUtil.getSecure('user');
          if(user){
            state.auth = true;
            state.user = user
          }
      }
    }
}