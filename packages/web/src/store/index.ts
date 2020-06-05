import Vue from 'vue'
import Vuex from 'vuex'
import createRootModule, { RootState } from '@/store/root'

Vue.use(Vuex)

export default new Vuex.Store<RootState>(createRootModule())
