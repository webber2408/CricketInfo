const SubscriberRendezvous = ({ apiCall, apiReq }) => {
  // Push the subscription event received from the client to all the neighbouring nodes.
  global?.NEIGHBOUR2_SOCKETS?.forEach((socket) => {
    socket.emit("push_from_neighbour_for_subscriber", {
      apiCall,
      apiReq,
    });
  });
  return;
};

module.exports = { SubscriberRendezvous };
