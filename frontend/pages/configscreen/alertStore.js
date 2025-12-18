let alerts = [];
let unreadCount = 0;
let listeners = [];

export const getAlerts = () => alerts;
export const getUnreadCount = () => unreadCount;

export const addAlert = (droneName) => {
  const newAlert = {
    id: Date.now(),
    title: `Intrusion Detected!`,
    message: `${droneName} has entered the defense zone.`,
    time: new Date().toLocaleTimeString(),
    date: new Date().toLocaleDateString(),
  };

  alerts.unshift(newAlert);
  unreadCount++;
  notifyListeners();
};

export const clearUnread = () => {
  unreadCount = 0;
  notifyListeners();
};

export const subscribe = (callback) => {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter((l) => l !== callback);
  };
};

const notifyListeners = () => listeners.forEach((l) => l());
