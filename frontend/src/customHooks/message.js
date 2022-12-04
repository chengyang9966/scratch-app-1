
/**
 * @param {Array} state - default state 
 * @param {Function} setState - default setState 
 * @param {changes} changes - newChanges
 * @return {Array} state has been filter
 */
 export function addCustomId([state, setState,changes]) {
    let newState=changes(state).map((x,index)=>({...x,id:x.id?x.id:`${new Date().toTimeString()}__${index}`}));

    if(state.length !== newState.length){
	return setState(newState);
    }

}

// simple function to chain a list of middlewares
export const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);