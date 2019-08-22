//----------------------------
//const handlers
//-----------------------------
const ACTION_HANDLERS = {

};

const initialState = {

};

export function UpdateTripReducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type];
    return handler ? handler(state, action) : initialState;
}