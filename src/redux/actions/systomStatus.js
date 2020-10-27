import * as systomStatus from 'constants/systomStatus';

export const unfold = (state) =>({type:systomStatus.SIDER_UNFOLD,state});
var websocket, prevEvent;


export const newSocket = () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    return dispatch => {
        dispatch({ type: 'FETCH_TOTOS' });
        websocket = new WebSocket(`ws://${config.host}/ws/webSocketServer?userId=${user.id}`);
        websocket.onopen = () => {
            // websocket.send(JSON.stringify({ msgType:"map_start"})); 
            websocket.onmessage = (event) => {
                // if(event != prevEvent) {
                dispatch(reaciveMsg(event));
                   //  prevEvent = event;
                //}
    
            }
        }
  
        websocket.onclose  = () => {
 
        };
        websocket.onerror  = () => {
        
        };
        console.log(websocket,'websocket');
            
    }
    
}

export const reWebsocket = () => {
    return websocket;
}

export const reaciveMsg = (event) => {
    return {
        type: systomStatus.NEW_SOCKET,
        socketMsg: event&&JSON.parse(event.data),
    }
}
export const socketon = (callback) => {
    websocket.send(JSON.stringify({ msgType:"map_start"})); 
    return {
        type: Symbol(),
    }
}

export const leaveHome = () => {
    websocket.send(JSON.stringify({ msgType:"map_end"})); 
    return {
        type: Symbol(),
    }
}   

export const closeSocket = () => {
    websocket.close(); 
    return {
        type: Symbol(),
    }
}