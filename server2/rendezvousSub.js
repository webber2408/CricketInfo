const SubscriberRendezvous = ({ apiCall, apiReq }) => {
  global?.NEIGHBOUR2_SOCKETS?.forEach((socket) => {
    socket.emit("push_from_neighbour_for_subscriber", {
      apiCall,
      apiReq,
    });
  });
  return;
};

module.exports = { SubscriberRendezvous };
