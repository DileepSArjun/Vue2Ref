import EventService from '@/services/EventService.js';

export const namespaced = true;

export const state = {
  events: [],
  event: {},
};

export const  mutations = {
  ADD_EVENT(state, event) {
    state.events.push(event);
  },
  SET_EVENTS(state, events) {
    state.events = events;
  },
  SET_EVENT(state, event) {
    state.event = event;
  },
};

export const actions = {
  createEvent({ commit, dispatch }, event) {
    EventService.postEvent(event)
      .then(() => {
        const notification = {
          type: 'success',
          message: 'Your event has been created.',
        };

        commit('ADD_EVENT', event);
        dispatch('notification/add', notification, { root: true });
      })
      .catch(error => {
        const notification = {
          type: 'error',
          message: 'There was a problem creating event: ' + error.message,
        };
        dispatch('notification/add', notification, { root: true });
      });
  },
  fetchEvents({ commit, dispatch }, { perPage, page }) {
    EventService.getEvents(perPage, page)
      .then(response => {
        commit('SET_EVENTS', response.data);
      })
      .catch(error => {
        const notification = {
          type: 'error',
          message: 'There was a problem fetching events: ' + error.message,
        };
        dispatch('notification/add', notification, { root: true });
      });
  },
  fetchEvent({ commit, getters, dispatch }, id) {
    var event = getters.getEventById(id);

    if(event) {
      commit('SET_EVENT', event);
      return;
    }

    EventService.getEvent(id)
      .then(response => {
        commit('SET_EVENT', response.data);
      })
      .catch(error => {
        const notification = {
          type: 'error',
          message: 'There was a problem fetching event details: ' + error.message,
        };
        dispatch('notification/add', notification, { root: true });
      });
  },
};

export const  getters = {
  getEventById: state => id => {
    return state.events.find(event => event.id === id);
  }
};
