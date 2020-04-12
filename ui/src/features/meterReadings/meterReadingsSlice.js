import {createSlice} from '@reduxjs/toolkit';
import api from '../../api/api';

export const meterReadingsSlice = createSlice({
    name: 'meterReadings',
    initialState: {
        loading: false,
        // Normalized State, using an array of ids and a dictionary of entities
        // See https://redux.js.org/recipes/structuring-reducers/normalizing-state-shape
        // See https://redux-toolkit.js.org/usage/usage-guide#managing-normalized-data
        ids: [],
        entities: {}
    },
    reducers: {
        getAllStarted: (state, action) => {
            state.loading = true;
        },
        getAllFinished: (state, action) => {
            state.loading = false;
            state.ids = action.payload.map(meterReading => meterReading.id);
            const entities = {};
            action.payload.forEach(meterReading => {
                entities[meterReading.id] = meterReading
            });
            state.entities = entities;
        },
        getAllError: (state, action) => {
            state.loading = false;
        }
    },
});

export const {getAllStarted, getAllFinished, getAllError} = meterReadingsSlice.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
export const getAll = () => async dispatch => {
    dispatch(meterReadingsSlice.actions.getAllStarted());
    api.getAll('meter-readings')
        .then(data => dispatch(meterReadingsSlice.actions.getAllFinished(data)))
        .catch(error => dispatch(meterReadingsSlice.actions.getAllError(error)));
};

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectMeterReadings = state => Object.values(state.meterReadings.entities);
export const selectMeterReadingsLoading = state => state.meterReadings.loading;

export default meterReadingsSlice.reducer;
